const chalk = require("chalk");
const gradient = require("gradient-string");
const color = gradient("blue", "purple");
const crayon = gradient("yellow", "lime", "green");
const blu = gradient("#243aff", "#4687f0", "#5800d4");
const sky = gradient("#0905ed", "#346eeb", "#344feb");
module.exports = (_0x553e50, _0x10178b) => {
  switch (_0x10178b) {
    case "warn":
      process.stderr.write(color("warn - ") + _0x553e50 + "\n");
      break;
    case "error":
      process.stderr.write(chalk.bold.hex("#ff0000").bold("error - ") + _0x553e50 + "\n");
      break;
    case "load":
      process.stderr.write(blu("new user - ") + _0x553e50 + "\n");
      break;
    default:
      process.stderr.write(sky(String(_0x10178b) + " - ") + _0x553e50 + "\n");
      break;
  }
};
module.exports.error = (_0xffad40, _0x234eb0) => {
  process.stderr.write(chalk.hex("#ff0000")("error - ") + _0xffad40 + "\n");
};
module.exports.err = (_0x2bb4eb, _0x22515f) => {
  process.stderr.write(chalk.hex("#ff0000")("error - ") + _0x2bb4eb) + "\n";
};
module.exports.warn = (_0x4e5f2f, _0xd74d84) => {
  process.stderr.write(chalk.yellow("warn - ") + _0x4e5f2f + "\n");
};
module.exports.loader = (_0x82ddd9, _0x33f125) => {
  switch (_0x33f125) {
    case "warn":
      process.stderr.write(crayon("warn - ") + _0x82ddd9 + "\n");
      break;
    case "error":
      process.stderr.write(chalk.hex("#ff0000")("error - ") + _0x82ddd9 + "\n");
      break;
    default:
      process.stderr.write(blu("REBEL - ") + _0x82ddd9 + "\n");
      break;
  }
};