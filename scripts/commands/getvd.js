module.exports.config = {
  name: "media",
  version: "1.0.0", 
  permission: 0,
  prefix: true,
  credits: "rebel",
  description: "Fetch random video by tag with description.",
  category: "media", 
  usages: "[tag]", 
  cooldowns: 0,
};

module.exports.run = async ({ api, event, args }) => {
  const axios = require('axios');
  const tag = args[0];  // Tag for categorizing media (e.g., romantic, funny, etc.)
  const type = "video";  // Always fetch video

  // List of valid tags
  const validTags = [
    "islamic", "romantic", "hot", "sad", "funny", "shairi"
  ];

  // Check if the provided tag is valid
  if (!validTags.includes(tag.toLowerCase())) {
    return api.sendMessage(`[⚠️] Invalid tag. Please use one of the following tags: ${validTags.join(", ")}`, event.threadID, event.messageID);
  }

  try {
    // Fetch a random video from the API (always request video)
    const response = await axios.get('https://rebel-api-server.onrender.com/api/media', {
      params: {
        tag: tag.toLowerCase(),
        type: type.toLowerCase()  // Always request "video"
      }
    });

    if (response.data.success) {
      const randomMedia = response.data.media;

      // Send the video directly (embed video player) with description
      return api.sendMessage({
        body: `--> "${tag}":\nDescription: ${randomMedia.description}`,
        attachment: await axios.get(randomMedia.link, { responseType: 'stream' }).then(res => res.data)
      }, event.threadID, event.messageID);
    } else {
      return api.sendMessage(`[⚠️] No media found with the tag "${tag}".`, event.threadID, event.messageID);
    }
  } catch (e) {
    return api.sendMessage('[⚠️] An error occurred while fetching media. Please try again later.', event.threadID, event.messageID);
  }
};