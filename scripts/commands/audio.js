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
    "request": "",
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

    if (!result || !result.audio || !result.audio.url) {
      return api.sendMessage("❎ | Failed to fetch audio download link.", event.threadID);
    }

    const fileName = `${event.senderID}.mp3`;
    const filePath = `${__dirname}/cache/${fileName}`;

    const response = await axios({
      url: result.audio.url,
      method: "GET",
      responseType: "stream"
    });

    const writer = fs.createWriteStream(filePath);
    response.data.pipe(writer);

    writer.on("finish", () => {
      if (fs.statSync(filePath).size > 26214400) {
        fs.unlinkSync(filePath);
        return api.sendMessage("❎ | File too large to send (limit: 25MB).", event.threadID);
      }

      const message = {
        body:
          `♚═════ 𝙼𝚄𝚂𝙸𝙲 ═════♚\n\n` +
          `🎵 Title: ${video.title}\n` +
          `🎥 Channel: ${video.author.name}\n` +
          `🕛 Duration: ${convertHMS(video.seconds)}\n` +
          `👀 Views: ${video.viewCount}\n` +
          `❤️ Likes: ${video.likes}\n\n` +
          `🎧 Music provided by X2💠`,
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

function convertHMS(seconds) {
  seconds = Number(seconds);
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = Math.floor((seconds % 3600) % 60);

  const hDisplay = h > 0 ? h + ":" : "";
  const mDisplay = m < 10 ? "0" + m : m;
  const sDisplay = s < 10 ? "0" + s : s;

  return hDisplay + mDisplay + ":" + sDisplay;
}
