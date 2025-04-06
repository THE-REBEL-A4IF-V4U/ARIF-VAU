const moment = require("moment");
const gradient = require("gradient-string");
const chalk = require("chalk");
const logger = require("../catalogs/Rebelc.js");
const crayon = gradient('yellow', 'lime', 'green');
const sky = gradient('#3446eb', '#3455eb', '#3474eb');

module.exports = function({ api, models }) {
	const Users = require("./controllers/users")({ models, api });
	const Threads = require("./controllers/threads")({ models, api });
	const Currencies = require("./controllers/currencies")({ models });

	// Function to display the banner
	function displayBanner(config) {
		const banner = gradient.pastel(`
╔════════════════════════════════════╗
║                                    ║
║    Welcome to THE-REBEL Bot!       ║
║    Version: ${config.version}      ║
║    Author: ${config.author}        ║
║    Time: ${moment().format('YYYY-MM-DD HH:mm:ss')} ║
║                                    ║
╚════════════════════════════════════╝`);
		console.log(banner);
	}

	(async function () {
		try {
			// Try to mark all messages as read (safe)
			try {
				await api.markAsReadAll();
			} catch (err) {
				if (err?.error === 1357031 || err?.errorSummary?.includes("no longer available")) {
					console.warn(chalk.yellow("markAsReadAll: Some messages are no longer available or accessible. Skipping..."));
				} else {
					console.error(chalk.red("Unexpected error in markAsReadAll:"), err);
				}
			}

			const [threads, users] = await Promise.all([
				Threads.getAll(),
				Users.getAll(['userID', 'name', 'data'])
			]);

			// Handle Threads
			threads.forEach(data => {
				const idThread = String(data.threadID);
				global.data.allThreadID.push(idThread);
				global.data.threadData.set(idThread, data.data || {});
				global.data.threadInfo.set(idThread, data.threadInfo || {});
				if (data.data?.banned) {
					global.data.threadBanned.set(idThread, {
						reason: data.data.reason || '',
						dateAdded: data.data.dateAdded || ''
					});
				}
				if (data.data?.commandBanned?.length) {
					global.data.commandBanned.set(idThread, data.data.commandBanned);
				}
				if (data.data?.NSFW) {
					global.data.threadAllowNSFW.push(idThread);
				}
			});

			// Handle Users
			users.forEach(dataU => {
				const idUsers = String(dataU.userID);
				global.data.allUserID.push(idUsers);
				if (dataU.name?.length) {
					global.data.userName.set(idUsers, dataU.name);
				}
				if (dataU.data?.banned) {
					global.data.userBanned.set(idUsers, {
						reason: dataU.data.reason || '',
						dateAdded: dataU.data.dateAdded || ''
					});
				}
				if (dataU.data?.commandBanned?.length) {
					global.data.commandBanned.set(idUsers, dataU.data.commandBanned);
				}
			});

			// Show Banner and Deploy Info
			displayBanner(global.config);
			global.loading(`deployed ${chalk.blueBright(global.data.allThreadID.length)} groups and ${chalk.blueBright(global.data.allUserID.length)} users\n\n${chalk.blue(`DEPLOYED BOT SUCCESSFULLY`)}\n`, "Rebel");

		} catch (error) {
			logger.loader(`can't load environment variable, error: ${error}`, 'error');
		}
	})();

	// Display operator/admin/approved info
	const operator = global.config.OPERATOR?.length || 0;
	const admin = global.config.ADMINBOT?.length || 0;
	const approved = global.config.APPROVED?.length || 0;

	console.log(`${crayon(``)}${sky(`data -`)} bot name : ${chalk.blueBright(global.config.BOTNAME || "Rebel")}`);
	console.log(`${sky(`Rebel -`)} bot id : ${chalk.blueBright(api.getCurrentUserID())}`);
	console.log(`${sky(`Rebel -`)} bot prefix : ${chalk.blueBright(global.config.PREFIX)}`);
	console.log(`${sky(`Rebel -`)} deployed ${chalk.blueBright(operator)} bot operators and ${chalk.blueBright(admin)} admins`);
	console.log(`${sky(`Rebel -`)} deployed ${chalk.blueBright(approved)} approved groups`);

	// Load command and event handlers
	const handleCommand = require("./handle/handleCommand.js")({ api, Users, Threads, Currencies, models });
	const handleCommandEvent = require("./handle/handleCommandEvent.js")({ api, Users, Threads, Currencies, models });
	const handleReply = require("./handle/handleReply.js")({ api, Users, Threads, Currencies, models });
	const handleReaction = require("./handle/handleReaction.js")({ api, Users, Threads, Currencies, models });
	const handleEvent = require("./handle/handleEvent.js")({ api, Users, Threads, Currencies, models });
	const handleCreateDatabase = require("./handle/handleCreateDatabase.js")({ api, Threads, Users, Currencies, models });

	// Return event handler
	return (event) => {
		switch (event.type) {
			case "message":
			case "message_reply":
			case "message_unsend":
				handleCreateDatabase({ event });
				handleCommand({ event });
				handleReply({ event });
				handleCommandEvent({ event });
				break;
			case "change_thread_image":
				break;
			case "event":
				handleEvent({ event });
				break;
			case "message_reaction":
				handleReaction({ event });
				break;
			default:
				break;
		}
	};
};