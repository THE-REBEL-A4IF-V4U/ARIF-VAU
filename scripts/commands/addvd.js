module.exports.config = {
  name: "add",
  version: "1.0.0",
  permission: 0,
  prefix: true,
  credits: "rebel",
  description: "Upload an image or video with a tag and description.",
  category: "media",
  usages: "[tag] [description] [reply with image/video]",
  cooldowns: 0,
};

module.exports.run = async ({ api, event, args }) => {
  const axios = require("axios");
  const FormData = require("form-data");

  const tag = args[0];
  const description = args.slice(1).join(" ");
  const attachment = event.messageReply?.attachments?.[0];

  const validTags = ["islamic", "romantic", "hot", "sad", "funny", "shairi"];

  if (!attachment || !tag || !description) {
    return api.sendMessage(
      "[⚠️] Please reply to an image/video and include a tag + description.\nUsage: add [tag] [description]",
      event.threadID,
      event.messageID
    );
  }

  if (!validTags.includes(tag.toLowerCase())) {
    return api.sendMessage(
      `[⚠️] Invalid tag. Use one of: ${validTags.join(", ")}`,
      event.threadID,
      event.messageID
    );
  }

  try {
    const mediaRes = await axios.get(attachment.url, { responseType: "stream" });
    const ext = attachment.type === "video" ? "mp4" : "jpg";

    const form = new FormData();
    form.append("file", mediaRes.data, { filename: `upload.${ext}` });
    form.append("text", description);
    form.append("tag", tag.toLowerCase());

    const response = await axios.post(
      "https://rebel-api-server.onrender.com/api/media/add",
      form,
      { headers: form.getHeaders() }
    );

    if (response.data.success) {
      return api.sendMessage(
        `[✅] Media uploaded successfully!\nTag: ${tag}\nType: ${attachment.type}\nLink: ${response.data.data.link}`,
        event.threadID,
        event.messageID
      );
    } else {
      return api.sendMessage("[⚠️] Upload failed. Try again later.", event.threadID, event.messageID);
    }
  } catch (err) {
    console.error("Upload Error:", err);
    return api.sendMessage("[⚠️] Error occurred: " + err.message, event.threadID, event.messageID);
  }
};
