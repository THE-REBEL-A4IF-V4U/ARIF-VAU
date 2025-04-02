const fonts = "/cache/Play-Bold.ttf"
const downfonts = "https://drive.google.com/u/0/uc?id=1uni8AiYk7prdrC7hgAmezaGTMH5R8gW8&export=download"
const fontsName = 45
const fontsInfo = 33
const fontsOthers = 27
const colorName = "#00FF00"
module.exports.config = {
     name: "infobox",
     version: "1.1.0",
     permission: 0,
     credits: "TR4",
     description: "HI reply",
     prefix: false,
     category: "without prefix",
     cooldowns: 5
};
module.exports.circle = async (image) => {
  const jimp = global.nodemodule["jimp"];
  image = await jimp.read(image);
  image.circle();
  return await image.getBufferAsync("image/png");
}
module.exports.run = async function ({ api, event, args, Users }) {
  var TOKEN = "6628568379%7Cc1e620fa708a1d5696fb991c1bde5662"
  let { senderID, threadID, messageID } = event;
  const { loadImage, createCanvas } = require("canvas");
  const request = require('request');
  const fs = global.nodemodule["fs-extra"];
  const axios = global.nodemodule["axios"];
  let pathImg = __dirname + `/cache/${senderID}123.png`;
  let pathAva = __dirname + `/cache/avtuserthread.png`;
  let pathAvata = __dirname + `/cache/avtuserrd.png`;
  let pathAvata2 = __dirname + `/cache/avtuserrd2.png`;
  let pathAvata3 = __dirname + `/cache/avtuserrd3.png`;

  var threadInfo = await api.getThreadInfo(threadID);
  let threadName = threadInfo.threadName;
  let icon = threadInfo.emoji;
  let sex = threadInfo.approvalMode;
      var pd = sex == false ? 'Turned off' : sex == true ? 'Turned on' : 'Kh';
  var nameMen = [];
    var gendernam = [];
    var gendernu = [];
    var nope = [];

    for (let z in threadInfo.userInfo) {
        var gioitinhone = threadInfo.userInfo[z].gender;
        var nName = threadInfo.userInfo[z].name;
        if (gioitinhone == 'MALE') {
            gendernam.push(z + gioitinhone);
        } else if (gioitinhone == 'FEMALE') {
            gendernu.push(gioitinhone);
        } else {
            nope.push(nName);
        }
    }

    var nam = gendernam.length;
    var nu = gendernu.length;
  let qtv = threadInfo.adminIDs.length;
  let sl = threadInfo.messageCount;
  let threadMem = threadInfo.participantIDs.length;
  const path = global.nodemodule["path"];
  const Canvas = global.nodemodule["canvas"];
  const __root = path.resolve(__dirname, "cache");
  var qtv2 = threadInfo.adminIDs;
  var idad = qtv2[Math.floor(Math.random() * qtv)];
  let idmem = threadInfo.participantIDs
  var idmemrd = idmem[Math.floor(Math.random() * threadMem)];
  var idmemrd1 = idmem[Math.floor(Math.random() * threadMem)];
  let getAvatarOne = (await axios.get(`https://graph.facebook.com/${idad.id}/picture?height=720&width=720&access_token=${TOKEN}`, { responseType: 'arraybuffer' })).data;
  let getAvatarOne2 = (await axios.get(`https://graph.facebook.com/${idmemrd}/picture?height=720&width=720&access_token=${TOKEN}`, { responseType: 'arraybuffer' })).data;
  let getAvatarOne3 = (await axios.get(`https://graph.facebook.com/${idmemrd1}/picture?height=720&width=720&access_token=${TOKEN}`, { responseType: 'arraybuffer' })).data;
  let Avatar = (
    await axios.get(encodeURI(
      `${threadInfo.imageSrc}`),
      { responseType: "arraybuffer" }
    )
  ).data;
  let getWanted = (
    await axios.get(encodeURI(`https://i.postimg.cc/pTb7L0MT/20240623-053326.jpg`), {
      responseType: "arraybuffer",
    })
  ).data;
  fs.writeFileSync(pathAva, Buffer.from(Avatar, "utf-8"));
  fs.writeFileSync(pathAvata, Buffer.from(getAvatarOne, 'utf-8'));
  fs.writeFileSync(pathAvata2, Buffer.from(getAvatarOne2, 'utf-8'));
  fs.writeFileSync(pathAvata3, Buffer.from(getAvatarOne3, 'utf-8'));
  avatar = await this.circle(pathAva);
  avataruser = await this.circle(pathAvata);
  avataruser2 = await this.circle(pathAvata2);
  avataruser3 = await this.circle(pathAvata3);
  fs.writeFileSync(pathImg, Buffer.from(getWanted, "utf-8"));

/*-----------------download----------------------*/
if(!fs.existsSync(__dirname+`${fonts}`)) { 
      let getfont = (await axios.get(`${downfonts}`, { responseType: "arraybuffer" })).data;
       fs.writeFileSync(__dirname+`${fonts}`, Buffer.from(getfont, "utf-8"));
    };
/*---------------------------------------------*/

  let baseImage = await loadImage(pathImg);
  let baseAva = await loadImage(avatar);
  let baseAvata = await loadImage(avataruser);
  let baseAvata2 = await loadImage(avataruser2);
  let baseAvata3 = await loadImage(avataruser3);
  let canvas = createCanvas(baseImage.width, baseImage.height);
  let ctx = canvas.getContext("2d");
  let text = args.join(" ") || threadName
  let id = threadInfo.threadID;
  ctx.drawImage(baseImage, 0, 0, canvas.width, canvas.height);
  ctx.drawImage(baseAva, 790, 182, 450, 450);
  ctx.drawImage(baseAvata, 450, 685, 43, 43);
  ctx.drawImage(baseAvata2, 500, 685, 43, 43);
  ctx.drawImage(baseAvata3, 550, 685, 43, 43);
  ctx.font = `700 ${fontsName}px Arial`;
  ctx.fillStyle = `${colorName}`
  ctx.textAlign = "start";
  fontSize = 250;
  ctx.fillText(text, 100, 85);
  Canvas.registerFont(__dirname+`${fonts}`, {
        family: "Play-Bold"
    });
  ctx.font = `${fontsInfo}px Play-Bold`;
  ctx.fillStyle = "#ffff";
  ctx.textAlign = "start";
  fontSize = 20;
  ctx.fillText(`${pd} `, 300, 350);
  ctx.fillText(` ${threadMem}`, 377, 415);
  ctx.fillText(`${qtv}`, 210, 473);
  ctx.fillText(`${nam}`, 460, 537);
  ctx.fillText(`${nu}`, 498, 601);
  ctx.fillText(`${sl}`, 450, 665);
  ctx.font = `${fontsOthers}px Play-Bold`;
  ctx.fillStyle = "#ffff";
  ctx.textAlign = "start";
  fontSize = 70;
  ctx.fillText(` ${id}`, 300, 280);
  ctx.font = `${fontsOthers}px Play-Bold`;
  ctx.fillStyle = "#ffff";
  ctx.textAlign = "start";
  fontSize = 20;
  ctx.fillText(`With ${parseInt(threadMem)-3} other members`, 607, 715);
  ctx.beginPath();
  const imageBuffer = canvas.toBuffer();
  fs.writeFileSync(pathImg, imageBuffer);
  fs.removeSync(pathAva);
  fs.removeSync(pathAvata);
  var rebel0 = (`.   ╭──────────────────╮\n          ʙᴏx ɪɴꜰᴏʀᴍᴀᴛɪᴏɴ\n    ╰──────────────────╯\n
♻️ ɢʀᴏᴜᴘ ɴᴀᴍᴇ: ${threadName}`);
  var rebel1 = (`_________________________________\n♻️ ᴀᴘᴘʀᴏᴠᴀʟ: ${pd} `);
  var rebel2 = (`_________________________________\n♻️ ɴᴜᴍʙᴇʀ ᴏꜰ ᴍᴀʟᴇꜱ: ${nam}  ᴍᴇᴍʙᴇʀꜱ`);
  var rebel3 = (`_________________________________\n♻️ ɴᴜᴍʙᴇʀ ᴏꜰ ꜰᴇᴍᴀʟᴇꜱ: ${nu}  ᴍᴇᴍʙᴇʀꜱ`);
  var rebel4 = (`_________________________________\n♻️ ᴡɪᴛʜ ${qtv}  ᴀᴅᴍɪɴɪꜱᴛʀᴀᴛᴏʀꜱ`);
  var rebel5 = (`_________________________________\n♻️ ᴛᴏᴛᴀʟ ɴᴜᴍʙᴇʀ ᴏꜰ ᴍᴇꜱꜱᴀɢᴇꜱ: ${sl} ᴍꜱɢꜱ`);
  var rebel6 = (`_________________________________\n♻️ ᴇᴍᴏᴊɪ: ${icon} `);
  var rebel7 = (` _________________________________\n♻️ ɢʀᴏᴜᴘ ɪᴅ: ${id}\n     _________________________________\n𝚃𝙷𝙸𝚂 𝙱𝙾𝚃 𝙲𝙾𝙽𝚃𝚁𝙾𝙻𝙸𝙽𝙶 𝙱𝚈 : 𝐓𝐑𝟒 𝐀𝐑𝐈𝐅 𝐕𝐀𝐔`)
  var rebel = (`${rebel0}\n${rebel1}\n${rebel2}\n${rebel3}\n${rebel4}\n${rebel5}\n${rebel6}\n${rebel7}`);

  return api.sendMessage(
 { body: rebel, attachment: fs.createReadStream(pathImg) },
    threadID,
    () => fs.unlinkSync(pathImg),
    messageID
  );
};
