const fs = require("fs");
const path = require("path");

const DATA_FOLDER = path.join(__dirname, "cache");
const BADWORDS_FILE = path.join(DATA_FOLDER, "badwords.json");
const WARNDATA_FILE = path.join(DATA_FOLDER, "warnData.json");
const SETTINGS_FILE = path.join(DATA_FOLDER, "settings.json");
const BANNED_FILE = path.join(DATA_FOLDER, "banned.json");

function safeReadJSON(filePath, defaultValue) {
  try {
    const content = fs.readFileSync(filePath, "utf-8");
    if (!content.trim()) return defaultValue;
    return JSON.parse(content);
  } catch (e) {
    return defaultValue;
  }
}

async function ensureFiles() {
  if (!fs.existsSync(DATA_FOLDER)) fs.mkdirSync(DATA_FOLDER, { recursive: true });
  if (!fs.existsSync(BADWORDS_FILE)) fs.writeFileSync(BADWORDS_FILE, "[]");
  if (!fs.existsSync(WARNDATA_FILE)) fs.writeFileSync(WARNDATA_FILE, "{}");
  if (!fs.existsSync(BANNED_FILE)) fs.writeFileSync(BANNED_FILE, "[]");
  if (!fs.existsSync(SETTINGS_FILE)) {
    fs.writeFileSync(SETTINGS_FILE, JSON.stringify({
      warnLimit: 5,
      cooldownTime: 30,
      notifyAdmin: true,
      adminID: "100006473882758",
      enable: true
    }, null, 2));
  }
}

module.exports.config = {
  name: "badwordwarnban",
  version: "1.0.1",
  permission: 1,
  credits: "REBEL A4IF V4U",
  description: "Badword detect করে warn করে, ২ বার হলে Admin কে জানায়, ৫ বার হলে System থেকে ban করে!",
  prefix: true,
  category: "group",
  usages: "[add/remove/list/reset/unban/on/off]",
  cooldowns: 5,
  dependencies: { "fs-extra": "", "axios": "" }
};

module.exports.handleEvent = async ({ api, event, Users }) => {
  const { threadID, senderID, body } = event;
  if (!body) return;

  await ensureFiles();

  const badwords = safeReadJSON(BADWORDS_FILE, []);
  const warnData = safeReadJSON(WARNDATA_FILE, {});
  const settings = safeReadJSON(SETTINGS_FILE, {});
  const banned = safeReadJSON(BANNED_FILE, []);

  if (!settings.enable) return;

  const lowerBody = body.toLowerCase();
  if (!badwords.some(word => lowerBody.includes(word))) return;

  if (banned.includes(senderID)) return;

  if (!warnData[senderID]) {
    warnData[senderID] = { count: 1, lastWarning: Date.now() };
  } else {
    const cooldown = (settings.cooldownTime || 30) * 1000;
    if (Date.now() - warnData[senderID].lastWarning > cooldown) {
      warnData[senderID].count += 1;
      warnData[senderID].lastWarning = Date.now();
    }
  }

  // 2 warn হলে admin কে জানাবে
  if (warnData[senderID].count === 2 && settings.notifyAdmin && settings.adminID) {
    const userName = await Users.getNameUser(senderID) || "ব্যবহারকারী";
    api.sendMessage(`⚠️ @${userName} কে ২ বার সতর্ক করা হয়েছে, নজর রাখুন!`, settings.adminID, (e, info) => {
      api.markAsReadAll();
    }, { mentions: [{ id: senderID, tag: userName }] });
  }

  // 5 warn হলে ban করবে
  if (warnData[senderID].count >= (settings.warnLimit || 5)) {
    if (!banned.includes(senderID)) banned.push(senderID);
    fs.writeFileSync(BANNED_FILE, JSON.stringify(banned, null, 2));
    const userName = await Users.getNameUser(senderID) || "ব্যবহারকারী";
    api.sendMessage(`❌ @${userName} খারাপ ব্যবহার করায় BAN করা হয়েছে!`, threadID, (e, info) => {
      api.markAsReadAll();
    }, { mentions: [{ id: senderID, tag: userName }] });
    delete warnData[senderID];
  }

  fs.writeFileSync(WARNDATA_FILE, JSON.stringify(warnData, null, 2));
};

module.exports.run = async ({ api, event, args }) => {
  const { threadID } = event;
  await ensureFiles();

  const badwords = safeReadJSON(BADWORDS_FILE, []);
  const warnData = safeReadJSON(WARNDATA_FILE, {});
  const settings = safeReadJSON(SETTINGS_FILE, {});
  const banned = safeReadJSON(BANNED_FILE, []);

  const subCommand = (args[0] || "").toLowerCase();

  switch (subCommand) {
    case "on":
      settings.enable = true;
      fs.writeFileSync(SETTINGS_FILE, JSON.stringify(settings, null, 2));
      return api.sendMessage("✅ BadwordWarnBan সিস্টেম চালু করা হয়েছে!", threadID);

    case "off":
      settings.enable = false;
      fs.writeFileSync(SETTINGS_FILE, JSON.stringify(settings, null, 2));
      return api.sendMessage("❌ BadwordWarnBan সিস্টেম বন্ধ করা হয়েছে!", threadID);

    case "add":
      if (!args[1]) return api.sendMessage("⚠️ দয়া করে একটি শব্দ দিন:\n/badwordwarnban add <word>", threadID);
      const wordToAdd = args.slice(1).join(" ").toLowerCase();
      if (badwords.includes(wordToAdd)) return api.sendMessage(`⚡ "${wordToAdd}" ইতিমধ্যেই তালিকায় আছে!`, threadID);
      badwords.push(wordToAdd);
      fs.writeFileSync(BADWORDS_FILE, JSON.stringify(badwords, null, 2));
      return api.sendMessage(`✅ "${wordToAdd}" সফলভাবে badword তালিকায় যোগ হয়েছে!`, threadID);

    case "remove":
      if (!args[1]) return api.sendMessage("⚠️ দয়া করে একটি শব্দ দিন:\n/badwordwarnban remove <word>", threadID);
      const wordToRemove = args.slice(1).join(" ").toLowerCase();
      const index = badwords.indexOf(wordToRemove);
      if (index === -1) return api.sendMessage(`❌ "${wordToRemove}" তালিকায় পাওয়া যায়নি!`, threadID);
      badwords.splice(index, 1);
      fs.writeFileSync(BADWORDS_FILE, JSON.stringify(badwords, null, 2));
      return api.sendMessage(`✅ "${wordToRemove}" সফলভাবে তালিকা থেকে সরানো হয়েছে!`, threadID);

    case "list":
      return api.sendMessage(
        badwords.length > 0
          ? "⚡ Badwords তালিকা:\n" + badwords.join(", ")
          : "⚡ এখনো কোনো badword যোগ করা হয়নি!",
        threadID
      );

    case "reset":
      if (args[1]) {
        delete warnData[args[1]];
        fs.writeFileSync(WARNDATA_FILE, JSON.stringify(warnData, null, 2));
        return api.sendMessage(`✅ ${args[1]} এর warn reset করা হয়েছে!`, threadID);
      } else {
        return api.sendMessage("⚠️ দয়া করে একটি বৈধ ইউজার আইডি দিন!", threadID);
      }

    case "unban":
      if (args[1]) {
        const idx = banned.indexOf(args[1]);
        if (idx !== -1) {
          banned.splice(idx, 1);
          fs.writeFileSync(BANNED_FILE, JSON.stringify(banned, null, 2));
          return api.sendMessage(`✅ ${args[1]} কে unban করা হয়েছে!`, threadID);
        } else {
          return api.sendMessage("⚠️ এই ইউজার banned তালিকায় নেই!", threadID);
        }
      } else {
        return api.sendMessage("⚠️ দয়া করে একটি বৈধ ইউজার আইডি দিন!", threadID);
      }

    default:
      return api.sendMessage(
        "ব্যবহার:\n" +
        "➤ /badwordwarnban add <word>\n" +
        "➤ /badwordwarnban remove <word>\n" +
        "➤ /badwordwarnban list\n" +
        "➤ /badwordwarnban reset <userID>\n" +
        "➤ /badwordwarnban unban <userID>\n" +
        "➤ /badwordwarnban on\n" +
        "➤ /badwordwarnban off",
        threadID
      );
  }
};
