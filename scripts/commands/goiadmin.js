module.exports.config = {
  name: "goiadmin",
    version: "1.0.0",
    permission: 0,
    credits: "nayan",
    description: "mention",
    prefix: true,
    category: "user",
    usages: "tag",
    cooldowns: 5,
};
module.exports.handleEvent = function({ api, event }) {
  if (event.senderID !== "100000564972717") {
    var aid = ["100000564972717"];
    for (const id of aid) {
    if ( Object.keys(event.mentions) == id) {
      var msg = ["Mantion_দিস না আরিফ বস এর মন মন ভালো নেই আস্কে-!💔🥀", "- আমার সাথে কেউ সেক্স করে না থুক্কু টেক্স করে নাহ🫂💔","আরিফ বস এখন  বিজি জা বলার আমাকে বলতে পারেন_!!😼🥰","এতো মিনশন নাহ দিয়া সিংগেল আরিফ রে একটা গফ দে 😒 😏","Mantion_না দিয়ে সিরিয়াস প্রেম করতে চাইলে ইনবক্স","মেনশন দিসনা পারলে একটা গফ দে","Mantion_দিস না  আরিফ প্রচুর বিজি 🥵🥀🤐"];
      return api.sendMessage({body: msg[Math.floor(Math.random()*msg.length)]}, event.threadID, event.messageID);
    }
    }}
};
module.exports.run = async function({}) {
}
