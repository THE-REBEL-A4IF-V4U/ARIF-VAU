const axios = require('axios');

module.exports.config = {
  name: "autospamaccept",
  version: "1.0.2",
  credits: "REBEL A4IF",
  description: "Auto accept message requests with dynamic blacklist and random welcome message."
};

module.exports.run = async function ({ api, event }) {
  const senderID = event.senderID;

  if (!event.body && !event.attachments?.length) return;

  try {
    // Step 1: Get remote blacklist
    const res = await axios.get('https://raw.githubusercontent.com/YourUsername/YourRepo/main/blacklist.json');
    const blacklist = res.data;

    if (blacklist.includes(senderID)) {
      console.log(`Blocked user tried to message: ${senderID}`);
      return;
    }

    // Step 2: Check if already accepted
    const info = await api.getThreadInfo(senderID);
    if (info.isSubscribed) return;

    // Step 3: Random welcome
    const messages = [
      "HLW NEW USER\nWELCOME TO THE REBEL SQUAD",
      "YO BRO! WELCOME TO OUR FAMILY!",
      "HEY THERE! GLAD TO HAVE YOU HERE!",
      "WELCOME! YOU'RE NOW PART OF THE REBEL GANG!",
      "HI NEW FRIEND! ENJOY THE REBEL BOT!"
    ];
    const randomMessage = messages[Math.floor(Math.random() * messages.length)];

    // Step 4: Accept request + welcome
    await api.handleMarkAsRead(senderID);
    await api.sendMessage(
      `${randomMessage}\n\nTHIS BOT MADE BY ARIF VAU\nACCOUNT LINK: https://www.facebook.com/ARIF.THE.REBEL.233`,
      senderID
    );

    console.log(`Accepted & welcomed user: ${senderID}`);
  } catch (err) {
    console.error("Auto accept error:", err.message);
  }
};