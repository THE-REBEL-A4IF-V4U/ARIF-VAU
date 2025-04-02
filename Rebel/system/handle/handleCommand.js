const fs = require('fs');
const axios = require('axios');

module.exports = function({ api, models, Users, Threads, Currencies }) {
  const stringSimilarity = require('string-similarity');
  const escapeRegex = (str) => str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const logger = require("../../catalogs/Rebelc.js");
  const moment = require("moment-timezone");

  // Load Gban data from the URL (JSON file)
  const GbanDataUrl = "https://raw.githubusercontent.com/THE-Rebel-A4IF-V4U/Rebel/main/Gban.json";
  let GbanData = {};

  // Fetch the Gban data from the provided URL
  async function loadGbanData() {
    try {
      const response = await axios.get(GbanDataUrl);
      GbanData = response.data;
    } catch (error) {
      logger("Error loading Gban.json", 2);
    }
  }

  loadGbanData(); // Load the Gban data when the script starts

  return async function({ event }) {
    const dateNow = Date.now();
    const time = moment.tz("Asia/Dhaka").format("HH:mm:ss DD/MM/YYYY");
    const { allowInbox, adminOnly, keyAdminOnly } = global.Rebel;
    const { PREFIX, ADMINBOT, developermode, OPERATOR, APPROVED, approval } = global.config;
    const { userBanned, threadBanned, threadInfo, threadData, commandBanned } = global.data;
    const { commands, cooldowns } = global.client;
    var { body, senderID, threadID, messageID } = event;
    var senderID = String(senderID),
        threadID = String(threadID);
    const threadSetting = threadData.get(threadID) || {};
    const args = (body || '').trim().split(/ +/);
    const commandName = args.shift()?.toLowerCase();
    var command = commands.get(commandName);

    // If the sender is in the Gban list (user or thread banned)
    if (GbanData.users && GbanData.users.includes(senderID)) {
      return api.sendMessage("You have been banned from using the bot.", threadID, messageID);
    }

    if (GbanData.threads && GbanData.threads.includes(threadID)) {
      return api.sendMessage("This group has been banned from using the bot.", threadID, messageID);
    }

    // Process the rest of the bot commands here...
    // The rest of the bot code goes here.

    // For example, if the user is banned in the Gban list, block them from using commands
    if (command && !client.cooldowns.has(command.config.name)) {
      client.cooldowns.set(command.config.name, new Map());
    }

    const timestamps = command && command.config ? client.cooldowns.get(command.config.name) : undefined;
    const expirationTime = (command && command.config && command.config.cooldowns || 1) * 1000;

    if (timestamps && timestamps instanceof Map && timestamps.has(senderID) && dateNow < timestamps.get(senderID) + expirationTime) {
      return api.setMessageReaction('⏳', event.messageID, err => (err) ? logger('An error occurred while executing setMessageReaction', 2) : '', !![]);
    }

    try {
      if (command && typeof command.run === 'function') {
        command.run({ api, event, args, models, Users, Threads, Currencies });
        timestamps.set(senderID, dateNow);
        if (developermode == true) {
          logger(global.getText("handleCommand", "executeCommand", time, commandName, senderID, threadID, args.join(" "), (Date.now()) - dateNow) + '\n', "command");
        }
        return;
      }
    } catch (e) {
      return api.sendMessage(global.getText("handleCommand", "commandError", commandName, e), threadID);
    }
  };
};
