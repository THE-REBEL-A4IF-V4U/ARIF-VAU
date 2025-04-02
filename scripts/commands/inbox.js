module.exports.config = { name: "inbox", version: "1.0", permission: 2, credits: "Rebel", description: "Send a message to a user's inbox", category: "spam", usages: "inbox", prefix: true, cooldowns: 5, dependencies: "", };

module.exports.run = async function ({ api, event, Users, args }) { var userID = Object.keys(event.mentions)[0] || event.senderID; var userName = await Users.getNameUser(userID);

if (!args[0]) { api.sendMessage(✅ SUCCESSFULLY SENT MESSAGE\n\n🔰 [${userName}] PLEASE CHECK YOUR INBOX OR MESSAGE REQUEST BOX, event.threadID); }

const confirmationMessage = ✅ SUCCESSFULLY ALLOW\n🔰 NOW YOU CAN USE ${global.config.BOTNAME} HERE;

try { api.sendMessage(confirmationMessage, userID); } catch (error) { api.sendMessage("❌ Failed to send message to inbox.", event.threadID); } };

