module.exports.config = {
    name: "setname",
    version: "1.0.0",
    permission: 0,
    credits: "TR4",
    description: "goibot.",
    prefix: false,
    category: "without prefix",
    usages: "system",
    cooldowns: 2,
}; 
module.exports.run = async function({ api, event, args }) {
	const name = args.join(" ")
	const mention = Object.keys(event.mentions)[0];
	if (!mention) return api.changeNickname(`${name}`, event.threadID, event.senderID);
	if (mention[0]) return api.changeNickname(`${name.replace(event.mentions[mention], "")}`, event.threadID, mention);
}