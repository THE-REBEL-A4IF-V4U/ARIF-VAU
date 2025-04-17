const axios = require('axios');

module.exports.config = {
    name: "mangainfo",
    version: "1.0.0",
    permision: 0,
    credit: "Fixed by REBEL A4IF",
    description: "Fetch manga information",
    category: "Game",
    prefix: false,
    usages: "[manga name]",
    cooldowns: 0,
};

module.exports.run = async function({ api, event, args }) {
    try {
        const { threadID, messageID } = event;

        if (!args[0]) {
            return api.sendMessage("Please provide a manga name. Example: mangainfo Naruto", threadID, messageID);
        }

        const mangaName = args.join(" ");
        const res = await axios.get(encodeURI(`https://api.lolhuman.xyz/api/manga?apikey=b229f3dc257deae3030fe409&query=${mangaName}`));

        if (res.data.status !== 200 || !res.data.result) {
            return api.sendMessage("Couldn't find any manga with that name.", threadID, messageID);
        }

        const data = res.data.result;

        let msg = `🌟 Title: ${data.title || "N/A"}\n`;
        msg += `🔗 Genre: ${data.genres || "N/A"}\n`;
        msg += `📖 Chapters: ${data.chapters || "N/A"}\n`;
        msg += `🆔 ID: ${data.id || "N/A"}\n`;
        msg += `💌 Status: ${data.status || "N/A"}`;

        return api.sendMessage(msg, threadID, messageID);

    } catch (err) {
        console.error(err);
        return api.sendMessage("An error occurred while fetching manga information.", event.threadID, event.messageID);
    }
};