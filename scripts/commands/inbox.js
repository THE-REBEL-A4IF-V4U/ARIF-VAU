const axios = require("axios");

module.exports.config = {
  name: "inbox",
  version: "1.0",
  permission: 0,
  credits: "Nayan",
  description: "একটি মেসেজ ব্যবহারকারীর ইনবক্সে পাঠান",
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

    // ✅ ডিফল্ট মেসেজ
    const defaultMessage = `✅ সফলভাবে অনুমতি দেওয়া হয়েছে\n🔰 এখন আপনি ${botName} ব্যবহার করতে পারেন`;
    const userMessage = args.length > 0 ? args.join(" ") : defaultMessage;

    var messageData = { body: userMessage };

    // ✅ গ্রুপে কনফার্মেশন মেসেজ পাঠানো
    api.sendMessage(
      `✅ সফলভাবে মেসেজ পাঠানো হয়েছে\n\n🔰 [${userName}] অনুগ্রহ করে আপনার ইনবক্স বা মেসেজ রিকোয়েস্ট বক্স চেক করুন`,
      event.threadID
    );

    // ✅ ইনবক্সে মেসেজ পাঠানো
    api.sendMessage(messageData, userID, (err) => {
      if (err) {
        api.sendMessage("❌ ইনবক্সে মেসেজ পাঠাতে ব্যর্থ হয়েছে।", event.threadID);
      }
    });

  } catch (error) {
    api.sendMessage("❌ মেসেজ পাঠানোর সময় একটি সমস্যা হয়েছে: " + error.message, event.threadID);
  }
};
