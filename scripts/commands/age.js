module.exports.config = {
  name: "age",
  version: "1.0.0",
  permission: 0,
  credits: "Blue",
  description: "Calculate your age based on your birthday.",
  prefix: true,
  category: "utility",
  cooldowns: 5,
  usages: "[YYYY-MM-DD]",
};

module.exports.run = function ({ api, event, args }) {
  const birthday = args[0];

  if (!birthday) {
    return api.sendMessage("Please provide your birthday in YYYY-MM-DD format.", event.threadID);
  }

  const currentDate = new Date();
  const birthDate = new Date(birthday);
  const age = currentDate.getFullYear() - birthDate.getFullYear();
  const isBeforeBirthday = currentDate.getMonth() < birthDate.getMonth() ||
                           (currentDate.getMonth() === birthDate.getMonth() && currentDate.getDate() < birthDate.getDate());

  const finalAge = isBeforeBirthday ? age - 1 : age;

  api.sendMessage(`তোমার বয়স ${finalAge} বুইড়া 😝`, event.threadID);
};
