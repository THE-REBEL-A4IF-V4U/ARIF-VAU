class Box {
  constructor(api, event) {
    this.api = api;
    this.event = event;
    this.lastID = null;
  }

  reply(message, threadID, callback) {
    return new Promise((resolve) => {
      this.api.sendMessage(
        message,
        threadID || this.event.threadID,
        async (err, info) => {
          if (typeof callback === "function") {
            await callback(err, info);
          }
          this.lastID = info?.messageID;
          resolve(info);
        }
      );
    });
  }

  sendContact(contact, message, threadID, callback) {
    return new Promise((resolve) => {
      this.api.send(
        contact,
        message,
        threadID || this.event.threadID,
        async (err, info) => {
          if (typeof callback === "function") {
            await callback(err, info);
          }
          this.lastID = info?.messageID;
          resolve(info);
        }
      );
    });
  }

  send(message, threadID, callback) {
    return new Promise((resolve) => {
      this.api.sendMessage(
        message,
        threadID || this.event.threadID,
        async (err, info) => {
          if (typeof callback === "function") {
            await callback(err, info);
          }
          this.lastID = info?.messageID;
          resolve(info);
        }
      );
    });
  }

  react(emoji, messageID, callback) {
    return new Promise((resolve) => {
      this.api.setMessageReaction(
        emoji,
        messageID || this.event.messageID,
        async (err, ...extra) => {
          if (typeof callback === "function") {
            await callback(err, ...extra);
          }
          resolve(true);
        },
        true
      );
    });
  }

  edit(newMessage, messageID, callback) {
    return new Promise((resolve) => {
      this.api.editMessage(
        newMessage,
        messageID || this.lastID,
        async (err, ...extra) => {
          if (typeof callback === "function") {
            await callback(err, ...extra);
          }
          resolve(true);
        }
      );
    });
  }
}

module.exports = Box;