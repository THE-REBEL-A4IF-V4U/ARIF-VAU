const { spawn } = require("child_process");
const chalk = require("chalk");
const path = require("path");
const express = require("express");
const fs = require("fs");
const app = express();
const logger = require("./Rebelc.js");

const PORT = process.env.PORT || 8080;
let botProcess = null;
let serverStarted = false;

app.get("/", (req, res) => {
  const filePath = path.join(__dirname, "./website/Rebel.html");
  if (fs.existsSync(filePath)) {
    res.sendFile(filePath);
  } else {
    res.send("<h1>Website is coming soon. Rebel.html not found.</h1>");
  }
});

function startBot() {
  logger("Starting REBEL Bot...", "rebel");

  if (!serverStarted) {
    app.listen(PORT, () => {
      logger.loader(`Website served on port ${chalk.blueBright(PORT)}`);
    });
    serverStarted = true; // Mark as started
    logger.loader(`App running on port ${chalk.blueBright(PORT)}`);
  } else {
    logger("Server already running, skipping app.listen()", "warn");
  }

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
        runBot();
      }, 5000);
    }
  });

  botProcess.on("error", (error) => {
    logger("An error occurred: " + JSON.stringify(error), "error");
  });
}

startBot();
