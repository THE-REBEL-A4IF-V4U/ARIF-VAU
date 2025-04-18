const axios = require('axios');
const cheerio = require('cheerio');

module.exports.config = {
  name: 'lyrics',
  version: '3.0.0',
  permission: 0,
  credits: 'Rebel Modified',
  description: 'Get lyrics of any song (Bangla, Hindi, English)',
  prefix: false,
  category: 'Music',
  usages: '/lyrics [song name]',
  cooldowns: 5,
};

module.exports.run = async function ({ api, event, args }) {
  const { threadID, messageID } = event;
  const query = args.join(' ');

  if (!query) {
    return api.sendMessage('Please provide a song name.', threadID, messageID);
  }

  try {
    const headers = { 'User-Agent': 'Mozilla/5.0' };

    // First try: Google Lyrics Box
    const googleUrl = `https://www.google.com/search?q=${encodeURIComponent(query)}+lyrics`;
    const googleRes = await axios.get(googleUrl, { headers });
    const $ = cheerio.load(googleRes.data);
    const lyricsBox = $('div[data-lyricid]');
    let lyrics = '';
    let singer = '';

    if (lyricsBox.length > 0) {
      const content = lyricsBox.html().replace(/<\/span><\/div><div.*?>/g, '\n');
      const parsed = cheerio.load(content);
      lyrics = parsed('span[jsname]').text();
      singer = $('div.auw0zb').first().text().trim();
    }

    // If not found on Google, fallback to Musixmatch
    if (!lyrics || lyrics.length < 10) {
      const mxmSearchUrl = `https://www.musixmatch.com/search/${encodeURIComponent(query)}`;
      const mxmSearchRes = await axios.get(mxmSearchUrl, { headers });
      const mxmMatch = mxmSearchRes.data.match(/<a class="title" href="(\/lyrics\/.*?)"/);

      if (mxmMatch) {
        const mxmLyricsUrl = `https://www.musixmatch.com${mxmMatch[1]}`;
        const mxmLyricsRes = await axios.get(mxmLyricsUrl, { headers });
        const $$ = cheerio.load(mxmLyricsRes.data);
        lyrics = $$('.lyrics__content__ok').text().trim();
        singer = $$('.mxm-track-title__artist-link').text().trim();
      }
    }

    if (lyrics && lyrics.trim() !== '') {
      api.sendMessage(`🎵 𝗟𝗬𝗥𝗜𝗖𝗦:\n\n${lyrics}\n\n👤 𝗔𝗥𝗧𝗜𝗦𝗧: ${singer || 'Unknown'}`, threadID, messageID);
    } else {
      api.sendMessage('Sorry, no lyrics found.', threadID, messageID);
    }

  } catch (error) {
    console.error(error);
    api.sendMessage('An error occurred while fetching lyrics.', threadID, messageID);
  }
};
