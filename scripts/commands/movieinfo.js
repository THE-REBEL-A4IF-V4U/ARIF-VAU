module.exports.config = {
  name: "movieinfo",
  version: "2.0.0",
  permission: 0,
  prefix: true,
  credits: "Modified by Rebel",
  description: "Get movie information including trailer and poster",
  category: "tools",
  usages: "[movie name]",
  cooldowns: 5,
};

module.exports.run = async function ({ api, event, args, utils, client, global }) {
    const axios = global.nodemodule["axios"];
    const fs = global.nodemodule["fs-extra"];
    const path = global.nodemodule["path"];
    
    const { threadID, messageID } = event;
    const apiKey = "426d0386"; // OMDB API Key
    const youtubeApiKey = "AIzaSyCnNsvPO-VL-Q7WqQ2BmlpYLaM1GvY1Ujw"; // Youtube API Key

    const title = args.join(" ");
    if (!title) return api.sendMessage("Please provide a movie title.", threadID, messageID);

    const apiUrl = `http://www.omdbapi.com/?t=${encodeURIComponent(title)}&apikey=${apiKey}`;

    try {
        const response = await axios.get(apiUrl);
        const movieData = response.data;

        if (movieData.Response === "False") 
            return api.sendMessage("Movie not found or an error occurred.", threadID, messageID);

        const movieTitle = movieData.Title;
        const year = movieData.Year;
        const cast = movieData.Actors;
        const plot = movieData.Plot;
        const ratings = movieData.Ratings.map((rating) => `${rating.Source}: ${rating.Value}`).join("\n");
        const posterUrl = movieData.Poster;

        const dir = __dirname + `/cache/movieinfo/`;
        if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
        const posterPath = path.join(dir, `poster_${event.senderID}.jpg`);

        let hasError = false;
        try {
            let imageResponse = await axios.get(posterUrl, { responseType: "arraybuffer" });
            fs.writeFileSync(posterPath, Buffer.from(imageResponse.data, "binary"));
        } catch (e) {
            console.log(e);
            hasError = true;
        }

        const trailerUrl = await getMovieTrailer(movieTitle, youtubeApiKey);

        const movieInfo = `
🎬 Title: ${movieTitle} (${year})
🎭 Cast: ${cast}
📖 Plot: ${plot}
📊 Ratings:\n${ratings}
🎥 Trailer: ${trailerUrl}
`;

        if (!hasError) {
            return api.sendMessage({
                body: movieInfo,
                attachment: fs.createReadStream(posterPath)
            }, threadID, () => fs.unlinkSync(posterPath), messageID);
        } else {
            return api.sendMessage(movieInfo, threadID, messageID);
        }

    } catch (e) {
        console.log(e);
        return api.sendMessage("An error occurred while fetching movie information.", threadID, messageID);
    }
};

async function getMovieTrailer(movieTitle, apiKey) {
    const axios = global.nodemodule["axios"];
    try {
        const searchUrl = `https://www.googleapis.com/youtube/v3/search?q=${encodeURIComponent(movieTitle + " official trailer")}&key=${apiKey}&maxResults=1&type=video`;
        const response = await axios.get(searchUrl);
        const videoId = response.data.items[0].id.videoId;
        return `https://www.youtube.com/watch?v=${videoId}`;
    } catch (e) {
        console.log(e);
        return "Trailer not found.";
    }
}