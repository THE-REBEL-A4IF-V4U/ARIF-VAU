module.exports.config = { name: "inbox", version: "1.0", permission: 0, // Changed to 0 so everyone can use it 
                         credits: "Rebel", description: "Send an image with a message to a user's inbox", category: "general", usages: "inbox", prefix: true, cooldowns: 5, dependencies: "", };

module.exports.run = async function ({ api, event, Users, args }) { var userID = Object.keys(event.mentions)[0] || event.senderID; var userName = await Users.getNameUser(userID);

const messageText = ✅ SUCCESSFULLY SENT MESSAGE\n\n🔰 [${userName}] PLEASE CHECK YOUR INBOX OR MESSAGE REQUEST BOX.;

// URL of the image file const imageUrl = "https://drive.google.com/uc?export=download&id=1EfUxyNQzXhItnzvL3qRQWOyaP765nd2m"; // Change this to the correct image URL

try { const attachment = await global.utils.getStreamFromURL(imageUrl); var messageData = { body: "✅ SUCCESSFULLY ALLOW\n🔰 NOW YOU CAN USE " + global.config.BOTNAME + " HERE", attachment: attachment };

// Send confirmation message to the group
api.sendMessage(messageText, event.threadID);

// Send the message with an image to the user's inbox
api.sendMessage(messageData, userID, (err) => {
  if (err) {
    api.sendMessage("❌ Failed to send image to inbox.", event.threadID);
  }
});

} catch (error) { api.sendMessage("❌ Error fetching the image.", event.threadID); } };

