const fs = require("fs-extra");
const request = require("request");

module.exports.config = {
  name: "group",
  version: "2.0.0",
  permission: 0,
  credits: "REBEL A4IF Edit",
  description: "Manage group settings easily (name, emoji, image, info, admin)",
  prefix: false,
  category: "group",
  usages: "/group name/emoji/image/admin/info",
  cooldowns: 5
};

module.exports.run = async ({ api, event, args }) => {
  const { threadID, messageID, messageReply, senderID } = event;

  if (!args[0]) {
    return api.sendMessage(
      `Group Manager Commands:\n\n➤ /groupname [new name]\n➤ /groupemoji [emoji]\n➤ /groupimage [reply with an image]\n➤ /groupadmin [tag user or reply user]\n➤ /groupinfo\n`,
      threadID, messageID
    );
  }

  const threadInfo = await api.getThreadInfo(threadID);
  const botID = api.getCurrentUserID();
  const botAdmin = threadInfo.adminIDs.some(e => e.id == botID);
  const userAdmin = threadInfo.adminIDs.some(e => e.id == senderID);

  if (!botAdmin) return api.sendMessage("⚠️ Bot must be admin to use this command!", threadID, messageID);

  const action = args[0].toLowerCase();

  switch (action) {
    case "name":
      {
        const newName = args.slice(1).join(" ") || (messageReply ? messageReply.body : null);
        if (!newName) return api.sendMessage("❌ Please provide a new group name!", threadID, messageID);

        await api.setTitle(newName, threadID);
        return api.sendMessage(`✅ Group name changed to: ${newName}`, threadID, messageID);
      }

    case "emoji":
      {
        const emoji = args[1] || (messageReply ? messageReply.body : null);
        if (!emoji) return api.sendMessage("❌ Please provide an emoji!", threadID, messageID);

        await api.changeThreadEmoji(emoji, threadID);
        return api.sendMessage(`✅ Group emoji changed to: ${emoji}`, threadID, messageID);
      }

    case "image":
      {
        if (event.type !== "message_reply" || !messageReply.attachments || messageReply.attachments.length == 0)
          return api.sendMessage("❌ Please reply to an image to set as group picture.", threadID, messageID);

        const attachment = messageReply.attachments[0];
        if (attachment.type !== "photo")
          return api.sendMessage("❌ Only image files are allowed!", threadID, messageID);

        const callback = () => {
          api.changeGroupImage(fs.createReadStream(__dirname + "/cache/group.png"), threadID, () => {
            fs.unlinkSync(__dirname + "/cache/group.png");
            api.sendMessage("✅ Group picture updated!", threadID, messageID);
          });
        };

        request(encodeURI(attachment.url)).pipe(fs.createWriteStream(__dirname + "/cache/group.png")).on("close", callback);
        break;
      }

    case "admin":
      {
        if (!userAdmin) return api.sendMessage("⚠️ Only group admins can promote or demote admins.", threadID, messageID);

        let targetID;
        if (Object.keys(event.mentions).length) {
          targetID = Object.keys(event.mentions)[0];
        } else if (messageReply) {
          targetID = messageReply.senderID;
        } else if (args[1]) {
          targetID = args[1];
        } else {
          return api.sendMessage("❌ Please tag, reply or provide ID of the user.", threadID, messageID);
        }

        const isTargetAdmin = threadInfo.adminIDs.some(e => e.id == targetID);

        if (isTargetAdmin) {
          await api.changeAdminStatus(threadID, targetID, false);
          return api.sendMessage("✅ Demoted from admin successfully.", threadID, messageID);
        } else {
          await api.changeAdminStatus(threadID, targetID, true);
          return api.sendMessage("✅ Promoted to admin successfully.", threadID, messageID);
        }
      }

    case "info":
      {
        const totalMembers = threadInfo.participantIDs.length;
        const totalAdmins = threadInfo.adminIDs.length;
        const emoji = threadInfo.emoji || "❔";
        const approvalMode = threadInfo.approvalMode ? "ON ✅" : "OFF ❎";
        const threadName = threadInfo.threadName || "Unnamed Group";
        const totalMsgs = threadInfo.messageCount;
        let adminList = "";

        for (const admin of threadInfo.adminIDs) {
          const user = (await api.getUserInfo(admin.id))[admin.id];
          adminList += `• ${user.name}\n`;
        }

        const info = `📋 Group Info:\n\n➤ Name: ${threadName}\n➤ ID: ${threadID}\n➤ Emoji: ${emoji}\n➤ Approval Mode: ${approvalMode}\n➤ Members: ${totalMembers}\n➤ Admins (${totalAdmins}):\n${adminList}\n➤ Total Messages: ${totalMsgs}`;

        if (threadInfo.imageSrc) {
          const callback = () => api.sendMessage(
            { body: info, attachment: fs.createReadStream(__dirname + "/cache/avt.png") },
            threadID, () => fs.unlinkSync(__dirname + "/cache/avt.png"), messageID
          );

          return request(encodeURI(threadInfo.imageSrc)).pipe(fs.createWriteStream(__dirname + "/cache/avt.png")).on("close", callback);
        } else {
          return api.sendMessage(info, threadID, messageID);
        }
      }

    default:
      return api.sendMessage("❌ Invalid option. Please use: name / emoji / image / admin / info.", threadID, messageID);
  }
};
