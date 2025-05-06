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

    try {
      const time = moment.tz("Asia/Dhaka").format("HH:mm:ss DD/MM/YYYY");

      // Fetch owner list & gban data
      const [owners, gbanData] = await Promise.all([
        axios.get("https://raw.githubusercontent.com/THE-REBEL-A4IF-V4U/Rebel/main/owners.json").then(r => r.data),
        axios.get("https://raw.githubusercontent.com/THE-REBEL-A4IF-V4U/Rebel/main/Gban.json").then(r => r.data)
      ]);

      if (gbanData[sender]) {
        await api.setMessageReaction('🚫', messageID, () => {}, true);
        if (banMsg) {
          return api.sendMessage(
            `You are banned from using the bot.\nReason: ${gbanData[sender].reason}\nBanned by: ARIFUL ISLAM ASIF\nDate: ${gbanData[sender].date}`,
            thread,
            messageID
          );
        }
        return;
      }

      if (userBanned.has(sender) || threadBanned.has(thread) || (!allowInbox && sender == thread)) {
        if (!ADMINBOT.includes(sender) && !OPERATOR.includes(sender)) return;
      }

      if (typeof body === "string" && body.startsWith(PREFIX + "request") && approval) {
        if (APPROVED.includes(thread)) {
          return api.sendMessage("This box is already approved.", thread, messageID);
        }

        try {
          const threadName = (await threadInfo.get(thread))?.threadName || "Unnamed Group";
          await api.sendMessage(`Approval request received:\nGroup: ${threadName}\nID: ${thread}`, OPERATOR[0]);
        } catch {
          const userName = (await Users.getNameUser(thread)) || "Facebook User";
          await api.sendMessage(`Approval request received:\nUser: ${userName}\nID: ${thread}`, OPERATOR[0]);
        }
        return api.sendMessage("Approval request sent to bot operators.", thread, messageID);
      }

      if (command && !APPROVED.includes(thread) && !OPERATOR.includes(sender) && !ADMINBOT.includes(sender) && approval) {
        return api.sendMessage("This box is not approved. Use the request command to request access.", thread, async (_err, info) => {
          await new Promise(res => setTimeout(res, 5000));
          return api.unsendMessage(info.messageID);
        });
      }

      if (command && adminOnly && sender !== api.getCurrentUserID() && !ADMINBOT.includes(sender) && !OPERATOR.includes(sender)) {
        if (adminOnlyMsg === true) {
          return api.sendMessage("Only bot admins can use the bot.", thread, messageID);
        }
        return;
      }

      // Fuzzy match if not found
      if (commandName?.startsWith(PREFIX) && !command) {
        const available = Array.from(commands.keys());
        const match = stringSimilarity.findBestMatch(commandName.slice(PREFIX.length), available);
        if (match.bestMatch.rating >= 0.5) {
          command = commands.get(match.bestMatch.target);
        } else {
          return api.sendMessage(`Command "${commandName}" does not exist.`, thread, messageID);
        }
      }

      // Banned commands
      const bannedCmdsThread = commandBanned.get(thread) || [];
      const bannedCmdsUser = commandBanned.get(sender) || [];
      if ((bannedCmdsThread.includes(command?.config.name) || bannedCmdsUser.includes(command?.config.name)) &&
        !ADMINBOT.includes(sender) && !OPERATOR.includes(sender)) {
        return api.sendMessage(`You are banned from using "${command.config.name}" command.`, thread, async (_err, info) => {
          await new Promise(res => setTimeout(res, 5000));
          return api.unsendMessage(info.messageID);
        });
      }

      // NSFW
      if (command?.config?.category?.toLowerCase() === "nsfw" &&
        !global.data.threadAllowNSFW.includes(thread) && !ADMINBOT.includes(sender)) {
        return api.sendMessage("NSFW content is not allowed in this thread.", thread, async (_err, info) => {
          await new Promise(res => setTimeout(res, 5000));
          return api.unsendMessage(info.messageID);
        });
      }

      // Run the command
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
      console.error("Command error:", err);
      return api.sendMessage("An error occurred while executing this command.", threadID, messageID);
    }
  };
};
