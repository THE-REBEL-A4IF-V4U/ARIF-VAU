const axios = require("axios");
const fs = require("fs-extra");

module.exports.config = {
  name: "group",
  version: "1.1.0",
  permission: 2,
  credits: "Rebel",
  description: "Manage group settings and admin tasks",
  prefix: true,
  category: "admin",
  usages: "[groupname | groupemoji | groupimage | gcadmin | groupinfo | ban | unban | search | gleave] [args]",
  cooldowns: 5
};

module.exports.handleReaction = async ({ event, api, Threads, handleReaction }) => {
  if (parseInt(event.userID) !== parseInt(handleReaction.author)) return;
  const { type, target } = handleReaction;
  const threadData = await Threads.getData(target);
  const data = threadData.data || {};

  switch (type) {
    case "ban":
      data.banned = 1;
      global.data.threadBanned.set(parseInt(target), 1);
      break;
    case "unban":
      data.banned = 0;
      global.data.threadBanned.delete(parseInt(target));
      break;
  }

  await Threads.setData(target, { data });
  api.sendMessage(`Group ${type}ned: ${target}`, event.threadID, () => api.unsendMessage(handleReaction.messageID));
};

module.exports.run = async ({ event, api, args, Threads }) => {
  const { threadID, messageID, senderID, mentions, messageReply } = event;
  const sub = args[0];
  const content = args.slice(1).join(" ");

  switch (sub) {
    case "groupname": {
      if (!content) return api.sendMessage("Please provide a name.", threadID);
      api.setTitle(content, threadID, (err) => {
        if (err) return api.sendMessage("Failed to change name.", threadID);
        api.sendMessage(`Changed group name to: ${content}`, threadID);
      });
      break;
    }

    case "groupemoji": {
      if (!content) return api.sendMessage("Please provide an emoji.", threadID);
      api.changeThreadEmoji(content, threadID, (err) => {
        if (err) return api.sendMessage("Failed to set emoji.", threadID);
        api.sendMessage(`Changed emoji to: ${content}`, threadID);
      });
      break;
    }

    case "groupimage": {
      if (!messageReply || !messageReply.attachments[0] || messageReply.attachments[0].type !== 'photo') {
        return api.sendMessage("Please reply to an image.", threadID);
      }
      const imgURL = messageReply.attachments[0].url;
      const filePath = __dirname + `/cache/${threadID}_groupimage.jpg`;
      const res = await axios.get(imgURL, { responseType: 'arraybuffer' });
      fs.writeFileSync(filePath, Buffer.from(res.data, "utf-8"));
      api.changeGroupImage(fs.createReadStream(filePath), threadID, () => {
        fs.unlinkSync(filePath);
        api.sendMessage("Group image updated!", threadID);
      });
      break;
    }

    case "gcadmin": {
      const id = Object.keys(mentions)[0];
      if (!id) return api.sendMessage("Please tag a user.", threadID);
      api.changeAdminStatus(threadID, id, true, (err) => {
        if (err) return api.sendMessage("Failed to promote to admin.", threadID);
        api.sendMessage(`Promoted ${mentions[id].replace("@", "")} to admin.`, threadID);
      });
      break;
    }

    case "groupinfo": {
      const threadInfo = await api.getThreadInfo(threadID);
      const name = threadInfo.threadName || "Unnamed";
      const emoji = threadInfo.emoji || "None";
      const memberCount = threadInfo.participantIDs.length;
      const adminCount = threadInfo.adminIDs.length;
      const approval = threadInfo.approvalMode ? "Enabled" : "Disabled";
      const msgCount = threadInfo.messageCount || "Unknown";

      return api.sendMessage(
        `Group Info:\n\nName: ${name}\nEmoji: ${emoji}\nMembers: ${memberCount}\nAdmins: ${adminCount}\nApproval Mode: ${approval}\nTotal Messages: ${msgCount}`,
        threadID
      );
    }

    case "ban":
    case "unban": {
      if (!args[1]) return api.sendMessage("Please provide group ID.", threadID);
      const id = parseInt(args[1]);
      const thread = await Threads.getData(id);
      if (!thread || !thread.threadID) return api.sendMessage("Thread not found.", threadID);
      const data = thread.data || {};
      if (sub === "ban" && data.banned) return api.sendMessage("Already banned.", threadID);
      if (sub === "unban" && !data.banned) return api.sendMessage("Not banned yet.", threadID);

      api.sendMessage(`React to confirm ${sub}ning group: ${id}`, threadID, (err, info) => {
        global.client.handleReaction.push({
          name: this.config.name,
          messageID: info.messageID,
          author: senderID,
          type: sub,
          target: id
        });
      });
      break;
    }

    case "search": {
      const keyword = content.toLowerCase();
      const all = await Threads.getAll(['threadID', 'name']);
      const match = all.filter(i => i.name?.toLowerCase().includes(keyword));
      if (!match.length) return api.sendMessage("No matches found.", threadID);
      const msg = match.map((i, idx) => `${idx + 1}. ${i.name} - ${i.threadID}`).join("\n");
      return api.sendMessage(`Matched Groups:\n${msg}`, threadID);
    }

    case "gleave": {
      if (!args[1]) return api.sendMessage("Please provide a group ID to leave.", threadID);
      const gid = parseInt(args[1]);
      if (isNaN(gid)) return api.sendMessage("Invalid group ID.", threadID);
      try {
        await api.removeUserFromGroup(api.getCurrentUserID(), gid);
        return api.sendMessage(`Bot has left group ID: ${gid}`, threadID);
      } catch (e) {
        return api.sendMessage("Failed to leave group. Make sure the bot is in the group and has permission.", threadID);
      }
    }

    default:
      return api.sendMessage("Unknown subcommand. Please use a valid one.", threadID);
  }
};
