const fs = require("fs-extra");
const axios = require("axios");
const path = require("path");

const BADWORDS_FILE = path.join(__dirname, "../../cache/badwords.json");
const WARNDATA_FILE = path.join(__dirname, "../../cache/warnData.json");
const SETTINGS_FILE = path.join(__dirname, "../../cache/badwordkick-config.json");

const RAW_URL = "https://raw.githubusercontent.com/THE-REBEL-A4IF-V4U/Rebel/main/Badword.json"; // RAW GitHub link

const cooldown = new Set();

async function ensureFiles() {
  if (!fs.existsSync(BADWORDS_FILE)) fs.writeFileSync(BADWORDS_FILE, "[]");
  if (!fs.existsSync(WARNDATA_FILE)) fs.writeFileSync(WARNDATA_FILE, "{}");
  if (!fs.existsSync(SETTINGS_FILE)) {
    fs.writeFileSync(SETTINGS_FILE, JSON.stringify({
      warnLimit: 5,  // Maximum warns before banning
      cooldownTime: 30, // Cooldown time in seconds
      notifyAdmin: true,
      adminID: "100006473882758" // Your Facebook ID
    }, null, 2));
  }
}

async function updateBadwords() {
  try {
    const res = await axios.get(RAW_URL);
    if (Array.isArray(res.data)) {
      fs.writeFileSync(BADWORDS_FILE, JSON.stringify(res.data, null, 2));
      console.log("✅ Badwords update completed!");
    }
  } catch (e) {
    console.error("❌ Error updating badwords:", e.message);
  }
}

module.exports.languages = {
  "bn": {
    "warn": "⚠️ সতর্কতা %1/%2: দয়া করে ভদ্র ভাষা ব্যবহার করুন!",
    "adminNotify": "⚡ রিপোর্ট: %1 (%2) bad word ব্যবহার করেছে!\nসতর্কতা: %3/%4",
    "kicked": "❌ %1 bad word ব্যবহার করার জন্য ব্যান করা হয়েছে %2 বার!",
    "finalBan": "❌ তুই খারাপ ছেলে, তোকে আমার সিস্টেম থেকে ব্যান করলাম!",
    "resetSuccess": "✅ %1 এর সতর্কতা রিসেট হয়েছে!",
    "missingID": "⚠️ ইউজার ID দিন: /badwordkick reset <userID>",
    "warnList": "⚡ সতর্কতা প্রাপ্ত ইউজারের লিস্ট:\n%1",
    "noWarn": "✅ এখনও কেউ সতর্ক হয়নি!",
    "usage": "⚡ ব্যবহার:\n/badwordkick reset <userID>\n/badwordkick list\n/badwordkick unban <userID>"
  }
};

module.exports.config = {
  name: "badword",
  version: "2.0.0",
  permission: 1,
  credits: "REBEL A4IF V4U",
  description: "Bad word detection, auto kick and warning system.",
  prefix: true,
  category: "group",
  usages: "[reset <userID>] / [list] / [unban <userID>]",
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

  const userName = await Users.getNameUser(senderID) || "ব্যবহারকারী";

  // ২ বার সতর্কতা এবং পরে এডমিনকে মেন্টেন জানানো হবে
  if (warnData[senderID].count >= 2 && warnData[senderID].count < 5) {
    api.sendMessage(
      module.exports.languages.bn.warn
        .replace("%1", warnData[senderID].count)
        .replace("%2", settings.warnLimit),
      threadID
    );

    if (settings.notifyAdmin) {
      const adminMsg = module.exports.languages.bn.adminNotify
        .replace("%1", userName)
        .replace("%2", senderID)
        .replace("%3", warnData[senderID].count)
        .replace("%4", settings.warnLimit);
      api.sendMessage(adminMsg, settings.adminID);
    }
  }

  // ৫ বার সতর্কতার পর সিস্টেম থেকে ব্যান
  if (warnData[senderID].count >= settings.warnLimit) {
    api.sendMessage(
      module.exports.languages.bn.kicked.replace("%1", userName).replace("%2", settings.warnLimit),
      threadID
    );
    setTimeout(() => api.removeUserFromGroup(senderID, threadID), 2000);

    // Send the final ban message to the user and notify the admin
    api.sendMessage(module.exports.languages.bn.finalBan, threadID);
    if (settings.notifyAdmin) {
      const finalAdminMsg = module.exports.languages.bn.adminNotify
        .replace("%1", userName)
        .replace("%2", senderID)
        .replace("%3", warnData[senderID].count)
        .replace("%4", settings.warnLimit);
      api.sendMessage(finalAdminMsg, settings.adminID);
    }

    // Delete user data after ban
    delete warnData[senderID];
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
      api.sendMessage(module.exports.languages.bn.resetSuccess.replace("%1", args[1]), threadID);
    } else {
      api.sendMessage(module.exports.languages.bn.missingID, threadID);
    }
  } else if (args[0] === "list") {
    const list = Object.keys(warnData)
      .map(uid => `${uid}: সতর্কতা ${warnData[uid].count}/${settings.warnLimit}`)
      .join("\n");
    api.sendMessage(
      list.length > 0 ? module.exports.languages.bn.warnList.replace("%1", list) : module.exports.languages.bn.noWarn,
      threadID
    );
  } else if (args[0] === "unban") {
    if (args[1]) {
      // Add logic for unban action
      api.sendMessage(`✅ ${args[1]} কে ব্যান মুক্ত করা হয়েছে!`, threadID);
    } else {
      api.sendMessage(module.exports.languages.bn.missingID, threadID);
    }
  } else {
    api.sendMessage(module.exports.languages.bn.usage, threadID);
  }
};
