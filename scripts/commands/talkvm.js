module.exports.config = {
   name: "talkvm",
   version: "1.1.0",
   permission: 0,
   credits: "rebel",
   description: "talk voice message reply",
   prefix: false,
   category: "without prefix",
   cooldowns: 0
}

module.exports.run = async function({ api, event, args, Threads }) {
try {
const axios = require("axios");
const {talk} = global.apirebel;
const {createReadStream, unlinkSync} = global.nodemodule["fs-extra"];
  const {resolve} = global.nodemodule["path"];
let ask = args.join(" ");
if (!ask) {
  return api.sendMessage('enter a message.', event.threadID, event.messageID);
}

axios.get(encodeURI(`${talk}${ask}`)).then(res => {
async function rebel() {
  const reply = res.data.reply
  const path = resolve(__dirname, 'cache', `${event.threadID}_${event.senderID}.mp3`);
await global.utils.downloadFile(`https://translate.google.com/translate_tts?ie=UTF-8&q=${reply}&tl=tl&client=tw-ob`, path);
      return api.sendMessage({
          attachment: createReadStream(path)
      }, event.threadID, () => unlinkSync(path), event.messageID);
}
return rebel();
})
} catch (error) {
return api.sendMessage('having some unexpected error  try again later.', event.threadID, event.messageID)
}
}