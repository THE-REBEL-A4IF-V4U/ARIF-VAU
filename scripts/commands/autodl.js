const fs = require('fs-extra');
const path = require('path');
const axios = require('axios');

module.exports.config = {
  name: "autodl",
  version: "2.0.4",
  permssion: 0,
  prefix: true,
  credits: "LocDev (Merged & Converted by ChatGPT)",
  description: "অটো মিডিয়া ডাউনলোড",
  category: "📥 মিডিয়া",
  usages: "[লিংক অথবা help]",
  cooldowns: 5,
  dependencies: {
    "fs-extra": "",
    "axios": ""
  }
};

module.exports.onStart = async function ({ api, event, args }) {
  if (args[0] === 'help') {
    return api.sendMessage(
      '📥 Autodl কমান্ডটি নিচের প্ল্যাটফর্মগুলো থেকে ভিডিও/অডিও/ইমেজ ডাউনলোড করতে পারে:\n\nTiktok, Instagram, Facebook, YouTube, Threads, Capcut, Pinterest, Soundcloud, Spotify এবং আরও অনেক কিছু।\n\n➤ শুধু লিংক পাঠালেই বট অটো ডাউনলোড করবে।',
      event.threadID,
      event.messageID
    );
  }
};

module.exports.onChat = async function ({ api, event }) {
  const { body, messageID, threadID } = event;
  if (!body) return;

  const url = body.trim();
  if (!/^http(s)?:\/\//.test(url)) return;

  const platforms = [
    /instagram\.com/, /facebook\.com/, /pinterest\.com/, /soundcloud\.com/, /capcut\.com/,
    /spotify\.com/, /x\.com/, /tiktok\.com/, /youtube\.com/, /threads\.net/, /zingmp3\.vn/
  ];

  const matched = platforms.some(p => p.test(url));
  if (!matched) return;

  let res;
  try {
    res = await axios.get(`https://j2down.vercel.app/download?url=${url}`);
  } catch (err) {
    console.error('❌ Download API error:', err.message);
    return api.sendMessage('⚠️ ডাউনলোড API থেকে তথ্য আনতে সমস্যা হয়েছে।', threadID, messageID);
  }

  const data = res.data;
  if (!data || !Array.isArray(data.medias) || data.medias.length === 0) {
    return api.sendMessage('❌ কোনো মিডিয়া পাওয়া যায়নি।', threadID, messageID);
  }

  const cacheDir = path.join(__dirname, 'cache');
  if (!fs.existsSync(cacheDir)) fs.mkdirSync(cacheDir);

  const files = [];

  for (let i = 0; i < data.medias.length; i++) {
    const media = data.medias[i];
    const ext = media.type === 'video' ? 'mp4' : media.type === 'audio' ? 'mp3' : 'jpg';
    const filePath = path.join(cacheDir, `${Date.now()}_${i}.${ext}`);

    try {
      const response = await axios.get(media.url, { responseType: 'arraybuffer' });
      fs.writeFileSync(filePath, response.data);
      files.push(fs.createReadStream(filePath));
      setTimeout(() => fs.unlink(filePath, () => {}), 60 * 1000);
    } catch (err) {
      console.error('❌ মিডিয়া ডাউনলোডে সমস্যা:', err.message);
    }
  }

  return api.sendMessage({
    body: `📥 ${data.title || "Downloaded Media"}`,
    attachment: files
  }, threadID, messageID);
};
