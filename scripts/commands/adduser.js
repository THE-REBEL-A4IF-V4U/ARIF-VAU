const axios = require("axios");
const fs = require("fs");

module.exports.config = {
  name: "adduser",
  version: "3.5.0",
  permission: 1,
  credits: "REBEL A4IF Modified by ChatGPT",
  description: "Add users to group via UID, username or link with auto welcome and admin mention",
  prefix: false,
  category: "group",
  usages: "/adduser <uid/username/link> [welcome message]",
  cooldowns: 5,
  dependencies: { "axios": "" }
};

async function getUIDFromInput(input) {
  try {
    const url = `https://id.traodoisub.com/api.php?link=${encodeURIComponent(input)}`;
    const res = await axios.get(url);
    return res.data.id || null;
  } catch {
    return null;
  }
}

module.exports.run = async ({ api, event, args }) => {
  if (args.length === 0)
    return api.sendMessage("❌ Usage: /adduser <uid/username/link> [welcome message]", event.threadID);

  const inputs = args.filter(arg => !arg.startsWith("@") && (arg.includes("facebook.com") || /^[a-zA-Z0-9.]+$/.test(arg)));
  const message = args.slice(inputs.length).join(" ") || "Welcome to the group!";
  const threadInfo = await api.getThreadInfo(event.threadID);
  const added = [], failed = [];

  for (const input of inputs) {
    let uid = /^\d+$/.test(input) ? input : await getUIDFromInput(input);
    if (!uid) {
      failed.push({ input, reason: "❌ UID not found from input." });
      continue;
    }

    if (threadInfo.participantIDs.includes(uid)) {
      failed.push({ input, reason: "⚠️ Already in group" });
      continue;
    }

    try {
      await api.addUserToGroup(uid, event.threadID);

      // Get names
      const userInfo = await api.getUserInfo(uid);
      const username = userInfo[uid]?.name || "Unknown User";

      const admins = threadInfo.adminIDs.map(a => a.id).filter(id => id !== api.getCurrentUserID());
      const adminInfos = await api.getUserInfo(admins);
      const adminMentions = admins.map(id => ({
        tag: `@${adminInfos[id]?.name || "Admin"}`,
        id
      }));

      // Send message
      await api.sendMessage({
        body: `✅ Added: @${username}\n${message}\n\nNotifying admins: ${adminMentions.map(m => m.tag).join(", ")}`,
        mentions: [
          { tag: `@${username}`, id: uid },
          ...adminMentions
        ]
      }, event.threadID);

      fs.appendFileSync("adduser.log", `[${new Date().toISOString()}] ADDED: ${uid} (${username}) BY: ${event.senderID}\n`);
      added.push(`${username} (${uid})`);
    } catch (err) {
      console.error(err);
      failed.push({ input: uid, reason: "❌ Add failed (Blocked or Privacy settings)." });
    }
  }

  const summary = `✅ Added: ${added.length}\n❌ Failed: ${failed.length}\n` +
    failed.map(f => `- ${f.input}: ${f.reason}`).join("\n");
  return api.sendMessage(summary, event.threadID);
};