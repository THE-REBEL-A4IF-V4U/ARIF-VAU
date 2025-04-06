const fs = require('fs');
const axios = require('axios');

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

module.exports.run = async ({ api, event, args }) => {
    const { messageID, threadID } = event;
    const input = args.join(" ");
    const separator = input.indexOf(" - ");
    const { rebelteach } = global.apirebel;

    // Check for correct format
    if (separator === -1) {
        return api.sendMessage(`Wrong format.\nTry: ${global.config.PREFIX}${this.config.name} your question - your answer`, threadID, messageID);
    }

    const ask = input.slice(0, separator).trim();
    const answer = input.slice(separator + 3).trim();

    if (!ask || !answer) {
        return api.sendMessage("Please provide both question and answer in the correct format.", threadID, messageID);
    }

    try {
        // Save question-answer pair to rebel.json (or any storage you prefer)
        const dataFile = './data/rebel.json';
        let data = {};
        
        if (fs.existsSync(dataFile)) {
            data = JSON.parse(fs.readFileSync(dataFile, 'utf-8'));
        }

        // Add the new Q&A pair
        data[ask] = answer;
        fs.writeFileSync(dataFile, JSON.stringify(data, null, 2));

        // Teach the bot by sending the data to the API
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

// Function to handle questions asked by users
module.exports.answerQuestion = async ({ api, event }) => {
    const { threadID, messageID } = event;
    const userQuestion = event.body.toLowerCase().trim();  // Convert to lowercase for easier matching

    try {
        // Load the Q&A data
        const dataFile = './data/rebel.json';
        if (fs.existsSync(dataFile)) {
            const data = JSON.parse(fs.readFileSync(dataFile, 'utf-8'));

            // Check if the question exists
            if (data[userQuestion]) {
                return api.sendMessage(data[userQuestion], threadID, messageID);  // Send the answer
            } else {
                return api.sendMessage("❓ I don't know the answer to that question. Please teach me.", threadID, messageID);
            }
        } else {
            return api.sendMessage("❓ I don't know the answer to that question. Please teach me.", threadID, messageID);
        }
    } catch (err) {
        return api.sendMessage("❌ Error occurred while retrieving the answer.", threadID, messageID);
    }
};
