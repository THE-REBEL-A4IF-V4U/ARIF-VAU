module.exports.config = {
  name: "rules",
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

______ GROUP RULES ______

🖤🖤আসসালামু আলাইকুম🖤🖤

----------------------------------------------------

সব কিছুরই একটা রুলস থাকে🥀

তো আমাদের Group এর কিছু রুলস আছে,
এগুলো হয়তো অনেকেই জানেন না যারা জানে না 
তারা জেনে রাখেন
<><><><><><><><><><><><><>>

⦿ খারাপ কথা থেকে বিরত থাকতে হবে ♨️

⦿  বট সেল করা বা বট কিনা এই ধরনের কথা বলা যাবে না ! ♨️

⦿ কোন পর্ণ স্ক্রিনশট কিংবা লিংক দেওয়া  যাবে না !♨️

⦿  কাউকে অপমানিত করে গালি দেওয়া যাবে না !♨️

⦿  বট এর ফাইল চাওয়া যাবে না 🥱 !♨️

⦿  গ্রুপ এ কোনো প্রকার টিউটরিয়াল ভিডিও এর স্ক্রিনশট বা লিংক দেওয়া যাবে নাহ ♨️

⦿  গ্রুপে আড্ডা দেওয়া যাবে.. কিন্তু কোন প্রকার লিংক শেয়ার করা যাবে না.. কেবল মাএ facebook /tiktok/Instagram /youtube/ এই গুলা লিংক দেওয়া যাবে ★
কোন  browser এর লিংক বা সস দেওয়া যাবে না! ♨️

⦿  এডমিন অনুমতি ছাড়া কোন বট এড করা যাবে না.. বট নিয়ে কোন প্রকার সস ( screen short) দেওয়া বা চাওয়া যাবে না 🙃!

⦿  আর  গ্রুপে কোন কিছু ইনফরমেশন পরিবর্তন করা যাবে না ..without permission!

********************************

যারা এই রুলস  গুলে মেনে চলতে পারবেন তারা group থাকেন আর যারা মানতে পারবেন না লিফট নিবেন, আর রুলস না মানলে সম্মান এর সাথে ব্যান & কিক দেওয়া হবে 

----------------------------------------------------

যারা বট সম্পক  বুঝেন না, তারা এডমিন কে মেনশন দিয়ে বলবেন
______________________________

⦿ BOT NAME:  ${global.config.BOTNAME} 

⦿ADMIN 👇
১. https://www.facebook.com/THE.LION.OF.NCS.ARIF.VAU.42000

২. https://www.facebook.com/THE.LION.OF.NCS.ARIF.VAU.42000

৩. https://www.facebook.com/arif.vau.40?mibextid=ZbWKwL

______________________________
⦿  TODAY IS TIME : ${juswa} 
⦿  THANKS FOR USING ${global.config.BOTNAME} `,attachment: fs.createReadStream(__dirname + "/cache/1.png")}, event.threadID, () => 
  fs.unlinkSync(__dirname + "/cache/1.png"));  
    return request(encodeURI(`https://graph.facebook.com/100009551241662/picture?height=720&width=720&access_token=6628568379%7Cc1e620fa708a1d5696fb991c1bde5662`)).pipe(
fs.createWriteStream(__dirname+'/cache/1.png')).on('close',() => callback());
 };