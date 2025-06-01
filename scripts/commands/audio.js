module.exports.config = {
  name: "music",
  version: "2.0.4",
  permission: 0,
  credits: " Fixed by Rebel",
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
    "trs-media-downloader": "",
    "yt-search": ""
  }
};

module.exports.run = async ({ api, event }) => {
  const fs = require("fs-extra");
  const rebelyt = require("trs-media-downloader");
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
    const url = video.url;

    const result = await rebelyt.rebelyt(url);
    const audioUrl = result?.mp3;

    if (!audioUrl) {
      return api.sendMessage("❌ | Failed to retrieve MP3 link.", event.threadID);
    }

    const fileName = `${event.senderID}.mp3`;
    const filePath = __dirname + `/cache/${fileName}`;

    const audioStream = request(audioUrl).pipe(fs.createWriteStream(filePath));

    audioStream.on("finish", async () => {
      const fileSize = fs.statSync(filePath).size;
      if (fileSize > 26214400) {
        fs.unlinkSync(filePath);
        return api.sendMessage("⚠️ | File too large to send (over 25MB).", event.threadID);
      }

      const msg = {
        body: `🎶 | Title: ${result.title}\n📺 | Channel: ${result.author}\n🔗 | Source: ${video.url}`,
        attachment: fs.createReadStream(filePath)
      };

      api.sendMessage(msg, event.threadID, () => fs.unlinkSync(filePath));
    });

    audioStream.on("error", (err) => {
      console.error("Audio Stream Error:", err);
      api.sendMessage("❌ | Error saving the audio file.", event.threadID);
    });

  } catch (err) {
    console.error("Music Command Error:", err);
    api.sendMessage("❌ | Failed to fetch or download the audio.", event.threadID);
  }
};
