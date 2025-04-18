const axios = require("axios");
const fs = require("fs-extra");
const path = require("path");

module.exports.config = {
  name: "movieinfo",
  version: "2.0.1",
  permission: 0,
  prefix: true,
  credits: "Modified by Rebel",
  description: "Get movie information including trailer and poster",
  category: "tools",
  usages: "[movie name]",
  cooldowns: 5,
};

module.exports.run = async function ({ api, event, args }) {
    const { threadID, messageID, senderID } = event;
    const apiKey = "426d0386"; // OMDB API Key
    const youtubeApiKey = "AIzaSyCnNsvPO-VL-Q7WqQ2BmlpYLaM1GvY1Ujw"; // Youtube API Key

    const title = args.join(" ");
    if (!title) return api.sendMessage("⚠️ Please provide a movie title.", threadID, messageID);

    try {
        const movieData = await fetchMovieData(title, apiKey);
        if (!movieData) 
            return api.sendMessage("❌ Movie not found or an error occurred.", threadID, messageID);

        const posterPath = await downloadPoster(movieData.Poster, senderID);
        const trailerUrl = await getMovieTrailer(movieData.Title, youtubeApiKey);

        const movieInfo = `
🎬 Title: ${movieData.Title} (${movieData.Year})
🎭 Cast: ${movieData.Actors}
📖 Plot: ${movieData.Plot}
📊 Ratings:\n${formatRatings(movieData.Ratings)}
🎥 Trailer: ${trailerUrl}
        `.trim();

        if (posterPath) {
            return api.sendMessage({
                body: movieInfo,
                attachment: fs.createReadStream(posterPath)
            }, threadID, () => fs.unlinkSync(posterPath), messageID);
        } else {
            return api.sendMessage(movieInfo, threadID, messageID);
        }

    } catch (err) {
        console.error(err);
        return api.sendMessage("⚠️ An unexpected error occurred.", threadID, messageID);
    }
};

// Helper Functions

async function fetchMovieData(title, apiKey) {
    try {
        const response = await axios.get(`http://www.omdbapi.com/?t=${encodeURIComponent(title)}&apikey=${apiKey}`);
        return response.data.Response === "True" ? response.data : null;
    } catch (err) {
        console.error("OMDB Error:", err.message);
        return null;
    }
}

async function downloadPoster(url, senderID) {
    if (!url || url === "N/A") return null;
    try {
        const dir = path.join(__dirname, "cache", "movieinfo");
        if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

        const posterPath = path.join(dir, `poster_${senderID}.jpg`);
        const response = await axios.get(url, { responseType: "arraybuffer" });
        fs.writeFileSync(posterPath, Buffer.from(response.data, "binary"));
        return posterPath;
    } catch (err) {
        console.error("Poster Download Error:", err.message);
        return null;
    }
}

async function getMovieTrailer(title, apiKey) {
    try {
        const searchUrl = `https://www.googleapis.com/youtube/v3/search?q=${encodeURIComponent(title + " official trailer")}&key=${apiKey}&maxResults=1&type=video`;
        const response = await axios.get(searchUrl);
        if (response.data.items && response.data.items.length > 0) {
            const videoId = response.data.items[0].id.videoId;
            return `https://www.youtube.com/watch?v=${videoId}`;
        }
        return "Trailer not found.";
    } catch (err) {
        console.error("YouTube API Error:", err.message);
        return "Trailer not found.";
    }
}

function formatRatings(ratings = []) {
    if (ratings.length === 0) return "No ratings available.";
    return ratings.map(r => `${r.Source}: ${r.Value}`).join("\n");
}
