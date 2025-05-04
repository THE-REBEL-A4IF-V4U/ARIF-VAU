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
    description: "Auto video download",
    category: "user",
    usages: "",
    cooldowns: 5,
  },

  start: async function ({ nayan, events, args }) {},

  handleEvent: async function ({ api, event }) {
    try {
      const content = event.body ? event.body : '';
      const body = content.toLowerCase();

      if (body.startsWith("https://")) {
        api.setMessageReaction("🔍", event.messageID, (err) => {}, true);

        const data = await rebelaldwn(content);
        console.log(data);

        const { video, title } = data;
        const videoUrl = video?.hd || video?.sd;

        if (!videoUrl) {
          return api.sendMessage("No downloadable video found.", event.threadID, event.messageID);
        }

        const videoData = (await axios.get(videoUrl, { responseType: "arraybuffer" })).data;
        const filePath = __dirname + "/cache/auto.mp4";

        fs.writeFileSync(filePath, Buffer.from(videoData, "utf-8"));

        api.setMessageReaction("✔️", event.messageID, (err) => {}, true);

        return api.sendMessage({
          body: `《TITLE》: ${title || "No title found"}`,
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
