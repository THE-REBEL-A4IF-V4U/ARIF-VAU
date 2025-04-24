const axios = require("axios");
const fs = require("fs-extra");
const path = require("path");

module.exports.config = {
    name: "imagine",
    version: "1.0.5",
    permission: 0,
    prefix: false,
    credits: "rebeel",
    description: "Generate images from prompts",
    category: "without prefix",
    cooldowns: 2
};

module.exports.languages = {
    "vi": {},
    "en": {
        "missing": "Use: /imagine cat"
    }
};

module.exports.run = async function ({ api, event, args, getText }) {
    const prompt = args.join(" ");
    if (!prompt) return api.sendMessage(getText("missing"), event.threadID, event.messageID);

    try {
        const apis = await axios.get('https://raw.githubusercontent.com/MOHAMMAD-NAYAN-07/Nayan/main/api.json');
        const apiBase = apis.data.api;

        const res = await axios.get(`${apiBase}/nayan/img?prompt=${encodeURIComponent(prompt)}`);
        const data = res.data.imageUrls;
        const numberSearch = data.length;

        let imgData = [];
        for (let i = 0; i < numberSearch; i++) {
            const imgPath = path.join(__dirname, `/cache/imagine_${i + 1}.jpg`);
            const imgBuffer = (await axios.get(data[i], { responseType: 'arraybuffer' })).data;
            fs.writeFileSync(imgPath, Buffer.from(imgBuffer, 'utf-8'));
            imgData.push(fs.createReadStream(imgPath));
        }

        await api.sendMessage({
            body: `🔍 Imagine Result\n\n📝 Prompt: ${prompt}\n\n#️⃣ Number of Images: ${numberSearch}`,
            attachment: imgData
        }, event.threadID, event.messageID);

        // Cleanup
        for (let i = 0; i < numberSearch; i++) {
            const imgPath = path.join(__dirname, `/cache/imagine_${i + 1}.jpg`);
            if (fs.existsSync(imgPath)) fs.unlinkSync(imgPath);
        }

    } catch (err) {
        console.error("Error:", err);
        api.sendMessage("Something went wrong while generating the image(s).", event.threadID, event.messageID);
    }
};
