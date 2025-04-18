const axios = require('axios');
const FormData = require('form-data');
const fs = require('fs-extra');
const path = require('path');
const downloader = require('image-downloader');

module.exports.config = {
  name: 'remove',
  version: '1.1.1',
  permission: 2,
  credits: 'REBEL',
  prefix: false,
  description: 'Remove photo background',
  category: 'user',
  usages: 'remove (reply to image)',
  cooldowns: 2,
  dependencies: {
    'form-data': '',
    'image-downloader': '',
    'fs-extra': ''
  }
};

module.exports.run = async function({ api, event, args }) {
  try {
    if (event.type !== "message_reply") 
      return api.sendMessage("Please reply to a photo.", event.threadID, event.messageID);

    if (!event.messageReply.attachments || event.messageReply.attachments.length === 0) 
      return api.sendMessage("No attachment found. Please reply to a photo.", event.threadID, event.messageID);

    const attachment = event.messageReply.attachments[0];
    if (attachment.type !== "photo") 
      return api.sendMessage("This is not a photo.", event.threadID, event.messageID);

    const imageUrl = attachment.url;
    const apiKeys = ["x6mFTNH6YfBD3vCVXTwkLuqa"]; // You can add more keys here

    const cachePath = path.join(__dirname, 'cache');
    if (!fs.existsSync(cachePath)) fs.mkdirSync(cachePath);

    const inputPath = path.join(cachePath, `photo.png`);
    await downloader.image({ url: imageUrl, dest: inputPath });

    const formData = new FormData();
    formData.append('size', 'auto');
    formData.append('image_file', fs.createReadStream(inputPath));

    const { data } = await axios({
      method: 'post',
      url: 'https://api.remove.bg/v1.0/removebg',
      data: formData,
      responseType: 'arraybuffer',
      headers: {
        ...formData.getHeaders(),
        'X-Api-Key': apiKeys[Math.floor(Math.random() * apiKeys.length)],
      }
    });

    const outputPath = path.join(cachePath, `output.png`);
    fs.writeFileSync(outputPath, data);

    api.sendMessage({ attachment: fs.createReadStream(outputPath) }, event.threadID, () => {
      fs.unlinkSync(inputPath);
      fs.unlinkSync(outputPath);
    }, event.messageID);

  } catch (error) {
    console.error(error);
    return api.sendMessage("An error occurred while removing background.", event.threadID, event.messageID);
  }
};        formData.append('size', 'auto');
        formData.append('image_file', fs.createReadStream(inputPath), path.basename(inputPath));
        axios({
            method: 'post',
            url: 'https://api.remove.bg/v1.0/removebg',
            data: formData,
            responseType: 'arraybuffer',
            headers: {
                ...formData.getHeaders(),
                'X-Api-Key': KeyApi[Math.floor(Math.random() * KeyApi.length)],
            },
            encoding: null
        })
            .then((response) => {
                if (response.status != 200) return console.error('Error:', response.status, response.statusText);
                fs.writeFileSync(inputPath, response.data);
                return api.sendMessage({ attachment: fs.createReadStream(inputPath) }, event.threadID, () => fs.unlinkSync(inputPath));
            })
            .catch((error) => {
                return console.error('Request failed:', error);
            });
     } catch (e) {
        console.log(e)
        return api.sendMessage(`có cái nịt`, event.threadID, event.messageID);
  }
};
