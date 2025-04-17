const axios = require('axios');
const cheerio = require('cheerio');
const fs = require('fs');
const request = require('request');
const ffmpeg = require('fluent-ffmpeg');
const ffmpegPath = require('@ffmpeg-installer/ffmpeg').path;
ffmpeg.setFfmpegPath(ffmpegPath);
const path = require('path');

module.exports.config = {
  name: "porn",
  version: "1.0.0",
  permssion: 2,
  credits: "Fixed by REBEL A4IF",
  description: "Send random NSFW image/video from selected category",
  category: "nsfw",
  prefix: false,
  usages: "porn [boobs, cum, bj, feet, ass, sex, pussy, teen, bdsm, asian, pornstar, gay]",
  cooldowns: 1,
  dependencies: []
};

module.exports.run = async function({ api, event, args }) {
  try {
    const content = args[0]?.toLowerCase();
    if (!content) return api.sendMessage("Please provide a category. Example: porn boobs", event.threadID, event.messageID);

    const album = {
      'asian': "9057591",
      'ass': "2830292",
      'bdsm': "17510771",
      'bj': "3478991",
      'boobs': "15467902",
      'cum': "1036491",
      'feet': "852341",
      'gay': "19446301",
      'pornstar': "20404671",
      'pussy': "1940602",
      'sex': "2132332",
      'teen': "17887331"
    };

    if (!album[content]) {
      return api.sendMessage("Invalid category. Available: boobs, cum, bj, feet, ass, sex, pussy, teen, bdsm, asian, pornstar, gay", event.threadID, event.messageID);
    }

    const albumURL = `https://www.pornhub.com/albums/female/${album[content]}`;
    const response = await axios.get(albumURL);
    const $ = cheerio.load(response.data);

    const result = [];
    $('ul.photosAlbumsListing li.photoAlbumListContainer div.photoAlbumListBlock a').each((i, el) => {
      const photoLink = $(el).attr('href');
      if (photoLink) result.push(photoLink);
    });

    if (result.length === 0) {
      return api.sendMessage("No content found, please try again later.", event.threadID, event.messageID);
    }

    const randomLink = "https://www.pornhub.com" + result[Math.floor(Math.random() * result.length)];
    const page = await axios.get(randomLink);
    const $$ = cheerio.load(page.data);

    if (content === 'sex') {
      const videoSource = $$('video.centerImageVid source').attr('src') || $$('video.centerImageVid source').attr('src0_3');
      if (!videoSource) return api.sendMessage("No video found.", event.threadID, event.messageID);

      const ext = path.extname(videoSource).split('?')[0].replace('.', '') || 'mp4';
      const tempVideo = path.join(__dirname, `cache/porn.${ext}`);
      const tempGif = path.join(__dirname, `cache/porn.gif`);

      await new Promise((resolve, reject) => {
        request(videoSource).pipe(fs.createWriteStream(tempVideo)).on('close', resolve).on('error', reject);
      });

      await new Promise((resolve, reject) => {
        ffmpeg(tempVideo)
          .toFormat('gif')
          .on('end', resolve)
          .on('error', reject)
          .save(tempGif);
      });

      api.sendMessage({ attachment: fs.createReadStream(tempGif) }, event.threadID, () => {
        fs.unlinkSync(tempGif);
        fs.unlinkSync(tempVideo);
      }, event.messageID);

    } else {
      const imgURL = $$('div#photoWrapper img').attr('src');
      if (!imgURL) return api.sendMessage("No image found.", event.threadID, event.messageID);

      const ext = path.extname(imgURL).split('?')[0].replace('.', '') || 'jpg';
      const tempImg = path.join(__dirname, `cache/porn.${ext}`);

      await new Promise((resolve, reject) => {
        request(imgURL).pipe(fs.createWriteStream(tempImg)).on('close', resolve).on('error', reject);
      });

      api.sendMessage({ attachment: fs.createReadStream(tempImg) }, event.threadID, () => {
        fs.unlinkSync(tempImg);
      }, event.messageID);
    }
  } catch (err) {
    console.error(err);
    return api.sendMessage("An unexpected error occurred. Please try again later.", event.threadID, event.messageID);
  }
};