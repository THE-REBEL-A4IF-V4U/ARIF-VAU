const fs = require("fs-extra");
const axios = require("axios");
const { loadImage, createCanvas } = require("canvas");

module.exports.config = { 
  name: "birthday",
  version: "1.1.1",
  permission: 0,
  credits: "rebel (optimized by ChatGPT)",
  description: "Birthday wish with a custom card",
  prefix: false,
  category: "without prefix",
  usage: "birthday (@mention)",
  cooldowns: 3,
  dependency: { "axios": "", "fs-extra": "", "canvas": "" }
};

module.exports.wrapText = async (ctx, text, maxWidth) => {
  if (ctx.measureText(text).width < maxWidth) return [text];
  if (ctx.measureText('W').width > maxWidth) return null;

  const words = text.split(' ');
  const lines = [];
  let line = '';

  while (words.length > 0) {
    let split = false;
    while (ctx.measureText(words[0]).width >= maxWidth) {
      const temp = words[0];
      words[0] = temp.slice(0, -1);
      if (split) words[1] = `${temp.slice(-1)}${words[1]}`;
      else {
        split = true;
        words.splice(1, 0, temp.slice(-1));
      }
    }
    if (ctx.measureText(`${line}${words[0]}`).width < maxWidth) {
      line += `${words.shift()} `;
    } else {
      lines.push(line.trim());
      line = '';
    }
    if (words.length === 0) lines.push(line.trim());
  }
  return lines;
};

module.exports.run = async function ({ args, Users, api, event }) {
  try {
    const pathImg = __dirname + "/cache/background.png";
    const pathAvt = __dirname + "/cache/avatar.png";

    const id = Object.keys(event.mentions)[0] || event.senderID;
    const name = await Users.getNameUser(id);

    const backgrounds = [
      "https://i.postimg.cc/k4RS69d8/20230921-195836.png"
    ];
    const selectedBg = backgrounds[Math.floor(Math.random() * backgrounds.length)];

    // Download avatar
    const avatarBuffer = (
      await axios.get(`https://graph.facebook.com/${id}/picture?width=720&height=720&access_token=6628568379%7Cc1e620fa708a1d5696fb991c1bde5662`, { responseType: "arraybuffer" })
    ).data;
    fs.writeFileSync(pathAvt, Buffer.from(avatarBuffer, "utf-8"));

    // Download background
    const bgBuffer = (
      await axios.get(selectedBg, { responseType: "arraybuffer" })
    ).data;
    fs.writeFileSync(pathImg, Buffer.from(bgBuffer, "utf-8"));

    const background = await loadImage(pathImg);
    const avatar = await loadImage(pathAvt);

    const canvas = createCanvas(background.width, background.height);
    const ctx = canvas.getContext("2d");

    ctx.drawImage(background, 0, 0, canvas.width, canvas.height);

    ctx.font = "400 32px Arial";
    ctx.fillStyle = "#1878F3";
    ctx.textAlign = "start";

    const lines = await this.wrapText(ctx, name, 1160);
    ctx.fillText(lines.join('\n'), 120, 727);

    ctx.beginPath();
    ctx.arc(270, 470, 200, 0, Math.PI * 2, true); // Optional: Circle Crop Avatar
    ctx.closePath();
    ctx.clip();
    ctx.drawImage(avatar, 70, 270, 400, 400);

    const finalImg = canvas.toBuffer();
    fs.writeFileSync(pathImg, finalImg);

    const birthdayMessage = `🎂🎂🎂🎂 শুভ জন্মদিন কলিজা 🎂🎂🎂🎂
           █▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄█
           💛❉ ╤╤╤╤ ✿ ╤╤╤╤ ❉💛
                𝐇𝐀𝐏𝐏𝐘 𝐁𝐈𝐑𝐓𝐇𝐃𝐀𝐘
       ❉ ╧╧╧{ ${name} }╧╧╧ ❉
_______________________________________
🍀🍀#___অনেক__অনেক___শুভেচ্ছা🍀🍀
🍫সুন্দর ও প্রাণবন্ত হোক তোমার আগামী দিন গুলো

┏┓┏┓🎈
┃┗┛ᴀᴘᴘʏ_🎂🎆🎉
┃┏┓┃　🄱🄸🅁🅃🄷🄳🄰🅈🎉🎆🎇
┗┛┗┛      

....❣I want to wish you all the love and
 happiness in the world,,,, 💞💞 
  All of which your deserve...... 💝💝

  #happiness 😘
   #happyday💜
  #birthdaycake🎂🤡
  #birthdaywishes😍😘🍰💐
  #birthdaywishesfriend🤯🎂
🌹🌹🌹🌹🌹🌹🌹🌹🌹🌹🌹🌹🌹🌹🌹

WiSh BY ${global.config.BOTNAME} 『🤖🖤』`;

    api.sendMessage(
      { body: birthdayMessage, attachment: fs.createReadStream(pathImg) },
      event.threadID,
      () => {
        fs.unlinkSync(pathImg);
        fs.unlinkSync(pathAvt);
      },
      event.messageID
    );
    
  } catch (error) {
    console.error(error);
    api.sendMessage("কিছু একটা সমস্যা হয়েছে জন্মদিন উইশ পাঠাতে...", event.threadID, event.messageID);
  }
};
