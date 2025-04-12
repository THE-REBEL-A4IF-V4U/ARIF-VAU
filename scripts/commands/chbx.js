const fonts = "/cache/Play-Bold.ttf";
const downfonts = "https://drive.google.com/u/0/uc?id=1uni8AiYk7prdrC7hgAmezaGTMH5R8gW8&export=download";
const fontsName = 45;
const fontsInfo = 33;
const fontsOthers = 27;
const colorName = "#00FF00";

module.exports.config = {
    name: "infobox",
    version: "1.1.1",
    permission: 0,
    credits: "TR4 (Fixed by ChatGPT)",
    description: "Group info with graphics",
    prefix: false,
    category: "without prefix",
    cooldowns: 5
};

module.exports.circle = async (image) => {
    const jimp = global.nodemodule["jimp"];
    image = await jimp.read(image);
    image.circle();
    return await image.getBufferAsync("image/png");
};

module.exports.run = async function ({ api, event, args }) {
    const fs = global.nodemodule["fs-extra"];
    const axios = global.nodemodule["axios"];
    const path = global.nodemodule["path"];
    const Canvas = global.nodemodule["canvas"];
    const { loadImage, createCanvas } = Canvas;

    const TOKEN = "6628568379%7Cc1e620fa708a1d5696fb991c1bde5662";
    const { senderID, threadID, messageID } = event;
    const __root = path.resolve(__dirname, "cache");

    const threadInfo = await api.getThreadInfo(threadID);
    const threadName = threadInfo.threadName || "Unknown";
    const icon = threadInfo.emoji || "❓";
    const approvalMode = threadInfo.approvalMode ? "Turned on" : "Turned off";
    const qtv = threadInfo.adminIDs.length;
    const totalMessages = threadInfo.messageCount;
    const threadMem = threadInfo.participantIDs.length;

    let nam = 0, nu = 0;
    threadInfo.userInfo.forEach(u => {
        if (u.gender === "MALE") nam++;
        else if (u.gender === "FEMALE") nu++;
    });

    const idAdminRandom = threadInfo.adminIDs[Math.floor(Math.random() * qtv)]?.id || senderID;
    const idUser1 = threadInfo.participantIDs[Math.floor(Math.random() * threadMem)];
    const idUser2 = threadInfo.participantIDs[Math.floor(Math.random() * threadMem)];

    const getImageBuffer = async (url) =>
        (await axios.get(url, { responseType: 'arraybuffer' })).data;

    const fallbackImage = 'https://i.postimg.cc/pTb7L0MT/20240623-053326.jpg';
    const pathImg = `${__root}/${senderID}123.png`;
    const pathAva = `${__root}/avtgroup.png`;
    const pathAvata1 = `${__root}/avtadmin.png`;
    const pathAvata2 = `${__root}/avtuser1.png`;
    const pathAvata3 = `${__root}/avtuser2.png`;

    try {
        const imageGroup = threadInfo.imageSrc || fallbackImage;
        const data = await Promise.all([
            getImageBuffer(imageGroup),
            getImageBuffer(`https://graph.facebook.com/${idAdminRandom}/picture?height=720&width=720&access_token=${TOKEN}`),
            getImageBuffer(`https://graph.facebook.com/${idUser1}/picture?height=720&width=720&access_token=${TOKEN}`),
            getImageBuffer(`https://graph.facebook.com/${idUser2}/picture?height=720&width=720&access_token=${TOKEN}`),
            getImageBuffer(fallbackImage)
        ]);

        fs.writeFileSync(pathAva, Buffer.from(data[0]));
        fs.writeFileSync(pathAvata1, Buffer.from(data[1]));
        fs.writeFileSync(pathAvata2, Buffer.from(data[2]));
        fs.writeFileSync(pathAvata3, Buffer.from(data[3]));
        fs.writeFileSync(pathImg, Buffer.from(data[4]));

        const circleAvatars = await Promise.all([
            this.circle(pathAva),
            this.circle(pathAvata1),
            this.circle(pathAvata2),
            this.circle(pathAvata3)
        ]);

        if (!fs.existsSync(__dirname + fonts)) {
            const fontData = await axios.get(downfonts, { responseType: "arraybuffer" });
            fs.writeFileSync(__dirname + fonts, Buffer.from(fontData.data, "utf-8"));
        }

        Canvas.registerFont(__dirname + fonts, { family: "Play-Bold" });

        const baseImage = await loadImage(pathImg);
        const canvas = createCanvas(baseImage.width, baseImage.height);
        const ctx = canvas.getContext("2d");

        ctx.drawImage(baseImage, 0, 0, canvas.width, canvas.height);
        ctx.drawImage(await loadImage(circleAvatars[0]), 790, 182, 450, 450);
        ctx.drawImage(await loadImage(circleAvatars[1]), 450, 685, 43, 43);
        ctx.drawImage(await loadImage(circleAvatars[2]), 500, 685, 43, 43);
        ctx.drawImage(await loadImage(circleAvatars[3]), 550, 685, 43, 43);

        const groupID = threadInfo.threadID;

        ctx.font = `700 ${fontsName}px Arial`;
        ctx.fillStyle = colorName;
        ctx.fillText(args.join(" ") || threadName, 100, 85);

        ctx.font = `${fontsInfo}px Play-Bold`;
        ctx.fillStyle = "#fff";
        ctx.fillText(`${approvalMode}`, 300, 350);
        ctx.fillText(`${threadMem}`, 377, 415);
        ctx.fillText(`${qtv}`, 210, 473);
        ctx.fillText(`${nam}`, 460, 537);
        ctx.fillText(`${nu}`, 498, 601);
        ctx.fillText(`${totalMessages}`, 450, 665);

        ctx.font = `${fontsOthers}px Play-Bold`;
        ctx.fillText(`${groupID}`, 300, 280);
        ctx.fillText(`With ${parseInt(threadMem) - 3} other members`, 607, 715);

        fs.writeFileSync(pathImg, canvas.toBuffer());

        const infoText = 
`.   ╭──────────────────╮
        ʙᴏx ɪɴꜰᴏʀᴍᴀᴛɪᴏɴ
    ╰──────────────────╯

♻️ ɢʀᴏᴜᴘ ɴᴀᴍᴇ: ${threadName}
_________________________________
♻️ ᴀᴘᴘʀᴏᴠᴀʟ: ${approvalMode}
_________________________________
♻️ ɴᴜᴍʙᴇʀ ᴏꜰ ᴍᴀʟᴇꜱ: ${nam} members
_________________________________
♻️ ɴᴜᴍʙᴇʀ ᴏꜰ ꜰᴇᴍᴀʟᴇꜱ: ${nu} members
_________________________________
♻️ ᴡɪᴛʜ ${qtv}  ᴀᴅᴍɪɴꜱ
_________________________________
♻️ ᴛᴏᴛᴀʟ ᴍᴇꜱꜱᴀɢᴇꜱ: ${totalMessages}
_________________________________
♻️ ᴇᴍᴏᴊɪ: ${icon}
_________________________________
♻️ ɢʀᴏᴜᴘ ɪᴅ: ${groupID}
_________________________________
𝚃𝙷𝙸𝚂 𝙱𝙾𝚃 𝙲𝙾𝙽𝚃𝚁𝙾𝙻𝙻𝙴𝙳 𝙱𝚈: 𝐓𝐑𝟒 𝐀𝐑𝐈𝐅 𝐕𝐀𝐔`;

        return api.sendMessage({
            body: infoText,
            attachment: fs.createReadStream(pathImg)
        }, threadID, () => {
            [pathImg, pathAva, pathAvata1, pathAvata2, pathAvata3].forEach(f => fs.existsSync(f) && fs.unlinkSync(f));
        }, messageID);

    } catch (err) {
        console.error(err);
        return api.sendMessage("An error occurred while generating the infobox.", threadID, messageID);
    }
};
