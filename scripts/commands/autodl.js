const fs = require('fs-extra'); const path = require('path'); const axios = require('axios');

module.exports.config = { name: "autodown", version: "1.0", permssion: 0, credits: "LocDev (Converted by Hamim)", description: "Automatically download media from multiple platforms", prefix: true, premium: false, category: "media", usages: "Reply or paste a media URL", cooldowns: 5 };

module.exports.onStart = async function ({ api, event, args }) { if (args[0] === 'help') { return api.sendMessage( '📥 Autodown supports video/image download from: Tiktok, Instagram, Facebook, YouTube, Threads, Capcut, Pinterest, Soundcloud, Spotify, and more.', event.threadID, event.messageID ); } };

module.exports.onChat = async function ({ api, event }) { const { body, messageID, threadID } = event; if (!body) return;

const url = body.trim(); if (!/^http(s)?:///.test(url)) return;

const patterns = [ /instagram.com/, /facebook.com/, /pinterest.com/, /soundcloud.com/, /capcut.com/, /spotify.com/, /x.com/, /tiktok.com/, /youtube.com/, /threads.net/, /zingmp3.vn/ ];

const matched = patterns.some(pattern => pattern.test(url)); if (!matched) return;

let res; try { res = await axios.get(https://j2down.vercel.app/download?url=${url}); } catch (err) { console.error('❌ Download API error:', err.message); return api.sendMessage('⚠️ Error fetching data from API.', threadID, messageID); }

const data = res.data; if (!data || !Array.isArray(data.medias) || data.medias.length === 0) { return api.sendMessage('❌ No downloadable media found.', threadID, messageID); }

const cachePath = path.join(__dirname, 'cache'); if (!fs.existsSync(cachePath)) fs.mkdirSync(cachePath);

const files = []; const contents = data.medias.map((item, index) => { const ext = item.type === 'video' ? 'mp4' : item.type === 'audio' ? 'mp3' : 'jpg'; const filePath = path.join(cachePath, ${Date.now()}_${index}.${ext}); return { url: item.url, path: filePath }; });

for (const content of contents) { try { const response = await axios.get(content.url, { responseType: 'arraybuffer' }); fs.writeFileSync(content.path, response.data); files.push(fs.createReadStream(content.path)); setTimeout(() => fs.unlink(content.path, () => {}), 60000); } catch (err) { console.error('❌ Error downloading media:', err.message); } }

return api.sendMessage({ body: 📥 ${data.title || 'Downloaded media:'}, attachment: files }, threadID, messageID); };

