const axios = require("axios");
const fs = require("fs-extra");
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
        if (!result || typeof result !== "object") {
          throw new Error("Invalid response from downloader.");
        }

        const { url, title, developer, Facebook, WhatsApp } = result;

        if (!url) {
          throw new Error("No video URL found in response.");
        }

        const videoData = (await axios.get(url, { responseType: "arraybuffer" })).data;
        const filePath = __dirname + "/cache/auto.mp4";

        fs.writeFileSync(filePath, Buffer.from(videoData));

        api.setMessageReaction("✔️", event.messageID, () => {}, true);

        return api.sendMessage({
          body: `《TITLE》: ${title || "No title"}\n《Developer》: ${developer}\n《Facebook》: ${Facebook}\n《WhatsApp》: ${WhatsApp}`,
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
