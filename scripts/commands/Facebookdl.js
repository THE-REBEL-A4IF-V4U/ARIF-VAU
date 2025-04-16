module.exports.config = {
  name: "facebook",
  version: "1.0.0",
  permission: 0,
  prefix: true,
  credits: "rebel",
  description: "Download a Facebook video using URL.",
  category: "media",
  usages: "[facebook_video_url]",
  cooldowns: 0,
};

module.exports.run = async ({ api, event, args }) => {
  const axios = require("axios");

  const videoUrl = args[0];

  if (!videoUrl || !videoUrl.includes("facebook.com")) {
    return api.sendMessage("[⚠️] অনুগ্রহ করে একটি বৈধ Facebook ভিডিও URL দিন।", event.threadID, event.messageID);
  }

  try {
    const response = await axios.get(`https://rebel-api-server.onrender.com/facebook`, {
      params: { url: videoUrl }
    });

    if (response.data.success) {
      const data = response.data;
      const videoLink = data.hd || data.sd;

      if (!videoLink) {
        return api.sendMessage("[⚠️] ভিডিও ডাউনলোড লিংক পাওয়া যায়নি।", event.threadID, event.messageID);
      }

      const videoStream = await axios.get(videoLink, { responseType: 'stream' });

      return api.sendMessage({
        body: "🎬 আপনার Facebook ভিডিও:",
        attachment: videoStream.data
      }, event.threadID, event.messageID);
    } else {
      return api.sendMessage("[❌] ভিডিও পাওয়া যায়নি। অনুগ্রহ করে ভিডিও URL চেক করুন।", event.threadID, event.messageID);
    }
  } catch (error) {
    return api.sendMessage("[⚠️] অনুরোধে সমস্যা হয়েছে, পরে আবার চেষ্টা করুন।", event.threadID, event.messageID);
  }
};