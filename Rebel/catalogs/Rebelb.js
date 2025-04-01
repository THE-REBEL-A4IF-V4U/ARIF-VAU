class Box { constructor(api, event) { this.api = api; this.event = event; this.lastID = null; }

reply(message, threadID = this.event.threadID, callback) { return new Promise((resolve) => { this.api.sendMessage(message, threadID, async (err, response) => { if (callback && typeof callback === "function") { await callback(err, response); } this.lastID = response?.messageID; resolve(response); }); }); }

sendContact(contact, threadID = this.event.threadID, callback) { return new Promise((resolve) => { this.api.send(contact, threadID, async (err, response) => { if (callback && typeof callback === "function") { await callback(err, response); } this.lastID = response?.messageID; resolve(response); }); }); }

send(message, threadID = this.event.threadID, callback) { return new Promise((resolve) => { this.api.sendMessage(message, threadID, async (err, response) => { if (callback && typeof callback === "function") { await callback(err, response); } this.lastID = response?.messageID; resolve(response); }); }); }

react(reaction, messageID = this.event.messageID, callback) { return new Promise((resolve) => { this.api.setMessageReaction(reaction, messageID, async (err, response) => { if (callback && typeof callback === "function") { await callback(err, response); } resolve(true); }, true); }); }

edit(newMessage, messageID = this.lastID, callback) { return new Promise((resolve) => { this.api.editMessage(newMessage, messageID, async (err, response) => { if (callback && typeof callback === "function") { await callback(err, response); } resolve(true); }); }); } }

module.exports = Box;

