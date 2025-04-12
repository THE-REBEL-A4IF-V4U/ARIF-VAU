const axios = require("axios");
const fs = require("fs-extra");

module.exports.config = {
  name: "groupe",
  version: "2.0.0",
  permission: 2,
  credits: "Rebel + ChatGPT Fix",
  description: "Manage group settings and admin tasks",
  prefix: false,
  category: "admin",
  usages: "/groupname | /gcemoji | /gcimage | /gcadmin | /groupinfo | /ban | /unban | /search | /gleave",
  cooldowns: 5,
  aliases: ["groupname", "gcemoji", "gcimage", "gcadmin", "groupinfo", "ban", "unban", "search", "gleave"]
};

module.exports.run = async ({ event, api, args, Threads }) => {
  const { threadID, messageID, senderID, body, mentions, messageReply, type } = event;
  const command = body?.split(" ")[0]?.toLowerCase();
  const content = body?.split(" ").slice(1).join(" ");

  switch (command) {
    case "/groupname": {
      if (!content) return api.sendMessage("Please provide a new group name.", threadID);
      api.setTitle(content, threadID, (err) => {
        if (err) return api.sendMessage("Failed to change group name.", threadID);
        api.sendMessage(`Group name changed to: ${content}`, threadID);
      });
      break;
    }

    case "/gcemoji": {
      if (!content) return api.sendMessage("Please provide an emoji.", threadID);
      api.changeThreadEmoji(content, threadID, (err) => {
        if (err) return api.sendMessage("Failed to change emoji.", threadID);
        api.sendMessage(`Emoji changed to: ${content}`, threadID);
      });
      break;
    }

    case "/gcimage": {
      if (!messageReply || !messageReply.attachments[0] || messageReply.attachments[0].type !== 'photo') {
        return api.sendMessage("Please reply to an image to set as group image.", threadID);
      }
      const imgURL = messageReply.attachments[0].url;
      const path = __dirname + `/cache/${threadID}_image.jpg`;
      const res = await axios.get(imgURL, { responseType: 'arraybuffer' });
      fs.writeFileSync(path, Buffer.from(res.data, "utf-8"));
      api.changeGroupImage(fs.createReadStream(path), threadID, (err) => {
        fs.unlinkSync(path);
        if (err) return api.sendMessage("Failed to change group image.", threadID);
        api.sendMessage("Group image updated!", threadID);
      });
      break;
    }

    case "/gcadmin": {
      const id = Object.keys(mentions)[0];
      if (!id) return api.sendMessage("Please tag someone to promote as admin.", threadID);
      api.changeAdminStatus(threadID, id, true, (err) => {
        if (err) return api.sendMessage("Failed to promote to admin.", threadID);
        api.sendMessage(`Promoted ${mentions[id].replace("@", "")} to admin.`, threadID);
      });
      break;
    }

    case "/groupinfo": {
      const info = await api.getThreadInfo(threadID);
      const name = info.threadName || "Unnamed";
      const emoji = info.emoji || "None";
      const memberCount = info.participantIDs.length;
      const adminCount = info.adminIDs.length;
      const approval = info.approvalMode ? "On" : "Off";
      const messageCount = info.messageCount || "Unknown";

      return api.sendMessage(
        `Group Info:\n\nName: ${name}\nEmoji: ${emoji}\nMembers: ${memberCount}\nAdmins: ${adminCount}\nApproval Mode: ${approval}\nTotal Messages: ${messageCount}`,
        threadID
      );
    }

    case "/ban":
    case "/unban": {
      const gid = parseInt(content);
      if (!gid) return api.sendMessage("Please provide a valid group ID.", threadID);
      const thread = await Threads.getData(gid);
      if (!thread || !thread.threadID) return api.sendMessage("Thread not found.", threadID);
      const data = thread.data || {};
      const alreadyBanned = data.banned === 1;

      if (command === "/ban" && alreadyBanned) return api.sendMessage("Group already banned.", threadID);
      if (command === "/unban" && !alreadyBanned) return api.sendMessage("Group is not banned.", threadID);

      api.sendMessage(`React to confirm ${command.slice(1)} group: ${gid}`, threadID, (err, info) => {
        global.client.handleReaction.push({
          name: this.config.name,
          messageID: info.messageID,
          author: senderID,
          type: command.slice(1),
          target: gid
        });
      });
      break;
    }

    case "/search": {
      const keyword = content.toLowerCase();
      const allThreads = await Threads.getAll(['threadID', 'name']);
      const match = allThreads.filter(t => t.name?.toLowerCase().includes(keyword));
      if (!match.length) return api.sendMessage("No matched groups found.", threadID);
      const msg = match.map((g, i) => `${i + 1}. ${g.name} - ${g.threadID}`).join("\n");
      return api.sendMessage(`Matched Groups:\n${msg}`, threadID);
    }

    case "/gleave": {
      const gid = parseInt(content);
      if (!gid) return api.sendMessage("Please provide a valid group ID to leave.", threadID);
      try {
        await api.removeUserFromGroup(api.getCurrentUserID(), gid);
        return api.sendMessage(`Bot has left the group: ${gid}`, threadID);
      } catch (e) {
        return api.sendMessage("Failed to leave. Maybe not in group or no permission.", threadID);
      }
    }

    default:
      return api.sendMessage("Unknown group command.", threadID);
  }
};
