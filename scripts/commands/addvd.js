module.exports.config = {
  name: "add",
  version: "1.0.0",
  permission: 0,
  prefix: true,
  credits: "farhan",
  description: "Upload an image or video with a tag and description.",
  category: "media",
  usages: "[tag] [description] [image/video]",
  cooldowns: 0,
};

module.exports.run = async ({ api, event, args }) => {
  const axios = require('axios');
  const fs = require('fs');
  const request = require('request');
  const FormData = require('form-data');
  
  const tag = args[0];  // Tag for categorizing media (e.g., romantic, funny, etc.)
  const description = args[1];  // Description for the media
  const mediaUrl = event.messageReply.attachments && event.messageReply.attachments[0].url;  // Get URL from the media attachment
  
  // If media (image/video) is not provided or tag/description is missing, return error
  if (!mediaUrl || !tag || !description) {
    return api.sendMessage('[⚠️] Please provide a valid image/video, tag, and description.', event.threadID, event.messageID);
  }

  // List of valid tags
  const validTags = [
    "islamic", "romantic", "hot", "sad", "funny", "shairi"
  ];

  // Check if the provided tag is valid
  if (!validTags.includes(tag.toLowerCase())) {
    return api.sendMessage(`[⚠️] Invalid tag. Please use one of the following tags: ${validTags.join(", ")}`, event.threadID, event.messageID);
  }

  try {
    // Create form data for uploading media
    const formData = new FormData();
    formData.append("file", request(mediaUrl));  // Request the media URL and append to the form
    formData.append("text", description);  // Add description to form data
    formData.append("tag", tag);  // Add the tag to form data

    // Send the media to the API for uploading
    const response = await axios.post('https://rebel-api-server.onrender.com/api/media/add', formData, {
      headers: formData.getHeaders(),
    });

    // If successful, send the media link to the user
    if (response.data.success) {
      return api.sendMessage(`[✅] Successfully uploaded media to the server. Here is your media: ${response.data.data.link}`, event.threadID, event.messageID);
    } else {
      return api.sendMessage('[⚠️] Failed to upload media. Please try again later.', event.threadID, event.messageID);
    }
  } catch (e) {
    console.error("Error occurred during media upload:", e);
    return api.sendMessage('[⚠️] An error occurred while uploading media. Please try again later.', event.threadID, event.messageID);
  }
};