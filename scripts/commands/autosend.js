module.exports.config = {
  name: 'azanBroadcast',
  version: '1.0.0',
  permission: 2,
  credits: 'Rebel',
  prefix: true,
  description: 'Auto broadcast Azan audio with message in all groups',
  category: 'azan',
  usages: '[]',
  cooldowns: 3
};

const axios = require('axios');
const moment = require("moment-timezone");

const delayInSeconds = 0; // আজান কয় সেকেন্ড আগে/পরে যাবে (0 মানে ঠিক সময়ে)

const config = [
  { timer: '5:55:00 AM', title: '𝓕𝓪𝓳𝓻', bn: 'ফজর' },
  { timer: '1:45:00 PM', title: '𝓓𝓱𝓸𝓱𝓻', bn: 'জোহর' },
  { timer: '4:45:00 PM', title: '𝓐𝓼𝓻', bn: 'আসর' },
  { timer: '6:15:00 PM', title: '𝓜𝓪𝓰𝓱𝓻𝓲𝓫', bn: 'মাগরিব' },
  { timer: '8:05:00 PM', title: '𝓘𝓼𝓱𝓪', bn: 'ইশা' }
];

module.exports.onLoad = client => {
  if (global.azan_broadcast_interval) clearInterval(global.azan_broadcast_interval);

  global.azan_broadcast_interval = setInterval(async () => {
    const now = new Date(Date.now() + 6 * 60 * 60 * 1000 + delayInSeconds * 1000); // Delay যোগ হচ্ছে
    const currentTime = now.toLocaleTimeString('en-US', { hour12: true });

    const matched = config.find(item => item.timer === currentTime);
    if (!matched) return;

    try {
      const timeText = moment().tz("Asia/Dhaka").format("HH:mm:ss (D/MM/YYYY) (dddd)");
      const azanAudioURL = (await axios.get(`https://rebel-api-server.onrender.com/api/azan`)).data.data;
      const audioStream = (await axios.get(azanAudioURL, { responseType: 'stream' })).data;

      const msg = {
        body: `┌─═ ✦❁ ${matched.title} 𝓐𝔃𝓪𝓷 ❁✦ ═─┐

🕰️ সময় ও তারিখ: ${timeText}
আসসালামু আলাইকুম!
এখন ${matched.bn} এর আজান হয়েছে।
নামাজের জন্য সবাই প্রস্তুত হোন।

🔔 *𝐓𝐇𝐄 𝐂𝐀𝐋𝐋 𝐓𝐎 𝐏𝐑𝐀𝐘𝐄𝐑*
└────────────────────┘`,
        attachment: audioStream
      };

      global.data.allThreadID.forEach(threadID => {
        client.api.sendMessage(msg, threadID);
      });

      console.log(`[AZAN SENT] ${matched.bn} (${currentTime}) -> ${azanAudioURL}`);
    } catch (err) {
      console.error("Azan Broadcast Error:", err.message || err);
    }
  }, 1000);
};

module.exports.run = () => {};