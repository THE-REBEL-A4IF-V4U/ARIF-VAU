module.exports.config = {
  name: "siteinfo",
  version: "1.0.2",
  permission: 0,
  credits: "Rebel",
  description: "View site info from a URL",
  prefix: false,
  category: "info",
  usages: "[site URL]",
  cooldowns: 5,
  dependencies: {
    "axios": "",
    "request": "",
    "fs-extra": ""
  }
};

module.exports.run = async ({ api, event, args }) => {
  const axios = require('axios');
  const request = require('request');
  const fs = require("fs-extra");

  let siteUrl = args.join(" ");
  if (!siteUrl) return api.sendMessage("Please provide a site URL.", event.threadID, event.messageID);

  try {
    const res = await axios.get(`https://list.ly/api/v4/meta?url=${encodeURIComponent(siteUrl)}`); // ✅ thik URL

    const metadata = res.data.metadata;
    if (!metadata) return api.sendMessage("No metadata found for this site!", event.threadID, event.messageID);

    const name = metadata.name || "N/A";
    const description = metadata.description || "N/A";
    const finalUrl = metadata.url || siteUrl;
    const images = metadata.images || [];

    if (images.length > 0) {
      let imgPath = __dirname + `/cache/siteinfo.png`;
      request(encodeURI(images[0]))
        .pipe(fs.createWriteStream(imgPath))
        .on("close", () => {
          api.sendMessage({
            body: `Name: ${name}\n\nDescription: ${description}\n\nURL: ${finalUrl}`,
            attachment: fs.createReadStream(imgPath)
          }, event.threadID, () => fs.unlinkSync(imgPath), event.messageID);
        });
    } else {
      api.sendMessage(`Name: ${name}\n\nDescription: ${description}\n\nURL: ${finalUrl}`, event.threadID, event.messageID);
    }
  } catch (err) {
    console.error(err);
    api.sendMessage("An error occurred while fetching site info.", event.threadID, event.messageID);
  }
};
