const fs = require("fs");
const axios = require("axios");

module.exports.config = {
  name: "movieinfo",
  version: "1.0.0",
  permission: 0,
  credits: "TR4",
  description: "Get movie information",
  prefix: true,
  category: "info",
  usages: "movie name",
  cooldowns: 5,
};

module.exports.run = async function({ api, event, args }) {
  api.setMessageReaction("😽", event.messageID, (err) => {}, true);
  api.sendTypingIndicator(event.threadID, true);
  
  const { messageID, threadID } = event;

  const movieName = args.join(" ");
  if (!movieName) return api.sendMessage("[ ! ] Please input movie name.", threadID, messageID);

  try {
    // Fetch movie data from API
    let data = await axios.get(`https://rebel-api-server.onrender.com/movie?name=${encodeURIComponent(movieName)}`);
    const movieData = data.data;
    
    // Ensure genres is an array before calling .join()
    const genres = Array.isArray(movieData.genres) ? movieData.genres.join(", ") : "Not available";
    const releaseDate = movieData.release_date || "Not available";
    const runtime = movieData.runtime ? `${movieData.runtime} minutes` : "Not available";
    const overview = movieData.overview || "No description available.";
    const rating = movieData.rating || "Not rated";

    const movieMessage = `
      Movie: ${movieData.title || "N/A"}
      Release Date: ${releaseDate}
      Runtime: ${runtime}
      Rating: ${rating}
      Genres: ${genres}
      Overview: ${overview}
    `;

    api.sendMessage(movieMessage, threadID, messageID);
  } catch (err) {
    api.sendMessage(`Error: ${err.message}`, event.threadID, event.messageID);
  }
};
