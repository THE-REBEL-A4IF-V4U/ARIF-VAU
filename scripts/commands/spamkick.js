const fs = require('fs-extra');
const path = require('path');

// Cache ফোল্ডার তৈরি
const cacheFolder = path.join(__dirname, '../../cache');
const configPath = path.join(cacheFolder, 'spamkick-config.json');

if (!fs.existsSync(cacheFolder)) fs.mkdirSync(cacheFolder);

// Settings read/save
let spamConfig = fs.existsSync(configPath) ? JSON.parse(fs.readFileSync(configPath)) : {};
let antiSpam = {};

module.exports.languages = {
  "en": {
    "on": "✅ Spam kick is now ON!",
    "off": "⛔ Spam kick is now OFF!",
    "alreadyOn": "Spam kick is already enabled.",
    "alreadyOff": "Spam kick is already disabled.",
    "notActive": "Spam kick is not active in this group.",
    "warn": "⚠️ [Warning] %1: Stop spamming or you will be kicked!",
    "kicked": "✅ User %1 has been kicked for ignoring the warning!",
    "settingsUpdated": "✅ Settings updated: limit %1 messages in %2 seconds.",
    "onlyGroup": "This command can only be used in group chats."
  }
};

module.exports.config = {
  name: "spamkick",
  version: "5.0.0",
  permission: 2,
  credits: "ARIF VAU Modified by REBEL",
  description: "Auto warn and kick spammers with persistent settings (saved in cache).",
  prefix: true,
  category: "group",
  usages: "[on/off/settings <messageLimit> <timeLimit>]",
  cooldowns: 5,
  dependencies: { "fs-extra": "" }
};

function saveConfig() {
  fs.writeFileSync(configPath, JSON.stringify(spamConfig, null, 2));
}

module.exports.handleEvent = async ({ api, event, Users }) => {
  const { threadID, senderID, isGroup } = event;

  if (!isGroup) return; // শুধু গ্রুপে কাজ করবে

  if (!spamConfig[threadID] || !spamConfig[threadID].active) return;

  if (!antiSpam[threadID]) antiSpam[threadID] = {};
  const threadData = antiSpam[threadID];

  if (!threadData[senderID]) {
    threadData[senderID] = { count: 1, startTime: Date.now(), warned: false };
  } else {
    threadData[senderID].count++;
    const timePassed = Date.now() - threadData[senderID].startTime;

    if (timePassed < spamConfig[threadID].timeLimit * 1000) {
      if (threadData[senderID].count > spamConfig[threadID].messageLimit) {
        if (!threadData[senderID].warned) {
          const userName = await Users.getNameUser(senderID) || senderID;
          api.sendMessage(
            module.exports.languages.en.warn.replace("%1", userName),
            threadID
          );
          threadData[senderID].warned = true;
          threadData[senderID].count = 1;
          threadData[senderID].startTime = Date.now();
        } else {
          try {
            await api.removeUserFromGroup(senderID, threadID);
            const userName = await Users.getNameUser(senderID) || senderID;
            api.sendMessage(
              module.exports.languages.en.kicked.replace("%1", userName),
              threadID
            );
          } catch (err) {
            console.error(`Failed to kick user ${senderID}:`, err);
          }
          delete threadData[senderID];
        }
      }
    } else {
      threadData[senderID] = { count: 1, startTime: Date.now(), warned: false };
    }
  }
};

module.exports.run = async ({ api, event, args }) => {
  const { threadID, isGroup } = event;

  if (!isGroup) return api.sendMessage(module.exports.languages.en.onlyGroup, threadID);

  if (args.length < 1) {
    return api.sendMessage(`Use: on / off / settings <messages> <seconds>`, threadID);
  }

  const command = args[0].toLowerCase();

  switch (command) {
    case "on":
      if (spamConfig[threadID]?.active) {
        return api.sendMessage(module.exports.languages.en.alreadyOn, threadID);
      }
      spamConfig[threadID] = { active: true, messageLimit: 20, timeLimit: 60 };
      saveConfig();
      api.sendMessage(module.exports.languages.en.on, threadID);
      break;

    case "off":
      if (!spamConfig[threadID]?.active) {
        return api.sendMessage(module.exports.languages.en.alreadyOff, threadID);
      }
      spamConfig[threadID].active = false;
      saveConfig();
      api.sendMessage(module.exports.languages.en.off, threadID);
      break;

    case "settings":
      if (args.length < 3) {
        return api.sendMessage(`Use: settings <messages> <seconds>`, threadID);
      }
      const messageLimit = parseInt(args[1]);
      const timeLimit = parseInt(args[2]);
      if (isNaN(messageLimit) || isNaN(timeLimit)) {
        return api.sendMessage(`Please provide valid numbers for messages and seconds.`, threadID);
      }
      spamConfig[threadID] = { active: true, messageLimit, timeLimit };
      saveConfig();
      api.sendMessage(
        module.exports.languages.en.settingsUpdated.replace("%1", messageLimit).replace("%2", timeLimit),
        threadID
      );
      break;

    default:
      api.sendMessage(`Invalid option. Use: on / off / settings`, threadID);
  }
};