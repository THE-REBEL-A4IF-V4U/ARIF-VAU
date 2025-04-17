module.exports.config = {
    name: "mangainfo",
    version: "1.0.0",
    permision: 0,
    credit: "BLACK",
    description: "Thông tin về phim anime",
    category: "Game",
    prefix: false,
    usages: "[name anime]",
    cooldowns: 0,
};

module.exports.run = async function({
    api,
    event,
    args,
    utils,
    Users,
    Threads
}) {
    try {
        let {
            threadID,
            senderID,
            messageID
        } = event;
        if (!args[0]) {
            api.sendMessage("", threadID, messageID)
        }
        const res = await axios.get(encodeURI(`https://api.lolhuman.xyz/api/manga?apikey=b229f3dc257deae3030fe409&query=${args[0]}`));
        console.log(res.data);
        let data = res.data;
        let callback = function() {
            return api.sendMessage({
                body: `Title 💎: ${data.title}\ngenre 🔗: ${data.genres}\nchapters: ${data.chapters}\nid: ${data.id}\nestatus 💌: ${data.status}`,
    } catch (err) {
        console.log(err)
        return api.sendMessage(`RED`, event.threadID)
    }
          }