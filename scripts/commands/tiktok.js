module.exports.config = {
  name: "tiktok",
  version: "1.0.0",
  permission: 0,
  prefix: true,
  credits: "rebel",
  description: "Download TikTok video from a link",
  category: "media",
  usages: "[tiktok_video_url]",
  cooldowns: 5,
};

module.exports.run = async ({ api, event, args }) => {
  const axios = require("axios");

  const url = args[0];
  if (!url || !url.includes("tiktok.com")) {
    return api.sendMessage("[⚠️] অনুগ্রহ করে একটি সঠিক TikTok ভিডিও লিংক দিন।", event.threadID, event.messageID);
  }

  try {
    const res = await axios.get(`https://rebel-api-server.onrender.com/tiktok?url=${encodeURIComponent(url)}`);
    const data = res.data;

    if (!data || !data.video || (!data.video.hd && !data.video.sd)) {
      return api.sendMessage("[⚠️] ভিডিও ডাউনলোড লিংক পাওয়া যায়নি।", event.threadID, event.messageID);
    }

    const videoLink = data.video.hd || data.video.sd;

    const stream = await axios.get(videoLink, { responseType: 'stream' });

    return api.sendMessage({
      body: `🎬 TikTok ভিডিও ডাউনলোড হয়েছে!\n\nCaption: ${data.title || "N/A"}`,
      attachment: stream.data
    }, event.threadID, event.messageID);

  } catch (err) {
    console.error(err);
    return api.sendMessage("[❌] কিছু একটা ভুল হয়েছে, পরে আবার চেষ্টা করুন।", event.threadID, event.messageID);
  }
};