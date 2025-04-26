const axios = require('axios');
const request = require('request');
const fs = require('fs-extra');
const moment = require('moment-timezone');
const pidusage = require('pidusage'); // এখানে সরাসরি import করো

module.exports.config = {
  name: "uptime",
  version: "1.1.1",
  permission: 0,
  credits: "rebel",
  description: "Show current time and a random quote",
  prefix: false,
  category: "without prefix",
  usage: "time",
  cooldowns: 3,
  dependency: { "axios": "", "fs-extra": "", "pidusage": "" } // pidusage dependency যোগ করলাম
};

module.exports.run = async function({ api, event, args, client, Users, Threads, __GLOBAL, Currencies }) {
  try {
    const uptime = process.uptime();
    const hours = Math.floor(uptime / (60 * 60));
    const minutes = Math.floor((uptime % (60 * 60)) / 60);
    const seconds = Math.floor(uptime % 60);

    const cpuUsage = await pidusage(process.pid);

    const quotes = [
      'যে নদীর গভীরতা বেশি, তার বয়ে যাওয়ার শব্দ কম।',
      'প্রাপ্তি আর প্রত্যাশার পার্থক্য হল দুঃখ। তাই নিজের প্রত্যাশাটা একটু কমিয়ে ফেলুন, দেখবেন আপনার দুঃখও কমে গেছে।',
      'পরিপূর্ণ তৃপ্তি নিয়ে কুঁড়ে ঘরে থাকাও ভালো, অতৃপ্তি নিয়ে বিরাট অট্টালিকায় থাকার কোন সার্থকতা নেই।',
      'প্রত্যেককে বিশ্বাস করা বিপদজনক; কিন্তু কাউকে বিশ্বাস না করা আরো বেশী বিপদজনক।',
      'আমরা সবাই পাপী; আপন পাপের বাটখারা দিয়ে; অন্যের পাপ মাপি!',
      'হ্যাঁ এবং না কথা দুটো সবচেয়ে পুরনো এবং সবচেয়ে ছোট। কিন্তু এ কথা দুটো বলতেই সবচেয়ে বেশি ভাবতে হয়।',
      'মানুষ মরে গেলে পচে যায় বেঁচে থাকলে বদলায় কারণে-অকারণে বদলায়।',
      'মানুষ প্রতিষ্ঠিত হওয়ার পরে যেই ব্যবহারটা করে সেটাই তার আসল চরিত্র।',
      'সাত কোটি বাঙালিরে হে মুগ্ধ জননী রেখেছ বাঙালি করে মানুষ করনি',
      'নদীতে স্রোত আছে, তাই নদী বেগবান। জীবনে দ্বন্দ্ব আছে তাই জীবন বৈচিত্রময়।'
    ];

    const randomQuote = quotes[Math.floor(Math.random() * quotes.length)];
    const currentTime = moment.tz("Asia/Dhaka").format("» D/MM/YYYY « { সময়: HH:mm:ss }");

    const images = [
      "https://i.postimg.cc/2y4K0yHQ/In-Shot-20230221-105733799.gif",
      "https://i.postimg.cc/TYb7xtXt/In-Shot-20230221-110523957.gif"
    ];

    const selectedImage = images[Math.floor(Math.random() * images.length)];
    const cacheFolder = __dirname + "/cache";
    const cachePath = cacheFolder + "/juswa.gif";

    if (!fs.existsSync(cacheFolder)) fs.mkdirSync(cacheFolder); // যদি cache ফোল্ডার না থাকে বানিয়ে নিবে

    const callback = () => {
      api.sendMessage({
        body: `আজকের তারিখ: ${currentTime}\n` +
              `বটের রানিং টাইম: ${hours} ঘন্টা ${minutes} মিনিট ${seconds} সেকেন্ড\n` +
              `Prefix: ${global.config?.PREFIX || '!'}\n` +
              `Bot Name: ${global.config?.BOTNAME || 'MyBot'}\n` +
              `মোট ব্যবহারকারী সংখ্যা: ${global.data.allUserID.length}\n` +
              `মোট গ্রুপ সংখ্যা: ${global.data.allThreadID.length}\n` +
              `Admin Facebook: https://www.facebook.com/THE.R3B3L.ARIF.VAU\n\n` +
              `—————————————————————\n» ${randomQuote} «\n` +
              `𝙱𝙾𝚃 𝙾𝚆𝙽𝙴𝚁: 𝗔𝗥𝗜𝗙𝗨𝗟 𝗜𝗦𝗟𝗔𝗠 𝗔𝗦𝗜𝗙\n` +
              `—————————————————————`,
        attachment: fs.createReadStream(cachePath)
      }, event.threadID, () => fs.unlinkSync(cachePath));
    };

    request(encodeURI(selectedImage))
      .pipe(fs.createWriteStream(cachePath))
      .on("close", callback);

  } catch (error) {
    console.error(error);
    return api.sendMessage("কিছু একটা সমস্যা হয়েছে!", event.threadID);
  }
};
