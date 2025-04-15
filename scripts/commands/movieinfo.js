module.exports = {
  config: {
    name: "movieinfo",
    version: "1.0.0",
    permission: 0,
    prefix: true,
    credits: "TR4",
    description: "Get detailed information about a movie",
    category: "user",
    usages: "[movie name]",
    cooldowns: 5,
  },

  start: async function({ nayan, events, args }) {},

  handleEvent: async function({ api, event, args }) {
    const axios = require("axios");

    const movieName = args.join(" ");
    if (!movieName) return api.sendMessage("[ ! ] Please provide a movie name.", event.threadID, event.messageID);

    // Movie API URL
    const movieInfoUrl = `https://rebel-api-server.onrender.com/movie?name=${encodeURIComponent(movieName)}`;

    try {
      // Fetch movie data from the API
      const response = await axios.get(movieInfoUrl);
      const data = response.data;

      if (!data || data.type !== "movie") {
        return api.sendMessage("[ ! ] Movie not found or invalid movie name.", event.threadID, event.messageID);
      }

      const { title, rating, year, duration, genres, description, poster, source } = data;

      // Format genres into a string if it's an array
      const genreList = Array.isArray(genres) ? genres.join(", ") : genres;

      const movieInfoMessage = `
        🎬 **Movie Title**: ${title}
        🌟 **Rating**: ${rating}/10
        🗓️ **Year**: ${year}
        ⏱️ **Duration**: ${duration}
        📝 **Genres**: ${genreList}
        📝 **Description**: ${description}
        🎥 **Source**: ${source}
      `;

      // Use a fallback poster image if none exists
      const moviePoster = poster || "https://via.placeholder.com/500x750.png?text=No+Image+Available";

      // Send the movie info along with the poster image
      api.sendMessage({
        body: movieInfoMessage,
        attachment: [{
          type: 'image',
          url: moviePoster
        }]
      }, event.threadID, event.messageID);

    } catch (error) {
      api.sendMessage(`Error: ${error.message}`, event.threadID, event.messageID);
    }
  }
};
