const chalk = require("chalk"); const gradient = require("gradient-string");

const color = gradient("blue", "purple"); const crayon = gradient("yellow", "lime", "green"); const blu = gradient("#243aff", "#4687f0", "#5800d4"); const sky = gradient("#0905ed", "#346eeb", "#344feb");

const log = (message, type = "info") => { switch (type) { case "warn": process.stderr.write(color("warn - ") + message + "\n"); break; case "error": process.stderr.write(chalk.bold.hex("#ff0000")("error - ") + message + "\n"); break; case "load": process.stderr.write(blu("new user - ") + message + "\n"); break; default: process.stderr.write(sky(${type} - ) + message + "\n"); break; } };

log.error = (message) => { process.stderr.write(chalk.hex("#ff0000")("error - ") + message + "\n"); };

log.warn = (message) => { process.stderr.write(chalk.yellow("warn - ") + message + "\n"); };

log.loader = (message, type = "info") => { switch (type) { case "warn": process.stderr.write(crayon("warn - ") + message + "\n"); break; case "error": process.stderr.write(chalk.hex("#ff0000")("error - ") + message + "\n"); break; default: process.stderr.write(blu("REBEL - ") + message + "\n"); break; } };

module.exports = log;

