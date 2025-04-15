const fs = require("fs");
const axios = require("axios");
const request = require("request");

module.exports.config = {
  name: "mediadownload",
  version: "1.0.0",
  permission: 0,
  credits: "TR4",
  description: "Download media from various platforms like YouTube, Facebook, Instagram, etc.",
  prefix: false, // Set to false for no prefix
  category: "admin",
  usages: "link",
  cooldowns: 5,
};

module.exports.run = async function({ api, event, args }) {
  api.setMessageReaction("😽", event.messageID, (err) => {}, true);
  api.sendTypingIndicator(event.threadID, true);

  const { messageID, threadID } = event;

  // The URL is directly passed in the message, so we extract it from the message body
  const content = event.body.trim(); // Get the message body

  if (!content) return api.sendMessage("[ ! ] Input link.", threadID, messageID);

  try {
    // Request media info from the API
    let response = await axios.get(`https://rebel-api-server.onrender.com/media?url=${encodeURIComponent(content)}`);
    
    const data = response.data;
    
    // Check if the response contains a media link
    if (!data || !data.media || !data.media.link) {
      return api.sendMessage("[ ! ] Media not found or the link is invalid.", threadID, messageID);
    }

    const mediaLink = data.media.link; // Get the download link from the API response
    const mediaTitle = data.media.title || "Downloaded Media"; // Get the title or set default

    // Create cache folder if not exists
    const cacheDir = __dirname + '/cache';
    if (!fs.existsSync(cacheDir)) {
      fs.mkdirSync(cacheDir);
    }

    // Create a writable stream for the media file
    const filePath = cacheDir + `/media_${Date.now()}.mp4`; // Save the file with a unique name
    const file = fs.createWriteStream(filePath);
    
    // Download the media file
    const rqs = request(encodeURI(mediaLink));
    rqs.pipe(file);

    // Send a message when download is complete
    file.on('finish', () => {
      setTimeout(function() {
        return api.sendMessage({
          body: `Downloaded Successfully.\n\nTitle: ${mediaTitle}`,
          attachment: fs.createReadStream(filePath)
        }, threadID, messageID);
      }, 5000);
    });
  } catch (err) {
    api.sendMessage(`Error: ${err.message}`, event.threadID, event.messageID);
  }
};