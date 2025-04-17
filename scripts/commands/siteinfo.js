module.exports.config = {
  name: "siteinfo", // command name.
  version: "1.0.0", // command version.
  permission: 0, // set to 1 for group admins, 2 for bot admins, 3 for bot operators.
  credits: "Rebel", // credit the creator.
  description: "View site info from a URL", // command description.
  prefix: false, // false for no prefix.
  category: "info", // command category.
  usages: "[site URL]", // command usage.
  cooldowns: 5, // command cooldown in seconds.
  dependencies: {
    "axios": "0.21.1", // example package dependency.
    "request": "2.88.2", // example package dependency.
  }
};

module.exports.run = async ({ api, event, args }) => {
  const axios = require('axios');
  const request = require('request');
  const fs = require("fs");
  
  // Get the URL from the arguments
  var juswa = args.join(" ");
  if (!juswa) return api.sendMessage(`Please provide a site URL.`, event.threadID, event.messageID);

  // Make the request to the List.ly API
  axios.get(`https://list.ly/api/v4/meta?url=${encodeURIComponent(juswa)}`)
    .then(res => {
      let a = res.data.name; // Site name
      let b = res.data.description; // Site description
      let d = res.data.url; // Site URL
      let c = res.data.image; // Site image URL

      let callback = function () {
        api.sendMessage(
          {
            body: `Name: ${a}\n\nDescription: ${b}\n\nUrl: ${d}`,
            attachment: fs.createReadStream(__dirname + `/cache/leecher.png`)
          },
          event.threadID,
          () => fs.unlinkSync(__dirname + `/cache/leecher.png`), // Clean up after sending the message
          event.messageID
        );
      };

      // Download the image from the URL and send it as an attachment
      request(encodeURI(c))
        .pipe(fs.createWriteStream(__dirname + `/cache/leecher.png`))
        .on("close", callback);
    })
    .catch(err => {
      api.sendMessage("An error occurred while fetching the site info.", event.threadID, event.messageID);
      console.error(err);
    });
};
