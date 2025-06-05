const fs = require("fs-extra");
const axios = require("axios");
const ytdl = require("ytdl-core");
const YouTubeAPI = require("simple-youtube-api");

module.exports.config = {
  name: "video",
  version: "1.0.1",
  permssion: 0,
  credits: "CatalizCS mod by Đăng - fixed by THE REBEL",
  description: "Play or search YouTube videos",
  prefix: true,
  category: "music",
  usages: "video [name or YouTube link]",
  cooldowns: 10,
  dependencies: {
    "ytdl-core": "",
    "simple-youtube-api": "",
    "fs-extra": "",
    "axios": ""
  },
  envConfig: {
    YOUTUBE_API: "AIzaSyDEE1-zZSRVI8lTaQOVsIAQFgL-_BJKvhk"
  }
};

module.exports.handleReply = async ({ api, event, handleReply }) => {
  try {
    const index = parseInt(event.body) - 1;
    const videoId = handleReply.link[index];
    const info = await ytdl.getInfo(`https://www.youtube.com/watch?v=${videoId}`);
    const title = info.videoDetails.title;
    const filePath = `${__dirname}/cache/${videoId}.mp4`;

    api.sendMessage(`⬇ Downloading: ${title}\nThis may take a few moments...`, event.threadID);

    ytdl(`https://www.youtube.com/watch?v=${videoId}`, { quality: "18" }) // MP4 360p
      .pipe(fs.createWriteStream(filePath))
      .on("close", () => {
        const stats = fs.statSync(filePath);
        if (stats.size > 26214400) {
          fs.unlinkSync(filePath);
          return api.sendMessage("❌ Video too large (over 25MB) to send.", event.threadID);
        }
        return api.sendMessage(
          { body: title, attachment: fs.createReadStream(filePath) },
          event.threadID,
          () => fs.unlinkSync(filePath)
        );
      })
      .on("error", error => {
        console.error(error);
        api.sendMessage("❌ Failed to download video.", event.threadID);
      });

  } catch (err) {
    console.error(err);
    api.sendMessage("❌ Could not process your request.", event.threadID);
  }
};

module.exports.run = async ({ api, event, args }) => {
  const youtube = new YouTubeAPI(module.exports.config.envConfig.YOUTUBE_API);

  if (!args[0]) return api.sendMessage("❌ Please enter a search query or YouTube link.", event.threadID);

  const keyword = args.join(" ");
  const videoRegex = /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.be)\/.+$/;

  // Direct video URL
  if (videoRegex.test(keyword)) {
    try {
      const id = ytdl.getURLVideoID(keyword);
      const info = await ytdl.getInfo(id);
      const title = info.videoDetails.title;
      const filePath = `${__dirname}/cache/${id}.mp4`;

      api.sendMessage(`⬇ Downloading: ${title}`, event.threadID);

      ytdl(keyword, { quality: "18" })
        .pipe(fs.createWriteStream(filePath))
        .on("close", () => {
          const stats = fs.statSync(filePath);
          if (stats.size > 26214400) {
            fs.unlinkSync(filePath);
            return api.sendMessage("❌ Video too large (over 25MB).", event.threadID);
          }
          return api.sendMessage(
            { body: title, attachment: fs.createReadStream(filePath) },
            event.threadID,
            () => fs.unlinkSync(filePath)
          );
        })
        .on("error", err => {
          console.error(err);
          api.sendMessage("❌ Error downloading the video.", event.threadID);
        });
    } catch (err) {
      console.error(err);
      api.sendMessage("❌ Failed to download video.", event.threadID);
    }

  } else {
    // Search mode
    try {
      const results = await youtube.searchVideos(keyword, 6);
      if (!results.length) return api.sendMessage("❌ No results found.", event.threadID);

      let message = `🎬 Found ${results.length} results:\n\n`;
      const videoLinks = [];
      const attachments = [];

      let count = 1;
      for (const video of results) {
        videoLinks.push(video.id);
        const thumbUrl = `https://img.youtube.com/vi/${video.id}/hqdefault.jpg`;
        const thumbPath = `${__dirname}/cache/thumb${count}.jpg`;

        const thumb = (await axios.get(thumbUrl, { responseType: "arraybuffer" })).data;
        fs.writeFileSync(thumbPath, Buffer.from(thumb, "utf-8"));
        attachments.push(fs.createReadStream(thumbPath));

        message += `${count}. ${video.title}\nChannel: ${video.channel.title}\n❍━━━━━━━━━━━━❍\n`;
        count++;
      }

      api.sendMessage(
        {
          body: message + "\n💬 Reply with the number to download.",
          attachment: attachments
        },
        event.threadID,
        (err, info) => {
          if (err) console.error(err);
          global.client.handleReply.push({
            name: module.exports.config.name,
            messageID: info.messageID,
            author: event.senderID,
            link: videoLinks
          });
        }
      );

    } catch (err) {
      console.error(err);
      api.sendMessage("❌ Failed to search videos.", event.threadID);
    }
  }
};
