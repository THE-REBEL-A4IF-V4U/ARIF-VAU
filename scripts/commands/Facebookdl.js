const fs = require("fs");
const axios = require("axios");
const request = require("request");

module.exports.config = {
  name: "fbvideo",
  version: "1.0.0",
  permission: 0,
  credits: "Rebel Tech Zone",
  description: "Download video from Facebook",
  prefix: true,
  category: "download",
  usages: "[facebook video link]",
  cooldowns: 5,
};

module.exports.run = async function({ api, event, args }) {
  const { messageID, threadID } = event;
  const link = args.join(" ");

  if (!link) {
    return api.sendMessage("[ ! ] Facebook ভিডিও লিংক দিন।", threadID, messageID);
  }

  // Show loading message
  const loadingImage = 'https://drive.google.com/uc?export=download&id=1HPv0BraxhZP8RG9bLYS5wznxunyiB6x7';
  api.sendMessage({
    body: `ভিডিও ডাউনলোড হচ্ছে...\n\nঅনুগ্রহ করে কিছুক্ষণ অপেক্ষা করুন!`,
    attachment: request(loadingImage)
  }, threadID, (err, info) => {
    const loadingMsgID = info.messageID;
    setTimeout(() => api.unsendMessage(loadingMsgID), 15000);
  });

  try {
    const response = await axios.get(`https://rebel-api-server.onrender.com/facebook?url=${encodeURIComponent(link)}`);
    const data = response.data;

    if (!data.downloads || !Array.isArray(data.downloads)) {
      return api.sendMessage("ডাউনলোড লিংক পাওয়া যায়নি।", threadID, messageID);
    }

    const hd = data.downloads.find(v => v.quality === "Download Video in HD Quality")?.link;
    const title = data.title || "Facebook Video";

    if (!hd) return api.sendMessage("HD ভিডিও লিংক পাওয়া যায়নি।", threadID, messageID);

    const cachePath = __dirname + "/cache";
    if (!fs.existsSync(cachePath)) fs.mkdirSync(cachePath);
    const filePath = `${cachePath}/fbvideo.mp4`;

    const file = fs.createWriteStream(filePath);
    const videoStream = await axios({
      method: 'GET',
      url: hd,
      responseType: 'stream'
    });

    videoStream.data.pipe(file);

    file.on('finish', () => {
      return api.sendMessage({
        body: `ভিডিও ডাউনলোড সম্পন্ন!\n\nTitle: ${title}`,
        attachment: fs.createReadStream(filePath)
      }, threadID, () => fs.unlinkSync(filePath), messageID);
    });

  } catch (err) {
    console.error("Download error:", err);
    return api.sendMessage(`[ ! ] সমস্যা হয়েছে: ${err.message}`, threadID, messageID);
  }
};
