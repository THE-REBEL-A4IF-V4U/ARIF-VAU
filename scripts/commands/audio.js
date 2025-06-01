const fs = require('fs');
const axios = require("axios");
const { resolve } = require('path');
const { createReadStream, unlinkSync, statSync } = require("fs-extra");

async function downloadMusicFromYoutube(link, path) {
  if (!link) return 'Link Not Found';
  const timestart = Date.now();

  try {
    const res = await axios.get("https://raw.githubusercontent.com/MOHAMMAD-NAYAN-07/Nayan/main/api.json");
    const api = res.data.down_stream;

    const encodedLink = encodeURIComponent(link);
    const data = await axios.get(`${api}/nayan/yt?url=${encodedLink}`);
    const audioUrl = data.data.data.audio_down;

    return new Promise((resolve, reject) => {
      axios({
        method: 'get',
        url: audioUrl,
        responseType: 'stream'
      }).then(response => {
        const writeStream = fs.createWriteStream(path);
        response.data.pipe(writeStream)
          .on('finish', async () => {
            try {
              const info = await axios.get(`${api}/nayan/yt?url=${encodedLink}`);
              const result = {
                title: info.data.data.title,
                timestart: timestart
              };
              resolve(result);
            } catch (error) {
              reject(error);
            }
          })
          .on('error', (error) => {
            reject(error);
          });
      }).catch(error => {
        reject(error);
      });
    });
  } catch (error) {
    return Promise.reject(error);
  }
}

module.exports.config = {
  name: "song",
  version: "1.0.0",
  permission: 0,
  credits: "Nayan",
  description: "Download song from YouTube",
  prefix: true,
  category: "Media",
  usages: "song <YouTube link or keywords>",
  cooldowns: 5
};

module.exports.handleReply = async function ({ api, event, handleReply }) {
  try {
    const path = `${__dirname}/cache/1.mp3`;
    const link = 'https://www.youtube.com/watch?v=' + handleReply.link[event.body - 1];
    const data = await downloadMusicFromYoutube(link, path);

    if (fs.statSync(path).size > 26214400) {
      return api.sendMessage('The file cannot be sent because it is larger than 25MB.', event.threadID, () => fs.unlinkSync(path), event.messageID);
    }

    api.unsendMessage(handleReply.messageID);
    return api.sendMessage({
      body: `🎵 Title: ${data.title}\n⏱️ Processing time: ${Math.floor((Date.now() - data.timestart) / 1000)}s\n💿====DISME PROJECT====💿`,
      attachment: fs.createReadStream(path)
    }, event.threadID, () => fs.unlinkSync(path), event.messageID);
  } catch (e) {
    console.log(e);
  }
};

module.exports.convertHMS = function (value) {
  const sec = parseInt(value, 10);
  let hours = Math.floor(sec / 3600);
  let minutes = Math.floor((sec - (hours * 3600)) / 60);
  let seconds = sec - (hours * 3600) - (minutes * 60);

  if (hours < 10) hours = "0" + hours;
  if (minutes < 10) minutes = "0" + minutes;
  if (seconds < 10) seconds = "0" + seconds;

  return (hours != '00' ? hours + ':' : '') + minutes + ':' + seconds;
};

module.exports.run = async function ({ api, event, args }) {
  if (!args.length) {
    return api.sendMessage('» উফফ আবাল কি গান শুনতে চাস তার ২/১ লাইন তো লেখবি নাকি 🥵 empty!', event.threadID, event.messageID);
  }

  const keywordSearch = args.join(" ");
  const path = `${__dirname}/cache/1.mp3`;

  if (fs.existsSync(path)) {
    fs.unlinkSync(path);
  }

  if (args.join(" ").startsWith("https://")) {
    try {
      const data = await downloadMusicFromYoutube(args.join(" "), path);

      if (fs.statSync(path).size > 26214400) {
        return api.sendMessage('Unable to send file because it is larger than 25MB.', event.threadID, () => fs.unlinkSync(path), event.messageID);
      }

      return api.sendMessage({
        body: `🎵 Title: ${data.title}\n⏱️ Processing time: ${Math.floor((Date.now() - data.timestart) / 1000)}s\n💿====DISME PROJECT====💿`,
        attachment: fs.createReadStream(path)
      }, event.threadID, () => fs.unlinkSync(path), event.messageID);
    } catch (e) {
      return console.log(e);
    }
  } else {
    try {
      const link = [], msg = [];
      const Youtube = require('youtube-search-api');
      const results = (await Youtube.GetListByKeyword(keywordSearch, false, 6)).items;

      results.forEach((video, index) => {
        link.push(video.id);
        msg.push(`${index + 1} - ${video.title} (${video.length.simpleText})\n`);
      });

      const body = `»🔎 Found ${link.length} results for your search:\n\n${msg.join('')}» Reply with the number to download.`;
      return api.sendMessage({ body }, event.threadID, (err, info) => {
        global.client.handleReply.push({
          type: 'reply',
          name: this.config.name,
          messageID: info.messageID,
          author: event.senderID,
          link
        });
      }, event.messageID);
    } catch (e) {
      return api.sendMessage('❌ An error occurred. Try again later!\n' + e.message, event.threadID, event.messageID);
    }
  }
};
