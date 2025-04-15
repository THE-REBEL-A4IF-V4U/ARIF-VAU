module.exports = {
  config: {
    name: "auto",
    version: "0.0.2",
    permission: 0,
    prefix: true,
    credits: "Nayan",
    description: "Auto video download",
    category: "user",
    usages: "",
    cooldowns: 5,
  },

  start: async function({ nayan, events, args }) {},
  
  handleEvent: async function({ api, event, args }) {
    const axios = require("axios");
    const request = require("request");
    const fs = require("fs-extra");
    
    const content = event.body ? event.body : '';
    const body = content.toLowerCase();
    
    // Your provided link for downloading videos
    const apiUrl = `https://rebel-api-server.onrender.com/media?url=${encodeURIComponent(content)}`;

    if (body.startsWith("https://")) {
      api.setMessageReaction("🔍", event.messageID, (err) => {}, true);
      
      try {
        // Fetch the media data using the provided API link
        const response = await axios.get(apiUrl);
        const data = response.data;

        if (!data || !data.media || !data.media.link) {
          return api.sendMessage("[ ! ] Media not found or the link is invalid.", event.threadID, event.messageID);
        }

        const { link, title } = data.media;
        
        // Fetch the video from the provided media link
        const videoData = await axios.get(link, { responseType: "arraybuffer" });
        const videoBuffer = Buffer.from(videoData.data, "utf-8");
        
        // Save the video file in cache
        fs.writeFileSync(__dirname + "/cache/auto.mp4", videoBuffer);

        // Send the video back to the user with title
        api.setMessageReaction("✔️", event.messageID, (err) => {}, true);

        return api.sendMessage({
          body: `《TITLE》: ${title}`,
          attachment: fs.createReadStream(__dirname + "/cache/auto.mp4")
        }, event.threadID, event.messageID);

      } catch (err) {
        api.sendMessage(`Error: ${err.message}`, event.threadID, event.messageID);
      }
    }
  }
};
