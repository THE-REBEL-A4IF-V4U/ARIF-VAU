const fs = require("fs-extra");
const axios = require("axios");
const moment = require("moment");

module.exports.config = {
  name: "git",
  version: "1.0.0",
  permission: 0, // spelling thik
  credits: "Rebel",
  prefix: 'awto',
  description: "Get username's GitHub info",
  category: "user",
  dependencies: {
    "axios": "",
    "moment": "",
    "fs-extra": ""
  },
  usages: "git <username>",
  cooldowns: 5
};

module.exports.run = async ({ api, event, args }) => {
  try {
    if (!args[0]) {
      return api.sendMessage(`GitHub username cannot be empty!`, event.threadID, event.messageID);
    }

    const username = encodeURIComponent(args.join(' '));
    const { data } = await axios.get(`https://api.github.com/users/${username}`);

    if (data.message) {
      return api.sendMessage(`User Not Found | Please provide a valid username!`, event.threadID, event.messageID);
    }

    const { login, avatar_url, name, id, html_url, public_repos, followers, following, location, created_at, bio } = data;

    const info = 
`== GitHub User Info ==

Name: ${name || "No Name"}
Username: ${login}
ID: ${id}
Bio: ${bio || "No Bio"}
Public Repositories: ${public_repos}
Followers: ${followers}
Following: ${following}
Location: ${location || "No Location"}
Account Created: ${moment.utc(created_at).format("dddd, MMMM Do YYYY")}
Profile: ${html_url}
Avatar below:`;

    // download avatar image
    const imgBuffer = (await axios.get(avatar_url, { responseType: "arraybuffer" })).data;
    const path = __dirname + "/cache/github_avatar.png";
    fs.writeFileSync(path, Buffer.from(imgBuffer, "binary"));

    api.sendMessage({
      body: info,
      attachment: fs.createReadStream(path)
    }, event.threadID, () => fs.unlinkSync(path), event.messageID);

  } catch (error) {
    console.error(error);
    return api.sendMessage(`An error occurred!`, event.threadID, event.messageID);
  }
};
