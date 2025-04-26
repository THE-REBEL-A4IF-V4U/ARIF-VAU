const axios = require('axios');
const request = require('request');
const fs = require('fs-extra');
const moment = require('moment-timezone');

module.exports.config = {
  name: "time",
  version: "1.1.1",
  permission: 0,
  credits: "rebel",
  description: "Show current time and a random quote",
  prefix: false,
  category: "without prefix",
  usage: "time",
  cooldowns: 3,
  dependency: { "axios": "", "fs-extra": "" }
};

module.exports.run = async function({ api, event }) {
  try {
    const quotes = [
      'অনেক কিছু ফিরে আসে কিন্তু সময়কে ফিরিয়ে আনা যায় না ।',
      'আমি তোমাদের বলেছি যে তোমরা মিনিটের খেয়াল রাখো, তাহলে দেখবে ঘন্টাগুলো আপনা থেকেই নিজেদের খেয়াল রাখছে ।',
      'বড় হতে হলে সর্বপ্রথম সময়ের মূল্য দিতে হবে ।',
      'মানুষের কয়লা নাম্বার শত্রু হল সময় ।',
      'সময় চলে যায় না আমরাই চলে যাই ।',
      'সময় দ্রুত চলে যায়, এর সদ্ব্যবহার যারা করতে পারে তারাই সফল ও সার্থক বলে পরিচিত হয় ।',
      'সময়ের সমুদ্রে আছি, কিন্তু একমুহূর্ত সময় নেই ।',
      'তোমার সময় যত বছর তত বছর কি তুমি বেঁচেছিলে ?',
      'জীবন এবং সময় পৃথিবীর শ্রেষ্ঠ শিক্ষক, জীবন শেখায় সময়কে ভালোভাবে ব্যবহার করতে , সময় শেখায় জীবনের মূল্য দিতে ।',
      'সময় নেতা তৈরি করে, ঠিক সময়ে ঠিক নেতা এই কারণেই বের হয়ে আসে ।',
      'আপনার জীবনের প্রতিটি মুহূর্তই আপনার ভবিষ্যৎ কে রূপদানে কাজ করে , সুতরাং জীবনের প্রতিটি মুহূর্ত কেই সঠিকভাবে কাজে লাগানোর চেষ্টা করুন ।',
      'সমস্ত জিনিসের জন্য নির্দিষ্ট সময় আছে ।',
      'নিজের চিন্তাকে সরল করার জন্য পরিষ্কারভাবে চিন্তা করতে আপনাকে কঠোর পরিশ্রম করতে হবে। কারণ পরিষ্কারভাবে চিন্তা করতে পারাটাই সবচেয়ে বড় কথা ।',
      'উদ্ভাবনী একজন নেতা ও একজন অনুসরণকারীর মধ্যে পার্থক্য তৈরি করে দেয় ।',
      'অসাধারণ সব কাজ করুন এবং সামনে এগিয়ে যান, আমি মনে করি আপনি যদি এমন কোনো কাজ করেন যা প্রশংসা কুড়ায় তাহলে আপনার উচিত আরো ভালো কোন কাজ করা।',
      'আপনার শারীরিক অক্ষমতা নিয়ে কোন অভিযোগ করবেন না বা তার কারণ খুঁজতে গিয়ে আপনার অমূল্য সময় নষ্ট করবেন না, আপনার যা কিছু ভেতরের শক্তি থাকে তা দিয়ে অন্যকে সাহায্য করুন বা করার চেষ্টা করুন ।'
    ];

    const images = [
      "https://i.postimg.cc/Kvnvtcfn/In-Shot-20230221-121841892.gif",
      "https://i.postimg.cc/W3P5Fn1m/In-Shot-20230221-121801665.gif",
      "https://i.postimg.cc/kgsSFvsF/In-Shot-20230221-121241570.gif"
    ];

    const randomQuote = quotes[Math.floor(Math.random() * quotes.length)];
    const randomImage = images[Math.floor(Math.random() * images.length)];
    const currentTime = moment.tz("Asia/Dhaka").format("» তারিখ: D/MM/YYYY «  { সময়: HH:mm:ss }");

    const filePath = __dirname + "/cache/juswa.gif";

    const downloadImage = () => new Promise((resolve, reject) => {
      request(encodeURI(randomImage))
        .pipe(fs.createWriteStream(filePath))
        .on("close", resolve)
        .on("error", reject);
    });

    await downloadImage();

    api.sendMessage({
      body: `~আঁস্সাঁলাঁমুঁ-আলাইকুম🖤 >>\n\nআজকের তারিখ এবং সময়:\n${currentTime}\n\nFacebook Link: https://www.facebook.com/THE.R3B3L.ARIF.VAU\n\n*************************************\n» ${randomQuote} «\n𝙱𝙾𝚃 𝙾𝚆𝙽𝙴𝚁: 𝗔𝗥𝗜𝗙𝗨𝗟 𝗜𝗦𝗟𝗔𝗠 𝗔𝗦𝗜𝗙\n*************************************`,
      attachment: fs.createReadStream(filePath)
    }, event.threadID, () => fs.unlinkSync(filePath));

  } catch (error) {
    console.error(error);
    api.sendMessage("কিছু একটা ভুল হয়েছে। দয়া করে পরে চেষ্টা করুন।", event.threadID);
  }
};
