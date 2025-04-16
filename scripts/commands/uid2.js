const axios = require("axios");
const fs = require("fs");
const request = require("request");

module.exports.config = {
  name: "uid3",
  version: "2.0.0",
  permission: 0,
  credits: "REBEL A4IF",
  prefix: true,
  description: "Get Facebook UID with username or UID",
  category: "info",
  cooldowns: 5
};

module.exports.run = async function({ api, event, args }) {
  if (!args[0] && event.type !== "message_reply") {
    return api.sendMessage("❌ Usage: /uid <username | uid | reply | mention>", event.threadID);
  }

  let uid, name;

  // Handle reply message
  if (event.type === "message_reply") {
    uid = event.messageReply.senderID;
    name = await api.getUserInfo(uid).then(info => info[uid].name);
  }

  // Handle mention
  else if (Object.keys(event.mentions).length > 0) {
    uid = Object.keys(event.mentions)[0];
    name = await api.getUserInfo(uid).then(info => info[uid].name);
  }

  // Handle username / UID input
  else {
    try {
      uid = await api.getUID(args[0]);
      const info = await api.getUserInfo(uid);
      name = info[uid].name;
    } catch (err) {
      return api.sendMessage("❌ Couldn't fetch UID. Make sure the link or username is valid.", event.threadID);
    }
  }

  const avatarURL = `https://graph.facebook.com/${uid}/picture?height=720&width=720&access_token=6628568379|c1e620fa708a1d5696fb991c1bde5662`;
  const filePath = __dirname + `/cache/uid-${uid}.jpg`;

  request(encodeURI(avatarURL)).pipe(fs.createWriteStream(filePath)).on("close", () => {
    api.sendMessage({
      body: `📥 𝗨𝗜𝗗 𝗜𝗡𝗙𝗢 📥\n━━━━━━━━━━━━━━\n👤 𝗡𝗮𝗺𝗲: ${name}\n🆔 𝗨𝗜𝗗: ${uid}\n🔗 𝗟𝗶𝗻𝗸: https://facebook.com/${uid}\n━━━━━━━━━━━━━━`,
      attachment: fs.createReadStream(filePath)
    }, event.threadID, () => fs.unlinkSync(filePath), event.messageID);
  });
};