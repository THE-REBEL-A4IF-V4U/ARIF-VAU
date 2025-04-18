const axios = require('axios');
const cheerio = require('cheerio');
const fs = require('fs');
const path = require('path');

module.exports.config = {
  name: "porn",
  version: "2.0.0",
  permission: 2,
  credits: "Fixed by REBEL A4IF",
  description: "Send random NSFW image/video from selected category",
  category: "nsfw",
  prefix: false,
  usages: "porn [boobs, cum, bj, feet, ass, sex, pussy, teen, bdsm, asian, pornstar, gay]",
  cooldowns: 2,
  dependencies: []
};

module.exports.run = async function({ api, event, args }) {
  try {
    const content = args[0]?.toLowerCase();
    if (!content) return api.sendMessage("Please provide a category. Example: porn boobs", event.threadID, event.messageID);

    const album = {
      'asian': "9057591", 'ass': "2830292", 'bdsm': "17510771", 'bj': "3478991",
      'boobs': "15467902", 'cum': "1036491", 'feet': "852341", 'gay': "19446301",
      'pornstar': "20404671", 'pussy': "1940602", 'sex': "2132332", 'teen': "17887331"
    };

    if (!album[content]) return api.sendMessage("Invalid category.", event.threadID, event.messageID);

    const albumURL = `https://www.pornhub.com/albums/female/${album[content]}`;
    const { data } = await axios.get(albumURL);
    const $ = cheerio.load(data);

    const result = [];
    $('ul.photosAlbumsListing li.photoAlbumListContainer div.photoAlbumListBlock a').each((i, el) => {
      const photoLink = $(el).attr('href');
      if (photoLink) result.push(photoLink);
    });

    if (!result.length) return api.sendMessage("No content found.", event.threadID, event.messageID);

    const randomLink = "https://www.pornhub.com" + result[Math.floor(Math.random() * result.length)];
    const page = await axios.get(randomLink);
    const $$ = cheerio.load(page.data);

    const cachePath = path.join(__dirname, "cache");
    if (!fs.existsSync(cachePath)) fs.mkdirSync(cachePath);

    if (content === 'sex') {
      let videoSource = $$('video source').attr('src') || $$('video source[src]').attr('src');
      if (!videoSource) return api.sendMessage("No video found.", event.threadID, event.messageID);

      const tempVideoPath = path.join(cachePath, `porn_video.mp4`);
      const videoStream = await axios.get(videoSource, { responseType: 'stream' });
      const writer = fs.createWriteStream(tempVideoPath);
      videoStream.data.pipe(writer);

      await new Promise(resolve => writer.on('finish', resolve));

      api.sendMessage({ attachment: fs.createReadStream(tempVideoPath) }, event.threadID, () => {
        fs.unlinkSync(tempVideoPath);
      }, event.messageID);

    } else {
      const imgURL = $$('div#photoWrapper img').attr('src');
      if (!imgURL) return api.sendMessage("No image found.", event.threadID, event.messageID);

      const tempImgPath = path.join(cachePath, `porn_image.jpg`);
      const imgStream = await axios.get(imgURL, { responseType: 'stream' });
      const writer = fs.createWriteStream(tempImgPath);
      imgStream.data.pipe(writer);

      await new Promise(resolve => writer.on('finish', resolve));

      api.sendMessage({ attachment: fs.createReadStream(tempImgPath) }, event.threadID, () => {
        fs.unlinkSync(tempImgPath);
      }, event.messageID);
    }
  } catch (err) {
    console.error(err);
    api.sendMessage("An unexpected error occurred.", event.threadID, event.messageID);
  }
};
