const chalk = require("chalk");
const gradient = require("gradient-string");

// Define gradient colors for different types of messages
const color = gradient("blue", "purple");
const crayon = gradient("yellow", "lime", "green");
const blu = gradient("#243aff", "#4687f0", "#5800d4");
const sky = gradient("#0905ed", "#346eeb", "#344feb");

// Main logging function
module.exports = (message, type) => {
  switch (type) {
    case "warn":
      process.stderr.write(color("warn - ") + message + "\n");
      break;
    case "error":
      process.stderr.write(chalk.bold.hex("#ff0000").bold("error - ") + message + "\n");
      break;
    case "load":
      process.stderr.write(blu("new user - ") + message + "\n");
      break;
    default:
      process.stderr.write(sky(String(type) + " - ") + message + "\n");
      break;
  }
};

// Error handling function
module.exports.error = (message) => {
  process.stderr.write(chalk.hex("#ff0000")("error - ") + message + "\n");
};

// Alternative error handling function (shortened version)
module.exports.err = (message) => {
  process.stderr.write(chalk.hex("#ff0000")("error - ") + message + "\n");
};

// Warning function
module.exports.warn = (message) => {
  process.stderr.write(chalk.yellow("warn - ") + message + "\n");
};

// Loader function for different log levels
module.exports.loader = (message, type) => {
  switch (type) {
    case "warn":
      process.stderr.write(crayon("warn - ") + message + "\n");
      break;
    case "error":
      process.stderr.write(chalk.hex("#ff0000")("error - ") + message + "\n");
      break;
    default:
      process.stderr.write(blu("REBEL - ") + message + "\n");
      break;
  }
};