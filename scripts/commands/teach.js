module.exports.config = {
    name: "teach",
    version: "1.0.2",
    permission: 0,
    credits: "rebel",
    prefix: false,
    description: "talk teach",
    category: "without prefix",
    usages: "your ask - my answer",
    cooldowns: 0
};

const axios = require('axios');

module.exports.run = async ({ api, event, args }) => {
    const { messageID, threadID } = event;
    const input = args.join(" ");
    const separator = input.indexOf(" - ");
    const { rebelteach } = global.apirebel;

    if (separator === -1) {
        return api.sendMessage(`Wrong format.\nTry: ${global.config.PREFIX}${this.config.name} your question - your answer`, threadID, messageID);
    }

    const ask = input.slice(0, separator).trim();
    const answer = input.slice(separator + 3).trim();

    if (!ask || !answer) {
        return api.sendMessage("Please provide both question and answer in the correct format.", threadID, messageID);
    }

    try {
        const url = `${rebelteach}${encodeURIComponent(ask)}=${encodeURIComponent(answer)}`;
        const res = await axios.get(url);

        const reply = res.data.reply;
        if (reply === "key and value have all cmnr, add the cc") {
            return api.sendMessage("⚠️ This question and answer already exist.", threadID, messageID);
        } else if (reply === "there's something wrong with cc, i don't know") {
            return api.sendMessage("❌ Unknown error occurred while teaching.", threadID, messageID);
        } else {
            return api.sendMessage("✅ Successfully learned your input!", threadID, messageID);
        }
    } catch (err) {
        return api.sendMessage("❌ Failed to connect to Rebel API.", threadID, messageID);
    }
};