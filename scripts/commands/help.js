const axios = require("axios");
const request = require('request');
const fs = require("fs-extra");

module.exports.config = { 
  name: "help", 
  version: "1.1.0", 
  permission: 0, 
  credits: "rebel", 
  description: "Commands list!", 
  prefix: false, 
  category: "without prefix", 
  usage: "module name", 
  cooldowns: 3, 
  dependencies: { "axios": "", "fs-extra": "" }
};

module.exports.languages = {
  en: {
    moduleInfo: "%1\n──────────────\n\nUsage: %3\nCategory: %4\nCooldown: %5 seconds\nPermission: %6\nDescription: %2\n\nCoded by: %7",
    helpList: "[There are %1 commands on this bot, use: \"%2help commandName\" to see usage]",
    user: "User",
    adminGroup: "Group Admin",
    adminBot: "Bot Admin"
  }
};

module.exports.handleEvent = async function({ api, event, getText }) {
  const { threadID, messageID, body } = event;
  const { commands } = global.client;

  if (!body || !body.toLowerCase().startsWith("help")) return;

  const args = body.slice(4).trim().split(/\s+/);
  if (args.length < 1 || !commands.has(args[0].toLowerCase())) return;

  const command = commands.get(args[0].toLowerCase());
  const threadSetting = global.data.threadData.get(parseInt(threadID)) || {};
  const prefix = threadSetting.hasOwnProperty("PREFIX") ? threadSetting.PREFIX : global.config.PREFIX;

  return api.sendMessage(getText("moduleInfo", command.config.name, command.config.description, `${prefix}${command.config.name} ${(command.config.usage || "")}`, command.config.category, command.config.cooldowns, 
    command.config.permission == 0 ? getText("user") : command.config.permission == 1 ? getText("adminGroup") : getText("adminBot"), command.config.credits), threadID, messageID);
};

module.exports.run = async function({ api, event, args, getText }) {
  const { threadID, messageID } = event;
  const { commands } = global.client;
  const threadSetting = global.data.threadData.get(parseInt(threadID)) || {};
  const prefix = threadSetting.hasOwnProperty("PREFIX") ? threadSetting.PREFIX : global.config.PREFIX;

  if (args[0] && args[0].toLowerCase() === "all") {
    let msg = "", groups = [];
    for (const cmd of commands.values()) {
      const group = cmd.config.category || "other";
      if (!groups.some(g => g.group === group)) groups.push({ group, cmds: [cmd.config.name] });
      else groups.find(g => g.group === group).cmds.push(cmd.config.name);
    }

    groups.forEach(g => {
      msg += `☂︎ ${g.group.charAt(0).toUpperCase() + g.group.slice(1)}\n${g.cmds.join(' • ')}\n\n`;
    });

    const response = await axios.get('https://apikanna.maduka9.repl.co');
    const ext = response.data.data.split('.').pop();
    const admID = "100000564972717";

    api.getUserInfo(parseInt(admID), (err, data) => {
      if (err) return console.log(err);
      const name = data[Object.keys(data)].name.replace("@", "");

      const callback = () => {
        api.sendMessage({
          body: `𝗖𝗼𝗺𝗺𝗮𝗻𝗱 𝗟𝗶𝘀𝘁\n\n${msg}\nSpamming the bot is strictly prohibited\n\nTotal Commands: ${commands.size}\n\nUse: help2 for all commands\n\n╭──────────╮\n✜     𝐌𝐈𝐍𝐃 𝐈𝐓     ✜\n╰──────────╯\n𝗜𝗧'𝗦 𝗝𝗨𝗦𝗧 𝗡𝗢𝗧 𝗔 𝗡𝗔𝗠𝗘, 𝗜𝗧'𝗦 𝗔 𝗕𝗥𝗔𝗡𝗗\n《𝗧.𝗥.𝗔》`,
          mentions: [{
            tag: name,
            id: admID,
            fromIndex: 0,
          }],
          attachment: fs.createReadStream(__dirname + `/cache/help.${ext}`)
        }, threadID, (err, info) => {
          fs.unlinkSync(__dirname + `/cache/help.${ext}`);
        }, messageID);
      };

      request(response.data.data)
        .pipe(fs.createWriteStream(__dirname + `/cache/help.${ext}`))
        .on("close", callback);
    });
    return;
  }

  const page = parseInt(args[0]) || 1;
  const numberPerPage = 30;
  const commandNames = [...commands.keys()].sort();
  const totalPages = Math.ceil(commandNames.length / numberPerPage);
  const start = (page - 1) * numberPerPage;
  const end = start + numberPerPage;
  const pageCommands = commandNames.slice(start, end);

  let msg = `\n     আসসালামু আলাইকুম\n/help command এ শুধু কিভাবে use করবেন তা দেয়া আছে\nFULL COMMAND দেখতে /menu all ব্যবহার করুন\n•────────────────────•\n\n`;

  pageCommands.forEach((cmd, index) => {
    msg += `「 ${start + index + 1} 」👉 ${prefix}${cmd}\n`;
  });

  msg += `\nPage (${page}/${totalPages})\nবর্তমানে ${commandNames.length}টি কমান্ড চালু আছে\n\n𝙱𝙾𝚃 𝙽𝙰𝙼𝙴: ${global.config.BOTNAME}\nBOT PREFIX: ${prefix}\n\n╭───────────────╮\n🔥 𝗔𝗥𝗜𝗙𝗨𝗟 𝗜𝗦𝗟𝗔𝗠 𝗔𝗦𝗜𝗙 🔥\n╰───────────────╯\n\n[ANY HELP CONTACT FB]\nhttps://www.facebook.com/THE.R3B3L.ARIF.VAU\n╭──────────╮\n✜     𝐌𝐈𝐍𝐃 𝐈𝐓     ✜\n╰──────────╯\n𝗜𝗧'𝗦 𝗝𝗨𝗦𝗧 𝗡𝗢𝗧 𝗔 𝗡𝗔𝗠𝗘, 𝗜𝗧'𝗦 𝗔 𝗕𝗥𝗔𝗡𝗗\n《𝗧.𝗥.𝗔》`;

  const images = [
    "https://i.postimg.cc/CL3KfbgJ/20230326-121649.jpg",
    "https://i.postimg.cc/t4mTtQpp/20230419-022146.png",
    "https://i.postimg.cc/JhJhRqdj/Screenshot-2023-05-03-06-42-46-559-com-facebook-lite-edit.jpg"
  ];

  const selectedImage = images[Math.floor(Math.random() * images.length)];
  const imgPath = __dirname + "/cache/help.jpg";

  request(encodeURI(selectedImage))
    .pipe(fs.createWriteStream(imgPath))
    .on("close", () => {
      api.sendMessage({
        body: msg,
        attachment: fs.createReadStream(imgPath)
      }, threadID, () => fs.unlinkSync(imgPath), messageID);
    });
};
