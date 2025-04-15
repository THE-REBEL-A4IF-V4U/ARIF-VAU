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

  start: async function({ nayan, events, args }) {},

  handleEvent: async function({ api, event, args }) {
    const axios = require("axios");

    const animeName = args.join(" ");
    if (!animeName) return api.sendMessage("[ ! ] Please provide an anime name.", event.threadID, event.messageID);

    // Anime API URL
    const animeInfoUrl = `https://rebel-api-server.onrender.com/anime?name=${encodeURIComponent(animeName)}`;

    try {
      // Fetch anime data from the API
      const response = await axios.get(animeInfoUrl);
      const data = response.data;

      if (!data || data.type !== "anime") {
        return api.sendMessage("[ ! ] Anime not found or invalid anime name.", event.threadID, event.messageID);
      }

      const { title, rating, aired, duration, episodes, genres, synopsis, poster, source } = data;

      // Format genres into a string if it's an array
      const genreList = Array.isArray(genres) ? genres.join(", ") : genres;

      const animeInfoMessage = `
        🎬 **Anime Title**: ${title}
        🌟 **Rating**: ${rating}/10
        📅 **Aired**: ${aired}
        ⏱️ **Duration**: ${duration}
        📺 **Episodes**: ${episodes}
        📝 **Genres**: ${genreList}
        📝 **Synopsis**: ${synopsis}
        🎥 **Source**: ${source}
      `;

      // Use a fallback poster image if none exists
      const animePoster = poster || "https://via.placeholder.com/500x750.png?text=No+Image+Available";

      // Send the anime info along with the poster image
      api.sendMessage({
        body: animeInfoMessage,
        attachment: [{
          type: 'image',
          url: animePoster
        }]
      }, event.threadID, event.messageID);

    } catch (error) {
      api.sendMessage(`Error: ${error.message}`, event.threadID, event.messageID);
    }
  }
};
