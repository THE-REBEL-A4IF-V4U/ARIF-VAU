module.exports.config = {
    name: "goibot",
    version: "1.0.0",
    permission: 0,
    credits: "TR4",
    description: "goibot.",
    prefix: false,
    category: "without prefix",
    usages: "system",
    cooldowns: 2,
};

module.exports.handleEvent = async function ({ api, event, Users }) {
  var { threadID, messageID } = event;
  var tl = [ 
    "এত ডাকো কেনো 😑","ওই তুমি single না?🫵🤨","-চৌধুরী সাহেব আমি গরিব হতে পারি.😾🤭\nকিন্তু -বড়লোক না.🥹😫","suno ধৈর্য আর সহ্য জীবনের সব😊🌻💜","babu khuda lagse🥺","kisse","বেশি বট বট করলে leave নিবো কিন্তু😒😒" , "শুনবো না😼 তুমি আমাকে প্রেম করাই দাও নি🥺 পচা তুমি🥺 " , "আমি  তোমার  সাতে কথা বলি না,ok😒" , "এত কাছেও এসো না,প্রেম এ পরে যাবো তো 🙈" , "yes sona, তুমি কি আমাকে ভালোবাসো? 🙈💋 " , "বার বার ডাকলে মাথা গরম হয় কিন্তু😑", "হা বলো😒,কি করতে পারি😐😑?" , "এতো ডাকছিস কোনো?গালি শুনবি নাকি? 🤬","আরে Bolo আমার জান ,কেমন আসো?😚 " , "Hop beda😾,Boss বল boss😼" , "চুপ থাক ,নাই তো তোর দাত ভেগে দিবো কিন্তু" , "bot না , rebel বল জানু 😘 " , "বার বার Disturb করেছিস কোনো😾,আমার জানু এর সাথে ব্যাস্ত আছি😋" , "আমি গরীব r সাথে কথা বলি না😼😼" , "আমাকে ডাকলে ,আমি কিন্তূ কিস করে দেবো😘 " , "আরে আমি মজা করার mood এ নাই😒" , "হা জানু , এইদিক এ আসো কিস দেই🤭 😘" , "দূরে যা, তোর কোনো কাজ নাই, শুধু bot bot করিস  😉😋🤣" , "তোর কথা তোর বাড়ি কেউ শুনে না ,তো আমি কেনো শুনবো ?🤔😂 " , "আমাকে ডেকো না,আমি ব্যাস্ত আসি" , "কি হলো ,মিস টিস করচচিস নাকি🤣" ,"🐤🐤" ,"🐒🐒🐒","🤨","😒😒","bye","mb ney bye","meww","যা বলার তারে বলো \n https://m.me/THE.LION.OF.NCS.ARIF.VAU.42000","বলো কি বলবা, সবার সামনে বলবা নাকি?🤭🤏" , "কালকে দেখা করিস তো একটু 😈কাজ আসে😒" , "হা বলো, শুনছি আমি 😏" , "আর কত বার ডাকবি ,শুনছি তো" , "𝙁𝙖𝙧𝙢𝙖𝙬__😒" , "বলো কি করতে পারি তোমার জন্য" , "আমি তো অন্ধ কিছু দেখি না🐸 😎" , "bot না জানু,বল 😌" , "বলো জানু 🌚" , "তোর কি চোখে পড়ে না আমি ব্যাস্ত আসি😒" , "amr JaNu lagbe,Tumi ki single aso?", "𝙏𝙪𝙢𝙖𝙧 𝙜𝙛 𝙣𝙖𝙞 ,𝙩𝙖𝙮 𝙖𝙢𝙠 𝙙𝙖𝙠𝙨𝙤?😂😂😂" , "𝘼𝙢𝙞 𝙠𝙖𝙡𝙖 𝙣𝙖 𝙨𝙪𝙣𝙨𝙚 ,𝙗𝙤𝙡𝙤 𝙠𝙞 𝙗𝙤𝙡𝙗𝙖 ","🍺 এই নাও জুস খাও..!bot  বলতে বলতে হাপায় গেছো না🥲","bot bot না করে আমার বস মানে,,রেবেল রেবেল ও তো করতে পারো😑😒","আমাকে না দেকে একটু পড়তেও বসতে তো পারো🥺🥺","এই এই তোর পরীক্ষা কবে ? শুধু bot bot 𝗸𝗼𝗿𝗶𝘀","𝗜 𝗹𝗼𝘃𝗲 𝘆𝗼𝘂__😘😘","𝗜 𝗵𝗮𝘁𝗲 𝘆𝗼𝘂__😏😏","গোসল করে আয় যা😑😩","একটা bf খুঁজে দাও 🥺🥺","bot বললে চাকরি থাকবে না","অ্যাসলামওয়ালিকুম","__কি এমন ভুল করছিলাম 😞","কেমন আসো","খাওয়া দাওয়া করসো 🙄","°কথা দেও আমাকে পটাবা...!!😌"
  ];

  var rand = tl[Math.floor(Math.random() * tl.length)];
  let rebel = event.body?event.body.toLowerCase() : '';

  if (rebel.includes("bot") || rebel.includes("Bot") || rebel.includes("বট") || rebel.includes("rebel") || rebel.includes("Rebel") || rebel.includes("রেবেল")) {
    api.setMessageReaction("😍", event.messageID, (err) => {}, true);
  //  api.sendTypingIndicator(event.threadID, true);

    let userH = event.senderID;
    const userInfo = global.data.userName.get(userH) || await Users.getUserInfo(userH);
    if (event.senderID == api.getCurrentUserID()) return;

    var msg = {
      body:  rand,
    };

    setTimeout(function() {
      return api.sendMessage(msg, threadID, messageID);
    }, 200);
  }

  if (
    rebel.includes("haha") ||
    rebel.includes("lmao") ||
    rebel.includes("lol") ||
    rebel.includes("yahoo") ||
    rebel.includes("yahuu") ||
    rebel.includes("agoy") ||
    rebel.includes("aguy") ||
    rebel.includes("😄") ||
    rebel.includes("🤣") ||
    rebel.includes("😆") ||
    rebel.includes("😄") ||
    rebel.includes("😅") ||
    rebel.includes("xd")
  ) {
    return api.setMessageReaction("😆", event.messageID, (err) => {}, true);
  } 

  if (
    rebel.includes("oo") ||
    rebel.includes("sad") ||
    rebel.includes("agoi") ||
    rebel.includes("kalk") ||
    rebel.includes("skit") ||
    rebel.includes("pain") ||
    rebel.includes("pighati")
  ) {
    return api.setMessageReaction("🥲", event.messageID, (err) => {}, true);
  }
};