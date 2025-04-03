const axios = require("axios"); const fs = require("fs");

module.exports.config = { name: "inbox", version: "1.0", permission: 0, credits: "REBEL", description: "Send a GIF message to a user's inbox", category: "general", usages: "inbox", prefix: true, cooldowns: 5, dependencies: { "axios": "" } };

module.exports.run = async function ({ api, event, Users, args }) { try { var userID = Object.keys(event.mentions)[0] || event.senderID; var userName = await Users.getNameUser(userID); const botName = global.config.BOTNAME || "BOT";

// ✅ Imgur GIF লিংক
const gifUrl = "https://i.imgur.com/VGaHChR.gif"; // নিশ্চিত করা লিংক

// ✅ ডিফল্ট মেসেজ
const defaultMessage = `✅ SUCCESSFULLY ALLOW\n🔰 NOW YOU CAN USE ${botName} HERE`;
const userMessage = args.length > 0 ? args.join(" ") : defaultMessage;

var messageData = { body: `${userMessage}` };

// ✅ GIF লোড করা
try {
  const response = await axios.get(gifUrl, { responseType: "stream" });
  messageData.attachment = response.data;
} catch (error) {
  messageData.body += "\n\n❌ GIF not available, sending text only.";
}

// ✅ গ্রুপে কনফার্মেশন মেসেজ পাঠানো
api.sendMessage(
  `✅ SUCCESSFULLY SENT MESSAGE\n\n🔰 [${userName}] PLEASE CHECK YOUR INBOX OR MESSAGE REQUEST BOX`,
  event.threadID
);

// ✅ ইনবক্সে মেসেজ পাঠানো
api.sendMessage(messageData, userID, (err) => {
  if (err) {
    api.sendMessage("❌ Failed to send message to inbox.", event.threadID);
  }
});

} catch (error) { api.sendMessage("❌ Error occurred while sending message: " + error.message, event.threadID); } };

