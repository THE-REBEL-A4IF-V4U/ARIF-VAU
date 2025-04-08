module.exports.config = {
  name: "add",
  version: "1.0.0",
  permission: 0,
  prefix: true,
  credits: "rebel",
  description: "Upload an image or video with a tag and description.",
  category: "media",
  usages: "[tag] [description] [image/video]",
  cooldowns: 0,
};

module.exports.run = async ({ api, event, args }) => {
  const axios = require('axios');

  const tag = args[0];
  const description = args.slice(1).join(" ");
  const attachment = event.messageReply?.attachments?.[0];

  if (!attachment || !tag || !description) {
    return api.sendMessage('[⚠️] Please reply to a valid image/video and provide a tag and description.', event.threadID, event.messageID);
  }

  const mediaUrl = attachment.url;

  const validTags = ["islamic", "romantic", "hot", "sad", "funny", "shairi"];
  if (!validTags.includes(tag.toLowerCase())) {
    return api.sendMessage(`[⚠️] Invalid tag. Use: ${validTags.join(", ")}`, event.threadID, event.messageID);
  }

  try {
    const response = await axios.post('https://rebel-api-server.onrender.com/api/media/add', {
      tag: tag.toLowerCase(),
      description: description,
      fileUrl: mediaUrl
    });

    if (response.data.success) {
      return api.sendMessage(`[✅] Successfully added media!\nTag: ${tag}\nDescription: ${description}`, event.threadID, event.messageID);
    } else {
      return api.sendMessage('[⚠️] Upload failed. Try again later.', event.threadID, event.messageID);
    }
  } catch (e) {
    console.error(e);
    return api.sendMessage('[⚠️] Error occurred: ' + e.message, event.threadID, event.messageID);
  }
};
