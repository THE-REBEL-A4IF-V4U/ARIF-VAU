const axios = require("axios");

module.exports.config = {
	name: "adduser",
	version: "1.0.2",
	permssion: 0,
	credits: "Yan Maglinte + Modified by THE REBEL",
	description: "Add user to group by UID or FB profile link",
	prefix: true,
	category: "group",
	usages: "[uid/link]",
	cooldowns: 5
};

module.exports.run = async function ({ api, event, args }) {
	const { threadID, messageID } = event;
	const botID = api.getCurrentUserID();
	const send = msg => api.sendMessage(msg, threadID, messageID);

	let { participantIDs, approvalMode, adminIDs } = await api.getThreadInfo(threadID);
	participantIDs = participantIDs.map(e => parseInt(e));
	const admins = adminIDs.map(e => parseInt(e.id));

	if (!args[0]) return send("⚠️ Please provide a UID or Facebook profile link.");

	let uid, name = null;

	// 🔗 If it's a Facebook link
	if (args[0].includes("facebook.com")) {
		const link = args[0];
		try {
			const res = await axios.get(`https://id.traodoisub.com/api.php?link=${encodeURIComponent(link)}`);
			if (!res.data || !res.data.id) return send("❌ UID not found from the provided link.");
			uid = parseInt(res.data.id);
		} catch (err) {
			console.error(err);
			return send("❌ Error fetching UID from the link.");
		}
	} else if (!isNaN(args[0])) {
		uid = parseInt(args[0]);
	} else {
		return send("⚠️ Invalid UID or link.");
	}

	if (participantIDs.includes(uid)) return send("✅ This user is already in the group.");

	try {
		await api.addUserToGroup(uid, threadID);
		if (approvalMode && !admins.includes(botID)) {
			return send("✅ User added to the *approval list*.");
		} else {
			return send("✅ User added to the *group*.");
		}
	} catch (err) {
		console.error(err);
		return send("❌ Failed to add user to the group. Maybe they have privacy settings or your bot isn't admin.");
	}
};
