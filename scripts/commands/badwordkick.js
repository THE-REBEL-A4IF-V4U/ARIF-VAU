const fs = require("fs");
const path = require("path");

const DATA_FOLDER = path.join(__dirname, "cache");
const BADWORDS_FILE = path.join(DATA_FOLDER, "badwords.json");
const WARNDATA_FILE = path.join(DATA_FOLDER, "warnData.json");
const SETTINGS_FILE = path.join(DATA_FOLDER, "settings.json");
const BANNED_FILE = path.join(DATA_FOLDER, "banned.json");

function safeReadJSON(filePath, defaultValue) {
  try {
    if (!fs.existsSync(filePath)) return defaultValue;
    const content = fs.readFileSync(filePath, "utf-8");
    if (!content.trim()) return defaultValue;
    return JSON.parse(content);
  } catch (e) {
    console.error(`[ReadJSON Error] ${filePath}:`, e.message || e);
    return defaultValue;
  }
}

async function safeWriteJSON(filePath, data) {
  try {
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
  } catch (e) {
    console.error(`[WriteJSON Error] ${filePath}:`, e.message || e);
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

async function safeMarkAsReadAll(api) {
  try {
    if (typeof api.markAsReadAll === 'function') {
      await api.markAsReadAll();
    }
  } catch (e) {
    console.error("[markAsReadAll Error]", e.message || e);
  }
}

module.exports.config = {
  name: "badwordwarnban",
  version: "1.1.1",
  permission: 1,
  credits: "REBEL A4IF V4U (Fixed & Optimized)",
  description: "Badword detect করে warn করে, warn limit cross করলে BAN করে!",
  prefix: true,
  category: "group",
  usages: "[add/remove/list/reset/unban/on/off]",
  cooldowns: 5,
  dependencies: {}
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

  const now = Date.now();

  if (!warnData[senderID]) {
    warnData[senderID] = { count: 1, lastWarning: now };
  } else {
    const cooldown = (settings.cooldownTime || 30) * 1000;
    const timePassed = now - warnData[senderID].lastWarning;

    if (timePassed < cooldown) return;

    warnData[senderID].count += 1;
    warnData[senderID].lastWarning = now;
  }

  const userName = await Users.getNameUser(senderID) || "ব্যবহারকারী";

  if (warnData[senderID].count === 2 && settings.notifyAdmin && settings.adminID) {
    await api.sendMessage({
      body: `⚠️ @${userName} কে ২ বার সতর্ক করা হয়েছে, নজর রাখুন!`,
      mentions: [{ id: senderID, tag: userName }]
    }, settings.adminID);
    await safeMarkAsReadAll(api);
  }

  if (warnData[senderID].count >= (settings.warnLimit || 5)) {
    if (!banned.includes(senderID)) banned.push(senderID);
    await safeWriteJSON(BANNED_FILE, banned);

    await api.sendMessage({
      body: `❌ @${userName} খারাপ ব্যবহার করায় BAN করা হয়েছে!`,
      mentions: [{ id: senderID, tag: userName }]
    }, threadID);

    delete warnData[senderID];
    await safeWriteJSON(WARNDATA_FILE, warnData);
    return;
  }

  await safeWriteJSON(WARNDATA_FILE, warnData);
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
      await safeWriteJSON(SETTINGS_FILE, settings);
      return api.sendMessage("✅ BadwordWarnBan সিস্টেম চালু করা হয়েছে!", threadID);

    case "off":
      settings.enable = false;
      await safeWriteJSON(SETTINGS_FILE, settings);
      return api.sendMessage("❌ BadwordWarnBan সিস্টেম বন্ধ করা হয়েছে!", threadID);

    case "add":
      if (!args[1]) return api.sendMessage("⚠️ দয়া করে একটি শব্দ দিন:\n/badwordwarnban add <word>", threadID);
      const wordToAdd = args.slice(1).join(" ").toLowerCase();
      if (badwords.includes(wordToAdd)) return api.sendMessage(`⚡ "${wordToAdd}" ইতিমধ্যেই তালিকায় আছে!`, threadID);
      badwords.push(wordToAdd);
      await safeWriteJSON(BADWORDS_FILE, badwords);
      return api.sendMessage(`✅ "${wordToAdd}" সফলভাবে badword তালিকায় যোগ হয়েছে!`, threadID);

    case "remove":
      if (!args[1]) return api.sendMessage("⚠️ দয়া করে একটি শব্দ দিন:\n/badwordwarnban remove <word>", threadID);
      const wordToRemove = args.slice(1).join(" ").toLowerCase();
      const index = badwords.indexOf(wordToRemove);
      if (index === -1) return api.sendMessage(`❌ "${wordToRemove}" তালিকায় পাওয়া যায়নি!`, threadID);
      badwords.splice(index, 1);
      await safeWriteJSON(BADWORDS_FILE, badwords);
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
        await safeWriteJSON(WARNDATA_FILE, warnData);
        return api.sendMessage(`✅ ${args[1]} এর warn reset করা হয়েছে!`, threadID);
      } else {
        return api.sendMessage("⚠️ দয়া করে একটি বৈধ ইউজার আইডি দিন!", threadID);
      }

    case "unban":
      if (args[1]) {
        const idx = banned.indexOf(args[1]);
        if (idx !== -1) {
          banned.splice(idx, 1);
          await safeWriteJSON(BANNED_FILE, banned);
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
