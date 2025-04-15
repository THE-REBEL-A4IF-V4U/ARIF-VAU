const fs = require("fs");
const axios = require("axios");
const request = require("request");

module.exports.config = {
  name: "fbvideo",
  version: "2.0.0",
  permission: 0,
  credits: "TR4",
  description: "Download video from facebook",
  prefix: true,
  category: "download",
  usages: "link",
  cooldowns: 5,
  dependencies: {
    'image-downloader': '',
  }
};

module.exports.run = async function({ api, event, args }) {
  api.setMessageReaction("😽", event.messageID, (err) => {}, true);
  api.sendTypingIndicator(event.threadID, true);
  
  const { messageID, threadID } = event;

  const prompt = args.join(" ");
  if (!args[0]) return api.sendMessage("[ ! ] Input link.", threadID, messageID);

  const content = args.join(" ");
  if (!args[1]) {
    // Show loading image
    const loadingImageURL = 'https://drive.google.com/uc?export=download&id=1HPv0BraxhZP8RG9bLYS5wznxunyiB6x7'; // Change to your loading image URL
    api.sendMessage({
      body: `একটু অপেক্ষা করুন \n\nআপনার ভিডিও ডাওনলোড হচ্ছে ...`,
      attachment: request(loadingImageURL)
    }, event.threadID, (err, info) => {
      const loadingMessageID = info.messageID;
      setTimeout(() => { api.unsendMessage(loadingMessageID) }, 20000); // Remove loading image after 20 seconds
    });
  }

  try {
    let data = await axios.get(`https://rebel-api-server.onrender.com/facebook?url=${content}`);
    
    // Create cache folder if not exists
    const cacheDir = __dirname + '/cache';
    if (!fs.existsSync(cacheDir)) {
      fs.mkdirSync(cacheDir);
    }

    const filePath = cacheDir + '/fbvideo.mp4';
    const file = fs.createWriteStream(filePath);
    
    const hd = data.data.downloads.find(item => item.quality === "Download Video in HD Quality").link;
    const userName = data.data.title;

    const rqs = request(encodeURI(hd));
    rqs.pipe(file);  

    file.on('finish', () => {
      setTimeout(function() {
        return api.sendMessage({
          body: `Downloaded Successfully.` + `\n\nTitle : ${userName}`,
          attachment: fs.createReadStream(filePath)
        }, threadID, messageID);
      }, 5000);
    });
  } catch (err) {
    api.sendMessage(`Error: ${err.message}`, event.threadID, event.messageID);  
  }
};
