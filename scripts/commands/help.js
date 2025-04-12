const axios = require("axios");
const fs = require("fs-extra");

module.exports.config = {
  name: "help",
  version: "1.0.3",
  permission: 0,
  credits: "REBEL + Fixed by ChatGPT",
  description: "Beginner's Guide",
  prefix: true,
  category: "guide",
  usages: "[Shows Commands]",
  cooldowns: 5,
  envConfig: {
    autoUnsend: true,
    delayUnsend: 60
  }
};

module.exports.languages = {
  en: {
    moduleInfo:
      "%1\n%2\n\nUsage: %3\nCategory: %4\nCooldown: %5 second(s)\nPermission: %6\n\nModule code by %7.",
    helpList:
      `There are %1 commands and %2 categories in ${global.config.BOTNAME} AI.`,
    user: "user",
    adminGroup: "group admin",
    adminBot: "bot admin"
  },
};

module.exports.handleEvent = function ({ api, event, getText }) {
  const { commands } = global.client;
  const { threadID, messageID, body } = event;
  if (!body || !body.toLowerCase().startsWith("help")) return;

  const splitBody = body.trim().split(/\s+/);
  if (splitBody.length === 1 || !commands.has(splitBody[1].toLowerCase())) return;

  const threadSetting = global.data.threadData.get(parseInt(threadID)) || {};
  const command = commands.get(splitBody[1].toLowerCase());
  const prefix = threadSetting.PREFIX || global.config.PREFIX;

  return api.sendMessage(
    getText(
      "moduleInfo",
      command.config.name,
      command.config.description,
      `${prefix}${command.config.name} ${command.config.usages || ""}`,
      command.config.category,
      command.config.cooldowns,
      command.config.permission === 0
        ? getText("user")
        : command.config.permission === 1
        ? getText("adminGroup")
        : getText("adminBot"),
      command.config.credits
    ),
    threadID,
    messageID
  );
};

module.exports.run = async function ({ api, event, args, getText }) {
  const { commands } = global.client;
  const { threadID, messageID } = event;
  const command = commands.get((args[0] || "").toLowerCase());
  const threadSetting = global.data.threadData.get(parseInt(threadID)) || {};
  const { autoUnsend, delayUnsend } = global.configModule[this.config.name];
  const prefix = threadSetting.PREFIX || global.config.PREFIX;

  if (command) {
    return api.sendMessage(
      getText(
        "moduleInfo",
        command.config.name,
        command.config.description,
        `${prefix}${command.config.name} ${command.config.usages || ""}`,
        command.config.category,
        command.config.cooldowns,
        command.config.permission === 0
          ? getText("user")
          : command.config.permission === 1
          ? getText("adminGroup")
          : getText("adminBot"),
        command.config.credits
      ),
      threadID,
      async (err, info) => {
        if (autoUnsend && !err) {
          await new Promise(resolve => setTimeout(resolve, delayUnsend * 1000));
          return api.unsendMessage(info.messageID);
        }
      },
      messageID
    );
  }

  const commandList = Array.from(commands.values());
  const categories = [...new Set(commandList.map(cmd => cmd.config.category.toLowerCase()))];
  const itemsPerPage = 10;
  const totalPages = Math.ceil(categories.length / itemsPerPage);
  let currentPage = parseInt(args[0]) || 1;

  if (currentPage > totalPages || currentPage < 1) {
    return api.sendMessage(
      `Oops! Please enter a page between 1 and ${totalPages}.`,
      threadID,
      messageID
    );
  }

  const startIdx = (currentPage - 1) * itemsPerPage;
  const visibleCategories = categories.slice(startIdx, startIdx + itemsPerPage);

  let msg = "";
  for (const cat of visibleCategories) {
    const cmds = commandList
      .filter(cmd => cmd.config.category.toLowerCase() === cat)
      .map(cmd => cmd.config.name);
    msg += `• ${cat.toUpperCase()}:\n${cmds.join(", ")}\n\n`;
  }

  msg += `Page ${currentPage}/${totalPages}\n`;
  msg += getText("helpList", commandList.length, categories.length);

  // Image logic
  const images = [
    "https://i.imgur.com/ruQ2pRn.jpg",
    "https://i.imgur.com/HXHb0cB.jpg",
    "https://i.imgur.com/ZJEI6KW.jpg",
    "https://i.imgur.com/XGL57Wp.jpg",
    "https://i.imgur.com/6OB00HJ.jpg",
    "https://i.imgur.com/6vHaRZm.jpg",
    "https://i.imgur.com/k6uE93k.jpg"
  ];
  const imgURL = images[Math.floor(Math.random() * images.length)];
  const imgPath = `${__dirname}/cache/help.jpg`;

  try {
    const res = await axios.get(imgURL, { responseType: "arraybuffer" });
    await fs.outputFile(imgPath, res.data);

    const msgObj = {
      body: msg,
      attachment: fs.createReadStream(imgPath)
    };

    return api.sendMessage(msgObj, threadID, async (err, info) => {
      if (autoUnsend && !err) {
        await new Promise(resolve => setTimeout(resolve, delayUnsend * 1000));
        return api.unsendMessage(info.messageID);
      }
    }, messageID);
  } catch (err) {
    console.error("Image fetch error:", err.message);
    return api.sendMessage(msg, threadID, messageID);
  }
};
