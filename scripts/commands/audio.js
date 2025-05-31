module.exports.config = {
  name: "music",
  version: "2.0.4",
  permssion: 0,
  credits: "Hamim & Fixed by Rebel",
  description: "Play a song",
  prefix: true,
  premium: false,
  category: "media",
  usages: "[title]",
  cooldowns: 10,
  dependencies: {
    "fs-extra": "",
    "request": "",
    "axios": "",
    "@distube/ytdl-core": "",
    "yt-search": ""
  }
};

module.exports.run = async ({ api, event }) => {
  const axios = require("axios");
  const fs = require("fs-extra");
  const ytdl = require("@distube/ytdl-core");
  const request = require("request");
  const yts = require("yt-search");

  const input = event.body;
  const args = input.split(" ");

  if (args.length < 2) {
    return api.sendMessage("❗ | Please provide a song name after the command.", event.threadID, event.messageID);
  }

  const songName = args.slice(1).join(" ");

  try {
    api.sendMessage(`🔍 | Searching for "${songName}"...`, event.threadID);

    const searchResults = await yts(songName);
    if (!searchResults.videos.length) {
      return api.sendMessage("❌ | No results found!", event.threadID, event.messageID);
    }

    const video = searchResults.videos[0];
    const stream = ytdl(video.url, {
      filter: "audioonly",
      quality: "highestaudio",
      highWaterMark: 1 << 25,
      requestOptions: {
        headers: {
          "User-Agent":
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/90.0.4430.212 Safari/537.36",
          "Accept-Language": "en-US,en;q=0.9"
        }
      }
    });

    const fileName = `${event.senderID}.mp3`;
    const filePath = __dirname + `/cache/${fileName}`;
    const writeStream = fs.createWriteStream(filePath);

    stream.pipe(writeStream);

    writeStream.on("finish", async () => {
      const fileSize = fs.statSync(filePath).size;
      if (fileSize > 26214400) {
        fs.unlinkSync(filePath);
        return api.sendMessage("⚠️ | File too large to send (over 25MB).", event.threadID);
      }

      const msg = {
        body: `🎶 | Title: ${video.title}\n📺 | Channel: ${video.author.name}\n👁 | Views: ${video.views}\n⏱ | Duration: ${video.timestamp}`,
        attachment: fs.createReadStream(filePath)
      };

      api.sendMessage(msg, event.threadID, () => fs.unlinkSync(filePath));
    });

    writeStream.on("error", (err) => {
      console.error("WriteStream Error:", err);
      api.sendMessage("❌ | Error saving the audio file.", event.threadID);
    });
  } catch (err) {
    console.error("Music Command Error:", err);
    api.sendMessage("❌ | Failed to fetch or download the audio.", event.threadID);
  }
};
