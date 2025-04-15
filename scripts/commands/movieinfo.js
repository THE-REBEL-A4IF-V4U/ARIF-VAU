const axios = require("axios");

module.exports.config = {
  name: "movieinfo",
  version: "1.0.0",
  permission: 0,
  credits: "TR4",
  description: "Fetch movie information",
  prefix: true, // No prefix required
  category: "info",
  usages: "movie name",
  cooldowns: 5,
};

module.exports.run = async function({ api, event, args }) {
  const { messageID, threadID } = event;

  // Get movie name from the user's input
  const movieName = args.join(" ");
  if (!movieName) return api.sendMessage("[ ! ] Please provide a movie name.", threadID, messageID);

  try {
    // Fetch movie data from the API
    let response = await axios.get(`https://rebel-api-server.onrender.com/movie?name=${encodeURIComponent(movieName)}`);
    const data = response.data;

    if (!data || !data.title) {
      return api.sendMessage("[ ! ] Movie not found or the link is invalid.", threadID, messageID);
    }

    const { title, description, rating, genres, duration, releaseDate, poster } = data;

    // Prepare the response message
    const message = `
      **Movie Title**: ${title}
      **Description**: ${description || "No description available."}
      **Rating**: ${rating || "N/A"}
      **Genres**: ${genres ? genres.join(", ") : "N/A"}
      **Duration**: ${duration || "N/A"}
      **Release Date**: ${releaseDate || "N/A"}
    `;

    // Send the response
    return api.sendMessage({
      body: message,
      attachment: poster ? [poster] : []
    }, threadID, messageID);

  } catch (err) {
    api.sendMessage(`Error: ${err.message}`, event.threadID, event.messageID);
  }
};