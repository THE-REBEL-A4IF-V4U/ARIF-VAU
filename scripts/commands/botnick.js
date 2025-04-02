module.exports.config = {
    name: "setbotname",
    version: "1.0.0",
    permission: 0,
    credits: "TR4",
    description: ".Automatically prevent change bot nickname",
    prefix: false,
    category: "Automatically prevent change bot nickname",
    usages: "system",
    cooldowns: 2,
};



module.exports.handleEvent = async function ({ api, args, event, client, __GLOBAL, Threads, Currencies }) {
    const { threadID } = event;
    let { nicknames } = await api.getThreadInfo(event.threadID)
    const nameBot = nicknames[api.getCurrentUserID()]
    if (nameBot !== `${config.BOTNAME}`) {
        api.changeNickname(`${(!global.config.BOTNAME) ? "Don't change nickname" : global.config.BOTNAME}`, threadID, api.getCurrentUserID());
        setTimeout(() => {
            return api.sendMessage(`Nickname change koirona  😒`, threadID);
        }, 1500);
    }
}

module.exports.run = async({ api, event, Threads}) => {
    let data = (await Threads.getData(event.threadID)).data || {};
    if (typeof data["cnamebot"] == "undefined" || data["cnamebot"] == false) data["cnamebot"] = true;
    else data["cnamebot"] = false;

    await Threads.setData(event.threadID, { data });
    global.data.threadData.set(parseInt(event.threadID), data);

    return api.sendMessage(`✅ ${(data["cnamebot"] == true) ? "Turn on" : "Turn off"} successfully cnamebot!`, event.threadID);

}