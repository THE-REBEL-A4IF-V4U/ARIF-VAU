const axios = require("axios");

module.exports.config = {
  name: "adduser",
  version: "1.0.2",
  permssion: 0,
  credits: "Yan Maglinte + Modified by THE REBEL",
  description: "Add user to group by ID or profile link",
  prefix: true,
  category: "group",
  usages: "[uid or profile link]",
  cooldowns: 5
};

module.exports.run = async function ({ api, event, args }) {
  const { threadID, messageID } = event;
  const botID = api.getCurrentUserID();
  const out = msg => api.sendMessage(msg, threadID, messageID);

  if (!args[0]) return out("⚠️ Please provide a UID or Facebook profile link to add.");

  let uid;

  // If it's a numeric UID
  if (!isNaN(args[0])) {
    uid = args[0];
    return addUserToGroup(uid);
  }

  // Otherwise, treat it as a link
  const link = args[0];

  try {
    const res = await axios.get(`https://facebookuid.freshbots.me/?url=${encodeURIComponent(link)}`);
    if (!res.data || !res.data.uid) return out("❌ UID not found from the provided link.");
    uid = res.data.uid;
    addUserToGroup(uid);
  } catch (e) {
    console.error("Error fetching UID:", e);
    return out("❌ Error fetching UID from the link.");
  }

  async function addUserToGroup(uid) {
    try {
      const threadInfo = await api.getThreadInfo(threadID);
      const participantIDs = threadInfo.participantIDs.map(e => parseInt(e));
      const adminIDs = threadInfo.adminIDs.map(e => parseInt(e.id));
      const approvalMode = threadInfo.approvalMode;

      if (participantIDs.includes(parseInt(uid))) {
        return out("⚠️ This user is already in the group.");
      }

      await api.addUserToGroup(parseInt(uid), threadID);

      if (approvalMode === true && !adminIDs.includes(botID)) {
        return out("✅ User added to the approval list.");
      } else {
        return out("✅ User added to the group successfully!");
      }
    } catch (err) {
      console.error(err);
      return out("❌ Failed to add user. Maybe the user has privacy restrictions or your bot is not friends with them.");
    }
  }
};
