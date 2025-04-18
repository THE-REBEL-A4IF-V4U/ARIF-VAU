module.exports.config = {
  name: "calculator",
  version: "1.1.0",
  permission: 0,
  credits: "Modified by Rebel from August Quinn",
  description: "সরল গাণিতিক হিসাব এবং ইউনিট রূপান্তর করুন",
  prefix: true,
  category: "with prefix",
  usages: "[অপারেশন বা চিহ্ন] [সংখ্যা]",
  cooldowns: 5,
};

module.exports.run = async function({ api, event, args }) {
  const { threadID, messageID, senderID } = event;

  const getUserInfo = async (api, userID) => {
    try {
      const userInfo = await api.getUserInfo(userID);
      return userInfo[userID].name;
    } catch (error) {
      console.error(`Error fetching user info: ${error}`);
      return "";
    }
  };

  const userName = await getUserInfo(api, senderID);

  if (args.length < 2) {
    return api.sendMessage(`প্রিয় ${userName}, সঠিকভাবে ব্যবহার করুন:\n\n/calc [অপারেশন বা চিহ্ন] [সংখ্যা]\n\nউদাহরণ: /calc + ৫ ১০`, threadID, messageID);
  }

  const operation = args[0].toLowerCase();
  const numbers = args.slice(1).map(arg => parseFloat(arg));

  if (numbers.some(isNaN)) {
    return api.sendMessage(`⚠️ ${userName}, দয়া করে সঠিক সংখ্যা প্রদান করুন।`, threadID, messageID);
  }

  let result;

  switch (operation) {
    case "add":
    case "+":
      result = numbers.reduce((acc, val) => acc + val, 0);
      break;
    case "subtract":
    case "-":
      result = numbers.reduce((acc, val) => acc - val);
      break;
    case "multiply":
    case "*":
    case "x":
      result = numbers.reduce((acc, val) => acc * val, 1);
      break;
    case "divide":
    case "/":
      result = numbers.reduce((acc, val) => acc / val);
      break;
    case "power":
      result = Math.pow(numbers[0], numbers[1]);
      break;
    case "mass":
      result = numbers[0] * 2.20462; // কেজি থেকে পাউন্ড
      break;
    case "temperature":
      result = (numbers[0] * 9/5) + 32; // সেলসিয়াস থেকে ফারেনহাইট
      break;
    case "time":
      result = numbers[0] / 60; // সেকেন্ড থেকে মিনিট
      break;
    case "speed":
      result = numbers[0] * 3.6; // মিটার/সেকেন্ড থেকে কিমি/ঘণ্টা
      break;
    default:
      return api.sendMessage(`প্রিয় ${userName}, এই অপারেশনটি সমর্থিত নয়।\n\nআপনি এই অপারেশনগুলো ব্যবহার করতে পারেন:\n➜ + বা add (যোগ)\n➜ - বা subtract (বিয়োগ)\n➜ * বা multiply (গুণ)\n➜ / বা divide (ভাগ)\n➜ power (ঘাত)\n➜ mass (ওজন রূপান্তর)\n➜ temperature (তাপমাত্রা রূপান্তর)\n➜ time (সময় রূপান্তর)\n➜ speed (গতি রূপান্তর)`, threadID, messageID);
  }

  const message = `🧮 𝗖𝗔𝗟𝗖𝗨𝗟𝗔𝗧𝗢𝗥\n\n${userName}, আপনার "${operation}" হিসাবের ফলাফল হলো: ${result}`;

  api.sendMessage(message, threadID, messageID);
};
