const fs = require("fs");
const path = require("path");

const DATA_FOLDER = path.join(__dirname, "cache");
const BADWORDS_FILE = path.join(DATA_FOLDER, "badwords.json");
const WARNDATA_FILE = path.join(DATA_FOLDER, "warnData.json");
const SETTINGS_FILE = path.join(DATA_FOLDER, "settings.json");

async function ensureFiles() {
  if (!fs.existsSync(DATA_FOLDER)) fs.mkdirSync(DATA_FOLDER, { recursive: true });
  if (!fs.existsSync(BADWORDS_FILE)) fs.writeFileSync(BADWORDS_FILE, "[]");
  if (!fs.existsSync(WARNDATA_FILE)) fs.writeFileSync(WARNDATA_FILE, "{}");
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

async function updateBadwords() {
  await ensureFiles();
}

module.exports.config = {
  name: "badwordkick",
  version: "1.0.0",
  credits: "REBEL A4IF V4U",
  description: "Badword detect করে warn & kick করে, সাথে on/off system যুক্ত!",
  hasPrefix: true,
  commandCategory: "Group Protection",
  usages: "[add/remove/list/reset/unban/on/off]",
  cooldowns: 3
};

module.exports.languages = {
  bn: {
    added: "✅ নতুন badword যোগ হয়েছে: %1",
    removed: "✅ badword মুছে ফেলা হয়েছে: %1",
    notFound: "❌ এই শব্দটি খুঁজে পাওয়া যায়নি!",
    warnList: "⚡ সতর্কতা তালিকা:\n\n%1",
    noWarn: "❌ এখনো কাউকে সতর্ক করা হয়নি!",
    resetSuccess: "✅ %1 এর সতর্কতা রিসেট করা হয়েছে!",
    missingID: "⚠️ অনুগ্রহ করে একটি বৈধ ইউজার আইডি দিন!",
    usage: "ব্যবহার:\n/badwordkick add/remove/reset/unban/on/off"
  }
};

module.exports.handleEvent = async ({ api, event, Users }) => {
  const { threadID, senderID, body } = event;
  if (!body) return;

  await ensureFiles();
  await updateBadwords();

  const badwords = JSON.parse(fs.readFileSync(BADWORDS_FILE));
  const warnData = JSON.parse(fs.readFileSync(WARNDATA_FILE));
  const settings = JSON.parse(fs.readFileSync(SETTINGS_FILE));

  if (!settings.enable) return; // যদি system off থাকে, তাহলে কিছু করবো না

  const lowerBody = body.toLowerCase();
  if (!badwords.some(word => lowerBody.includes(word.toLowerCase()))) return;

  if (!warnData[senderID]) {
    warnData[senderID] = { count: 1, lastWarning: Date.now() };
  } else {
    const cooldown = settings.cooldownTime * 1000;
    if (Date.now() - warnData[senderID].lastWarning > cooldown) {
      warnData[senderID].count += 1;
      warnData[senderID].lastWarning = Date.now();
    }
  }

  if (warnData[senderID].count >= settings.warnLimit) {
    api.removeUserFromGroup(senderID, threadID);
    if (settings.notifyAdmin && settings.adminID) {
      api.sendMessage(
        `⚠️ সদস্য (${senderID}) কে ${settings.warnLimit} বার সতর্ক করার পরে গ্রুপ থেকে সরিয়ে দেয়া হয়েছে!`,
        settings.adminID
      );
    }
    delete warnData[senderID];
  }

  fs.writeFileSync(WARNDATA_FILE, JSON.stringify(warnData, null, 2));
};

module.exports.run = async ({ api, event, args }) => {
  const { threadID } = event;
  await ensureFiles();

  const badwords = JSON.parse(fs.readFileSync(BADWORDS_FILE));
  const warnData = JSON.parse(fs.readFileSync(WARNDATA_FILE));
  const settings = JSON.parse(fs.readFileSync(SETTINGS_FILE));

  if (args[0] === "on") {
    settings.enable = true;
    fs.writeFileSync(SETTINGS_FILE, JSON.stringify(settings, null, 2));
    return api.sendMessage("✅ BadwordKick সিস্টেম চালু করা হয়েছে!", threadID);
  }

  if (args[0] === "off") {
    settings.enable = false;
    fs.writeFileSync(SETTINGS_FILE, JSON.stringify(settings, null, 2));
    return api.sendMessage("❌ BadwordKick সিস্টেম বন্ধ করা হয়েছে!", threadID);
  }

  if (args[0] === "add") {
    if (!args[1]) return api.sendMessage("⚠️ দয়া করে একটি শব্দ দিন:\n/badwordkick add <word>", threadID);
    const wordToAdd = args.slice(1).join(" ").toLowerCase();
    if (badwords.includes(wordToAdd)) return api.sendMessage(`⚡ "${wordToAdd}" আগেই তালিকায় আছে!`, threadID);
    badwords.push(wordToAdd);
    fs.writeFileSync(BADWORDS_FILE, JSON.stringify(badwords, null, 2));
    return api.sendMessage(`✅ "${wordToAdd}" সফলভাবে badword তালিকায় যোগ হয়েছে!`, threadID);
  }

  if (args[0] === "remove") {
    if (!args[1]) return api.sendMessage("⚠️ দয়া করে একটি শব্দ দিন:\n/badwordkick remove <word>", threadID);
    const wordToRemove = args.slice(1).join(" ").toLowerCase();
    const index = badwords.findIndex(word => word.toLowerCase() === wordToRemove);
    if (index === -1) return api.sendMessage(`❌ "${wordToRemove}" তালিকায় খুঁজে পাওয়া যায়নি!`, threadID);
    badwords.splice(index, 1);
    fs.writeFileSync(BADWORDS_FILE, JSON.stringify(badwords, null, 2));
    return api.sendMessage(`✅ "${wordToRemove}" সফলভাবে badword তালিকা থেকে মুছে ফেলা হয়েছে!`, threadID);
  }

  if (args[0] === "reset") {
    if (args[1]) {
      delete warnData[args[1]];
      fs.writeFileSync(WARNDATA_FILE, JSON.stringify(warnData, null, 2));
      return api.sendMessage(module.exports.languages.bn.resetSuccess.replace("%1", args[1]), threadID);
    } else {
      return api.sendMessage(module.exports.languages.bn.missingID, threadID);
    }
  }

  if (args[0] === "list") {
    const list = Object.keys(warnData)
      .map(uid => `${uid}: সতর্কতা ${warnData[uid].count}/${settings.warnLimit}`)
      .join("\n");
    return api.sendMessage(
      list.length > 0 ? module.exports.languages.bn.warnList.replace("%1", list) : module.exports.languages.bn.noWarn,
      threadID
    );
  }

  if (args[0] === "unban") {
    if (args[1]) {
      delete warnData[args[1]];
      fs.writeFileSync(WARNDATA_FILE, JSON.stringify(warnData, null, 2));
      return api.sendMessage(`✅ ${args[1]} কে ব্যান মুক্ত করা হয়েছে!`, threadID);
    } else {
      return api.sendMessage(module.exports.languages.bn.missingID, threadID);
    }
  }

  return api.sendMessage(
    module.exports.languages.bn.usage + "\n\n" +
    "➤ /badwordkick add <word>\n" +
    "➤ /badwordkick remove <word>\n" +
    "➤ /badwordkick reset <userID>\n" +
    "➤ /badwordkick list\n" +
    "➤ /badwordkick unban <userID>\n" +
    "➤ /badwordkick on\n" +
    "➤ /badwordkick off",
    threadID
  );
};
