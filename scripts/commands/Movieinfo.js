const axios = require("axios");

module.exports.config = {
  name: "movie",
  version: "1.0.0",
  permission: 0,
  credits: "Rebel Tech Zone",
  description: "Get movie info using name",
  prefix: true,
  category: "search",
  usages: "[movie name]",
  cooldowns: 5,
};

module.exports.run = async function ({ api, event, args }) {
  const { threadID, messageID } = event;
  const name = args.join(" ");

  if (!name) return api.sendMessage("[ ❗ ] সিনেমার নাম দিন!", threadID, messageID);

  try {
    const res = await axios.get(`https://rebel-api-server.onrender.com/movie?name=${encodeURIComponent(name)}`);
    const data = res.data;

    if (!data.title) {
      return api.sendMessage("[ ❗ ] কোনো তথ্য পাওয়া যায়নি!", threadID, messageID);
    }

    const msg = 
`🎬 *Title:* ${data.title}
⭐ *Rating:* ${data.rating}
🗓️ *Year:* ${data.year}
⌛ *Duration:* ${data.duration}
📖 *Genres:* ${data.genres}
📝 *Description:* ${data.description}
🌐 *Source:* TMDB`;

    if (data.poster) {
      const imageStream = await axios.get(data.poster, { responseType: "stream" });
      return api.sendMessage({
        body: msg,
        attachment: imageStream.data
      }, threadID, messageID);
    } else {
      return api.sendMessage(msg, threadID, messageID);
    }

  } catch (err) {
    console.error("Movie Command Error:", err.message);
    return api.sendMessage("[ ❗ ] সার্ভার সমস্যা বা ভুল নাম দেওয়া হয়েছে!", threadID, messageID);
  }
};
