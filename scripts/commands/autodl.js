const axios = require("axios");
const fs = require("fs-extra");
const path = require("path");

module.exports.config = {
  name: "mea",
  version: "1.1.0",
  permission: 0,
  credits: "REBEL A4IF",
  prefix: false,
  description: "Download media by just sending a link",
  category: "downloader",
  usages: "Send media link directly",
  cooldowns: 5,
};

module.exports.run = async ({ api, event }) => {
  const message = event.body;
  const urlPattern = /(https?:\/\/[^\s]+)/g;
  const urls = message.match(urlPattern);

  if (!urls) return;

  const targetUrl = urls[0];

  try {
    // Send request to your media API
    const res = await axios.get(`https://rebel-api-server.onrender.com/media?url=${encodeURIComponent(targetUrl)}`);
    const data = res.data?.result?.data;

    if (!data || !data.high) {
      return api.sendMessage("❌ মিডিয়া পাওয়া যায়নি।", event.threadID, event.messageID);
    }

    const title = data.title || "media_file";
    const fileName = `${title.replace(/[^\w\s]/gi, "_").slice(0, 30)}.mp4`;
    const tempPath = path.join(__dirname, "cache", fileName);

    // Start the media download
    const stream = await axios({
      method: 'GET',
      url: data.high,
      responseType: 'stream'
    });

    // Check if the media size is too large (greater than 25MB)
    const contentLength = stream.headers['content-length'];
    if (contentLength && parseInt(contentLength) > 25 * 1024 * 1024) {
      return api.sendMessage(`⚠️ ভিডিওটি খুব বড় (${(parseInt(contentLength) / 1024 / 1024).toFixed(2)}MB)। 25MB এর বেশি হলে পাঠানো যাবে না।`, event.threadID, event.messageID);
    }

    // Pipe the media stream to a temporary file
    stream.data.pipe(fs.createWriteStream(tempPath));

    stream.data.on('end', () => {
      // Send the media file once download is complete
      api.sendMessage({
        body: `🎬 ${title}\n\n✅ ডাউনলোড সম্পন্ন!`,
        attachment: fs.createReadStream(tempPath)
      }, event.threadID, () => fs.unlinkSync(tempPath), event.messageID);
    });

  } catch (err) {
    console.error("Media Downloader Error:", err);
    return api.sendMessage("❌ ডাউনলোড করতে সমস্যা হচ্ছে। পরে আবার চেষ্টা করুন।", event.threadID, event.messageID);
  }
};