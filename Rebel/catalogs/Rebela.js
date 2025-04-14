const { spawn } = require("child_process");
const chalk = require("chalk");
const path = require("path");
const logger = require("./Rebelc.js");

let botProcess = null;

function startBot() {
  logger("Starting REBEL Bot...", "rebel");
  runBot();
}

function runBot() {
  botProcess = spawn("node", ["Rebelb.js"], {
    cwd: __dirname,
    stdio: "inherit",
    shell: true,
  });

  botProcess.on("close", (code) => {
    logger("Bot exited with code " + code, "warn");
    if (code !== 0) {
      logger("Restarting bot in 5 seconds...", "rebel");
      setTimeout(() => {
        runBot(); // restart bot
      }, 5000);
    }
  });

  botProcess.on("error", (error) => {
    logger("An error occurred: " + JSON.stringify(error), "error");
  });
}

startBot();
