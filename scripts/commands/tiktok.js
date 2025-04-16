module.exports.config = {
  name: "tiktok",
  version: "1.0.0",
  permission: 0,
  prefix: true,
  credits: "rebel",
  description: "Download a TikTok video by URL.",
  category: "media",
  usages: "[video_url]",
  cooldowns: 0,
};

module.exports.run = async ({ api, event, args }) => {
  const axios = require('axios');

  const videoUrl = args[0];

  if (!videoUrl || !videoUrl.includes("tiktok.com")) {
    return api.sendMessage("[⚠️] অনুগ্রহ করে একটি বৈধ TikTok ভিডিও লিংক দিন।", event.threadID, event.messageID);
  }

  try {
    const response = await axios.get(`https://rebel-api-server.onrender.com/tiktok`, {
      params: { url: videoUrl }
    });

    if (response.data.success) {
      const videoDetails = response.data;
      const videoStream = await axios.get(videoDetails.no_watermark_video, { responseType: 'stream' });

      return api.sendMessage({
        body: `🎵 TikTok ভিডিও\n\n` +
              `📌 Title: ${videoDetails.title}\n` +
              `🎧 Audio: ${videoDetails.audio || "Unavailable"}\n` +
              `👁️ Views: ${videoDetails.views}`,
        attachment: videoStream.data
      }, event.threadID, event.messageID);
    } else {
      return api.sendMessage("[⚠️] ভিডিও ডাউনলোড করা যায়নি, আবার চেষ্টা করুন।", event.threadID, event.messageID);
    }
  } catch (error) {
    return api.sendMessage("[❌] কিছু একটা ভুল হয়েছে, পরে আবার চেষ্টা করুন।", event.threadID, event.messageID);
  }
};