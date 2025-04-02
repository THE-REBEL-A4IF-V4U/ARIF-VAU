module.exports.config = {
	name: "joinNoti",
	eventType: ["log:subscribe"],
	version: "1.0.1",
	credits: "CatalizCS", //fixing ken gusler
	description: "Notify bot or group member with random gif/photo/video",
	dependencies: {
		"fs-extra": "",
		"path": "",
		"pidusage": ""
	}
};

module.exports.onLoad = function () {
		const { existsSync, mkdirSync } = global.nodemodule["fs-extra"];
		const { join } = global.nodemodule["path"];

	const path = join(__dirname, "rebel", "joinGif");
	if (existsSync(path)) mkdirSync(path, { recursive: true });	

	const path2 = join(__dirname, "rebel", "joinGif", "randomgif");
		if (!existsSync(path2)) mkdirSync(path2, { recursive: true });

		return;
}


module.exports.run = async function({ api, event }) {
	const { join } = global.nodemodule["path"];
	const { threadID } = event;
	if (event.logMessageData.addedParticipants.some(i => i.userFbId == api.getCurrentUserID())) {
		api.changeNickname(`{ ${global.config.PREFIX} } - ${(!global.config.BOTNAME) ? "bot" : global.config.BOTNAME}`, threadID, api.getCurrentUserID());
		const fs = require("fs");
		return api.sendMessage("𝙷𝙴 𝙷𝙴 𝙸 𝙱𝙰𝙲𝙺 \n     𝙸𝚃𝚂 𝙼3 『T』『R』『A』", event.threadID, () => api.sendMessage({body:`⊱•────•─────────•────•⊰
	𝐓𝐇𝐈𝐒 𝐁𝐎𝐓 𝐑𝐄-𝐌𝐀𝐃𝐄
				𝐁𝐘 
	𝐓.𝐑.𝐀 𝐀𝐑𝐈𝐅-𝐕𝐀𝐔 ⊱•────•─────────•────•⊰
❇️ ${global.config.BOTNAME} Bot Connected 🌐✅

❇️ ~ আসসালামু আলাইকুম আমার নাম
${global.config.BOTNAME}

❇️ আমার Prefix  হলো [ ${global.config.PREFIX} ]

❇️ আমার কমান্ডা লিস্ট দেখার জন্য  ${global.config.PREFIX}help ব্যবহার করুন.

❇️ আমার বস 𝐓.𝐑.𝐀-𝐀𝐑𝐈𝐅𝐔𝐋 𝐈𝐒𝐋𝐀𝐌 𝐀𝐒𝐈𝐅

❇️ যেকোনো সমস্যার জন্য ${global.config.PREFIX}called  ব্যবহার করুন; 
_______________×_______________
Thank You, Have A Nice Day 😜\n●───༆ "কারোর ༂ জন্য ༂

 𝐏𝐄𝐑𝐅𝐄𝐂𝐓 হতে ༂" চাই ༂ না

 ❥┼🥀🥰

🥀🤎ღ●───༂ যে  ༂আমার ༂ সে ༂ নিজেই ༂ আমাকে  ༂ 𝐏𝐄𝐑𝐅𝐄𝐂𝐓 ༆‌༂ বানিয়ে ༂ নিবে ༆‌༂" ❥┼
`, attachment: fs.createReadStream(__dirname + "/rebel/joinGif/arifvau.mp4")} ,threadID));
	}
	else {
		try {
			const { createReadStream, existsSync, mkdirSync, readdirSync } = global.nodemodule["fs-extra"];
			let { threadName, participantIDs } = await api.getThreadInfo(threadID);

			const threadData = global.data.threadData.get(parseInt(threadID)) || {};
			const path = join(__dirname, "rebel", "joinGif");
			const pathGif = join(path, `${threadID}.gif`);

			var mentions = [], nameArray = [], memLength = [], i = 0;

			for (id in event.logMessageData.addedParticipants) {
				const userName = event.logMessageData.addedParticipants[id].fullName;
				nameArray.push(userName);
				mentions.push({ tag: userName, id });
				memLength.push(participantIDs.length - i++);
			}

			memLength.sort((a, b) => a - b);
		(typeof threadData.customJoin == "undefined") ?  msg = "\n‎⊰᯽⊱─────────────⊰᯽⊱\n  🔹 আসসালামু আলাইকুম  🔹\n⊰᯽⊱─────────────⊰᯽⊱ \n\n꧁⁣𓆩 {name} 𓆪꧂\n\n        『 𝗪𝗘𝗟𝗟✦𝗖𝗢𝗠𝗘 』\n────────────────── \nআপনি আমাদের ({soThanhVien}) নং সদস্য\n\nগ্রুপ নাম: {threadName} \n\n         আমাদের গ্রুপের পক্ষ থেকে\n                   আপনার জন্য\n              ভালোবাসা অভিরাম\n❃❃❃❃❃❃❃❃❃❃❃❃❃❃❃❃❃❃\n   ♻️ 𝐓𝐇𝐈𝐒 𝐁𝐎𝐓 𝐏𝐑𝐎𝐓𝐄𝐂𝐓 ♻️\n                    - 🄱🅈 -\n   🔥{ 𝚃.𝚁.𝙰} 𝐓𝐇𝐄 𝐑𝐄𝐁𝐄𝐋  🔥" : msg = threadData.customJoin;

			msg = msg
			.replace(/\{name}/g, nameArray.join(', '))
			.replace(/\{type}/g, (memLength.length > 1) ?  'You' : 'Friend')
			.replace(/\{soThanhVien}/g, memLength.join(', '))
			.replace(/\{threadName}/g, threadName);

			if (existsSync(path)) mkdirSync(path, { recursive: true });

			const randomPath = readdirSync(join(__dirname, "rebel", "joinGif", "randomgif"));

			if (existsSync(pathGif)) formPush = { body: msg, attachment: createReadStream(pathGif), mentions }
			else if (randomPath.length != 0) {
				const pathRandom = join(__dirname, "rebel", "joinGif", "randomgif", `${randomPath[Math.floor(Math.random() * randomPath.length)]}`);
				formPush = { body: msg, attachment: createReadStream(pathRandom), mentions }
			}
			else formPush = { body: msg, mentions }

			return api.sendMessage(formPush, threadID);
		} catch (e) { return console.log(e) };
	}
			}