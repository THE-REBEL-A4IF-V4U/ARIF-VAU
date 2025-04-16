module.exports.config = {
  name: "autospamaccept",
  version: "1.0.1",
  credits: "REBEL A4IF",
  description: "Auto accept message requests with blacklist and random welcome message."
};

module.exports.run = async function ({ api, event }) {
  const senderID = event.senderID;

  // Step 1: Blacklist user IDs
  const blacklist = ["1000123456789", "1000111122223333"]; // Add your spammer IDs here
  if (blacklist.includes(senderID)) {
    console.log(`Blocked user tried to message: ${senderID}`);
    return;
  }

  try {
    // Step 2: Check if already accepted
    const info = await api.getThreadInfo(senderID);
    if (info.isSubscribed) return; // Already accepted

    // Step 3: Random welcome messages
    const messages = [
      "HLW NEW USER\nWELCOME TO THE REBEL SQUAD",
      "YO BRO! WELCOME TO OUR FAMILY!",
      "HEY THERE! GLAD TO HAVE YOU HERE!",
      "WELCOME! YOU'RE NOW PART OF THE REBEL GANG!",
      "HI NEW FRIEND! ENJOY THE REBEL BOT!"
    ];
    const randomMessage = messages[Math.floor(Math.random() * messages.length)];

    // Step 4: Accept request & send message
    await api.handleMarkAsRead(senderID);
    await api.sendMessage(
      `${randomMessage}\n\nTHIS BOT MADE BY ARIF VAU\nACCOUNT LINK: https://www.facebook.com/ARIF.THE.REBEL.233`,
      senderID
    );

    console.log(`Accepted and greeted user: ${senderID}`);
  } catch (err) {
    console.error("Auto accept failed:", err.message);
  }
};
