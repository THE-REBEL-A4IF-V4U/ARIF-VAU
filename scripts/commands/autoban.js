const fs = global.nodemodule['fs-extra']
module.exports.config = {
	 name: "autoban",
	 version: "1.1.0",
	 permission: 0,
	 credits: "TR4",
	 description: "group a gala gali ba baje kotha bolle auto ban kore dewya hobe",
	 prefix: true,
	 category: "system",
	 cooldowns: 0
};




module.exports.handleEvent = async function ({
  api,
  event,
  args,
  Users,
  Threads,
}) {
  var { threadID, reason } = event,
    id = '' + event.senderID,
    idgr = '' + event.threadID,
    name = (await Users.getData(event.senderID)).name,
    idbox = event.threadID,
    datathread = (await Threads.getData(event.threadID)).threadInfo
  const moment = require('moment-timezone')
  var gio = moment.tz('Asia/Ho_Chi_Minh').format('HH:mm:ss DD/MM/YYYY')
  const time = moment.tz('Asia/Ho_Chi_minh').format('HH:MM:ss L')
  if (!event.body) {
    return
  }
  if (
    event.body.indexOf('khankir pula') !== -1 || 
    event.body.indexOf('tor maire xudi') !== -1 ||
    event.body.indexOf('tor mare xudi') !== -1 ||
    event.body.indexOf('tor make xudi') !== -1 ||
    event.body.indexOf('tor mare cudi') !== -1 ||
    event.body.indexOf('bessar pula') !== -1 ||
    event.body.indexOf('madarchud') !== -1 ||
    event.body.indexOf('tor mar vuda') !== -1 ||
    event.body.indexOf('tor mar sawya') !== -1 ||
    event.body.indexOf('tor bon ke cudi') !== -1 ||
    event.body.indexOf('tor bon ke xudi') !== -1 ||
    event.body.indexOf('kuttar bacha') !== -1 ||
    event.body.indexOf('januyar er bacha') !== -1 ||
    event.body.indexOf('tor mare xude mashik ber kori') !== -1 ||
    event.body.indexOf('bessa magir pula') !== -1 ||
    event.body.indexOf('guti baz er maire xudi') !== -1 ||
    event.body.indexOf('tokai magir pula') !== -1 ||
    event.body.indexOf('fokinnir pula') !== -1 ||
    event.body.indexOf('vab cudas') !== -1 ||
    event.body.indexOf('nobin er maire xudi') !== -1 ||
    event.body.indexOf('খানকির পুলা) !== -1 ||
    event.body.indexOf('মাদারচোদ') !== -1 ||
    event.body.indexOf('তর মারে চুদি') !== -1 ||
    event.body.indexOf('বেসা মাগির পুলা') !== -1 ||
    event.body.indexOf('কুত্তার মাচ্চা') !== -1 ||
    event.body.indexOf('তর মন রে চুদি') !== -1 ||
    event.body.indexOf('তর মার মাসুক খাস') !== -1 ||
    event.body.indexOf('তর মার ভুদার মাশিক বের করমু চুদে') !== -1 ||
    event.body.indexOf('তরে চুদমু') !== -1 ||
    event.body.indexOf('kire magir pula') !== -1 ||
    event.body.indexOf('soyorer bacha') !== -1 ||
    event.body.indexOf('আয় চুদি তকে) !== -1 ||
    event.body.indexOf('ফকিন্নির পুলা') !== -1 ||
    event.body.indexOf('কুত্তার বাচা') !== -1 ||
    event.body.indexOf('তর মার ভুদায় দিমু') !== -1 ||
    event.body.indexOf('তর বন কে ফালাইয়া চুদমু') !== -1 ||
    event.body.indexOf('তর মারে ফালাইয়া চুদমু') !== -1 ||
    event.body.indexOf('তর মার ভুদার মাসিক বের করমু চুদে') !== -1 ||
    event.body.indexOf('চুদা চুদি করতে আসছত এখানে') !== -1 ||
    event.body.indexOf('আয় চুদি তকে') !== -1 ||
    event.body.indexOf('তর দন') !== -1 ||
    event.body.indexOf(তর ভুদা') !== -1 ||
    event.body.indexOf('তর সাওয়া') !== -1 ||
    event.body.indexOf('তর নানির হেডা') !== -1 ||
    event.body.indexOf('তর মার সাওয়া') !== -1 ||
    event.body.indexOf('xuda diye manus kormu) !== -1 ||
    event.body.indexOf('virtual haram kormu cude') !== -1 ||
    event.body.indexOf('মাগির পুলা) !== -1 ||
    event.body.indexOf('কানা মাদারচুদ') !== -1 ||
    event.body.indexOf('kana madarcud') !== -1 ||
    event.body.indexOf('তর মার ভুদায় শুটকি মাছের গন্ধ') !== -1 ||
    event.body.indexOf(''তর মারে কন্ডম দিয়ে চুদি) !== -1 ||
    event.body.indexOf('তর বন কে কন্ডম লাগিয়ে চুদি') !== -1 ||
    event.body.indexOf('তর  বউ কে কন্ডম লাগিয়ে চুদি') !== -1 ||
    event.body.indexOf('তর মাকে চুদে কন্ডম লিক করছি') !== -1 ||
    event.body.indexOf('তর বন কে চুদে কন্ডম লিক করছি') !== -1 ||
    event.body.indexOf('ay lagi) !== -1 ||
    event.body.indexOf('tor mar sawya bangmu') !== -1 ||
    event.body.indexOf('tor mar vuday bormu') !== -1 ||
    event.body.indexOf('tor mare cude masik bar kormu') !== -1 ||
    event.body.indexOf('tor mar mashik diye toke gosol koramu') !== -1 ||
    event.body.indexOf('চুদা দিয়ে ভুদা ফাটাইয়া ফেলমু) !== -1 ||
    event.body.indexOf('তর বন কে চুদে পেট ফুলামু') !== -1 ||
    event.body.indexOf('cudir vai) !== -1 ||
    event.body.indexOf('xudir vai') !== -1 ||
    event.body.indexOf('madarcud er macha') !== -1 ||
    event.body.indexOf('bancud er bacha') !== -1 ||
    event.body.indexOf('madarxud er bacha') !== -1 ||
    event.body.indexOf('banxud er bacha') !== -1 ||
    event.body.indexOf('tokai magir pula') !== -1 ||
    event.body.indexOf('bosti magir pula') !== -1 ||
    event.body.indexOf('vudar group') !== -1 ||
    event.body.indexOf('group er maire xudi') !== -1 ||
    event.body.indexOf('কিরে মাদারচুদ) !== -1 ||
    event.body.indexOf('কাল ও না তর চুদে আসলাম') !== -1 ||
    event.body.indexOf('তরে আবার চুদমু') !== -1 ||
    event.body.indexOf('তরে বাবারে চুদমু') !== -1 ||
    event.body.indexOf('তর গুসঠির মাইরে চুদি') !== -1 ||
    event.body.indexOf('tor gusti cudi) !== -1 ||
    event.body.indexOf('tor gustis maire cudi') !== -1 ||
    event.body.indexOf('vudar group a add dise ke') !== -1 ||
    event.body.indexOf('sawyar group') !== -1 ||
    event.body.indexOf('সাওয়ার গ্রুপ) !== -1 ||
    event.body.indexOf('বুদার গ্রুপ') !== -1 ||
    event.body.indexOf('নটি মাগি') !== -1 ||
    event.body.indexOf('চুদনার পুলা') !== -1 ||
    event.body.indexOf('তুর বন এর ভুদায় বেগুন দিমু') !== -1 ||
    event.body.indexOf('তরে চুদে মেরে ফেলমু') !== -1 ||
    event.body.indexOf('তর বন এর গুদ ফাটামু চুদে') !== -1 ||
    event.body.indexOf('তর বন এর দুদ টিপমু') !== -1 ||
    event.body.indexOf('তর বনরে চুদতে সেই মজা') !== -1 ||
    event.body.indexOf('তর বন কে চুদলে তুই মজা পাবি') !== -1 ||
    event.body.indexOf('আডমিন কন খানকির পুলায়') !== -1 ||
    event.body.indexOf('আডমিন এর মাইরে চুদি') !== -1 ||
    event.body.indexOf('কুত্তার বাচ্চা আডমিন') !== -1 ||
    event.body.indexOf('admin er maire xudi) !== -1 ||
    event.body.indexOf('admin er maire xudi') !== -1 ||
    event.body.indexOf('admin er gusti cudi') !== -1 ||
    event.body.indexOf('Admin khankir pula') !== -1 ||
    event.body.indexOf('admin bessar pula') !== -1 ||
    event.body.indexOf('Admin tokai magir pula') !== -1 ||
    event.body.indexOf('Admin kuttar baccha') !== -1 ||
    event.body.indexOf('admin er buday bormu') !== -1 ||
    event.body.indexOf('Admin re putki marmu ') !== -1 ||
    event.body.indexOf('আডমিন কে পুটকি মারো সবাই) !== -1 ||
    event.body.indexOf('আডমিন কে পুটকি মারমু') !== -1 ||
    event.body.indexOf('তরে পুটকি মারি') !== -1 ||
    event.body.indexOf('পুটকি মারে আমারে') !== -1 ||
    event.body.indexOf('পুটকি মারে তরে') !== -1
  ) {
    let data = (await Users.getData(id)).data || {}
    var namethread = datathread.threadName
     api.removeUserFromGroup(id, threadID)
    return (
      (data.banned = true),
      (data.reason = 'Cursing bots' || null),
      (data.dateAdded = time),
      await Users.setData(id, { data: data }),
      global.data.userBanned.set(id, {
        reason: data.reason,
        dateAdded: data.dateAdded,
      }),
      api.sendMessage(
'•<><><><><User Ban ><><><><>•' + '\n' +
'| ➜ You Have Been Banned' + ' | ' + ' Curse Bot , Admin' + '\n' +
'| ➜ Name : ' + name + '\n' +
'| ➜ Tid : ' + idgr + '\n' +
'| ➜ Admin said you : Portable Garbage Bag ∐w∐' + '\n' +
'| ➜ Please remove the ban : ' + 'https://www.facebook.com/ARIF.THE.REBEL.233' + '\n' +
'•<><><><><⚜️><><><><>•',
        threadID,
        () => {
          var idd = global.config.ADMINBOT
          for (let idad of idd) {
            api.sendMessage(
'•<><><><>< User Ban ><><><><>•' + '\n' +
'| ➜ ' + name + ' group ' + namethread + '\n' +
'| ➜ Curse Bot : ' + event.body + '\n' +
'| ➜ At the time : ' + gio + '\n' +
'| ➜ Id Group : ' + idgr + '\n' +
'| ➜ Facebook.com/' + id + '\n' +
'•<><><><><⚜️><><><><>•', 
              idad
            )
          }
        }
      )
    )

  } else {
    return
  }
}
module.exports.run = async function ({
  api,
  event,
  args,
  Users,
  Threads,
  __GLOBAL,
}) {
  api.sendMessage(
    `Automatically banned when cursing bots\n Modules code by 𝐓𝐇𝐄 𝐑𝐄𝐁𝐄𝐋 𝐒𝐐𝐔𝐀𝐃`,
    event.threadID,
    event.messageID
  )
}