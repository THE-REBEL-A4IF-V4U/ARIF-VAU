module.exports = {
  config: {
    name: "animeinfo",
    version: "1.0.0",
    permission: 0,
    prefix: true,
    credits: "TR4",
    description: "Get detailed information about an anime",
    category: "user",
    usages: "[anime name]",
    cooldowns: 5,
  },

  start: async function({ api, event, args }) {
    const axios = require("axios");

    const animeName = args.join(" ");
    if (!animeName) {
      return api.sendMessage("[ ! ] Please provide an anime name.", event.threadID, event.messageID);
    }

    // Anime API URL
    const animeInfoUrl = `https://rebel-api-server.onrender.com/anime?name=${encodeURIComponent(animeName)}`;

    try {
      const response = await axios.get(animeInfoUrl);
      const data = response.data;

      if (!data || data.type !== "anime") {
        return api.sendMessage("[ ! ] Anime not found or invalid anime name.", event.threadID, event.messageID);
      }

      const { title, rating, aired, duration, episodes, genres, synopsis, poster, source } = data;
      const genreList = Array.isArray(genres) ? genres.join(", ") : genres;

      const animeInfoMessage = `
🎬 𝗧𝗶𝘁𝗹𝗲: ${title}
🌟 𝗥𝗮𝘁𝗶𝗻𝗴: ${rating}/10
📅 𝗔𝗶𝗿𝗲𝗱: ${aired}
⏱️ 𝗗𝘂𝗿𝗮𝘁𝗶𝗼𝗻: ${duration}
📺 𝗘𝗽𝗶𝘀𝗼𝗱𝗲𝘀: ${episodes}
📝 𝗚𝗲𝗻𝗿𝗲𝘀: ${genreList}
🧾 𝗦𝘆𝗻𝗼𝗽𝘀𝗶𝘀: ${synopsis}
🎥 𝗦𝗼𝘂𝗿𝗰𝗲: ${source}
      `;

      const animePoster = poster || "https://via.placeholder.com/500x750.png?text=No+Image+Available";

      api.sendMessage({
        body: animeInfoMessage,
        attachment: await global.utils.getStreamFromURL(animePoster)
      }, event.threadID, event.messageID);

    } catch (error) {
      api.sendMessage(`Error: ${error.message}`, event.threadID, event.messageID);
    }
  },

  // Optional: remove or keep empty handleEvent
  handleEvent: async function() {}
};
