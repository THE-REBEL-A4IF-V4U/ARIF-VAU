const axios = require('axios');
const fs = require('fs-extra');
const FormData = require('form-data');
 
module.exports.config = {
    name: "4k",
    version: "1.0.2",
    permssion: 0,
    credits: "Satoru",
    description: "AI দিয়ে ছবিকে স্পষ্ট করা",
    category: "Box",
    cooldowns: 5, 
    prefix: true
};
 
module.exports.onStart = async function ({ api, event }) {
    let imgFile;
    if (event.messageReply) {
        imgFile = event.messageReply.attachments.find(attachment => attachment.type == "photo");
    }
    else {
        imgFile = event.attachments.find(attachment => attachment.type == "photo");
    }
 
    if (!imgFile)
        return api.sendMessage("আপনাকে অবশ্যই কোনো ছবি পাঠাতে বা রিপ্লাই দিতে হবে স্পষ্ট করার জন্য।", event.threadID, event.messageID);
 
    const getStream = (await axios.get(imgFile.url, { responseType: 'stream' })).data;
 
    api.sendMessage("⏳ ছবি স্পষ্ট করা হচ্ছে, অনুগ্রহ করে অপেক্ষা করুন...", event.threadID, async (err, info) => {
        try {
            const buffer = await lamNetAnh(getStream);
 
            const pathSaveImg = __dirname + `/cache/lamnetanh_${event.senderID}_${Date.now()}.png`;
            fs.writeFileSync(pathSaveImg, buffer);
 
            return api.sendMessage({ 
                body: `✅ সফলভাবে সম্পন্ন!\n🖼️ নিচে স্পষ্ট করা ছবি দেওয়া হলো!`,
                attachment: fs.createReadStream(pathSaveImg)
            }, event.threadID, () => {
                fs.unlinkSync(pathSaveImg);
                api.unsendMessage(info.messageID);
            }, event.messageID);
        } catch (error) {
            return api.sendMessage(`একটি ত্রুটি ঘটেছে: ${error.message}`, event.threadID, event.messageID);
        }
    }, event.messageID);
};
 
async function lamNetAnh(fileStream) {
    try {
        const form = new FormData();
        form.append('image', '{}');
        form.append('image', fileStream, {
            filename: 'image.jpg',
            contentType: 'image/jpeg'
        });
 
        const postUploadResponse = await axios.post('https://api.imggen.ai/guest-upload', form, {
            headers: {
                ...form.getHeaders(),
                'Accept': '*/*',
                'Accept-Encoding': 'gzip, deflate, br',
                'Accept-Language': 'bn-BD,bn;q=0.9,en-US;q=0.8,en;q=0.7',
                'Origin': 'https://imggen.ai',
                'Referer': 'https://imggen.ai/',
                'User-Agent': 'Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Mobile Safari/537.36'
            }
        });
 
        let uploadedImageData = postUploadResponse.data.image;
        uploadedImageData.url = `https://api.imggen.ai${uploadedImageData.url}`;
 
        const postUpscaleResponse = await axios.post('https://api.imggen.ai/guest-upscale-image', 
            {
                image: uploadedImageData
            },
            {
                headers: {
                    'Accept': 'application/json, text/plain, */*',
                    'Content-Type': 'application/json',
                    'Origin': 'https://imggen.ai',
                    'Referer': 'https://imggen.ai/',
                    'User-Agent': 'Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Mobile Safari/537.36'
                }
            }
        );
 
        if (postUpscaleResponse.data.message !== 'Image upscaled successfully') {
            throw new Error('ছবি স্পষ্ট করা ব্যর্থ হয়েছে');
        }
 
        const upscaledImageUrl = `https://api.imggen.ai${postUpscaleResponse.data.upscaled_image}`;
 
        const { data: imgBuffer } = await axios.get(upscaledImageUrl, { responseType: 'arraybuffer' });
        return imgBuffer;
 
    } catch (error) {
        console.error('ছবি স্পষ্ট করার প্রক্রিয়ায় ত্রুটি:', error);
        throw new Error('ছবি স্পষ্ট করা সম্ভব হয়নি। অনুগ্রহ করে পরে আবার চেষ্টা করুন।');
    }
}
