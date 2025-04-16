const axios = require("axios");
const fs = require("fs");

module.exports.config = {
  name: "adduser",
  version: "3.0.0",
  permission: 1,
  credits: "REBEL A4IF",
  description: "Add users to group via UID or profile link with welcome message, logging & admin tagging",
  prefix: false,
  category: "group",
  usages: "/adduser <uid/link> [welcome message]",
  cooldowns: 5,
  dependencies: {
    "axios": ""
  }
};

module.exports.run = async ({ api, event, args }) => {
  if (args.length === 0) {
    return api.sendMessage("❌ Usage: /adduser <uid or profile link> [optional welcome message]", event.threadID);
  }

  const inputs = args.filter(arg => arg.includes("facebook.com") || /^\d+$/.test(arg));
  const message = args.slice(inputs.length).join(" ") || "Welcome to the group!";
  const threadInfo = await api.getThreadInfo(event.threadID);
  const added = [], failed = [];

  for (const input of inputs) {
    let uid;

    // Step 1: Get UID
    if (/^\d+$/.test(input)) {
      uid = input;
    } else {
      try {
        const res = await axios.get(`https://id.traodoisub.com/api.php?link=${encodeURIComponent(input)}`);
        uid = res.data.id;
        if (!uid) throw new Error("UID not found.");
      } catch (e) {
        failed.push({ input, reason: "❌ Invalid profile link or UID fetch failed." });
        continue;
      }
    }

    // Step 2: Check if already in group
    if (threadInfo.participantIDs.includes(uid)) {
      failed.push({ input: uid, reason: "⚠️ Already in group" });
      continue;
    }

    // Step 3: Try to add
    try {
      await api.addUserToGroup(uid, event.threadID);

      // Get admin list & build mentions
      const admins = threadInfo.adminIDs.map(a => a.id).filter(id => id !== api.getCurrentUserID());
      const adminMentions = admins.map((id, index) => ({
        tag: `@admin${index + 1}`,
        id: id
      }));

      // Send welcome message with admin tagging
      await api.sendMessage({
        body: `✅ Added: @user\n${message}\n\nNotifying admins: ${adminMentions.map(m => m.tag).join(" ")}`,
        mentions: [
          { tag: "@user", id: uid },
          ...adminMentions
        ]
      }, event.threadID);

      // Logging
      fs.appendFileSync("adduser.log", `[${new Date().toISOString()}] ADDED: ${uid} BY: ${event.senderID}\n`);
      added.push(uid);
    } catch (err) {
      console.error("Add failed:", err);
      failed.push({ input: uid, reason: "❌ Invite blocked or user blocked bot" });
    }
  }

  // Final Summary
  const summary = `✅ Added: ${added.length}\n❌ Failed: ${failed.length}\n` +
    failed.map(f => `- ${f.input}: ${f.reason}`).join("\n");
  return api.sendMessage(summary, event.threadID);
};
