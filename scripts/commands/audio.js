const axios = require("axios");
const fs = require("fs-extra");
const ytdl = require("@distube/ytdl-core");
const yts = require("yt-search");

module.exports.config = {
  name: "music",
  version: "2.0.4",
  permssion: 0,
  prefix: true,
  credits: "DRIDI-RAYEN - Converted by ChatGPT",
  description: "আপনার পছন্দের গান চালান",
  category: "🔍 অনুসন্ধান",
  usages: "[গানের নাম]",
  cooldowns: 10,
  dependencies: {
    "fs-extra": "",
    "request": "",
    "axios": "",
    "ytdl-core": "",
    "yt-search": ""
  }
};

module.exports.run = async ({ api, event }) => {
  const input = event.body;
  const args = input.split(" ");

  if (args.length < 2) {
    return api.sendMessage("⚠️ অনুগ্রহ করে একটি গানের নাম লিখুন!", event.threadID, event.messageID);
  }

  args.shift();
  const songName = args.join(" ");

  try {
    const infoMsg = await api.sendMessage(`🔍 গান খোঁজা হচ্ছে: 『${songName}』\nঅনুগ্রহ করে অপেক্ষা করুন...`, event.threadID);

    const searchResults = await yts(songName);
    if (!searchResults.videos.length) {
      return api.sendMessage("❌ কোনো ফলাফল পাওয়া যায়নি।", event.threadID, event.messageID);
    }

    const video = searchResults.videos[0];
    const videoUrl = video.url;

    const stream = ytdl(videoUrl, { filter: "audioonly" });

    const fileName = `${event.senderID}.mp3`;
    const filePath = `${__dirname}/cache/${fileName}`;

    stream.pipe(fs.createWriteStream(filePath));

    stream.on('response', () => {
      console.log('[DOWNLOADER] গান ডাউনলোড শুরু হয়েছে...');
    });

    stream.on('info', (info) => {
      console.log('[DOWNLOADER]', `Downloading: ${info.videoDetails.title} by ${info.videoDetails.author.name}`);
    });

    stream.on('end', () => {
      console.log('[DOWNLOADER] গান ডাউনলোড সম্পন্ন হয়েছে।');

      if (fs.statSync(filePath).size > 26214400) {
        fs.unlinkSync(filePath);
        return api.sendMessage('❌ ফাইলটি ২৫MB এর বেশি হওয়ায় পাঠানো যাচ্ছে না।', event.threadID);
      }

      const message = {
        body: `✅ আপনার গানটি ডাউনলোড করা হয়েছে:\n\n🎶 শিরোনাম: ${video.title}\n👤 শিল্পী: ${video.author.name}`,
        attachment: fs.createReadStream(filePath)
      };

      api.unsendMessage(infoMsg.messageID);
      api.sendMessage(message, event.threadID, () => {
        fs.unlinkSync(filePath);
      });
    });

  } catch (error) {
    console.error('[ERROR]', error);
    api.sendMessage('❗ একটি ত্রুটি ঘটেছে, অনুগ্রহ করে পরে আবার চেষ্টা করুন।', event.threadID);
  }
};
