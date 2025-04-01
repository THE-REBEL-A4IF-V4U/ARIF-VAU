console.clear();
const { spawn } = require("child_process");
const express = require("express");
const chalk = require("chalk");
const path = require("path");

// Load logger safely
let logger;
try {
  logger = require("./Rebelc.js");
} catch (error) {
  console.error(chalk.red("Error loading logger module:"), error);
  process.exit(1);
}

const app = express();
const PORT = process.env.PORT || 8080;

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "/website/Rebel.html"));
});

console.clear();

function startBot(restartMessage) {
  if (restartMessage) {
    logger(restartMessage, "starting");
  }

  console.log(
    chalk.blue(`
⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯
             DEPLOYING MAIN SYSTEM
⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯
`)
  );

  logger.loader("Deploying app on port " + chalk.blueBright(PORT));

  // Start the server properly
  app.listen(PORT, () => {
    logger.loader("App deployed on port " + chalk.blueBright(PORT));
  });

  // Initialize global countRestart if undefined
  if (typeof global.countRestart === "undefined") {
    global.countRestart = 0;
  }

  const botProcess = spawn("node", ["--trace-warnings", "--async-stack-traces", "Rebelb.js"], {
    cwd: __dirname,
    stdio: "inherit",
    shell: true,
  });

  botProcess.on("close", (code) => {
    if (code !== 0 && global.countRestart < 5) {
      global.countRestart++;
      console.log(chalk.yellow(`Restarting bot... Attempt ${global.countRestart}`));
      startBot("Restarting bot...");
    } else {
      console.error(chalk.red("Bot stopped. Max restart attempts reached."));
    }
  });

  botProcess.on("error", (error) => {
    logger("An error occurred: " + JSON.stringify(error), "error");
  });
}

startBot();