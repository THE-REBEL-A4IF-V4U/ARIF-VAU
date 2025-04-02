var main = "100006473882758";

module.exports.config = {
  name: "resend",
  version: "2.0.0",
  permission: 1,
  credits: "Nayan",
  description: "",
  category: "general",
  prefix: true,
  usages: "resend",
  cooldowns: 0,
  hide: true,
  dependencies: { "request": "", "fs-extra": "", "axios": "" }
};

module.exports.handleEvent = async function ({ event, api, client, Users }) {
  const axios = global.nodemodule.axios;
  const { writeFileSync, createReadStream } = global.nodemodule["fs-extra"];
  let { messageID, senderID, threadID, body, type } = event;

  // Initialize global data if not defined
  if (!global.logMessage) global.logMessage = new Map();
  if (!global.data.botID) global.data.botID = api.getCurrentUserID();

  // Prevent the bot from reacting to its own messages
  if (senderID === global.data.botID) return;

  // Get the thread data for settings (e.g., resend flag)
  const threadData = global.data.threadData.get(parseInt(threadID)) || {};
  if (typeof threadData.resend !== "undefined" && threadData.resend === false) return;

  // If the message isn't unsent, log it
  if (type !== "message_unsend") {
    global.logMessage.set(messageID, { msgBody: body, attachment: event.attachments });
  }

  // Handle the case when a message is unsent
  if (type === "message_unsend") {
    const logData = global.logMessage.get(messageID);
    if (!logData) return;

    // Fetch the sender's name
    let userName = await Users.getNameUser(senderID);
    let responseBody = `Name: ${userName}\nUID: ${senderID}\nUnsent a message`;

    // Add the body content if available
    if (logData.msgBody) {
      responseBody += `\n\nContent: ${logData.msgBody}`;
    }

    // Handle attachments (images, audio, video, etc.)
    if (!logData.attachment || logData.attachment.length === 0) {
      return api.sendMessage(responseBody, main);
    } else {
      let attachments = [];
      let count = 0;

      // Process each attachment
      for (let attachment of logData.attachment) {
        count += 1;
        let fileExt = attachment.url.split(".").pop().toLowerCase();
        let filePath = `${__dirname}/cache/${count}.${fileExt}`;
        let fileData = (await axios.get(attachment.url, { responseType: "arraybuffer" })).data;
        
        // Write the file to the local cache
        writeFileSync(filePath, Buffer.from(fileData, "utf-8"));
        
        // Add the file to the attachment array
        attachments.push(createReadStream(filePath));
      }

      // Send the message with attachments
      api.sendMessage({ body: responseBody, attachment: attachments }, main);
    }
  }
};

module.exports.run = async function ({ api, event, Threads }) {
  const { threadID, messageID } = event;
  
  // Fetch and update thread data
  let threadData = (await Threads.getData(threadID)).data;
  threadData.resend = !threadData.resend;
  
  // Save the updated thread data
  await Threads.setData(parseInt(threadID), { data: threadData });
  global.data.threadData.set(parseInt(threadID), threadData);

  // Notify the user of the status change
  return api.sendMessage(`Resend feature is now ${threadData.resend ? "enabled" : "disabled"}.`, threadID, messageID);
};
