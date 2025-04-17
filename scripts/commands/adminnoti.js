const fs = require('fs');
const path = require('path');
const axios = require('axios');

module.exports.config = {
    name: "adminnoti",
    version: "2.0.0",
    permission: 2,
    credits: "Upgraded by Rebel A4IF",
    description: "Send admin notification (text + media) to all groups with progress and retry",
    prefix: true,
    category: "admin",
    usages: "[message]",
    cooldowns: 5,
};

let atmPaths = [];

async function downloadAttachments(attachments) {
    let files = [];
    for (const atm of attachments) {
        try {
            const res = await axios.get(atm.url, { responseType: 'stream' });
            const contentLength = parseInt(res.headers['content-length'] || '0');
            
            if (contentLength > 25 * 1024 * 1024) { // 25MB limit
                console.log(`Skipped large file (${(contentLength/1024/1024).toFixed(2)} MB)`);
                continue;
            }

            const ext = atm.type.split('/')[1] || 'bin';
            const fileName = `${Date.now()}_${Math.floor(Math.random() * 9999)}.${ext}`;
            const filePath = path.join(__dirname, 'cache', fileName);
            const writer = fs.createWriteStream(filePath);
            res.data.pipe(writer);

            await new Promise(resolve => writer.on('finish', resolve));
            files.push(fs.createReadStream(filePath));
            atmPaths.push(filePath);
        } catch (err) {
            console.error('Attachment download error:', err);
        }
    }
    return files;
}

function cleanupFiles() {
    for (const filePath of atmPaths) {
        if (fs.existsSync(filePath)) {
            fs.unlinkSync(filePath);
        }
    }
    atmPaths = [];
}

async function sendWithRetry(api, msgData, id, retries = 2) {
    for (let attempt = 1; attempt <= retries; attempt++) {
        try {
            return await new Promise((resolve, reject) => {
                api.sendMessage(msgData, id, (err, info) => {
                    if (err) return reject(err);
                    resolve(info);
                });
            });
        } catch (err) {
            console.error(`Attempt ${attempt} failed for thread ${id}:`, err);
            if (attempt == retries) throw err;
            await new Promise(res => setTimeout(res, 500));
        }
    }
}

module.exports.handleReply = async ({ api, event, handleReply, Users, Threads }) => {
    const moment = require('moment-timezone');
    const time = moment.tz('Asia/Dhaka').format('DD/MM/YYYY - HH:mm:ss');
    const { threadID, messageID, senderID, body, attachments } = event;
    const senderName = await Users.getNameUser(senderID);

    let replyText = `${senderName} replied to your announcement\n\nTime: ${time}\nReply: ${body}\n\nFrom group: ${(await Threads.getInfo(threadID)).threadName || "Unknown"}`;
    let msgData = { body: replyText };

    if (attachments.length > 0) {
        const files = await downloadAttachments(attachments);
        if (files.length > 0) msgData.attachment = files;
    }

    api.sendMessage(msgData, handleReply.threadID, (err, info) => {
        cleanupFiles();
        if (!err) {
            global.client.handleReply.push({
                name: module.exports.config.name,
                type: "reply",
                messageID: info.messageID,
                messID: messageID,
                threadID: threadID
            });
        }
    });
};

module.exports.run = async ({ api, event, args, Users }) => {
    const moment = require('moment-timezone');
    const time = moment.tz('Asia/Dhaka').format('DD/MM/YYYY - HH:mm:ss');
    const { threadID, messageID, senderID, messageReply, type } = event;

    if (!args[0] && type !== "message_reply") {
        return api.sendMessage("Please provide a message.", threadID);
    }

    const allThreads = global.data.allThreadID || [];
    let success = 0, failed = 0, total = allThreads.length;
    const senderName = await Users.getNameUser(senderID);

    let contentText = `Message from Admin\n\nTime: ${time}\nAdmin: ${senderName}\nMessage: ${args.join(" ")}\n\nReply to this message if you want to respond.`;
    let msgData = { body: contentText };

    if (type === "message_reply" && messageReply.attachments.length > 0) {
        const files = await downloadAttachments(messageReply.attachments);
        if (files.length > 0) msgData.attachment = files;
    }

    for (let i = 0; i < total; i++) {
        const id = allThreads[i];
        try {
            await sendWithRetry(api, msgData, id);
            success++;
        } catch (err) {
            failed++;
        }

        if (i % 5 === 0 || i === total - 1) { // Update progress every 5 sends
            api.sendMessage(`Sending Progress: (${i+1}/${total})\nSuccess: ${success}\nFailed: ${failed}`, threadID);
        }
        
        await new Promise(res => setTimeout(res, 300));
    }

    cleanupFiles();
    api.sendMessage(`Finished sending.\nTotal: ${total}\nSuccess: ${success}\nFailed: ${failed}`, threadID);
};
