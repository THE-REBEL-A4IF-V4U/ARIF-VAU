const fs = require('fs');
const axios = require('axios');

module.exports = function ({ api, models, Users, Threads, Currencies }) {
  const stringSimilarity = require('string-similarity');
  const escapeRegex = (str) => str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const logger = require("../../catalogs/Rebelc.js");
  const moment = require("moment-timezone");

  // Load Gban data from the URL (JSON file)
  const GbanDataUrl = "https://raw.githubusercontent.com/THE-Rebel-A4IF-V4U/Rebel/main/Gban.json";
  let GbanData = { users: [], threads: [] };

  // Fetch the Gban data from the provided URL
  async function loadGbanData() {
    try {
      const response = await axios.get(GbanDataUrl);
      GbanData = response.data || { users: [], threads: [] };
      logger("Gban.json loaded successfully", 1);
    } catch (error) {
      logger("Error loading Gban.json: " + error.message, 2);
    }
  }

  // Load Gban data at script startup
  loadGbanData();

  return async function ({ event }) {
    try {
      const dateNow = Date.now();
      const time = moment.tz("Asia/Dhaka").format("HH:mm:ss DD/MM/YYYY");

      const { allowInbox, adminOnly, keyAdminOnly } = global.Rebel || {};
      const { PREFIX, ADMINBOT, developermode, OPERATOR, APPROVED, approval } = global.config || {};
      const { userBanned, threadBanned, threadInfo, threadData, commandBanned } = global.data || {};
      const { commands, cooldowns } = global.client || {};

      let { body, senderID, threadID, messageID } = event;
      senderID = String(senderID);
      threadID = String(threadID);

      const threadSetting = threadData.get(threadID) || {};
      const args = (body || '').trim().split(/ +/);
      const commandName = args.shift()?.toLowerCase();
      const command = commands.get(commandName);

      // Check if the sender or thread is banned
      if (GbanData.users.includes(senderID)) {
        return api.sendMessage("❌ You are banned from using the bot.", threadID, messageID);
      }

      if (GbanData.threads.includes(threadID)) {
        return api.sendMessage("🚫 This group is banned from using the bot.", threadID, messageID);
      }

      // Ensure cooldowns are initialized
      if (command && !cooldowns.has(command.config.name)) {
        cooldowns.set(command.config.name, new Map());
      }

      const timestamps = command && command.config ? cooldowns.get(command.config.name) : new Map();
      const expirationTime = (command && command.config && command.config.cooldown || 1) * 1000;

      if (timestamps.has(senderID) && dateNow < timestamps.get(senderID) + expirationTime) {
        return api.setMessageReaction('⏳', event.messageID, err => {
          if (err) logger('Error executing setMessageReaction', 2);
        }, true);
      }

      // Execute the command
      if (command && typeof command.run === 'function') {
        await command.run({ api, event, args, models, Users, Threads, Currencies });
        timestamps.set(senderID, dateNow);

        if (developermode) {
          logger(
            `Command Executed: ${commandName} | Time: ${time} | User: ${senderID} | Group: ${threadID} | Args: ${args.join(" ")} | Execution Time: ${(Date.now() - dateNow)}ms`,
            "command"
          );
        }
        return;
      }

    } catch (e) {
      logger(`Error in command execution: ${e.message}`, 2);
      return api.sendMessage("⚠ An error occurred while processing your request.", event.threadID);
    }
  };
};
