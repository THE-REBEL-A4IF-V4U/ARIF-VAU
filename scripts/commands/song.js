const axios = require('axios');
const yts = require('yt-search');
const ytdl = require('trs-media-downloader');
const fs = require('fs');
const path = require('path');

module.exports.config = {
    name: "song",
    version: "2.1.0",
    permission: 0,
    credits: "Rebel A4IF Upgrade",
    description: "Search YouTube song and download with thumbnail",
    prefix: true,
    category: "media",
    usages: "[song name]",
    cooldowns: 5,
};

let searchResults = {};

module.exports.run = async function({ api, event, args }) {
    const { threadID, messageID, senderID } = event;
    if (!args[0]) return api.sendMessage("Please type a song name!\nExample: /song mera dil", threadID, messageID);

    const query = args.join(' ');
    const results = await yts(query);

    if (!results.videos.length) return api.sendMessage("No songs found!", threadID, messageID);

    const topResults = results.videos.slice(0, 5);

    let msg = '🎵 Top 5 songs found:\n\n';
    let index = 1;
    for (const video of topResults) {
        msg += `${index++}. ${video.title}\n⏳ ${video.timestamp}\n\n`;
    }
    msg += "Reply with a number (1-5) to download.";

    searchResults[senderID] = topResults;

    return api.sendMessage(msg, threadID, (err, info) => {
        global.client.handleReply.push({
            type: 'songChoose',
            name: this.config.name,
            author: senderID,
            messageID: info.messageID
        });
    });
};

module.exports.handleReply = async function({ api, event, handleReply }) {
    const { threadID, messageID, senderID, body } = event;
    if (handleReply.author != senderID) return;

    const choice = parseInt(body);
    if (isNaN(choice) || choice < 1 || choice > 5) {
        return api.sendMessage("❌ Invalid number! Please reply between 1-5.", threadID, messageID);
    }

    const video = searchResults[senderID][choice - 1];
    const url = video.url;
    const title = video.title;
    const duration = video.timestamp;
    const thumbnail = video.thumbnail;

    const filePath = path.join(__dirname, 'cache', `${Date.now()}.mp3`);

    try {
        const stream = ytdl(url, { filter: 'audioonly', quality: 'highestaudio' })
            .pipe(fs.createWriteStream(filePath));

        stream.on('finish', async () => {
            // Download thumbnail image
            const thumbPath = path.join(__dirname, 'cache', `${Date.now()}_thumb.jpg`);
            const thumbRes = await axios.get(thumbnail, { responseType: 'arraybuffer' });
            fs.writeFileSync(thumbPath, Buffer.from(thumbRes.data, 'utf-8'));

            await api.sendMessage({
                body: `🎶 Here is your song:\n\nTitle: ${title}\n⏳ Duration: ${duration}`,
                attachment: [
                    fs.createReadStream(thumbPath),
                    fs.createReadStream(filePath)
                ]
            }, threadID, () => {
                // Delete files after sending
                fs.unlinkSync(filePath);
                fs.unlinkSync(thumbPath);
            });
        });

        stream.on('error', (error) => {
            console.error('Download error:', error);
            api.sendMessage("❌ Error downloading the song. Please try again.", threadID, messageID);
        });

    } catch (error) {
        console.error(error);
        return api.sendMessage("❌ Something went wrong. Please try again.", threadID, messageID);
    }
};
