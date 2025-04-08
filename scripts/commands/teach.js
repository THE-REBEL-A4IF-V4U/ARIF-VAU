const axios = require('axios');

module.exports.config = {
    name: "teach",
    version: "1.0.3",
    permission: 0,
    credits: "rebel",
    prefix: false,
    description: "Teach the bot a new question and answer.",
    category: "without prefix",
    usages: "your question - your answer",
    cooldowns: 0
};

module.exports.run = async ({ api, event, args }) => {
    const { messageID, threadID } = event;
    const input = args.join(" ");
    const separator = input.indexOf(" - ");

    const rebelteach = "https://rebel-api-server.onrender.com/api/rebel?teach=";

    if (separator === -1) {
        return api.sendMessage(
            `⚠️ Wrong format.\nTry: ${global.config.PREFIX}${this.config.name} your question - your answer`,
            threadID,
            messageID
        );
    }

    const ask = input.slice(0, separator).trim();
    const answer = input.slice(separator + 3).trim();

    if (!ask || !answer) {
        return api.sendMessage("❗ Please provide both a question and an answer in the correct format.", threadID, messageID);
    }

    try {
        const url = `${rebelteach}${encodeURIComponent(`${ask}=${answer}`)}`;
        const res = await axios.get(url);
        const result = res.data;

        if (result.success) {
            return api.sendMessage(
                `✅ ${result.message}\nPreview: ${result.previewAsk}`,
                threadID,
                messageID
            );
        } else {
            return api.sendMessage(
                `❌ Failed: ${result.message || "Unknown error"}`,
                threadID,
                messageID
            );
        }
    } catch (err) {
        console.error(err);
        return api.sendMessage("❌ Failed to connect to Rebel API.", threadID, messageID);
    }
};
