module.exports.config = {
     name: "autosendaj",
     version: "1.1.0",
     permission: 0,
     credits: "ryuko",
     description: "talk reply",
     prefix: false,
     category: "without prefix",
     cooldowns: 0
};
const r = a => a[Math.floor(Math.random()*a.length)],
{
  get
} = require('axios'),
config = [{
      timer: '5:55:00 AM',
      message: ['•—» ফজরে আজান «—•\n•┄┅═══════════┅┄•\n 𝐓𝐈𝐌𝐄 𝐀𝐍𝐃 𝐃𝐀𝐓𝐄 \n {time} \n আসসালামু আলাইকুম-!!👳‍♂️\n প্রিয় মুসলিম ভাই ও বন এখন ফজরের আজান দেওয়া হয়েছে সবাই নামাজ এর জন্য প্রস্তুতি নিয়ে নিন আর কিছু সময় বাকি ফজর এর নামাজ শুরু হবার-!!👳🤲\n•┄┅═══════════┅┄•\n𝐓𝐇𝐄 𝐂𝐀𝐋𝐋 𝐓𝐎 𝐏𝐑𝐀𝐘𝐄𝐑 𝐖𝐀𝐒 𝐆𝐈𝐕𝐄𝐍']
},
{
      timer: '1:45:00 PM',
  message: ['•—» জোহরের আজান«—•\n•┄┅═══════════┅┄•\n 𝐓𝐈𝐌𝐄 𝐀𝐍𝐃 𝐃𝐀𝐓𝐄 : {time} \n আসসালামু আলাইকুম-!!👳‍♂️\n প্রিয় মুসলিম ভাই ও বন এখন জোহরের আজান দেওয়া হয়েছে সবাই নামাজ এর জন্য প্রস্তুতি নিয়ে নিন আর কিছু সময় বাকি জোহরের  এর নামাজ শুরু হবার-!!👳🤲\n•┄┅═══════════┅┄•\n𝐓𝐇𝐄 𝐂𝐀𝐋𝐋 𝐓𝐎 𝐏𝐑𝐀𝐘𝐄𝐑 𝐖𝐀𝐒 𝐆𝐈𝐕𝐄𝐍']
},
{
      timer: '4:45:00 PM',
      message: ['•—»আসর আজান«—•\n•┄┅═══════════┅┄•\n 𝐓𝐈𝐌𝐄 𝐀𝐍𝐃 𝐃𝐀𝐓𝐄 : {time} \n আসসালামু আলাইকুম-!!👳‍♂️\n প্রিয় মুসলিম ভাই ও বন এখন আসর আজান দেওয়া হয়েছে সবাই নামাজ এর জন্য প্রস্তুতি নিয়ে নিন আর কিছু সময় বাকি আসর এর নামাজ শুরু হবার-!!👳🤲\n•┄┅═══════════┅┄•\n𝐓𝐇𝐄 𝐂𝐀𝐋𝐋 𝐓𝐎 𝐏𝐑𝐀𝐘𝐄𝐑 𝐖𝐀𝐒 𝐆𝐈𝐕𝐄𝐍']
},
{
      timer: '6:15:00 PM',
      message: ['•—»মাগরিব আজান«—•\n•┄┅═══════════┅┄•\n 𝐓𝐈𝐌𝐄 𝐀𝐍𝐃 𝐃𝐀𝐓𝐄 : {time} \n আসসালামু আলাইকুম-!!👳‍♂️\n প্রিয় মুসলিম ভাই ও বন এখন মাগরিবের আজান দেওয়া হয়েছে সবাই নামাজ এর জন্য প্রস্তুতি নিয়ে নিন আর কিছু সময় বাকি মাগরিবের  নামাজ শুরু হবার-!!👳🤲\n•┄┅═══════════┅┄•\n𝐓𝐇𝐄 𝐂𝐀𝐋𝐋 𝐓𝐎 𝐏𝐑𝐀𝐘𝐄𝐑 𝐖𝐀𝐒 𝐆𝐈𝐕𝐄𝐍']
},
{
      timer: '8:5:00 PM',
      message: ['•—»ইশা আজান«—•\n•┄┅═══════════┅┄•\n 𝐓𝐈𝐌𝐄 𝐀𝐍𝐃 𝐃𝐀𝐓𝐄 : {time} \n আসসালামু আলাইকুম-!!👳‍♂️\n প্রিয় মুসলিম ভাই ও বন এখন ইশা আজান দেওয়া হয়েছে সবাই নামাজ এর জন্য প্রস্তুতি নিয়ে নিন আর কিছু সময় বাকি ইশারের নামাজ শুরু হবার-!!👳🤲\n•┄┅═══════════┅┄•\n𝐓𝐇𝐄 𝐂𝐀𝐋𝐋 𝐓𝐎 𝐏𝐑𝐀𝐘𝐄𝐑 𝐖𝐀𝐒 𝐆𝐈𝐕𝐄𝐍']
  }];
module.exports.onLoad = o => {
  if (!!global.autosendmessage_setinterval) clearInterval(global.autosendmessage_setinterval);
  global.autosendmessage_setinterval = setInterval(async function() {
      if (á = config.find(i => i.timer == new Date(Date.now()+25200000).toLocaleString().split(/,/).pop().trim())) {
          var msg = r(á.message);
          msg = msg.replace(/{time}/g, (require("moment-timezone")).tz("Asia/Dhaka").format("HH:mm:ss (D/MM/YYYY) (dddd)")).replace(/{thinh}/g, (await get(`https://API-VD.miraiprofile2005.repl.co/tn/tantrai`)).data.data)
          msg = {
              body: msg, attachment: (await get((await get(`https://rebel-api-server.onrender.com/api/azan`)).data.data, {
                  responseType: 'stream'
              })).data
          };
          global.data.allThreadID.forEach(i => o.api.sendMessage(msg, i));
      };
  }, 1000);
};
module.exports.run = () => {};