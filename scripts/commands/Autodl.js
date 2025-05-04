const axios = require("axios");
const fs = require("fs-extra");
const path = require("path");
const { rebelaldwn } = require("trs-media-downloader");

module.exports = {
  config: {
    name: "auto",
    version: "0.0.2",
    permission: 0,
    prefix: true,
    credits: "REBEL",
    description: "auto video download",
    category: "user",
    usages: "",
    cooldowns: 5,
  },

  start: async function ({ nayan, events, args }) {},

  handleEvent: async function ({ api, event }) {
    try {
      const content = event.body || '';
      const body = content.toLowerCase();

      if (body.startsWith("https://")) {
        api.setMessageReaction("🔍", event.messageID, () => {}, true);

        const result = await rebelaldwn(content);
        if (!result || typeof result !== "object" || !result.url) {
          throw new Error("Invalid response from downloader.");
        }

        // Handle array or string for video URL
        const videoUrl = Array.isArray(result.url)
          ? result.url[0]?.url || result.url[0]
          : result.url;

        if (!videoUrl) {
          throw new Error("No valid video URL found.");
        }

        const filePath = path.join(__dirname, "cache", "auto.mp4");
        const videoBuffer = (await axios.get(videoUrl, { responseType: "arraybuffer" })).data;

        await fs.outputFile(filePath, videoBuffer);

        api.setMessageReaction("✔️", event.messageID, () => {}, true);

        return api.sendMessage({
          body: `VIDEO BY THE REBEL`,
          attachment: fs.createReadStream(filePath)
        }, event.threadID, () => fs.unlinkSync(filePath), event.messageID);
      }
    } catch (err) {
      console.error(err);
      api.setMessageReaction("❌", event.messageID, () => {}, true);
      return api.sendMessage("Download failed or invalid link.", event.threadID, event.messageID);
    }
  }
};
