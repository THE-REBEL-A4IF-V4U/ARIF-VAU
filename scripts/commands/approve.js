module.exports.config = {
  name: "approve",
  version: "2.0.0",
  permission: 0,
  credits: "ryuko",
  description: "approve thread using thread id",
  prefix: false,
  category: "admin",
  usages: "approve [box/remove] [userid/groupid]",
  cooldowns: 5,
};

module.exports.languages = {
    "vi": {
        "listAdmin": 'Danh sách toàn bộ người điều hành bot: \n\n%1',
        "notHavePermssion": 'Bạn không đủ quyền hạn để có thể sử dụng chức năng "%1"',
        "addedNewAdmin": 'Đã thêm %1 người dùng trở thành người điều hành bot:\n\n%2',
        "removedAdmin": 'Đã gỡ bỏ %1 người điều hành bot:\n\n%2'
    },
    "en": {
        "listAdmin": 'approved list : \n\n%1',
        "notHavePermssion": 'you have no permission to use "%1"',
        "addedNewAdmin": 'approved %1 box :\n\n%2',
        "removedAdmin": 'remove %1 box in approve lists :\n\n%2'
    }
}

module.exports.run = async function ({ api, event, args, Threads, Users, permssion, getText }) {
    const content = args.slice(1, args.length);
    const { threadID, messageID, mentions } = event;
    const { configPath } = global.client;
    const { APPROVED } = global.config;
    const { userName } = global.data;
    const { writeFileSync } = global.nodemodule["fs-extra"];
    const mention = Object.keys(mentions);
    delete require.cache[require.resolve(configPath)];
    var config = require(configPath);
    
       
    switch (args[0]) {
        case "list":
        case "all":
        case "-a": {
            const listAdmin = APPROVED || config.APPROVED || [];
            var msg = [];

            for (const idAdmin of listAdmin) {
                if (parseInt(idAdmin)) {
                  let username = "not a user";
                  let groupname = "not a group";
                  try {
        groupname = await global.data.threadInfo.get(idAdmin).threadName || "name does not exist"
      } catch (error) {
        username = await Users.getNameUser(idAdmin);
      }
                  msg.push(`\nuser name : ${username}\ngroup name : ${groupname}\nid : ${idAdmin}`);
                }
            };

            return api.sendMessage(`approved users and groups :\n${msg.join('\n')}`, threadID, messageID);
        }

        case "box": {
            if (permssion != 3) return api.sendMessage(getText("notHavePermssion", "add"), threadID, messageID);
          

            if (mention.length != 0 && isNaN(content[0])) {
                var listAdd = [];

                for (const id of mention) {
                    APPROVED.push(id);
                    config.APPROVED.push(id);
                    listAdd.push(`${id} - ${event.mentions[id]}`);
                };

                writeFileSync(configPath, JSON.stringify(config, null, 4), 'utf8');
                return api.sendMessage(getText("addedNewAdmin", mention.length, listAdd.join("\n").replace(/\@/g, "")), threadID, messageID);
            }
            else if (content.length != 0 && !isNaN(content[0])) {
                APPROVED.push(content[0]);
                config.APPROVED.push(content[0]);
                let username = "not a user";
                  let groupname = "not a group";
                  try {
        groupname = await global.data.threadInfo.get(content[0]).threadName || "name does not exist"
      } catch (error) {
        username = await Users.getNameUser(content[0]);
      }
                writeFileSync(configPath, JSON.stringify(config, null, 4), 'utf8');
                return api.sendMessage('this box has been approved', content[0], () => {
                return api.sendMessage(getText("addedNewAdmin", 1, `\nuser name : ${username}\ngroup name : ${groupname}\nid : ${content[0]}`), threadID, messageID);
                });
            }
            else return global.utils.throwError(this.config.name, threadID, messageID);
        }
        

        case "remove":
        case "rm":
        case "delete": {
            if (permssion != 3) return api.sendMessage(getText("notHavePermssion", "delete"), threadID, messageID);
            if (mentions.length != 0 && isNaN(content[0])) {
                const mention = Object.keys(mentions);
                var listAdd = [];

                for (const id of mention) {
                    const index = config.APPROVED.findIndex(item => item == id);
                    APPROVED.splice(index, 1);
                    config.APPROVED.splice(index, 1);
                    listAdd.push(`${id} - ${event.mentions[id]}`);
                };

                writeFileSync(configPath, JSON.stringify(config, null, 4), 'utf8');
                return api.sendMessage(getText("removedAdmin", mention.length, listAdd.join("\n").replace(/\@/g, "")), threadID, messageID);
            }
            else if (content.length != 0 && !isNaN(content[0])) {
                const index = config.APPROVED.findIndex(item => item.toString() == content[0]);
                APPROVED.splice(index, 1);
                config.APPROVED.splice(index, 1);
                let username = "not a user";
                  let groupname = "not a group";
                  try {
        groupname = await global.data.threadInfo.get(content[0]).threadName || "name does not exist"
      } catch (error) {
        username = await Users.getNameUser(content[0]);
      }
                writeFileSync(configPath, JSON.stringify(config, null, 4), 'utf8');
                return api.sendMessage('this box has been removed from approved list', content[0], () => {
                return api.sendMessage(getText("removedAdmin", 1, `user name : ${username}\ngroup name : ${groupname}\nid : ${content[0]}`), threadID, messageID);
                });
            }
            else global.utils.throwError(this.config.name, threadID, messageID);
        }

        default: {
            return global.utils.throwError(this.config.name, threadID, messageID);
        }
    };
}
