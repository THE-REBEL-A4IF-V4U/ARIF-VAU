const fs = require('fs');
const axios = require('axios');
const path = require('path');

const adminUID = ["100006473882758", "100000564972717", "100009551241662"]; // Tumar new UID gula add kore disi

module.exports.config = {
  name: "adminnoti",
  version: "3.1.0",
  permission: 2,
  credits: "Rebel A4IF Special (Fixed by ChatGPT)",
  description: "Send admin notification to groups with reply system",
  prefix: true,
  category: "admin",
  usages: "[message]",
  cooldowns: 5,
};

async function downloadAttachment(atm) {
  const ext = atm.type?.split('/')[1] || 'bin';
  const filePath = path.join(__dirname, 'cache', `${atm.filename || Date.now()}.${ext}`);
  const res = await axios.get(atm.url, { responseType: 'stream' });
  const writer = fs.createWriteStream(filePath);
  res.data.pipe(writer);
  await new Promise(resolve => writer.on('finish', resolve));
  return filePath;
}

module.exports.run = async function({ api, event, args, Users }) {
  const { threadID, senderID, messageReply } = event;

  if (!adminUID.includes(senderID)) {
    return api.sendMessage("⛔ You are not authorized to use this command.", threadID);
  }

  if (!args[0] && (!messageReply || !messageReply.attachments || messageReply.attachments.length === 0)) {
    return api.sendMessage("⚠️ Provide a text or reply to an attachment to send.", threadID);
  }

  // --- fetch all group threads ---
  const allThreads = (await api.getThreadList(100, null, ["INBOX"]))
    .filter(thread => thread.isGroup && thread.name)
    .map(thread => thread.threadID)
    .filter(id => id != threadID);

  const senderName = await Users.getNameUser(senderID);

  const bodyText = args.length > 0
    ? `🛡️ Admin Notification 🛡️\nFrom: ${senderName}\n\nMessage:\n${args.join(' ')}`
    : `🛡️ Admin Notification 🛡️\nFrom: ${senderName}\n\n[Attachment]`;

  let attachments = [];
  let filePaths = [];

  if (messageReply && messageReply.attachments && messageReply.attachments.length > 0) {
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

  let success = 0, failed = 0;
  global.replyAdminNoti = global.replyAdminNoti || {};

  for (const id of allThreads) {
    try {
      const sent = await api.sendMessage({ body: bodyText, attachment: attachments.length > 0 ? attachments : undefined }, id);
      if (sent && sent.messageID) {
        global.replyAdminNoti[sent.messageID] = { groupID: id, adminSend: true };
      }
      success++;
      await new Promise(res => setTimeout(res, 400)); // Little delay to prevent spam block
    } catch (err) {
      console.error(`Failed to send to ${id}:`, err.message || err);
      failed++;
    }
  }

  // Clean cache
  for (const file of filePaths) {
    try { fs.unlinkSync(file); } catch (e) {}
  }

  api.sendMessage(`✅ Notification Finished!\n\nSuccess: ${success} group(s)\nFailed: ${failed} group(s)`, threadID);
};

module.exports.handleEvent = async function({ api, event, Users, Threads }) {
  const { threadID, senderID, messageReply, body } = event;
  if (!global.replyAdminNoti) return;

  if (messageReply && global.replyAdminNoti[messageReply.messageID]) {
    const infoReply = global.replyAdminNoti[messageReply.messageID];
    const isAdminSent = infoReply.adminSend;
    const threadInfo = await Threads.getInfo(threadID);
    const userName = await Users.getNameUser(senderID);

    if (isAdminSent) {
      // Reply from group to Admin
      for (const adminID of adminUID) {
        const forwardMsg = `
✉️ New Reply to Admin Notification:

👥 Group: ${threadInfo.threadName || "Unnamed Group"}
👤 From: ${userName}
📝 Message: ${body || "[Attachment]"}`;

        let attachments = [];
        if (event.attachments && event.attachments.length > 0) {
          try {
            const res = await axios.get(event.attachments[0].url, { responseType: 'stream' });
            attachments.push(res.data);
          } catch (e) {
            console.error('Attachment fetch failed:', e.message || e);
          }
        }

        await api.sendMessage({ body: forwardMsg, attachment: attachments.length > 0 ? attachments : undefined }, adminID);
      }

      global.replyAdminNoti[messageReply.messageID] = {
        groupID: threadID,
        userID: senderID,
        adminSend: false,
      };

    } else {
      // Reply from Admin back to Group User
      const groupID = infoReply.groupID;

      const sendBody = `🛡️ Admin replied:\n\n${body || "[Attachment]"}`;

      let attachments = [];
      if (event.attachments && event.attachments.length > 0) {
        try {
          const res = await axios.get(event.attachments[0].url, { responseType: 'stream' });
          attachments.push(res.data);
        } catch (e) {
          console.error('Attachment fetch failed:', e.message || e);
        }
      }

      await api.sendMessage({ body: sendBody, attachment: attachments.length > 0 ? attachments : undefined }, groupID);
      console.log(`✅ Admin reply delivered to group.`);
    }
  }
};
