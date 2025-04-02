const axios = require('axios');
const fs = require('fs');

module.exports.config = {
    name: "rmbg",
    version: "1.0.0",
    permission: 2,
    credits: "TR4",
    description: "bg remove .",
    prefix: false,
    category: "bg remove ",
    usages: "/rmbg",
    cooldowns: 2,
};

module.exports.run = async ({ api, event }) => {
  const imageLink = event.messageReply?.attachments[0]?.url;
  const outputFile = `./removebg-${event.senderID}-${Date.now()}.png`; //save
 { api.setMessageReaction("👀", event.messageID, (err) => {}, true);
 }
  if (!imageLink) {
    api.sendMessage("Please reply to an image.", event.threadID, event.messageID);
    return;
  }
 const waitMessage = await api.sendMessage("𝗪𝗮𝗶𝘁 𝗞𝗼𝗿𝗼 𝗕𝗮𝗯𝘆 <😘", event.threadID);
  
  const apiKey = 'zXTXpDCsnkudFrhUXXrZ9ZBN';
  const apiUrl = `https://api.remove.bg/v1.0/removebg`;

  axios.post(apiUrl, {
    image_url: imageLink,
    size: "auto"
  }, {
    headers: {
      'X-Api-Key': apiKey
    },
    responseType: 'arraybuffer'
  })
    .then((response) => {
      if (response.status !== 200) throw new Error(`Error: ${response.status}`);
      fs.writeFileSync(outputFile, response.data);
       setTimeout(() => {
      api.unsendMessage(waitMessage.messageID);
    }, 5000);
      api.sendMessage({
        body: '𝗔𝗶 𝗻𝗮𝘄 𝗕𝗮𝗯𝘆 < 😘😘',
        attachment: fs.createReadStream(outputFile)
      }, event.threadID, () => fs.unlinkSync(outputFile), event.messageID);
    })
    .catch((error) => {
      api.sendMessage(`Failed to remove background: ${error.message}`, event.threadID, event.messageID);
    });
};