const axios = require("axios");
const fs = require("fs");
const path = require("path");

module.exports.config = {
  name: "cp",
  version: "1.2.0",
  permission: 0,
  credits: "TR4 + Cover Support by THE REBEL",
  description: "Fetch info using UID and show cover photo if available",
  prefix: false,
  category: "without prefix",
  cooldowns: 0
};

module.exports.run = async function ({ api, event, args }) {
  const { threadID, senderID, messageID, type, mentions, messageReply } = event;

  let uid;

  if (args[0] && !isNaN(args[0])) {
    uid = args[0];
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

    // 👉 Try to get cover photo
    const coverInfoUrl = `https://graph.facebook.com/${uid}?fields=cover&access_token=6628568379|c1e620fa708a1d5696fb991c1bde5662`;
    const coverRes = await axios.get(coverInfoUrl);
    const coverUrl = coverRes.data?.cover?.source;

    let imagePath = null;
    let attachment = null;

    if (coverUrl) {
      const imgRes = await axios.get(coverUrl, { responseType: "arraybuffer" });
      const buffer = Buffer.from(imgRes.data, "binary");
      imagePath = path.join(__dirname, "temp_cover.jpg");
      fs.writeFileSync(imagePath, buffer);
      attachment = fs.createReadStream(imagePath);
    }

    api.sendMessage(
      {
        body: infoMessage,
        attachment: attachment
      },
      threadID,
      () => {
        if (imagePath) fs.unlinkSync(imagePath);
      }
    );
  } catch (err) {
    console.error(err.message);
    return api.sendMessage("❌ Couldn't fetch user information or cover photo. UID may be invalid or private.", threadID, messageID);
  }
};
