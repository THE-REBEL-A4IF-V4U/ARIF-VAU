module.exports.config = {
  name: "siteinfo",
  version: "1.0.1",
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

  let url = args.join(" ");
  if (!url) return api.sendMessage("Please provide a site URL.", event.threadID, event.messageID);

  try {
    const response = await axios.get(`https://list.ly/api/v4/meta?url=${encodeURIComponent(url)}`);
    const { name, description, url: finalUrl, image } = response.data;

    if (!name && !description && !finalUrl) {
      return api.sendMessage("No info found for this site!", event.threadID, event.messageID);
    }

    if (image) {
      let imgPath = __dirname + `/cache/siteinfo.png`;
      request(encodeURI(image))
        .pipe(fs.createWriteStream(imgPath))
        .on("close", () => {
          api.sendMessage({
            body: `Name: ${name || "N/A"}\n\nDescription: ${description || "N/A"}\n\nURL: ${finalUrl || "N/A"}`,
            attachment: fs.createReadStream(imgPath)
          }, event.threadID, () => fs.unlinkSync(imgPath), event.messageID);
        });
    } else {
      api.sendMessage(`Name: ${name || "N/A"}\n\nDescription: ${description || "N/A"}\n\nURL: ${finalUrl || "N/A"}`, event.threadID, event.messageID);
    }
  } catch (err) {
    console.error(err);
    api.sendMessage("An error occurred while fetching site info.", event.threadID, event.messageID);
  }
};
