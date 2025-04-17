const fs = global.nodemodule["fs-extra"];
const moment = require("moment-timezone");

module.exports.config = {
  name: "autoban",
  version: "1.1.0",
  permission: 0,
  credits: "TR4",
  description: "Group e gali diyeile auto ban kore debe",
  prefix: true,
  category: "system",
  cooldowns: 0
};

const badwords = [
  "khankir pula", "tor maire xudi", "tor mare xudi", "tor make xudi", "tor mare cudi", "bessar pula", "madarchud",
  "tor mar vuda", "tor mar sawya", "tor bon ke cudi", "tor bon ke xudi", "kuttar bacha", "januyar er bacha",
  "tor mare xude mashik ber kori", "bessa magir pula", "guti baz er maire xudi", "tokai magir pula", "fokinnir pula",
  "vab cudas", "nobin er maire xudi", "খানকির পুলা", "মাদারচোদ", "তর মারে চুদি", "বেসা মাগির পুলা", "কুত্তার মাচ্চা",
  "তর মন রে চুদি", "তর মার মাসুক খাস", "তর মার ভুদার মাশিক বের করমু চুদে", "তরে চুদমু", "kire magir pula",
  "soyorer bacha", "আয় চুদি তকে", "ফকিন্নির পুলা", "কুত্তার বাচা", "তর মার ভুদায় দিমু", "তর বন কে ফালাইয়া চুদমু",
  "তর মারে ফালাইয়া চুদমু", "চুদা চুদি করতে আসছত এখানে", "তর দন", "তর ভুদা", "তর সাওয়া", "তর নানির হেডা",
  "তর মার সাওয়া", "xuda diye manus kormu", "virtual haram kormu cude", "মাগির পুলা", "কানা মাদারচুদ",
  "kana madarcud", "তর মার ভুদায় শুটকি মাছের গন্ধ", "তর মারে কন্ডম দিয়ে চুদি", "তর বন কে কন্ডম লাগিয়ে চুদি",
  "তর বউ কে কন্ডম লাগিয়ে চুদি", "তর মাকে চুদে কন্ডম লিক করছি", "তর বন কে চুদে কন্ডম লিক করছি", "ay lagi",
  "tor mar sawya bangmu", "tor mar vuday bormu", "tor mare cude masik bar kormu", "tor mar mashik diye toke gosol koramu",
  "চুদা দিয়ে ভুদা ফাটাইয়া ফেলমু", "তর বন কে চুদে পেট ফুলামু", "cudir vai", "xudir vai", "madarcud er macha",
  "bancud er bacha", "madarxud er bacha", "banxud er bacha", "tokai magir pula", "bosti magir pula", "vudar group",
  "group er maire xudi", "কিরে মাদারচুদ", "কাল ও না তর চুদে আসলাম", "তরে আবার চুদমু", "তরে বাবারে চুদমু",
  "তর গুসঠির মাইরে চুদি", "tor gusti cudi", "tor gustis maire cudi", "vudar group a add dise ke", "sawyar group",
  "সাওয়ার গ্রুপ", "বুদার গ্রুপ", "নটি মাগি", "চুদনার পুলা", "তুর বন এর ভুদায় বেগুন দিমু", "তরে চুদে মেরে ফেলমু",
  "তর বন এর গুদ ফাটামু চুদে", "তর বন এর দুদ টিপমু", "তর বনরে চুদতে সেই মজা", "তর বন কে চুদলে তুই মজা পাবি",
  "আডমিন কন খানকির পুলায়", "আডমিন এর মাইরে চুদি", "কুত্তার বাচ্চা আডমিন", "admin er maire xudi",
  "admin er gusti cudi", "Admin khankir pula", "admin bessar pula", "Admin tokai magir pula", "Admin kuttar baccha",
  "admin er buday bormu", "Admin re putki marmu", "আডমিন কে পুটকি মারো সবাই", "আডমিন কে পুটকি মারমু",
  "তরে পুটকি মারি", "পুটকি মারে আমারে", "পুটকি মারে তরে"
];

module.exports.handleEvent = async function ({ api, event, Users, Threads }) {
  const { threadID, senderID, body } = event;
  if (!body) return;

  const lowerCaseBody = body.toLowerCase();
  if (badwords.some(word => lowerCaseBody.includes(word))) {
    const name = (await Users.getData(senderID)).name;
    const dataThread = (await Threads.getData(threadID)).threadInfo;
    const time = moment.tz('Asia/Dhaka').format('HH:mm:ss DD/MM/YYYY');

    await api.removeUserFromGroup(senderID, threadID);

    let userData = (await Users.getData(senderID)).data || {};
    userData.banned = true;
    userData.reason = "Cursing bot/admin";
    userData.dateAdded = time;
    await Users.setData(senderID, { data: userData });

    global.data.userBanned.set(senderID, {
      reason: userData.reason,
      dateAdded: userData.dateAdded
    });

    api.sendMessage(
      `•<><><><>< User Ban ><><><><>•
| ➜ You Have Been Banned for Cursing Bot/Admin
| ➜ Name: ${name}
| ➜ TID: ${threadID}
| ➜ Admin Said You: Portable Garbage Bag ∐w∐
| ➜ Contact Admin to Remove Ban: https://www.facebook.com/ARIF.THE.REBEL.233
•<><><><><⚜️><><><><>•`,
      threadID,
      () => {
        const admins = global.config.ADMINBOT || [];
        for (let adminID of admins) {
          api.sendMessage(
            `•<><><><>< User Ban ><><><><>•
| ➜ Name: ${name}
| ➜ Group: ${dataThread.threadName}
| ➜ Curse: ${body}
| ➜ Time: ${time}
| ➜ Group ID: ${threadID}
| ➜ Profile: facebook.com/${senderID}
•<><><><><⚜️><><><><>•`,
            adminID
          );
        }
      }
    );
  }
};

module.exports.run = async function ({ api, event }) {
  api.sendMessage(
    `Automatically banned when cursing bots.\nModule created by 𝐓𝐇𝐄 𝐑𝐄𝐁𝐄𝐋 𝐒𝐐𝐔𝐀𝐃.`,
    event.threadID,
    event.messageID
  );
};