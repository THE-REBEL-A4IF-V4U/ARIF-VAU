const axios = require("axios");
const fs = require("fs");

module.exports.config = {
  name: "inbox",
  version: "1.0",
  permission: 0, // সবাই ব্যবহার করতে পারবে
  credits: "Nayan",
  description: "Send a GIF message to a user's inbox",
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

    // ✅ Google Drive GIF link (ডিরেক্ট ডাউনলোড লিংক)
    const gifUrl = "https://drive.google.com/uc?export=download&id=YOUR_FILE_ID"; // এখানে আপনার GIF এর ড্রাইভ আইডি দিন

    // ✅ GIF ডাউনলোড করে লোকাল ফাইলে সেভ করা
    const gifPath = __dirname + "/inbox_gif.gif";
    const response = await axios({ url: gifUrl, responseType: "stream" });

    const writer = fs.createWriteStream(gifPath);
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
        // ✅ মেসেজ পাঠানো শেষ হলে লোকাল GIF ডিলিট করে দেওয়া
        fs.unlinkSync(gifPath);
      }
    });

  } catch (error) {
    api.sendMessage("❌ Error occurred while sending GIF: " + error.message, event.threadID);
  }
};
