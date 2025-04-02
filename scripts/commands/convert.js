module.exports.config = {
  name: "convert",
  version: "1.0.0",
  Permssion: 0,
  credits: "Araxy",
  description: "convert video sang to mp3",
  prefix: false, 
  category: "vedio to mp3",
  usages: "reply",
  cooldowns: 5
};
module.exports.run = async function ({ api, args, event, Currencies, Users }) {
try{
const axios = require("axios");
  const fs = require("fs-extra");
  const request = require("request");
var audioss = []
var audio = args.join(" ") || event.messageReply.attachments[0].url;
  var { data } = await axios.get(audio ,{  method: 'GET',  responseType: 'arraybuffer' });
              fs.writeFileSync(__dirname + "/cache/vdtoau.m4a", Buffer.from(data, 'utf-8'));
audioss.push(fs.createReadStream(__dirname + "/cache/vdtoau.m4a"));
  var msg = { body : "𝗖𝗼𝘃𝗲𝗿𝘁 𝘀𝗮𝗻𝗴 𝗠𝗣𝟯  ️🎶\n𝐓𝐇𝐄 𝐑𝐄𝐁𝐄𝐋 ", attachment: audioss}
api.sendMessage(msg, event.threadID, event.messageID)
} catch(e){
  console.log(e)
}
    }