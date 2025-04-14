const axios = require("axios");
const chalk = require("chalk");
const fs = require("fs");
const path = require("path");
const express = require("express");
const { spawn } = require("child_process");
const { showBanner } = require("./banner");

// Express app for KeepAlive + Website
const app = express();
const PORT = process.env.PORT || 3000;

app.get("/", (req, res) => {
  const filePath = path.join(__dirname, "website/Rebel.html");
  if (fs.existsSync(filePath)) {
    res.sendFile(filePath);
  } else {
    res.send("<h1>Website is coming soon. Rebel.html not found.</h1>");
  }
});

app.listen(PORT, () => {
  console.log(chalk.green(`✓ Server running at http://localhost:${PORT}`));
});

// Fetch JSON utility
async function fetchRemoteJSON(url) {
  try {
    const res = await axios.get(url);
    return res.data;
  } catch {
    console.log(chalk.red("Failed to fetch from URL: " + url));
    return null;
  }
}

async function runCheckAndStartBot() {
  console.log(chalk.yellow("Checking for updates...\n"));

  const remotePkg = await fetchRemoteJSON("https://raw.githubusercontent.com/THE-REBEL-A4IF-V4U/A4IFB0T/main/package.json");
  const notice = await fetchRemoteJSON("https://raw.githubusercontent.com/THE-REBEL-A4IF-V4U/A4IFB0T/main/notice.json");

  // Show notice if available
  if (notice?.message) {
    let bannerColor = chalk.bgCyan;
    if (notice.type === "warning") bannerColor = chalk.bgYellow.black;
    if (notice.type === "error") bannerColor = chalk.bgRed.white;

    const message = ` NOTICE: ${notice.message} `;
    const line = "─".repeat(message.length);

    console.log(bannerColor("\n" + line));
    console.log(bannerColor(message));
    console.log(bannerColor(line) + "\n");
  }

  showBanner(); // Banner logo

  // Check version
  const localPath = path.join(__dirname, "package.json");
  if (!fs.existsSync(localPath)) {
    console.log(chalk.red("Local package.json not found!"));
    process.exit(1);
  }

  const localPkg = require(localPath);
  if (!remotePkg?.version) {
    console.log(chalk.red("Remote version info missing!"));
    process.exit(1);
  }

  if (localPkg.version !== remotePkg.version) {
    console.log(chalk.red("\nBot version mismatch!"));
    console.log(`Local: ${chalk.red(localPkg.version)} | Latest: ${chalk.green(remotePkg.version)}`);
    console.log(chalk.red("Please update your bot to continue."));
    process.exit(1);
  }

  console.log(chalk.green("✅ Bot is up-to-date. Launching bot...\n"));

  const rebelaPath = path.join(__dirname, "Rebel", "catalogs", "Rebela.js");
  const child = spawn("node", [rebelaPath], {
    stdio: "inherit",
    shell: true,
  });

  child.on("error", (err) => {
    console.log(chalk.red("Bot launch failed: "), err);
  });
}

runCheckAndStartBot();
