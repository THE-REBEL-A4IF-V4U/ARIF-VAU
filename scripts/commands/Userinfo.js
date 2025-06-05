const axios = require("axios");
const fs = require("fs");
const path = require("path");

module.exports.config = {
  name: "uid2",
  version: "1.1.1",
  permission: 0,
  credits: "TR4 + Fixed by THE REBEL",
  description: "Fetch UID and info from mention, reply or profile link",
  prefix: false,
  category: "without prefix",
  cooldowns: 0,
};

module.exports.run = async function ({ api, event, args }) {
  const { threadID, senderID, messageID } = event;

  let uid;

  // 🌐 1. If a Facebook URL is given
  if (args[0] && args[0].includes("facebook.com")) {
    try {
      const link = args[0];
      const res = await axios.get(`https://facebookuid.freshbots.me/?url=${encodeURIComponent(link)}`);
      if (!res.data || !res.data.uid) {
        return api.sendMessage("❌ Couldn't fetch UID from the link.", threadID, messageID);
      }
      uid = res.data.uid;
    } catch (err) {
      console.error(err);
      return api.sendMessage("❌ Error while fetching UID from the link.", threadID, messageID);
    }

  // 💬 2. If reply to message
  } else if (event.type === "message_reply") {
    uid = event.messageReply.senderID;

  // 🏷️ 3. If mention
  } else if (Object.keys(event.mentions).length > 0) {
    uid = Object.keys(event.mentions)[0];

  // 🧍 4. Default: message sender
  } else {
    uid = senderID;
  }

  try {
    const userInfo = await api.getUserInfo(uid);
    const user = userInfo[uid];

    const userInfoMessage = `
🌟 𝗨𝘀𝗲𝗿 𝗜𝗻𝗳𝗼 🌟

📝 𝗡𝗮𝗺𝗲: ${user.name}
🆔 𝗨𝗜𝗗: ${uid}
🎂 𝗕𝗶𝗿𝘁𝗵𝗱𝗮𝘆: ${user.isBirthday ? "Yes 🎉" : "No"}
📊 𝗧𝘆𝗽𝗲: ${user.type}
🤝 𝗙𝗿𝗶𝗲𝗻𝗱: ${user.isFriend ? "Yes" : "No"}
🌐 𝗟𝗶𝗻𝗸: https://facebook.com/${uid}`.trim();

    // Avatar URL
    const avatarUrl = `https://graph.facebook.com/${uid}/picture?width=512&height=512&access_token=6628568379%7Cc1e620fa708a1d5696fb991c1bde5662`;
    const response = await axios.get(avatarUrl, { responseType: "arraybuffer" });
    const buffer = Buffer.from(response.data, "binary");

    const imagePath = path.resolve(__dirname, "temp_avatar.png");
    fs.writeFileSync(imagePath, buffer);

    api.sendMessage({
      body: userInfoMessage,
      attachment: fs.createReadStream(imagePath)
    }, threadID, () => fs.unlinkSync(imagePath));

  } catch (err) {
    console.error(err);
    api.sendMessage("❌ Error fetching user information.", threadID, messageID);
  }
};
