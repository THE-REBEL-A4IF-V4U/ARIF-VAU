const fs = require('fs');
const axios = require('axios');
const path = require('path');

const adminUID = ["100006473882758"]; // <== Ei list e admin ID gulo rakhba

module.exports.config = {
    name: "adminnoti",
    version: "3.0.0",
    permission: 2,
    credits: "Rebel A4IF Special",
    description: "Send admin notification to groups with full reply system",
    prefix: true,
    category: "admin",
    usages: "[message]",
    cooldowns: 5,
};

async function downloadAttachment(atm) {
    const ext = atm.type.split('/')[1] || 'bin';
    const filePath = path.join(__dirname, 'cache', `${atm.filename || Date.now()}.${ext}`);
    const res = await axios.get(atm.url, { responseType: 'stream' });
    const writer = fs.createWriteStream(filePath);
    res.data.pipe(writer);
    await new Promise(resolve => writer.on('finish', resolve));
    return filePath;
}

module.exports.run = async function({ api, event, args, Users, Threads }) {
    const { threadID, senderID, messageReply, type } = event;

    if (!adminUID.includes(senderID)) 
        return api.sendMessage("⛔ You are not authorized to use this command.", threadID);

    if (!args[0] && (!messageReply || messageReply.attachments.length === 0)) {
        return api.sendMessage("⚠️ Provide a text or reply to an attachment to send.", threadID);
    }

    const allThreads = global.data.allThreadID || [];
    let activeThreads = allThreads.filter(id => id != threadID);

    const senderName = await Users.getNameUser(senderID);

    const bodyText = args.length > 0 
        ? `🛡️ Admin Notification 🛡️\nFrom: ${senderName}\n\nMessage:\n${args.join(' ')}`
        : `🛡️ Admin Notification 🛡️\nFrom: ${senderName}\n\n[Attachment]`;

    let attachments = [];
    let filePaths = [];

    if (messageReply && messageReply.attachments.length > 0) {
        for (const atm of messageReply.attachments) {
            try {
                const filePath = await downloadAttachment(atm);
                attachments.push(fs.createReadStream(filePath));
                filePaths.push(filePath);
            } catch (err) {
                console.error('Attachment download failed:', err);
            }
        }
    }

    const msg = { body: bodyText };
    if (attachments.length > 0) msg.attachment = attachments;

    let success = 0, failed = 0;
    for (const id of activeThreads) {
        try {
            await api.sendMessage(msg, id, (err, info) => {
                if (!err) {
                    global.replyAdminNoti = global.replyAdminNoti || {};
                    global.replyAdminNoti[info.messageID] = { groupID: id, adminSend: true };
                }
            });
            success++;
            await new Promise(res => setTimeout(res, 500)); // half second delay
        } catch (err) {
            console.error(`Failed to send to ${id}:`, err);
            failed++;
        }
    }

    // Clean cache
    for (const file of filePaths) {
        try { fs.unlinkSync(file); } catch (e) {}
    }

    api.sendMessage(`✅ Notification Finished!\nSuccess: ${success} group(s)\nFailed: ${failed} group(s)`, threadID);
};

// Global message listener
module.exports.handleEvent = async function({ api, event, Users, Threads }) {
    const { threadID, senderID, messageReply, body, type } = event;
    if (!global.replyAdminNoti) return;

    if (messageReply && global.replyAdminNoti[messageReply.messageID]) {
        const isAdminSent = global.replyAdminNoti[messageReply.messageID].adminSend;
        const threadInfo = await Threads.getInfo(threadID);
        const userName = await Users.getNameUser(senderID);

        if (isAdminSent) {
            // Reply from group to Admin
            for (const adminID of adminUID) {
                const forwardMsg = 
`✉️ New Reply to Admin Notification:

👥 Group: ${threadInfo.threadName || "Unnamed Group"}
👤 From: ${userName}
📝 Message: ${body || "[Attachment]"}`;

                let attachments = [];

                if (type !== 'message' && event.attachments.length > 0) {
                    try {
                        const fileURL = event.attachments[0].url;
                        const res = await axios.get(fileURL, { responseType: 'stream' });
                        attachments.push(res.data);
                    } catch (e) { console.error(e); }
                }

                api.sendMessage({ body: forwardMsg, attachment: attachments }, adminID, (err, info) => {
                    if (!err) {
                        global.replyAdminNoti[info.messageID] = {
                            groupID: threadID,
                            userID: senderID,
                            adminSend: false
                        };
                    }
                });
            }
        } else {
            // Reply from Admin back to User
            const { groupID } = global.replyAdminNoti[messageReply.messageID];

            const sendBody = `🛡️ Admin replied to you:\n\n${body || "[Attachment]"}`;
            
            let attachments = [];

            if (event.attachments.length > 0) {
                try {
                    const fileURL = event.attachments[0].url;
                    const res = await axios.get(fileURL, { responseType: 'stream' });
                    attachments.push(res.data);
                } catch (e) { console.error(e); }
            }

            api.sendMessage({ body: sendBody, attachment: attachments }, groupID, (err) => {
                if (!err) {
                    console.log(`✅ Admin reply delivered.`);
                }
            });
        }
    }
};
