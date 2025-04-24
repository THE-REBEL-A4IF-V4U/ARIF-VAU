const axios = require("axios");
const fs = require("fs-extra");
const path = require("path");

module.exports.config = {
    name: "ffinfo",
    version: "1.0.5",
    permission: 0,
    prefix: false,
    credits: "Deku",
    description: "Get Free Fire user info by UID.",
    category: "without prefix",
    cooldowns: 2
};

module.exports.languages = {
    "vi": { "missing": "Vui lòng nhập UID." },
    "en": { "missing": "Please enter a UID." }
};

module.exports.run = async function ({ api, event, args, getText }) {
    const uid = args.join(" ");
    if (!uid) return api.sendMessage(getText("missing"), event.threadID, event.messageID);

    try {
        const res = await axios.get(`https://for-devs.ddns.net/api/ffinfo?uid=${uid}&apikey=r-rishad100`);
        const data = res.data;
        const acc = data.accountInfo;

        let imgData = [];
        let imgCount = 0;
        const images = data.equippedItems?.flatMap(type => type.items.map(item => item.image)) || [];

        for (const url of images) {
            const filePath = path.join(__dirname, `/cache/ffinfo_${++imgCount}.jpg`);
            const img = (await axios.get(url, { responseType: 'arraybuffer' })).data;
            fs.writeFileSync(filePath, Buffer.from(img));
            imgData.push(fs.createReadStream(filePath));
        }

        await api.sendMessage({
            body: acc,
            attachment: imgData
        }, event.threadID, event.messageID);

        // Cleanup
        for (let i = 1; i <= imgCount; i++) {
            const filePath = path.join(__dirname, `/cache/ffinfo_${i}.jpg`);
            if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
        }

    } catch (err) {
        console.error("Error occurred:", err);
        return api.sendMessage("An error occurred while fetching the data.", event.threadID, event.messageID);
    }
};
