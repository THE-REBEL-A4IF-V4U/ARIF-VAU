const fs = require("fs-extra");
const path = require("path");

const activeGroupsFilePath = path.join(__dirname, "..", "events", "rebel", "groupSettings.json");

let activeGroups = {};
if (fs.existsSync(activeGroupsFilePath)) {
  try {
    const fileData = fs.readFileSync(activeGroupsFilePath, "utf-8").trim();
    activeGroups = fileData ? JSON.parse(fileData) : {};

    if (typeof activeGroups !== "object" || Array.isArray(activeGroups)) {
      console.warn("activeGroups data is invalid. Resetting to empty object.");
      activeGroups = {};
    }
  } catch (error) {
    console.error("Error loading active groups:", error.message);
    activeGroups = {}; // fallback to prevent crashes
  }
} else {
  // Ensure the file exists with an empty object
  fs.ensureFileSync(activeGroupsFilePath);
  fs.writeFileSync(activeGroupsFilePath, "{}", "utf-8");
}

const saveActiveGroups = () => {
  try {
    fs.writeFileSync(activeGroupsFilePath, JSON.stringify(activeGroups, null, 2), "utf-8");
  } catch (error) {
    console.error("Error saving active groups:", error.message);
  }
};

module.exports = {
  config: {
    name: "antichange",
    version: "1.0.0",
    permission: 0,
    credits: "rebel",
    description: "Prevents unauthorized group changes",
    prefix: false,
    category: "box",
    usages: "antichange [on/off]",
    cooldowns: 5,
  },

  start: async function ({ rebel, events, args, Threads }) {
    const threadID = events.threadID;
    const senderID = events.senderID;
    const botAdmins = global.config.ADMINBOT;

    const threadInfo = await rebel.getThreadInfo(threadID);
    const groupAdmins = threadInfo.adminIDs.map(admin => admin.id);

    if (!groupAdmins.includes(senderID) && !botAdmins.includes(senderID)) {
      return rebel.sendMessage("⚠️ Only group admins or bot admins can use this command.", threadID);
    }

    const initialGroupName = threadInfo.threadName;
    const initialGroupImage = threadInfo.imageSrc || "";
    const { setData, getData, delData } = Threads;

    if (args[0] === "on") {
      const groupData = await getData(threadID);
      const dataThread = groupData.threadInfo;

      if (!activeGroups[threadID]) {
        activeGroups[threadID] = {
          name: initialGroupName,
          image: initialGroupImage,
        };

        await setData(threadID, { threadInfo: dataThread });
        saveActiveGroups();
        rebel.sendMessage("✅ Anti-change feature has been activated for this group.", threadID);
      } else {
        rebel.sendMessage("⚠️ Anti-change feature is already active for this group.", threadID);
      }
    } else if (args[0] === "off") {
      if (activeGroups[threadID]) {
        delete activeGroups[threadID];
        await delData(threadID);
        saveActiveGroups();
        rebel.sendMessage("🚫 Anti-change feature has been deactivated for this group.", threadID);
      } else {
        rebel.sendMessage("⚠️ Anti-change feature is not active for this group.", threadID);
      }
    } else {
      rebel.sendMessage("⚠️ Invalid option. Please use 'antichange on' or 'antichange off'.", threadID);
    }
  }
};
