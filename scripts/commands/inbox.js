const axios = require("axios");
const fs = require("fs");

module.exports.config = {
  name: "inbox",
  version: "1.0",
  permission: 0,
  credits: "Nayan",
  description: "Send a GIF message to a user's inbox",
  category: "general",
  usages: "inbox",
  prefix: true,
  cooldowns: 5,
  dependencies: { "axios": "" }
};

module.exports.run = async function ({ api, event, Users, args }) {
  try {
    var userID = Object.keys(event.mentions)[0] || event.senderID;
    var userName = await Users.getNameUser(userID);
    
    const botName = global.config.BOTNAME || "BOT";

    // ✅ Google Drive GIF লিংক
    const gifUrl = "https://drive.google.com/uc?export=download&id=1EfUxyNQzXhItnzvL3qRQWOyaP765nd2m";

    // ✅ GIF লোকাল ফাইলে ডাউনলোড করুন
    const gifPath = __dirname + "/inbox_gif.gif";
    const response = await axios({ url: gifUrl, responseType: "stream" });

    const writer = fs.createWriteStream(gifPath);
    response.data.pipe(writer);

    await new Promise((resolve, reject) => {
      writer.on("finish", resolve);
      writer.on("error", reject);
    });

    // ✅ ডিফল্ট মেসেজ
    const defaultMessage = `✅ SUCCESSFULLY ALLOW\n🔰 NOW YOU CAN USE ${botName} HERE`;

    const userMessage = args.length > 0 ? args.join(" ") : defaultMessage;

    var messageData = { 
      body: userMessage, 
      attachment: fs.createReadStream(gifPath) 
    };

    // ✅ গ্রুপে কনফার্মেশন মেসেজ পাঠানো
    api.sendMessage(
      `✅ SUCCESSFULLY SENT MESSAGE\n\n🔰 [${userName}] PLEASE CHECK YOUR INBOX OR MESSAGE REQUEST BOX`,
      event.threadID
    );

    // ✅ ইনবক্সে GIF পাঠানো
    api.sendMessage(messageData, userID, (err) => {
      if (err) {
        api.sendMessage("❌ Failed to send GIF to inbox.", event.threadID);
      } else {
        fs.unlinkSync(gifPath);
      }
    });

  } catch (error) {
    api.sendMessage("❌ Error occurred while sending GIF: " + error.message, event.threadID);
  }
};
