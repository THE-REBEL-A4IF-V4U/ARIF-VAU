const axios = require("axios");
const fs = require("fs");
const path = require("path");

module.exports.config = {
  name: "inbox",
  version: "1.0",
  permission: 0, // সবাই ব্যবহার করতে পারবে
  credits: "Nayan",
  description: "Send a message with an image to a user's inbox",
  category: "general",
  usages: "inbox",
  prefix: true,
  cooldowns: 5,
  dependencies: { "axios": "" } // Ensure axios is available
};

module.exports.run = async function ({ api, event, Users, args }) {
  try {
    var userID = Object.keys(event.mentions)[0] || event.senderID;
    var userName = await Users.getNameUser(userID);
    
    const botName = global.config.BOTNAME || "BOT";

    // ✅ Google Drive image link (ডিরেক্ট ডাউনলোড লিংক)
    const imageUrl = "https://drive.google.com/uc?export=download&id=1EfUxyNQzXhItnzvL3qRQWOyaP765nd2m";

    // ✅ ইমেজ ডাউনলোড করে লোকাল ফাইলে সেভ করা
    const imgPath = path.join(__dirname, "inbox_image.jpg");
    const response = await axios({ url: imageUrl, responseType: "stream" });
    const writer = fs.createWriteStream(imgPath);
    response.data.pipe(writer);

    // ✅ ফাইল ডাউনলোড শেষ হলে
    await new Promise((resolve, reject) => {
      writer.on("finish", resolve);
      writer.on("error", reject);
    });

    // ✅ ডিফল্ট মেসেজ
    const defaultMessage = `✅ SUCCESSFULLY ALLOW\n🔰 NOW YOU CAN USE ${botName} HERE`;

    // ✅ ইউজার যদি কাস্টম মেসেজ দেয় তাহলে সেটাই, নাহলে ডিফল্ট মেসেজ
    const userMessage = args.length > 0 ? args.join(" ") : defaultMessage;

    // ✅ ইনবক্সে পাঠানোর জন্য মেসেজ তৈরি
    var messageData = { 
      body: userMessage, 
      attachment: fs.createReadStream(imgPath) 
    };

    // ✅ গ্রুপে কনফার্মেশন মেসেজ পাঠানো
    api.sendMessage(
      `✅ SUCCESSFULLY SENT MESSAGE\n\n🔰 [${userName}] PLEASE CHECK YOUR INBOX OR MESSAGE REQUEST BOX`,
      event.threadID
    );

    // ✅ ইনবক্সে মেসেজ পাঠানো
    api.sendMessage(messageData, userID, (err) => {
      if (err) {
        api.sendMessage("❌ Failed to send message to inbox.", event.threadID);
      } else {
        // ✅ মেসেজ পাঠানো শেষ হলে লোকাল ইমেজ ডিলিট করে দেওয়া
        fs.unlinkSync(imgPath);
      }
    });

  } catch (error) {
    api.sendMessage("❌ Error occurred while sending message: " + error.message, event.threadID);
  }
};
