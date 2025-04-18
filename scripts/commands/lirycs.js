const axios = require('axios');

module.exports.config = {
  name: 'lyrics',
  version: '1.0.0',
  permission: 0,
  credits: 'Rebel',
  description: 'Get song lyrics easily',
  prefix: false,
  category: 'Music',
  usages: '/lyrics [song name]',
  cooldowns: 5,
};

module.exports.run = async function ({ api, event, args }) {
  const { threadID, messageID } = event;
  const song = args.join(' ');

  if (!song) {
    return api.sendMessage('Please provide a song name to find lyrics.', threadID, messageID);
  }

  try {
    const response = await axios.get(`https://api.lyrics.ovh/v1/${encodeURIComponent(song.split(' ')[0])}/${encodeURIComponent(song.split(' ').slice(1).join(' '))}`);
    if (response.data.lyrics) {
      api.sendMessage(`🎵 Lyrics for "${song}":\n\n${response.data.lyrics}`, threadID, messageID);
    } else {
      api.sendMessage('Lyrics not found.', threadID, messageID);
    }
  } catch (error) {
    console.error(error);
    api.sendMessage('Sorry, could not fetch lyrics. Try another song.', threadID, messageID);
  }
};
