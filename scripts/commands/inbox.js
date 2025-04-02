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
  dependencies: "",
};

module.exports.run = async function ({ api, event, Users, args }) {
  try {
    var userID = Object.keys(event.mentions)[0] || event.senderID;
    var userName = await Users.getNameUser(userID);
    
    const botName = global.config.BOTNAME || "BOT"; // যদি BOTNAME না থাকে, তাহলে "BOT" হবে

    // Google Drive image link (ডিরেক্ট ডাউনলোড লিংক)
    const imageUrl = "https://drive.google.com/uc?export=download&id=1EfUxyNQzXhItnzvL3qRQWOyaP765nd2m";
    
    // ইমেজ ফেচ করা হচ্ছে
    const attachment = await global.utils.getStreamFromURL(imageUrl);
    
    // ডিফল্ট মেসেজ
    const defaultMessage = `✅ SUCCESSFULLY ALLOW\n🔰 NOW YOU CAN USE ${botName} HERE`;

    // ইউজার যদি কাস্টম মেসেজ লিখে তাহলে সেটা, নাহলে ডিফল্ট মেসেজ
    const userMessage = args.length > 0 ? args.join(" ") : defaultMessage;

    // ইনবক্সে পাঠানোর জন্য মেসেজ তৈরি
    var messageData = { 
      body: userMessage, 
      attachment 
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
      }
    });

  } catch (error) {
    api.sendMessage("❌ Error occurred while sending message: " + error.message, event.threadID);
  }
};
