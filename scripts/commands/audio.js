const fs = require("fs-extra");
const axios = require("axios");
const yts = require("yt-search");
const { rebelyt } = require("trs-media-downloader");

module.exports.config = {
  name: "music",
  version: "2.0.4",
  permission: 0,
  credits: "Hamim",
  description: "Play a song",
  prefix: true,
  premium: false,
  category: "media",
  usages: "[title]",
  cooldowns: 10,
  dependencies: {
    "fs-extra": "",
    "axios": "",
    "yt-search": "",
    "trs-media-downloader": ""
  }
};

module.exports.run = async ({ api, event }) => {
  const input = event.body;
  const data = input.split(" ");

  if (data.length < 2) {
    return api.sendMessage("ℹ️ | Please provide a song title.", event.threadID);
  }

  data.shift();
  const song = data.join(" ");

  try {
    api.sendMessage(`🔍 | Searching for "${song}". Please wait...`, event.threadID);

    const searchResults = await yts(song);
    if (!searchResults.videos.length) {
      return api.sendMessage("❎ | No results found.\n\nError: Invalid request.", event.threadID);
    }

    const video = searchResults.videos[0];
    const result = await rebelyt(video.url);

    if (!result || !result.mp3) {
      return api.sendMessage("❎ | Failed to fetch audio download link.", event.threadID);
    }

    const filePath = `${__dirname}/cache/${event.senderID}.webm`;

    const response = await axios({
      url: result.mp3,
      method: "GET",
      responseType: "stream"
    });

    const writer = fs.createWriteStream(filePath);
    response.data.pipe(writer);

    writer.on("finish", () => {
      const fileSize = fs.statSync(filePath).size;
      if (fileSize > 26214400) {
        fs.unlinkSync(filePath);
        return api.sendMessage("❎ | File too large to send (limit: 25MB).", event.threadID);
      }

      const message = {
        body:
          `♚═════ 𝙼𝚄𝚂𝙸𝙲 ═════♚\n\n` +
          `🎵 Title: ${result.title}\n` +
          `🎥 Channel: ${result.author}\n` +
          `📥 Developer: ${result.developer}\n` +
          `🔗 Facebook: ${result.Facebook}\n` +
          `📱 WhatsApp: ${result.WhatsApp}`,
        attachment: fs.createReadStream(filePath)
      };

      api.sendMessage(message, event.threadID, () => fs.unlinkSync(filePath));
    });

    writer.on("error", (err) => {
      console.error("[WRITE ERROR]", err);
      fs.unlinkSync(filePath);
      api.sendMessage("❎ | Error saving the file.", event.threadID);
    });

  } catch (error) {
    console.error('[ERROR]', error);
    api.sendMessage("❎ | An error occurred while processing your request.", event.threadID);
  }
};
