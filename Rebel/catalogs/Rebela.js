// catalogs/Rebela.js
const { spawn } = require("child_process");
const chalk = require("chalk");
const path = require("path");
const express = require("express");
const app = express();
const logger = require("./Rebelc.js");

const PORT = process.env.PORT || 8080;

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "../website/Rebel.html"));
});

function startBot() {
  logger("Starting REBEL Bot...", "rebel");
  logger.loader(`App running on port ${chalk.blueBright(PORT)}`);

  app.listen(PORT, () => {
    logger.loader(`Website served on port ${chalk.blueBright(PORT)}`);
  });

  const child = spawn("node", ["Rebelb.js"], {
    cwd: __dirname,
    stdio: "inherit",
    shell: true,
  });

  child.on("close", (code) => {
    if (code !== 0) {
      logger("Bot exited with code " + code, "warn");
    }
  });

  child.on("error", (error) => {
    logger("An error occurred: " + JSON.stringify(error), "error");
  });
}

startBot();