module.exports.config = {
  name: "goiamn",
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
  if (event.senderID !== "100058690712670") {
    var aid = ["100058690712670"];
    for (const id of aid) {
    if ( Object.keys(event.mentions) == id) {
      var msg = [ " আার পারলামনা bot bot করতে করতে এখন মেনশন দেয়া শুরু করছে 🙂"," মেনশ না দিয়ে বলো কি বলবা🫠 "," আছি আছি এতো মেনশন দিতে হবেনা😌"];
      return api.sendMessage({body: msg[Math.floor(Math.random()*msg.length)]}, event.threadID, event.messageID);
    }
    }}
};
module.exports.run = async function({}) {
}
