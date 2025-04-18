const axios = require('axios');
const FormData = require('form-data');
const fs = require('fs-extra');
const path = require('path');
const downloader = require('image-downloader');

module.exports.config = {
  name: 'remove',
  version: '1.1.1',
  permission: 2,
  credits: 'REBEL',
  prefix: false,
  description: 'Remove photo background',
  category: 'user',
  usages: 'remove (reply to image)',
  cooldowns: 2,
  dependencies: {
    'form-data': '',
    'image-downloader': '',
    'fs-extra': ''
  }
};

module.exports.run = async function({ api, event, args }) {
  try {
    if (event.type !== "message_reply") 
      return api.sendMessage("Please reply to a photo.", event.threadID, event.messageID);

    if (!event.messageReply.attachments || event.messageReply.attachments.length === 0) 
      return api.sendMessage("No attachment found. Please reply to a photo.", event.threadID, event.messageID);

    const attachment = event.messageReply.attachments[0];
    if (attachment.type !== "photo") 
      return api.sendMessage("This is not a photo.", event.threadID, event.messageID);

    const imageUrl = attachment.url;
    const apiKeys = ["x6mFTNH6YfBD3vCVXTwkLuqa"]; // Tomar remove.bg API keys, chaile aro add korte paro.

    const cachePath = path.join(__dirname, 'cache');
    if (!fs.existsSync(cachePath)) fs.mkdirSync(cachePath);

    const inputPath = path.join(cachePath, `photo_${event.messageID}.png`);
    await downloader.image({ url: imageUrl, dest: inputPath });

    const formData = new FormData();
    formData.append('size', 'auto');
    formData.append('image_file', fs.createReadStream(inputPath));

    const response = await axios({
      method: 'post',
      url: 'https://api.remove.bg/v1.0/removebg',
      data: formData,
      responseType: 'arraybuffer',
      headers: {
        ...formData.getHeaders(),
        'X-Api-Key': apiKeys[Math.floor(Math.random() * apiKeys.length)],
      },
      encoding: null
    });

    if (response.status != 200)
      return api.sendMessage("Failed to remove background.", event.threadID, event.messageID);

    const outputPath = path.join(cachePath, `output_${event.messageID}.png`);
    fs.writeFileSync(outputPath, response.data);

    api.sendMessage({ attachment: fs.createReadStream(outputPath) }, event.threadID, () => {
      fs.unlinkSync(inputPath);
      fs.unlinkSync(outputPath);
    }, event.messageID);

  } catch (error) {
    console.error(error);
    return api.sendMessage("An error occurred while removing background.", event.threadID, event.messageID);
  }
};
