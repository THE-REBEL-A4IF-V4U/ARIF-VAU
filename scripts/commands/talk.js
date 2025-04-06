module.exports.config = {
    name: "rebel",
    version: "1.1.0",
    permission: 0,
    credits: "rebel",
    description: "rebel reply system",
    prefix: false,
    category: "without prefix",
    cooldowns: 0
};

const axios = require('axios');

module.exports.onLoad = function () {
    const { writeFileSync, existsSync } = global.nodemodule["fs-extra"];
    const { resolve } = global.nodemodule["path"];
    const log = require('../../Rebel/catalogs/Rebelc.js');
    const path = resolve(__dirname, 'system', 'system.json');

    if (!existsSync(path)) {
        const obj = { rebel: {} };
        writeFileSync(path, JSON.stringify(obj, null, 4));
    } else {
        const data = require(path);
        if (!data.hasOwnProperty('rebel')) data.rebel = {};
        writeFileSync(path, JSON.stringify(data, null, 4));
    }
};

module.exports.handleEvent = async ({ api, event, args, Threads }) => {
    const { threadID, messageID } = event;
    const { resolve } = global.nodemodule["path"];
    const path = resolve(__dirname, '../commands', 'system', 'system.json');
    const { rebel } = global.apirebel;
    const { rebel: rebelStatus } = require(path);

    if (rebelStatus?.[threadID] === true) {
        if (event.senderID !== api.getCurrentUserID()) {
            try {
                const res = await axios.get(encodeURI(`${rebel}${event.body}`));
                const reply = res.data.reply;
                if (!reply || reply === "null" || reply.toLowerCase().includes("teach me")) {
                    api.sendMessage("i didn't understand you, teach me.", threadID, messageID);
                } else {
                    api.sendMessage(reply, threadID, messageID);
                }
            } catch (err) {
                api.sendMessage("error fetching response.", threadID, messageID);
            }
        }
    }
};

module.exports.run = async ({ api, event, args, permssion }) => {
    const { writeFileSync } = global.nodemodule["fs-extra"];
    const { resolve } = global.nodemodule["path"];
    const path = resolve(__dirname, 'system', 'system.json');
    const { threadID, messageID } = event;
    const database = require(path);
    const { rebel } = global.apirebel;
    const { rebel: rebelStatus } = database;

    if (!args[0]) return api.sendMessage("enter a message", threadID, messageID);

    switch (args[0]) {
        case "on":
            if (permssion !== 1) return api.sendMessage('only group admins can use this command.', threadID, messageID);
            rebelStatus[threadID] = true;
            api.sendMessage("successfully turned on rebel mode.", threadID);
            break;

        case "off":
            if (permssion !== 1) return api.sendMessage('only group admins can use this command.', threadID, messageID);
            rebelStatus[threadID] = false;
            api.sendMessage("successfully turned off rebel mode.", threadID);
            break;

        default:
            try {
                const res = await axios.get(encodeURI(`${rebel}${args.join(" ")}`));
                const reply = res.data.reply;
                if (!reply || reply === "null" || reply.toLowerCase().includes("teach me")) {
                    api.sendMessage("i didn't understand you, teach me.", threadID, messageID);
                } else {
                    api.sendMessage(reply, threadID, messageID);
                }
            } catch (err) {
                api.sendMessage("error fetching response.", threadID, messageID);
            }
            break;
    }

    writeFileSync(path, JSON.stringify(database, null, 4));
};