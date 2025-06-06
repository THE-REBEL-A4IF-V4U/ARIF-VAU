const axios = require("axios");
const fs = require("fs");
const path = require("path");

module.exports.config = {
  name: "uid2",
  version: "1.1.3",
  permission: 0,
  credits: "TR4 + Fixed by THE REBEL",
  description: "Fetch info using reply, mention, or raw UID",
  prefix: false,
  category: "without prefix",
  cooldowns: 0
};

module.exports.run = async function ({ api, event, args }) {
  const { threadID, senderID, messageID, type, mentions, messageReply } = event;

  let uid;

  // 🔍 Determine UID source
  if (args[0] && !isNaN(args[0])) {
    uid = args[0]; // Manual UID input
  } else if (type === "message_reply") {
    uid = messageReply.senderID;
  } else if (Object.keys(mentions).length > 0) {
    uid = Object.keys(mentions)[0];
  } else {
    uid = senderID;
  }

  try {
    const userInfo = await api.getUserInfo(uid);
    const user = userInfo[uid];

    const name = user.name || "Unknown";
    const profileUrl = `https://facebook.com/${uid}`;
    const type = user.type || "N/A";
    const isFriend = user.isFriend ? "Yes" : "No";
    const isBirthday = user.isBirthday ? "Yes 🎂" : "No";

    const infoMessage = `
🌟 𝗨𝘀𝗲𝗿 𝗜𝗻𝗳𝗼 🌟

📝 𝗡𝗮𝗺𝗲: ${name}
🆔 𝗨𝗜𝗗: ${uid}
🎂 𝗕𝗶𝗿𝘁𝗵𝗱𝗮𝘆: ${isBirthday}
📊 𝗧𝘆𝗽𝗲: ${type}
🤝 𝗙𝗿𝗶𝗲𝗻𝗱: ${isFriend}
🌐 𝗟𝗶𝗻𝗸: ${profileUrl}`.trim();

    const avatarUrl = `https://graph.facebook.com/${uid}/picture?width=512&height=512&access_token=6628568379%7Cc1e620fa708a1d5696fb991c1bde5662`;
    const res = await axios.get(avatarUrl, { responseType: "arraybuffer" });
    const buffer = Buffer.from(res.data, "binary");

    const imagePath = path.join(__dirname, "temp_avatar.png");
    fs.writeFileSync(imagePath, buffer);

    api.sendMessage({
      body: infoMessage,
      attachment: fs.createReadStream(imagePath)
    }, threadID, () => fs.unlinkSync(imagePath));

  } catch (err) {
    console.error(err);
    return api.sendMessage("❌ Couldn't fetch user information. Make sure the UID is valid.", threadID, messageID);
  }
};
