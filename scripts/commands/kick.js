module.exports.config = {
  name: "kick",
  version: "2.5.0", 
  permission: 2,
  prefix: true,
  credits: "Modified by REBEL A4IF V4U",
  description: "Kick members by tag, kick all, or kick disabled accounts",
  category: "group", 
  usages: "[tag | all | facebookuser]", 
  cooldowns: 0,
};

module.exports.run = async function({ api, event, args }) {
  const mention = Object.keys(event.mentions);
  const threadInfo = await api.getThreadInfo(event.threadID).catch(e => null);

  if (!threadInfo) return api.sendMessage("An error has occurred!", event.threadID);
  if (!threadInfo.adminIDs.some(item => item.id == api.getCurrentUserID())) {
    return api.sendMessage('Need group admin rights.\nPlease add and try again!', event.threadID, event.messageID);
  }

  const senderIsAdmin = threadInfo.adminIDs.some(item => item.id == event.senderID);
  if (!senderIsAdmin) {
    return api.sendMessage("You must be an admin to use this command.", event.threadID, event.messageID);
  }

  if (args[0] === "all") {
    let members = threadInfo.participantIDs;
    members = members.filter(id => id != api.getCurrentUserID() && id != event.senderID); // Bot and sender ke bad
    for (let id of members) {
      setTimeout(() => {
        api.removeUserFromGroup(id, event.threadID);
      }, 1000);
    }
    return api.sendMessage(`Kicking ${members.length} members...`, event.threadID);
  }

  if (args[0] === "facebookuser") {
    let members = threadInfo.participantIDs.filter(id => id != api.getCurrentUserID() && id != event.senderID);

    let lockedIds = [];

    for (let id of members) {
      try {
        let user = await api.getUserInfo(id);
        if (!user[id]?.name) {
          lockedIds.push(id);
        }
      } catch (e) {
        lockedIds.push(id);
      }
      await new Promise(resolve => setTimeout(resolve, 500)); // To avoid rate limit
    }

    if (lockedIds.length === 0) {
      return api.sendMessage("No locked/disabled accounts found.", event.threadID);
    }

    for (let id of lockedIds) {
      setTimeout(() => {
        api.removeUserFromGroup(id, event.threadID);
      }, 1000);
    }

    return api.sendMessage(`Kicking ${lockedIds.length} disabled/locked accounts...`, event.threadID);
  }

  if (mention.length === 0) {
    return api.sendMessage("You must tag the person to kick, or use [all] or [facebookuser]", event.threadID);
  }

  for (let id of mention) {
    setTimeout(() => {
      api.removeUserFromGroup(id, event.threadID);
    }, 3000);
  }
};
