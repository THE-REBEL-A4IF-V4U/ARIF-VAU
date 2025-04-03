const axios = require("axios");
const fs = require("fs");

module.exports.config = {
  name: "inbox",
  version: "1.0",
  permission: 0,
  credits: "Rebel",
  description: "একটি GIF বার্তা ব্যবহারকারীর ইনবক্সে পাঠান",
  category: "সাধারণ",
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

    // ✅ GIF লোকাল ফাইলে ডাউনলোড করা হচ্ছে
    const gifPath = __dirname + "/inbox_gif.gif";
    const response = await axios({ url: gifUrl, responseType: "stream" });

    const writer = fs.createWriteStream(gifPath);
    response.data.pipe(writer);

    await new Promise((resolve, reject) => {
      writer.on("finish", resolve);
      writer.on("error", reject);
    });

    // ✅ ডিফল্ট বার্তা
    const defaultMessage = `✅ সফলভাবে অনুমোদন করা হয়েছে\n🔰 এখন আপনি ${botName} ব্যবহার করতে পারবেন`;
    const userMessage = args.length > 0 ? args.join(" ") : defaultMessage;

    var messageData = {
      body: userMessage,
      attachment: fs.createReadStream(gifPath)
    };

    // ✅ গ্রুপে নিশ্চিতকরণ বার্তা পাঠানো
    api.sendMessage(
      `✅ সফলভাবে বার্তা পাঠানো হয়েছে\n\n🔰 [${userName}] দয়া করে আপনার ইনবক্স বা মেসেজ অনুরোধ বাক্স চেক করুন`,
      event.threadID
    );

    // ✅ ইনবক্সে GIF পাঠানো
    api.sendMessage(messageData, userID, (err) => {
      fs.unlinkSync(gifPath); // ✅ ফাইল মুছে ফেলা হবে
      if (err) {
        api.sendMessage(
          "❌ আমি সবার ইনবক্সে যাই না! ভাবছিলাম তোর ইনবক্সে যাব, কিন্তু তোর ভিতরে সমস্যা আছে, তাই যামু না।",
          event.threadID
        );
      }
    });

  } catch (error) {
    api.sendMessage(
      "❌ GIF পাঠানোর সময় একটি সমস্যা হয়েছে: " + error.message,
      event.threadID
    );
  }
};
