module.exports.config = {
  name: "imgur",
  version: "1.0.0", 
  permission: 0,
  prefix: true,
  credits: "farhan",
  description: "Uploads images or videos to Imgur and provides a download link.",
  category: "other", 
  usages: "[tag]", 
  cooldowns: 0,
};

module.exports.run = async ({ api, event, args }) => {
  const axios = global.nodemodule['axios'];
  const formData = require('form-data');
  const fs = require('fs');

  // Retrieve the media attachment from the reply
  const mediaUrl = event.messageReply.attachments && event.messageReply.attachments[0].url;

  // If no media is attached in the reply, return an error
  if (!mediaUrl) 
    return api.sendMessage('[⚠️] Please reply to an image or video message to upload it to Imgur.', event.threadID, event.messageID);

  try {
    // Fetch the media content from the URL
    const mediaResponse = await axios.get(mediaUrl, { responseType: 'arraybuffer' });
    const mediaBuffer = Buffer.from(mediaResponse.data, 'binary');

    // Fetch the API keys from the remote `key.json` file on GitHub
    const keysResponse = await axios.get('https://raw.githubusercontent.com/THE-REBEL-A4IF-V4U/Rebel/main/key.json');
    const imgurClientID = keysResponse.data.apikey.IMGUR_CLIENT_ID; // Accessing the IMGUR_CLIENT_ID

    // If the API key is missing
    if (!imgurClientID) {
      return api.sendMessage('[⚠️] Imgur Client ID not found in key.json', event.threadID, event.messageID);
    }

    // Prepare form data for the Imgur upload
    const data = new formData();
    data.append('image', mediaBuffer, 'media'); // Attach the media file

    // Imgur API endpoint
    const imgurApiUrl = 'https://api.imgur.com/3/upload';

    // Post the form data to Imgur API
    const imgurResponse = await axios.post(imgurApiUrl, data, {
      headers: {
        ...data.getHeaders(),
        Authorization: `Client-ID ${imgurClientID}`,
      }
    });

    // Retrieve the Imgur link from the response
    const imgurLink = imgurResponse.data.data.link;

    // Send the Imgur link in the chat
    return api.sendMessage(`Here is your Imgur link: ${imgurLink}`, event.threadID, event.messageID);
  }
  catch (e) {
    // In case of error
    return api.sendMessage('[⚠️] An error occurred while uploading to Imgur. Please try again later.', event.threadID, event.messageID);
  }
};