const fs = require("fs");
const axios = require("axios");
const jimp = require("jimp");
const path = require("path");
const crypto = require("crypto");

module.exports.config = {
  name: "gpt",
  version: "1.2.2",
  permission: 0,
  credits: "Nayan x Optimized by ARIF VAU",
  description: "Chat with GPT-4 or generate AI images dynamically.",
  prefix: false,
  category: "without prefix",
  usage: "gpt (your prompt or question)",
  cooldowns: 5,
  dependency: { "axios": "", "jimp": "", "fs": "", "crypto": "" }
};

module.exports.run = async function({ api, event, args }) {
  if (!args.length) {
    return api.sendMessage("❌ দয়া করে একটি প্রশ্ন বা নির্দেশ দিন।", event.threadID, event.messageID);
  }

  const prompt = args.join(" ");
  const tempImageName = `dalle3_${crypto.randomBytes(6).toString("hex")}.png`;
  const tempImagePath = path.join(__dirname, tempImageName);

  try {
    await api.sendMessage({ body: "🔍 অনুরোধ প্রক্রিয়াকরণ চলছে..." }, event.threadID, event.messageID);

    // Load API URL
    const { data: apiData } = await axios.get('https://raw.githubusercontent.com/MOHAMMAD-NAYAN-07/Nayan/main/api.json');
    const gptApiUrl = apiData.gpt4;

    // Call GPT API
    const gptResponse = await axios.post(`${gptApiUrl}/gpt4`, { prompt });

    const gptResult = gptResponse.data;

    if (gptResult?.response) {
      return api.sendMessage(gptResult.response, event.threadID, event.messageID);
    } 

    if (gptResult?.imgUrl) {
      const { data: imageBuffer } = await axios.get(gptResult.imgUrl, { responseType: "arraybuffer" });
      const image = await jimp.read(imageBuffer);

      await image.writeAsync(tempImagePath);

      await api.sendMessage(
        {
          body: `🖼️ এখানে তোমার ছবিটি: "${prompt}"`,
          attachment: fs.createReadStream(tempImagePath)
        },
        event.threadID,
        () => {
          // Delete temp file after sending
          fs.unlink(tempImagePath, (err) => {
            if (err) console.error("[Temp File Delete Error]:", err.message);
          });
        }
      );
    } else {
      throw new Error("API থেকে অজানা ফরম্যাটের রেসপন্স এসেছে।");
    }

  } catch (error) {
    console.error("[GPT Command Error]:", error.message || error);
    api.sendMessage("⚠️ দুঃখিত, অনুরোধটি প্রক্রিয়াকরণে সমস্যা হয়েছে।", event.threadID, event.messageID);
  }
};
