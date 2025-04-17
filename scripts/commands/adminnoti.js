const fs = require('fs');
const axios = require('axios');

module.exports.config = {
    name: "adminnoti",
    version: "1.0.1",
    permission: 2,
    credits: "fixed by rebel a4if",
    description: "Send notification from admin to all threads",
    prefix: true,
    category: "admin",
    usages: "[msg]",
    cooldowns: 5,
};

let atmDir = [];

async function getAtm(attachments, body) {
    let msg = { body };
    let files = [];
    for (const atm of attachments) {
        try {
            const res = await axios.get(atm.url, { responseType: 'stream' });
            const ext = atm.type.split('/')[1] || 'jpg';
            const path = __dirname + `/cache/${atm.filename || Date.now()}.${ext}`;
            const writer = fs.createWriteStream(path);
            res.data.pipe(writer);
            await new Promise(resolve => writer.on('finish', resolve));
            files.push(fs.createReadStream(path));
            atmDir.push(path);
        } catch (err) {
            console.error('Download error:', err);
        }
    }
    if (files.length > 0) msg.attachment = files;
    return msg;
}

module.exports.handleReply = async function({ api, event, handleReply, Users, Threads }) {
    const moment = require("moment-timezone");
    const gio = moment.tz("Asia/Dhaka").format("DD/MM/YYYY - HH:mm:ss");
    const { threadID, messageID, senderID, body, attachments } = event;
    const name = await Users.getNameUser(senderID);

    switch (handleReply.type) {
        case "sendnoti": {
            let text = `${name} replied to your announcement\n\nTime: ${gio}\nReply: ${body}\n\nFrom group: ${(await Threads.getInfo(threadID)).threadName || "Unknown"}`;
            let msg = { body: text };
            if (attachments.length > 0) msg = await getAtm(attachments, text);

            api.sendMessage(msg, handleReply.threadID, (err, info) => {
                atmDir.forEach(file => fs.unlinkSync(file));
                atmDir = [];
                global.client.handleReply.push({
                    name: this.config.name,
                    type: "reply",
                    messageID: info.messageID,
                    messID: messageID,
                    threadID
                });
            });
            break;
        }

        case "reply": {
            let text = `Admin ${name} replied to you\n\nReply: ${body}\n\nReply to this message if you want to respond again.`;
            let msg = { body: text };
            if (attachments.length > 0) msg = await getAtm(attachments, text);

            api.sendMessage(msg, handleReply.threadID, (err, info) => {
                atmDir.forEach(file => fs.unlinkSync(file));
                atmDir = [];
                global.client.handleReply.push({
                    name: this.config.name,
                    type: "sendnoti",
                    messageID: info.messageID,
                    threadID
                });
            }, handleReply.messID);
            break;
        }
    }
};

module.exports.run = async function({ api, event, args, Users }) {
    const moment = require("moment-timezone");
    const gio = moment.tz("Asia/Manila").format("DD/MM/YYYY - HH:mm:ss");
    const { threadID, messageID, senderID, messageReply } = event;
    if (!args[0]) return api.sendMessage("Please input message.", threadID);

    const allThread = global.data.allThreadID || [];
    let canSend = 0, cannotSend = 0;
    const senderName = await Users.getNameUser(senderID);

    let text = `Message from Admin\n\nTime: ${gio}\nAdmin: ${senderName}\nMessage: ${args.join(" ")}\n\nReply to this message if you want to respond.`;
    let msg = { body: text };
    if (event.type === "message_reply" && messageReply.attachments.length > 0) {
        msg = await getAtm(messageReply.attachments, text);
    }

    for (const id of allThread) {
        try {
            await api.sendMessage(msg, id, (err, info) => {
                if (err) cannotSend++;
                else {
                    canSend++;
                    global.client.handleReply.push({
                        name: this.config.name,
                        type: "sendnoti",
                        messageID: info.messageID,
                        messID: messageID,
                        threadID: id
                    });
                }
            });
        } catch (err) {
            console.error(err);
            cannotSend++;
        }
    }

    atmDir.forEach(file => fs.unlinkSync(file));
    atmDir = [];

    api.sendMessage(`Sent to ${canSend} thread(s), failed to send to ${cannotSend} thread(s).`, threadID);
};
