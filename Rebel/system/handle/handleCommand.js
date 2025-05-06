module.exports = function ({
  api,
  models,
  Users,
  Threads,
  Currencies,
  ...rest
}) {
  const axios = require("axios");
  const stringSimilarity = require("string-similarity");
  const moment = require("moment-timezone");
  const sendError = require("../../catalogs/Rebelc.js");

  return async function ({ event }) {
    const {
      allowInbox,
      adminOnly,
      keyAdminOnly
    } = global.Rebel;

    const {
      PREFIX,
      ADMINBOT,
      developermode,
      OPERATOR,
      APPROVED,
      approval,
      banMsg,
      adminOnlyMsg
    } = global.config;

    const {
      userBanned,
      threadBanned,
      threadInfo,
      threadData,
      commandBanned
    } = global.data;

    const {
      commands,
      cooldowns
    } = global.client;

    const {
      body,
      senderID,
      threadID,
      messageID
    } = event;

    const sender = String(senderID);
    const thread = String(threadID);
    const input = (body || '').trim().split(/ +/);
    const commandName = input.shift()?.toLowerCase();
    let command = commands.get(commandName);

    // Time + Owners Fetch
    const time = moment.tz("Asia/Dhaka").format("HH:mm:ss DD/MM/YYYY");
    const owners = (await axios.get("https://raw.githubusercontent.com/THE-REBEL-A4IF-V4U/Rebel/main/owners.json")).data;

    // Global ban check (GBan)
    const gbanData = (await axios.get("https://raw.githubusercontent.com/THE-REBEL-A4IF-V4U/Rebel/main/Gban.json")).data;
    if (gbanData[sender]) {
      await api.setMessageReaction('🚫', messageID, () => {}, true);
      if (banMsg) {
        return api.sendMessage(`[❌] You are banned from using the bot\n[❗] Reason: ${gbanData[sender].reason}\n[❗] Banned by: ARIFUL ISLAM ASIF\n[❗] Banned at: ${gbanData[sender].date}`, thread, messageID);
      }
      return;
    }

    // User/Thread banned or inbox disabled
    if (userBanned.has(sender) || threadBanned.has(thread) || (!allowInbox && sender == thread)) {
      if (!ADMINBOT.includes(sender) && !OPERATOR.includes(sender)) {
        return;
      }
    }

    // Approval check
    const approvalMessage = `[❌] This box is not approved.\n[➡️] Use "${PREFIX}request" to send an approval request.`;
    if (typeof body === "string" && body.startsWith(PREFIX + "request") && approval) {
      if (APPROVED.includes(thread)) {
        return api.sendMessage("[✅] This box is already approved.", thread, messageID);
      }
      try {
        const threadName = (await threadInfo.get(thread)).threadName || "Unnamed Group";
        await api.sendMessage(`Approval request received from:\nGroup: ${threadName}\nID: ${thread}`, OPERATOR[0]);
        return api.sendMessage("[✅] Approval request sent to bot operators.", thread, messageID);
      } catch {
        const userName = (await Users.getNameUser(thread)) || "Facebook User";
        await api.sendMessage(`Approval request received from user:\nUser: ${userName}\nID: ${thread}`, OPERATOR[0]);
        return api.sendMessage("[✅] Approval request sent to bot operators.", thread, messageID);
      }
    }

    if (command && !APPROVED.includes(thread) && !OPERATOR.includes(sender) && !ADMINBOT.includes(sender) && approval) {
      return api.sendMessage(approvalMessage, thread, async (_err, msgInfo) => {
        await new Promise(r => setTimeout(r, 5000));
        return api.unsendMessage(msgInfo.messageID);
      });
    }

    // Admin-only mode
    if (command && adminOnly && sender !== api.getCurrentUserID() && !ADMINBOT.includes(sender) && !OPERATOR.includes(sender)) {
      if (adminOnlyMsg === true) {
        return api.sendMessage("[MODE] - Only bot admins can use the bot", thread, messageID);
      }
      return;
    }

    // Command fuzzy matching if not found
    if (commandName?.startsWith(PREFIX) && !command) {
      const available = Array.from(commands.keys());
      const match = stringSimilarity.findBestMatch(commandName.slice(PREFIX.length), available);
      if (match.bestMatch.rating >= 0.5) {
        command = commands.get(match.bestMatch.target);
      } else {
        return api.sendMessage(global.getText("handleCommand", "commandNotExist", commandName), thread, messageID);
      }
    }

    // Command Ban Check
    const bannedCmdsThread = commandBanned.get(thread) || [];
    const bannedCmdsUser = commandBanned.get(sender) || [];
    if ((bannedCmdsThread.includes(command?.config?.name) || bannedCmdsUser.includes(command?.config?.name)) &&
        !ADMINBOT.includes(sender) && !OPERATOR.includes(sender)) {
      return api.sendMessage(`[❌] You are banned from using "${command.config.name}" command.`, thread, async (_err, msgInfo) => {
        await new Promise(r => setTimeout(r, 5000));
        return api.unsendMessage(msgInfo.messageID);
      });
    }

    // NSFW check
    if (command?.config?.category?.toLowerCase() === "nsfw" && !global.data.threadAllowNSFW.includes(thread) && !ADMINBOT.includes(sender)) {
      return api.sendMessage(global.getText("handleCommand", "threadNotAllowNSFW"), thread, async (_err, msgInfo) => {
        await new Promise(r => setTimeout(r, 5000));
        return api.unsendMessage(msgInfo.messageID);
      });
    }

    // Ensure command is valid and has a run function
    if (!command || typeof command.run !== "function") {
      return api.sendMessage(`[❌] Command "${commandName}" not found or is invalid.`, thread, messageID);
    }

    // Execute Command
    try {
      await command.run({
        api,
        event,
        models,
        Users,
        Threads,
        Currencies,
        args: input,
        commandName,
        ...rest
      });
    } catch (err) {
      sendError(`Error in command ${command?.config?.name || commandName}: ${err.message}`, 2);
      return api.sendMessage(`[❌] An error occurred while executing this command.`, thread, messageID);
    }
  };
};
