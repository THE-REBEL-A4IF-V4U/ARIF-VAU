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

      // Check if the message contains a URL
      if (body.startsWith("https://")) {
        api.setMessageReaction("🔍", event.messageID, () => {}, true);  // Set reaction as searching

        // Fetch the data from the downloader
        const result = await rebelaldwn(content);
        
        // Ensure result is valid and contains a URL
        if (!result || typeof result !== "object" || !result.url) {
          throw new Error("Invalid response from downloader.");
        }

        // Handle the URL being an array or a string
        const videoUrl = Array.isArray(result.url)
          ? result.url[0]?.url || result.url[0]
          : result.url;

        if (!videoUrl) {
          throw new Error("No valid video URL found.");
        }

        // Prepare the file path to save the downloaded video
        const filePath = path.join(__dirname, "cache", "auto.mp4");

        // Download the video and save it to the file system
        const videoBuffer = (await axios.get(videoUrl, { responseType: "arraybuffer" })).data;
        await fs.outputFile(filePath, videoBuffer);

        // Set reaction as success
        api.setMessageReaction("✔️", event.messageID, () => {}, true);

        // Send the downloaded video back as a message with the title and developer info
        return api.sendMessage({
          body: `《TITLE》: ${result.title || "No title"}\n《Developer》: ${result.developer}\n《Facebook》: ${result.Facebook}\n《WhatsApp》: ${result.WhatsApp}`,
          attachment: fs.createReadStream(filePath)
        }, event.threadID, () => fs.unlinkSync(filePath), event.messageID);  // Delete the file after sending
      }
    } catch (err) {
      console.error(err);

      // Set reaction as failure
      api.setMessageReaction("❌", event.messageID, () => {}, true);

      // Inform the user about the failure
      return api.sendMessage("Download failed or invalid link.", event.threadID, event.messageID);
    }
  }
};
