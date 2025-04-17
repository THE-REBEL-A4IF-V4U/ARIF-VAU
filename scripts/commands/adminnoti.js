const fs = require('fs');
const axios = require('axios');
const path = require('path');

// Your Admin UIDs
const adminUID = [
  "100006473882758",
  "100000564972717",
  "100009551241662"
];

module.exports.config = {
  name: "adminnoti",
  version: "3.1.0",
  permission: 2,
  credits: "Rebel A4IF Special",
  description: "Send admin notification to groups with reply system",
  prefix: true,
  category: "admin",
  usages: "[message]",
  cooldowns: 3,
};

// Download attachment to local cache
async function downloadAttachment(atm) {
  try {
    const ext = atm.type?.split('/')[1] || 'bin';
    const filePath = path.join(__dirname, 'cache', `${atm.filename || Date.now()}.${ext}`);
    const res = await axios.get(atm.url, { responseType: 'stream' });
    const writer = fs.createWriteStream(filePath);
    res.data.pipe(writer);
    await new Promise(resolve => writer.on('finish', resolve));
    return filePath;
  } catch (err) {
    console.error('Attachment download failed:', err);
    return null;
  }
}

module.exports.run = async function({ api, event, args, Users, Threads }) {
  const { threadID, senderID, messageReply } = event;

  if (!adminUID.includes(senderID)) {
    return api.sendMessage("⛔ You are not authorized to use this command.", threadID);
  }

  if (!args[0] && (!messageReply || !messageReply.attachments || messageReply.attachments.length === 0)) {
    return api.sendMessage("⚠️ Provide a text or reply to an attachment to send.", threadID);
  }

  const allThreads = global.data.allThreadID || [];
  const activeThreads = allThreads.filter(id => id != threadID);

  const senderName = await Users.getNameUser(senderID);

  const bodyText = args.length > 0
    ? `🛡️ Admin Notification 🛡️\nFrom: ${senderName}\n\nMessage:\n${args.join(' ')}`
    : `🛡️ Admin Notification 🛡️\nFrom: ${senderName}\n\n[Attachment]`;

  const attachments = [];
  const filePaths = [];

  if (messageReply?.attachments?.length > 0) {
    for (const atm of messageReply.attachments) {
      const filePath = await downloadAttachment(atm);
      if (filePath) {
        attachments.push(fs.createReadStream(filePath));
        filePaths.push(filePath);
      }
    }
  }

  const msg = { body: bodyText };
  if (attachments.length > 0) msg.attachment = attachments;

  let success = 0, failed = 0;
  global.replyAdminNoti = global.replyAdminNoti || {};

  for (const id of activeThreads) {
    try {
      const info = await api.sendMessage(msg, id);
      if (info?.messageID) {
        global.replyAdminNoti[info.messageID] = { groupID: id, adminSend: true };
      }
      success++;
      await new Promise(r => setTimeout(r, 300)); // Small delay to avoid spam block
    } catch (err) {
      console.error(`Failed to send to ${id}:`, err);
      failed++;
    }
  }

  // Delete cache files
  for (const file of filePaths) {
    try { fs.unlinkSync(file); } catch (e) { }
  }

  api.sendMessage(`✅ Notification Completed!\n\nSuccess: ${success}\nFailed: ${failed}`, threadID);
};

module.exports.handleEvent = async function({ api, event, Users, Threads }) {
  const { threadID, senderID, messageReply, body } = event;
  if (!global.replyAdminNoti || !messageReply) return;

  const infoReply = global.replyAdminNoti[messageReply.messageID];
  if (!infoReply) return;

  const isAdminSent = infoReply.adminSend;
  const threadInfo = await Threads.getInfo(threadID);
  const userName = await Users.getNameUser(senderID);

  if (isAdminSent) {
    // Reply from Group to Admin
    for (const adminID of adminUID) {
      const forwardMsg = `
✉️ New Reply to Admin Notification:

👥 Group: ${threadInfo.threadName || "Unnamed Group"}
👤 From: ${userName}
📝 Message: ${body || "[Attachment]"}`;

      const attachments = [];
      if (event.attachments?.length > 0) {
        try {
          const res = await axios.get(event.attachments[0].url, { responseType: 'stream' });
          attachments.push(res.data);
        } catch (e) {
          console.error('Attachment fetch failed:', e);
        }
      }

      await api.sendMessage({ body: forwardMsg, attachment: attachments }, adminID);
    }
    global.replyAdminNoti[messageReply.messageID] = {
      groupID: threadID,
      userID: senderID,
      adminSend: false
    };
  } else {
    // Reply from Admin to Group
    const groupID = infoReply.groupID;
    const sendBody = `🛡️ Admin replied:\n\n${body || "[Attachment]"}`;

    const attachments = [];
    if (event.attachments?.length > 0) {
      try {
        const res = await axios.get(event.attachments[0].url, { responseType: 'stream' });
        attachments.push(res.data);
      } catch (e) {
        console.error('Attachment fetch failed:', e);
      }
    }

    await api.sendMessage({ body: sendBody, attachment: attachments }, groupID);
    console.log(`✅ Admin reply delivered.`);
  }
};
