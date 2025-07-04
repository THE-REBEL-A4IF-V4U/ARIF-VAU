const axios = require("axios");
const fs = require("fs");
const { createCanvas, loadImage } = require("canvas");

module.exports.config = {
    name: "spamban",
    version: "1.1.0",
    permission: 0,
    credits: "TR4",
    description: "Automatically warns users when certain sensitive keywords are detected in the message.",
    prefix: false,
    category: "without prefix",
    cooldowns: 0
};

module.exports.run = async ({ event, api }) => { };

module.exports.handleEvent = async ({ event, api }) => {
    const message = event.body?.toLowerCase();  
    if (!message) return;

    const senderID = event.senderID;

    if (global.data.userBanned.has(senderID)) {
        const lastWarningTime = global.data.userBanned.get(senderID);
        const currentTime = Date.now();
        const oneDayInMillis = 24 * 60 * 60 * 1000;

        if (currentTime - lastWarningTime < oneDayInMillis) {
            return api.sendMessage(" ", event.threadID);
        }
    }

    const sensitiveKeywords = ["সাওয়া", "আবাল", "বাইনচোদ", "মাদারচোদ", "fuck you", "চুদি", "motherfucker"];
    const warningText = "WARNING!";

    for (const keyword of sensitiveKeywords) {
        if (message.includes(keyword)) {
            api.sendTypingIndicator(event.threadID);

            try {
                const userInfo = await api.getUserInfo([senderID]);
                const userName = userInfo[senderID].name;

                const userAvatarUrl = `https://graph.facebook.com/${senderID}/picture?width=512&height=512&access_token=6628568379%7Cc1e620fa708a1d5696fb991c1bde5662`;

                // Ensure cache directory exists
                const cacheDir = __dirname + "/cache";
                if (!fs.existsSync(cacheDir)) fs.mkdirSync(cacheDir);

                const avatarPath = cacheDir + "/avt.png";
                const warnedAvatarPath = cacheDir + "/warned_avt.png";

                // Download user avatar
                const response = await axios.get(userAvatarUrl, { responseType: "arraybuffer" });
                fs.writeFileSync(avatarPath, Buffer.from(response.data));

                // Load image and draw warning text
                const img = await loadImage(avatarPath);
                const canvas = createCanvas(img.width, img.height);
                const ctx = canvas.getContext("2d");

                ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
                ctx.font = "bold 100px Arial";
                ctx.fillStyle = "red";
                ctx.textAlign = "center";
                ctx.fillText(warningText, canvas.width / 2, canvas.height / 2);

                // Save new image
                const outputStream = fs.createWriteStream(warnedAvatarPath);
                const stream = canvas.createPNGStream();
                stream.pipe(outputStream);

                outputStream.on("finish", () => {
                    const warningMessage = `⚠️ 𝗪𝗔𝗥𝗡𝗜𝗡𝗚!\n\nYour message contains sensitive content. Please refrain from using inappropriate language.\n\n  ⦿ 𝗨𝗦𝗘𝗥: ${userName}\n  ⦿ 𝗜𝗗: ${senderID}\n  ⦿ 𝗞𝗘𝗬𝗪𝗢𝗥𝗗: ${keyword}`;
                    api.sendMessage({ body: warningMessage, attachment: fs.createReadStream(warnedAvatarPath) }, event.threadID);

                    global.data.userBanned.set(senderID, Date.now());
                });
            } catch (error) {
                console.error("Error handling warning system:", error);
            }

            break;
        }
    }
};

module.exports.listenGlobal = true;
