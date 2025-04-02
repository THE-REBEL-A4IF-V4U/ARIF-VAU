module.exports.config = {
  name: "log",
  eventType: ["log:unsubscribe", "log:subscribe", "log:thread-name"],
  version: "1.0.0",
  credits: "Tpk",//*được sự chỉ dẫn nhiệt tình của dc-nam
  description: "Record bot activity notifications!",
  envConfig: {
    enable: true
  }
};

module.exports.run = async function ({ api, event, Users, Threads, Currencies }) {
  const threadSetting = (await Threads.getData(String(event.threadID))).data || 
    {};
    const threadInfo = await api.getThreadInfo(event.threadID)
    var threadName = threadInfo.threadName||"Name does not exist";
  const logger = require("../../Rebel/catalogs/Rebelc.js");
  if (!global.configModule[this.config.name].enable) return;
  let botID = api.getCurrentUserID();
   let threadMem = threadInfo.participantIDs.length;
  /*var allThreadID = global.data.allThreadID;
  for (const singleThread of allThreadID) {
    const thread = global.data.threadData.get(singleThread) || {};
    if (typeof thread["log"] != "undefined" && thread["log"] == false) return;
  }*/
  
  const moment = require("moment-timezone");
  const time = moment.tz("Asia/Dhaka").format("D/MM/YYYY HH:mm:ss");
  let sex = threadInfo.approvalMode;
  var pd = sex == false ? 'Turn off' : sex == true ? 'Turn on' : '\n';
  let qtv = threadInfo.adminIDs.length;
  let icon = threadInfo.emoji;
  //let nameThread = (await Threads.getData(event.threadID)).threadInfo.threadName || "Tên không tồn tại";
  //let nameThread = global.data.threadInfo.get(event.threadID).threadName || "Tên không tồn tại"; 

  //let threadInfo = await api.getThreadInfo(event.threadID);
  //nameThread =threadInfo.threadName;
  const nameUser = global.data.userName.get(event.author) || await Users.getNameUser(event.author);

  //console.log(nameThread)
 
  var formReport = "====「 𝙉𝙊𝙏𝙄𝙁𝙄𝘾𝘼𝙏𝙄𝙊𝙉 𝙊𝙁 𝐓𝐇𝐄 𝐑𝐄𝐁𝐄𝐋 」 ====\n━━━━━━━━━━━━━━━━━━" +
    //"\n\n[👨‍👩‍👧‍👧] 𝗕𝗼𝘅: " + nameThread +
    `\n[🧸] 𝙂𝙧𝙤𝙪𝙥 𝙉𝙖𝙢𝙚: ${threadName} ` +
    "\n[🔰] 𝙂𝙧𝙤𝙪𝙥 𝙄𝙙: " + event.threadID +
    `\n[💓] 𝙏𝙤𝙩𝙖𝙡 𝙈𝙚𝙢𝙗𝙚𝙧 𝙊𝙛 𝙂𝙧𝙤𝙪𝙥: ${threadMem}` +
    `\n[🧩] 𝘼𝙥𝙥𝙧𝙤𝙫𝙚: ${pd}` +
    `\n[⚜️] 𝘼𝙙𝙢𝙞𝙣𝙨: ${qtv}` +
    "\n━━━━━━━━━━━━━━━━━━" +
    "\n[⚠️] 𝘼𝙘𝙩𝙞𝙤𝙣 𝙏𝙖𝙠𝙚𝙣 : {task}" +
    "\n[👤] 𝙉𝙖𝙢𝙚 𝙐𝙨𝙚𝙧 : " + nameUser +
    "\n[🍄] 𝗨𝘀𝗲𝗿 𝗶𝗱: " + event.author +
    "\n[🌐] 𝗹𝗶𝗻𝗸 𝗙𝗮𝗰𝗲𝗯𝗼𝗼𝗸: https://www.facebook.com/" + event.author +
    "\n━━━━━━━━━━━━━━━━━━\n[⏰] 𝙏𝙞𝙢𝙚: " + time + "",
    task = "";
  switch (event.logMessageType) {
    case "log:thread-name": {
        newName = event.logMessageData.name || "Name does not exist";
        task = "User changes group name to " + newName + "";
        await Threads.setData(event.threadID, {name: newName});
        break;
    }
    case "log:subscribe": {
      if (event.logMessageData.addedParticipants.some(i => i.userFbId == botID)) task = "User added bot to a new group!";
      break;
    }
    case "log:unsubscribe": {
      if (event.logMessageData.leftParticipantFbId == botID) {
        if(event.senderID == botID) return;
        const data = (await Threads.getData(event.threadID)).data || {};
        data.banned = true;
        var reason = "Click the bot freely, without permission";
        data.reason = reason || null;
        data.dateAdded = time;
        await Threads.setData(event.threadID, { data });
        global.data.threadBanned.set(event.threadID, { reason: data.reason, dateAdded: data.dateAdded });

        task = "User kicked bot out of group!"
      }
      break;
    }
    default:
      break;
  }

  async function streamURL(url, mime='jpg') {
    const dest = `${__dirname}/cache/${Date.now()}.${mime}`,
    downloader = require('image-downloader'),
    fse = require('fs-extra');
    await downloader.image({
        url, dest
    });
    setTimeout(j=>fse.unlinkSync(j), 60*1000, dest);
    return fse.createReadStream(dest);
};
  if (task.length == 0) return;
  formReport = formReport
    .replace(/\{task}/g, task);
 var god = "100000564972717";

    return api.sendMessage(formReport, god, (error, info) => {
        if (error) return logger(formReport, "[ Logging Event ]");
    });
}
