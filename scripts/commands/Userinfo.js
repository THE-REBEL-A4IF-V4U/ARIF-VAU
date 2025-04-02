module.exports.config = {
   name: "uid2",
   version: "1.1.0",
   permission: 0,
   credits: "TR4",
   description: "HI reply",
   prefix: false,
   category: "without prefix",
   cooldowns: 0
};

module.exports.run = async function ({ api, event, args }) {
   let { threadID, senderID, messageID } = event;
   const axios = require("axios");
   const fs = require("fs");
   const path = require("path");

   let uid;
   if (event.type === "message_reply") {
      uid = event.messageReply.senderID;
   } else if (Object.keys(event.mentions).length > 0) {
      uid = Object.keys(event.mentions)[0];
   } else {
      uid = event.senderID;
   }

   try {
      const threadInfo = await api.getThreadInfo(threadID);
      const userInfo = await api.getUserInfo(uid);

      const name = userInfo[uid].name;
      const profileUrl = userInfo[uid].profileUrl;
      const type = userInfo[uid].type;
      const isFriend = userInfo[uid].isFriend;
      const isBirthday = userInfo[uid].isBirthday;

      const userInfoMessage = `
      🌟 User Information 🌟

      📝 Name: ${name}
      🆔 UID: ${uid}
      🎂 Birthday: ${isBirthday}
      📊 Status: ${type}
      🤝 Friends: ${isFriend}
      🌐 Facebook Link: ${profileUrl}`;

      const userAvatarUrl = `https://graph.facebook.com/${uid}/picture?width=512&height=512&access_token=6628568379%7Cc1e620fa708a1d5696fb991c1bde5662`;
      const response = await axios.get(userAvatarUrl, { responseType: "arraybuffer" });
      const buffer = Buffer.from(response.data, "binary");

      const imagePath = path.resolve(__dirname, 'temp_avatar.png');
      fs.writeFileSync(imagePath, buffer);

      api.sendMessage({
         body: userInfoMessage,
         attachment: fs.createReadStream(imagePath)
      }, threadID, () => fs.unlinkSync(imagePath));

   } catch (error) {
      console.error(error);
      api.sendMessage("An error occurred while fetching user information.", threadID, messageID);
   }
};
