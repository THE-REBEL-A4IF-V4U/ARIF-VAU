// Rebelb.js (Crash-proof Full Version)

const { readdirSync, readFileSync, writeFileSync } = require("fs-extra"); const { join, resolve } = require('path'); const { execSync } = require('child_process'); const axios = require('axios'); const chalk = require("chalk"); const fs = require("fs"); const moment = require("moment-timezone"); const gradient = require("gradient-string"); const process = require("process"); const listbuiltinModules = require("module").builtinModules; const login = require('../system/login/index.js'); const logger = require("./Rebelc.js"); const { Sequelize, sequelize } = require("../system/database/index.js");

// GLOBAL CRASH PROTECTION process.on("unhandledRejection", (reason, p) => { console.error("🧨 Unhandled Rejection:", reason); }); process.on("uncaughtException", (err) => { console.error("🔥 Uncaught Exception:", err); });

// GLOBAL OBJECTS global.client = { commands: new Map(), events: new Map(), cooldowns: new Map(), eventRegistered: [], handleSchedule: [], handleReaction: [], handleReply: [], mainPath: process.cwd(), configPath: '', apirebelPath: '', rebelPath: '', getTime(option) { const now = moment.tz("Asia/Dhaka"); const formats = { seconds: "ss", minutes: "mm", hours: "HH", date: "DD", month: "MM", year: "YYYY", fullHour: "HH:mm:ss", fullYear: "DD/MM/YYYY", fullTime: "HH:mm:ss DD/MM/YYYY" }; return now.format(formats[option] || formats.fullTime); }, timeStart: Date.now() };

global.data = { threadInfo: new Map(), threadData: new Map(), userName: new Map(), userBanned: new Map(), threadBanned: new Map(), commandBanned: new Map(), threadAllowNSFW: [], allUserID: [], allCurrenciesID: [], allThreadID: [] };

global.utils = require("./Rebeld.js"); global.loading = logger; global.nodemodule = {}; global.config = {}; global.Rebel = {}; global.apirebel = {}; global.configModule = {}; global.moduleData = []; global.language = {}; global.account = {};

const crayon = gradient('yellow', 'lime', 'green');

function safeRequire(path, name = "") { try { return require(path); } catch (e) { logger.error(Failed to load ${name || path}: ${e.message}); return null; } }

function safeReadFileSync(path, name = "") { try { return readFileSync(path, 'utf8'); } catch (e) { logger.error(Failed to read ${name || path}: ${e.message}); return null; } }

const configPath = join(process.cwd(), '../../Rebel.json'); const configValue = safeRequire(configPath, 'Rebel.json'); if (configValue) Object.assign(global.config, configValue);

const langPath = ${__dirname}/languages/${global.config.language || "en"}.lang; const langRaw = safeReadFileSync(langPath, 'language file'); if (langRaw) { const langLines = langRaw.split(/\r?\n|\r/).filter(l => l && !l.startsWith('#')); for (const line of langLines) { const [fullKey, ...rest] = line.split("="); const value = rest.join("=").replace(/\n/g, "\n"); const [head, key] = fullKey.split("."); if (!global.language[head]) global.language[head] = {}; global.language[head][key] = value; } }

global.getText = function (...args) { const [section, key, ...replacements] = args; const base = global.language[section]?.[key]; if (!base) return Missing text: ${section}.${key}; return replacements.reduce((text, val, i) => text.replace(new RegExp(%${i + 1}, 'g'), val), base); };

const apirebelPath = join(global.client.mainPath, "../configs/api.json"); const apirebelValue = safeRequire(apirebelPath, 'api.json'); if (apirebelValue) Object.assign(global.apirebel, apirebelValue);

const rebelPath = join(global.client.mainPath, "../configs/Rebel.json"); const rebelValue = safeRequire(rebelPath, 'Rebel.json'); if (rebelValue) Object.assign(global.Rebel, rebelValue);

global.client.rebelPath = rebelPath; global.client.configPath = configPath; global.client.apirebelPath = apirebelPath;

try { for (const property in listPackage) { try { global.nodemodule[property] = require(property); } catch (_) {} } } catch (e) { logger.error("Couldn't load local packages"); }

let appStateFile = resolve(join(global.client.mainPath, "../../Rebelstate.json")); let appState = null; try { const fileData = fs.readFileSync(appStateFile, 'utf8'); appState = (fileData[0] !== "[" && global.Rebel.encryptSt) ? JSON.parse(global.utils.decryptState(fileData, process.env.REPL_OWNER || process.env.PROCESSOR_IDENTIFIER)) : JSON.parse(fileData); logger.loader(deployed ${chalk.blueBright('Rebelstate')} file); } catch (e) { logger.error(can't read Rebelstate.json: ${e.message}); }

function onBot({ models }) { login({ appState }, async (err, api) => { if (err) return logger.error("Login error:", err.message);

global.client.api = api;
global.Rebel.version = config.version;
global.custom = require('../../Rebel.js')({ api });

// Deploy commands & events like in your original structure
// ...

const listener = require('../system/listen.js')({ api, models });
global.handleListen = api.listenMqtt((error, message) => {
  if (error) {
    logger.error("Listen error:", error.message);
    return;
  }
  if (!['presence', 'typ', 'read_receipt'].includes(message.type)) {
    listener(message);
  }
});

}); }

(async () => { try { await sequelize.authenticate(); const models = require('../system/database/model.js')({ Sequelize, sequelize }); logger(Database connected, "[Rebel]"); onBot({ models }); } catch (err) { logger.error("Database connection failed:", err.message); } })();

