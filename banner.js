// banner.js
const chalk = require("chalk");

function showBanner() {
  const banner = `
🌅 ${chalk.hex("#FFA07A").bold("THIS BOT MADE BY (REBEL)")} 🌅

${chalk.cyan(`
 _____  ______ ____  ______ _      
|  __ \\|  ____|  _ \\|  ____| |     
| |__) | |__  | |_) | |__  | |     
|  _  /|  __| |  _ <|  __| | |     
| | \\ \\| |____| |_) | |____| |____ 
|_|  \\_\\______|____/|______|______|
`)}

${chalk.green("Developer:")} MD ARIFUL ISLAM ASIF
${chalk.green("Facebook :")} https://facebook.com/ARIFUL.ISLAM.233
${chalk.green("WhatsApp :")} 01905600093
`;
  console.log(banner);
}

module.exports = { showBanner };