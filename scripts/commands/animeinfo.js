module.exports.config = {
  name: "mal",
  version: "1.0.1",
  permission: 0,
  credits: "Modified by Rebel from ZiaRein",
  description: "MyAnimeList থেকে এনিমে খোঁজ করুন",
  category: "rebel",
  prefix: false,
  usages: "[anime এর নাম]",
  cooldowns: 5
};

module.exports.run = async ({ api, event }) => {
  const axios = require("axios");
  const Scraper = require('mal-scraper');
  const request = require("request");
  const fs = require("fs");

  let input = event.body;

  // Check if user provided search query
  const args = input.split(" ");
  if (args.length < 2) {
    return api.sendMessage("⚠️ অনুগ্রহ করে একটি এনিমের নাম লিখুন।\nউদাহরণ: mal One Piece", event.threadID, event.messageID);
  }

  let query = args.slice(1).join(" "); // Remove 'mal' word
  api.sendMessage(`🔍 অনুসন্ধান চলছে:\n【 ${query} 】`, event.threadID, event.messageID);

  try {
    const Anime = await Scraper.getInfoFromName(query);

    if (!Anime) {
      return api.sendMessage("⚠️ কোন এনিমে পাওয়া যায়নি!", event.threadID, event.messageID);
    }

    const getURL = Anime.picture;
    const ext = getURL.substring(getURL.lastIndexOf(".") + 1) || "jpg";

    // Safe array joins
    const producers = Array.isArray(Anime.producers) ? Anime.producers.join(", ") : "None";
    const studios = Array.isArray(Anime.studios) ? Anime.studios.join(", ") : "None";
    const genres = Array.isArray(Anime.genres) ? Anime.genres.join(", ") : "None";

    const details = 
`🎴 শিরোনাম: ${Anime.title}
🎌 জাপানি নাম: ${Anime.japaneseTitle}
📺 ধরন: ${Anime.type}
♻️ স্ট্যাটাস: ${Anime.status}
🗓️ প্রচার শুরু: ${Anime.premiered}
🕰️ সম্প্রচার সময়: ${Anime.broadcast}
🗓️ সম্প্রচারিত হয়েছে: ${Anime.aired}
🎬 নির্মাতা: ${producers}
🏢 স্টুডিও: ${studios}
📚 উৎস: ${Anime.source}
📽️ পর্ব সংখ্যা: ${Anime.episodes}
⏳ সময়কাল: ${Anime.duration}
🏷️ ঘরানা: ${genres}
🔥 জনপ্রিয়তা: ${Anime.popularity}
🏆 র‍্যাঙ্ক: ${Anime.ranked}
⭐ স্কোর: ${Anime.score}
🔞 রেটিং: ${Anime.rating}

📝 সারাংশ:
${Anime.synopsis}

🔗 লিঙ্ক: ${Anime.url}`;

    const callback = () => {
      api.sendMessage({
        body: details,
        attachment: fs.createReadStream(__dirname + `/cache/mal.${ext}`)
      }, event.threadID, () => fs.unlinkSync(__dirname + `/cache/mal.${ext}`), event.messageID);
    };

    request(getURL).pipe(fs.createWriteStream(__dirname + `/cache/mal.${ext}`)).on("close", callback);

  } catch (err) {
    console.error(err);
    api.sendMessage(`⚠️ ত্রুটি ঘটেছে:\n${err.message}`, event.threadID, event.messageID);
  }
};
