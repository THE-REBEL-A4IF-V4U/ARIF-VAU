const axios = require("axios");

module.exports.config = {
  name: "animeinfo",
  version: "1.0.0",
  permission: 0,
  credits: "TR4",
  description: "Fetch anime information",
  prefix: true, // No prefix required
  category: "info",
  usages: "anime name",
  cooldowns: 5,
};

module.exports.run = async function({ api, event, args }) {
  const { messageID, threadID } = event;

  // Get anime name from the user's input
  const animeName = args.join(" ");
  if (!animeName) return api.sendMessage("[ ! ] Please provide an anime name.", threadID, messageID);

  try {
    // Fetch anime data from the API
    let response = await axios.get(`https://rebel-api-server.onrender.com/anime?name=${encodeURIComponent(animeName)}`);
    const data = response.data;

    if (!data || !data.title) {
      return api.sendMessage("[ ! ] Anime not found or the link is invalid.", threadID, messageID);
    }

    const { title, description, rating, genres, episodes, status, poster } = data;

    // Prepare the response message
    const message = `
      **Anime Title**: ${title}
      **Description**: ${description || "No description available."}
      **Rating**: ${rating || "N/A"}
      **Genres**: ${genres ? genres.join(", ") : "N/A"}
      **Episodes**: ${episodes || "N/A"}
      **Status**: ${status || "N/A"}
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