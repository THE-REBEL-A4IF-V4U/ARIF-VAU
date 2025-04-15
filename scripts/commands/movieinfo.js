const axios = require("axios");
const fs = require("fs-extra");

module.exports = {
  config: {
    name: "movieinfo",
    version: "1.0.1",
    permission: 0,
    prefix: true,
    credits: "TR4 + Modified by REBEL A4IF",
    description: "Get detailed information about a movie",
    category: "user",
    usages: "[movie name]",
    cooldowns: 5,
  },

  start: async function({ api, event, args }) {
    const movieName = args.join(" ");
    if (!movieName) {
      return api.sendMessage("❌ Please provide a movie name.", event.threadID, event.messageID);
    }

    const url = `https://rebel-api-server.onrender.com/movie?name=${encodeURIComponent(movieName)}`;

    try {
      const res = await axios.get(url);
      const data = res.data;

      if (!data || data.type !== "movie") {
        return api.sendMessage("❌ Movie not found or invalid response.", event.threadID, event.messageID);
      }

      const {
        title,
        rating,
        year,
        duration,
        genres,
        description,
        poster,
        source
      } = data;

      const genreList = Array.isArray(genres) ? genres.join(", ") : genres;

      const info = 
`🎬 𝗧𝗶𝘁𝗹𝗲: ${title}
🌟 𝗥𝗮𝘁𝗶𝗻𝗴: ${rating}/10
📅 𝗬𝗲𝗮𝗿: ${year}
⏱️ 𝗗𝘂𝗿𝗮𝘁𝗶𝗼𝗻: ${duration}
🎭 𝗚𝗲𝗻𝗿𝗲𝘀: ${genreList}
📝 𝗗𝗲𝘀𝗰𝗿𝗶𝗽𝘁𝗶𝗼𝗻: ${description}
📡 𝗦𝗼𝘂𝗿𝗰𝗲: ${source}`;

      const imgPath = __dirname + "/cache/movieposter.jpg";

      const imgData = await axios.get(poster, { responseType: "arraybuffer" });
      fs.writeFileSync(imgPath, Buffer.from(imgData.data, "utf-8"));

      return api.sendMessage({
        body: info,
        attachment: fs.createReadStream(imgPath)
      }, event.threadID, () => fs.unlinkSync(imgPath), event.messageID);

    } catch (err) {
      console.error(err);
      return api.sendMessage(`❌ Error: ${err.message}`, event.threadID, event.messageID);
    }
  },

  handleEvent: async function () {} // Not used for this command
};
