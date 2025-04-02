module.exports.config = {
  name: "info",
  version: "1.0.0",
  permission: 0,
  credits: "nayan",
  prefix: true,
  description: "",
  category: "prefix",
  usages: "",
  cooldowns: 5,
  dependencies: 
{
  "request":"",
  "fs-extra":"",
  "axios":""
}
};
module.exports.run = async function({ api,event,args,client,Users,Threads,__GLOBAL,Currencies }) {
const axios = global.nodemodule["axios"];
const request = global.nodemodule["request"];
const fs = global.nodemodule["fs-extra"];
const time = process.uptime(),
  hours = Math.floor(time / (60 * 60)),
  minutes = Math.floor((time % (60 * 60)) / 60),
  seconds = Math.floor(time % 60);
const moment = require("moment-timezone");
var juswa = moment.tz("Asia/Dhaka").format("『D/MM/YYYY』 【hh:mm:ss】");

var callback = () => api.sendMessage({body:`


𝐓𝐇𝐄 𝐑𝐄𝐁𝐄𝐋 𝐒𝐐𝐔𝐀𝐃  
--------------------------------------------

FACEBOOK :  ARIF CHOWDHURY 

GENDER : MALE

Age : 22+

Relationship : SINGLE 😓

Work : ****

FACEBOOK LINK : https://www.facebook.com/100009551241662

Wp : wa.me/+8801329593053

TELEGRAM : t.me/TRA_ARIFVAU

Mail : ariful.islam.asif.200@gmail.com

➟ UPTIME

TODAY IS TIME : ${juswa} 

BOT IS RUNNING ${hours}:${minutes}:${seconds}.

THANKS FOR USING ${global.config.BOTNAME} 『🙅🖤』`,attachment: fs.createReadStream(__dirname + "/cache/1.png")}, event.threadID, () => 
  fs.unlinkSync(__dirname + "/cache/1.png"));  
    return request(encodeURI(`https://graph.facebook.com/100009551241662/picture?height=720&width=720&access_token=6628568379%7Cc1e620fa708a1d5696fb991c1bde5662`)).pipe(
fs.createWriteStream(__dirname+'/cache/1.png')).on('close',() => callback());
 };