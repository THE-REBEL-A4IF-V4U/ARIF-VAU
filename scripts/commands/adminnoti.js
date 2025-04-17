const fs = require('fs');
const axios = require('axios');
const path = require('path');

module.exports.config = {
    name: "adminnoti",
    version: "2.0.3",
    permission: 2,
    credits: "Rebel A4IF Fixed Improved",
    description: "Send admin notification to all groups (text or attachment supported)",
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

module.exports.run = async function({ api, event, args, Users }) {
    const { threadID, senderID, messageReply } = event;
    if (!args[0] && (!messageReply || messageReply.attachments.length === 0)) {
        return api.sendMessage("❌ Please provide a message or reply to an attachment.", threadID);
    }

    const allThread = global.data.allThreadID || [];
    let success = 0, failed = 0;
    const senderName = await Users.getNameUser(senderID);

    const bodyText = args.length > 0 
        ? `📢 Admin Notification\n\n👤 From: ${senderName}\n\n📝 Message: ${args.join(' ')}`
        : `📢 Admin Notification\n\n👤 From: ${senderName}\n\n📎 [Attachment]`;

    let attachments = [];
    let filePaths = [];

    // If user replied to attachment
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
    if (attachments.length > 0) {
        msg.attachment = attachments;
    }

    // Send to all groups
    for (const id of allThread) {
        try {
            await api.sendMessage(msg, id);
            success++;
            await new Promise(res => setTimeout(res, 1000)); // 1 second delay
        } catch (err) {
            failed++;
            console.error(`Failed to send to ${id}:`, err);
        }
    }

    // Cleanup cache
    for (const file of filePaths) {
        try { fs.unlinkSync(file); } catch (e) {}
    }

    return api.sendMessage(`✅ Notification Sent!\n\nSuccess: ${success} group(s)\nFailed: ${failed} group(s)`, threadID);
};
