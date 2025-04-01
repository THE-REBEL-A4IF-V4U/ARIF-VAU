const axios = require("axios"); const fs = require("fs"); const path = require("path");

function startLoading(message) { const dots = [".", "..", "..."]; let index = 0; process.stdout.write(message); const interval = setInterval(() => { process.stdout.write("\r" + message + dots[index]); index = (index + 1) % dots.length; }, 300); return interval; }

function stopLoading(interval, success, message) { clearInterval(interval); console.log((success ? "✔️" : "❌") + " " + message); }

async function fetchJSON(url, loadingMessage, successMessage, errorMessage) { const loader = startLoading(loadingMessage); try { const response = await axios.get(url); stopLoading(loader, true, successMessage); return response.data; } catch (error) { stopLoading(loader, false, errorMessage + error.message); return null; } }

async function updatePackageJson() { const data = await fetchJSON( "https://raw.githubusercontent.com/THE-REBEL-A4IF-V4U/REBEL-AUTHOR/main/package.json", "Updating package.json", "package.json updated successfully.", "Error updating package.json: " ); if (data) { fs.writeFileSync("package.json", JSON.stringify(data, null, 2), "utf-8"); } }

async function fetchVersionFile() { return await fetchJSON( "https://raw.githubusercontent.com/THE-REBEL-A4IF-V4U/REBEL-AUTHOR/main/version.json", "Loading version file", "Version file loaded successfully.", "Error fetching version.json" ); }

async function fetchFileContent(fileName) { try { const url = https://raw.githubusercontent.com/MOHAMMAD-NAYAN/Nayan-Bot/main/${fileName}; const response = await axios.get(url); return response.data; } catch (error) { console.warn(Warning: Could not fetch ${fileName}.); return null; } }

function deleteFile(filePath) { const fullPath = path.join(__dirname, filePath); if (fs.existsSync(fullPath)) { fs.unlinkSync(fullPath); console.log(✔️ Deleted: ${filePath}); } else { console.warn(❌ File not found: ${filePath}); } }

async function updateFiles(versionData, latestVersion) { const versionInfo = versionData.find(v => v.version === latestVersion); if (!versionInfo) { console.log("No updates required."); return; }

if (versionInfo.deleteFiles) {
    for (const file of versionInfo.deleteFiles) {
        deleteFile(file);
    }
}

if (versionInfo.files) {
    for (const [fileName, notice] of Object.entries(versionInfo.files)) {
        const content = await fetchFileContent(fileName) || notice;
        const fullPath = path.join(__dirname, fileName);
        fs.mkdirSync(path.dirname(fullPath), { recursive: true });
        fs.writeFileSync(fullPath, content, "utf-8");
        console.log(`✔️ Updated: ${fileName}`);
    }
}

}

(async () => { const versionData = await fetchVersionFile(); if (!versionData) return;

const localPackage = require("./package.json");
const latestPackage = await fetchJSON(
    "https://raw.githubusercontent.com/THE-REBEL-A4IF-V4U/REBEL-AUTHOR/main/package.json",
    "Checking latest package version",
    "Latest package.json loaded.",
    "Error fetching package.json"
);

if (!latestPackage || !latestPackage.version) return;

if (localPackage.version !== latestPackage.version) {
    console.log("⚡ Updating to latest version...");
    await updateFiles(versionData, latestPackage.version);
    await updatePackageJson();
} else {
    console.log("✔️ You are using the latest version.");
}

})();

