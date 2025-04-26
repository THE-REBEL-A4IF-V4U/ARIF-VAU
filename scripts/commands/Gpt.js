const fs = require("fs");
const axios = require("axios");
const jimp = require("jimp");
const path = require("path");
const crypto = require("crypto");

module.exports.config = {
  name: `gpt`,
  version: "1.2.0",
  permission: 0,
  credits: "Nayan x Optimized by ARIF VAU",
  description: "Chat with GPT-4 or generate AI images dynamically.",
  prefix: false,
  category: "without prefix",
  usage: `${global.config.BOTNAME} (your prompt or question)`,
  cooldowns: 5,
  dependency: {
    "axios": "",
    "jimp": "",
    "fs": "",
    "crypto": ""
  }
};

module.exports.run = async function({ nayan, events, args, NAYAN }) {
  if (!args.length) {
    return nayan.reply("❌ Please provide a prompt or question.", events.threadID, events.messageID);
  }

  const prompt = args.join(" ");
  const tempImageName = `dalle3_${crypto.randomBytes(6).toString("hex")}.png`;
  const tempImagePath = path.join(__dirname, tempImageName);

  try {
    NAYAN.react("🔍");

    const { data: apiData } = await axios.get('https://raw.githubusercontent.com/MOHAMMAD-NAYAN-07/Nayan/main/api.json');
    const gptApiUrl = apiData.gpt4;

    const { data: gptResponse } = await axios.post(`${gptApiUrl}/gpt4`, { prompt });

    const gptResult = gptResponse.data;

    if (gptResult?.response) {
      NAYAN.react("✔️");
      return nayan.reply(gptResult.response, events.threadID, events.messageID);
    } 

    if (gptResult?.imgUrl) {
      const { data: imageBuffer } = await axios.get(gptResult.imgUrl, { responseType: "arraybuffer" });
      const image = await jimp.read(imageBuffer);

      await image.writeAsync(tempImagePath);

      const attachment = fs.createReadStream(tempImagePath);

      NAYAN.react("✔️");

      await nayan.sendMessage(
        {
          body: `🖼️ Here is your generated image based on: "${prompt}"`,
          attachment,
        },
        events.threadID,
        events.messageID
      );

      // Safely delete after sending
      fs.unlink(tempImagePath, (err) => {
        if (err) console.error("[Temp File Delete Error]:", err.message);
      });
    } else {
      throw new Error("Invalid API response structure.");
    }

  } catch (error) {
    console.error("[GPT Command Error]:", error.message || error);
    NAYAN.react("⚠️");
    nayan.reply("⚠️ Sorry, something went wrong while processing your request.", events.threadID, events.messageID);
  }
};
