const fs = require("fs-extra");
const axios = require("axios");
const path = require("path");

const BADWORDS_FILE = path.join(__dirname, "../../cache/badwords.json");
const WARNDATA_FILE = path.join(__dirname, "../../cache/warnData.json");
const SETTINGS_FILE = path.join(__dirname, "../../cache/badwordkick-config.json");

const RAW_URL = "https://raw.githubusercontent.com/THE-REBEL-A4IF-V4U/Rebel/main/Badword.json"; // তোমার RAW GitHub URL

const cooldown = new Set();

async function ensureFiles() {
  if (!fs.existsSync(BADWORDS_FILE)) fs.writeFileSync(BADWORDS_FILE, "[]");
  if (!fs.existsSync(WARNDATA_FILE)) fs.writeFileSync(WARNDATA_FILE, "{}");
  if (!fs.existsSync(SETTINGS_FILE)) {
    fs.writeFileSync(SETTINGS_FILE, JSON.stringify({
      warnLimit: 3,
      cooldownTime: 30, // সেকেন্ডে Cooldown
      notifyAdmin: true,
      adminID: "100006473882758" // তোমার Facebook ID
    }, null, 2));
  }
}

async function updateBadwords() {
  try {
    const res = await axios.get(RAW_URL);
    if (Array.isArray(res.data)) {
      fs.writeFileSync(BADWORDS_FILE, JSON.stringify(res.data, null, 2));
      console.log("✅ Badwords আপডেট সম্পন্ন!");
    }
  } catch (e) {
    console.error("❌ Badwords আপডেট সমস্যা:", e.message);
  }
}

module.exports.languages = {
  "en": {
    "warn": "⚠️ Warning %1/%2: Please use decent language!",
    "kicked": "❌ %1 has been removed for using bad language %2 times!",
    "adminNotify": "⚡ Report: %1 (%2) used bad language!\nWarnings: %3/%4",
    "resetSuccess": "✅ Reset warnings for user: %1",
    "missingID": "⚠️ Please provide a user ID: /badwordkick reset <userID>",
    "warnList": "⚡ List of warned users:\n%1",
    "noWarn": "✅ No users have been warned yet!",
    "usage": "⚡ Usage:\n/badwordkick reset <userID>\n/badwordkick list"
  }
};

module.exports.config = {
  name: "badwordkick",
  version: "2.0.0",
  permission: 1,
  credits: "REBEL A4IF V4U",
  description: "Auto kick and warning system for bad words.",
  prefix: true,
  category: "group",
  usages: "[reset <userID>] / [list]",
  cooldowns: 5,
  dependencies: { "fs-extra": "", "axios": "" }
};

module.exports.handleEvent = async ({ api, event, Users }) => {
  const { threadID, senderID, body } = event;
  if (!body) return;

  await ensureFiles();
  await updateBadwords();

  const badwords = JSON.parse(fs.readFileSync(BADWORDS_FILE));
  const warnData = JSON.parse(fs.readFileSync(WARNDATA_FILE));
  const settings = JSON.parse(fs.readFileSync(SETTINGS_FILE));
  const lowerBody = body.toLowerCase();

  if (!badwords.some(word => lowerBody.includes(word.toLowerCase()))) return;

  if (cooldown.has(senderID)) return;
  cooldown.add(senderID);
  setTimeout(() => cooldown.delete(senderID), settings.cooldownTime * 1000);

  if (!warnData[senderID]) warnData[senderID] = { count: 0 };
  warnData[senderID].count++;

  const userName = await Users.getNameUser(senderID) || "User";

  if (warnData[senderID].count >= settings.warnLimit) {
    api.sendMessage(
      module.exports.languages.en.kicked.replace("%1", userName).replace("%2", settings.warnLimit),
      threadID
    );
    setTimeout(() => api.removeUserFromGroup(senderID, threadID), 2000);
    delete warnData[senderID];
  } else {
    api.sendMessage(
      module.exports.languages.en.warn
        .replace("%1", warnData[senderID].count)
        .replace("%2", settings.warnLimit),
      threadID
    );
  }

  if (settings.notifyAdmin) {
    const adminMsg = module.exports.languages.en.adminNotify
      .replace("%1", userName)
      .replace("%2", senderID)
      .replace("%3", warnData[senderID].count)
      .replace("%4", settings.warnLimit);
    api.sendMessage(adminMsg, settings.adminID);
  }

  fs.writeFileSync(WARNDATA_FILE, JSON.stringify(warnData, null, 2));
};

module.exports.run = async ({ api, event, args }) => {
  const { threadID } = event;
  await ensureFiles();

  const warnData = JSON.parse(fs.readFileSync(WARNDATA_FILE));
  const settings = JSON.parse(fs.readFileSync(SETTINGS_FILE));

  if (args[0] === "reset") {
    if (args[1]) {
      delete warnData[args[1]];
      fs.writeFileSync(WARNDATA_FILE, JSON.stringify(warnData, null, 2));
      api.sendMessage(module.exports.languages.en.resetSuccess.replace("%1", args[1]), threadID);
    } else {
      api.sendMessage(module.exports.languages.en.missingID, threadID);
    }
  } else if (args[0] === "list") {
    const list = Object.keys(warnData)
      .map(uid => `${uid}: Warnings ${warnData[uid].count}/${settings.warnLimit}`)
      .join("\n");
    api.sendMessage(
      list.length > 0 ? module.exports.languages.en.warnList.replace("%1", list) : module.exports.languages.en.noWarn,
      threadID
    );
  } else {
    api.sendMessage(module.exports.languages.en.usage, threadID);
  }
};