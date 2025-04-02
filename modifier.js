const axios = require("axios");
const fs = require('fs');
const path = require("path");
function startLoading(_0x5adf81) {
  const _0x22be07 = ['.', '..', "..."];
  let _0x157932 = 0;
  process.stdout.write('' + _0x5adf81);
  const _0x5c24ec = setInterval(() => {
    process.stdout.write("\r" + _0x5adf81 + _0x22be07[_0x157932]);
    _0x157932 = (_0x157932 + 1) % _0x22be07.length;
  }, 300);
  return _0x5c24ec;
}
function stopLoading(_0x3d388d, _0x31221b, _0x57a9f9) {
  clearInterval(_0x3d388d);
  process.stdout.clearLine();
  process.stdout.cursorTo(0);
  console.log((_0x31221b ? '✔️' : '❌') + ' ' + _0x57a9f9);
}
async function updatePackageJson() {
  const _0x1bfc06 = startLoading("Updating package.json");
  try {
    const _0x3cf6bf = await axios.get("https://raw.githubusercontent.com/MOHAMMAD-NAYAN/Nayan-Bot/main/package.json");
    const _0x312a66 = _0x3cf6bf.data;
    if (typeof _0x312a66 === "object") {
      const _0x3eaf50 = JSON.stringify(_0x312a66, null, 2);
      fs.writeFileSync(path.join(__dirname, "package.json"), _0x3eaf50, "utf-8");
      stopLoading(_0x1bfc06, true, "package.json updated successfully.");
    } else {
      stopLoading(_0x1bfc06, false, "Unexpected response format. Expected an object.");
      console.warn("Fetched content is not an object:", _0x312a66);
    }
  } catch (_0x4e61c9) {
    stopLoading(_0x1bfc06, false, "Error updating package.json: " + _0x4e61c9.message);
    if (_0x4e61c9.response) {
      console.error("HTTP error: " + _0x4e61c9.response.status + " - " + _0x4e61c9.response.statusText);
    } else if (_0x4e61c9.request) {
      console.error("No response received from the server.");
    } else {
      console.error("Error:", _0x4e61c9.message);
    }
  }
}
async function fetchVersionFile() {
  const _0x2056da = startLoading("Loading version file");
  try {
    const _0x43d9da = await axios.get("https://raw.githubusercontent.com/MOHAMMAD-NAYAN/Nayan-Bot/main/version.json");
    stopLoading(_0x2056da, true, "Version file loaded successfully.");
    return _0x43d9da.data;
  } catch (_0xa220d) {
    stopLoading(_0x2056da, false, "Error fetching version.json");
    console.error(_0xa220d.message);
    return [];
  }
}
async function fetchPackageJson() {
  const _0x38988c = startLoading("Loading package.json");
  try {
    const _0x569762 = await axios.get("https://raw.githubusercontent.com/MOHAMMAD-NAYAN/Nayan-Bot/main/package.json");
    stopLoading(_0x38988c, true, "package.json loaded successfully.");
    return _0x569762.data;
  } catch (_0x4092be) {
    stopLoading(_0x38988c, false, "Error fetching package.json");
    console.error(_0x4092be.message);
    return null;
  }
}
function getLatestVersion(_0x289a16) {
  return _0x289a16.reduce((_0x37939c, _0x728fd9) => {
    return _0x728fd9.version > _0x37939c ? _0x728fd9.version : _0x37939c;
  }, _0x289a16[0].version);
}
async function fetchFileContent(_0x53b7c9) {
  try {
    const _0x3cc9e1 = "https://raw.githubusercontent.com/MOHAMMAD-NAYAN/Nayan-Bot/main/" + _0x53b7c9;
    const _0x3d73fe = await axios.get(_0x3cc9e1);
    return _0x3d73fe.data;
  } catch (_0x45b1a9) {
    console.warn("Warning: Could not fetch file content from GitHub for " + _0x53b7c9 + ". Creating with default notice.");
    return null;
  }
}
function deleteFile(_0x1ec044, _0x4d6749) {
  const _0x30cc03 = path.join(__dirname, _0x1ec044);
  const _0x1b9d7a = startLoading("Deleting file: " + _0x1ec044);
  setTimeout(() => {
    if (fs.existsSync(_0x30cc03)) {
      fs.unlinkSync(_0x30cc03);
      stopLoading(_0x1b9d7a, true, "Deleted file: " + _0x1ec044 + "\nNotice: " + _0x4d6749);
    } else {
      stopLoading(_0x1b9d7a, false, "File not found, could not delete: " + _0x1ec044);
    }
  }, 500);
}
async function updateFiles(_0x24d934, _0x45f66b) {
  const _0x5d84f8 = _0x24d934.find(_0x113e8d => _0x113e8d.version === _0x45f66b);
  if (_0x5d84f8 && _0x5d84f8.deleteFiles) {
    for (const [_0x472e3b, _0x8c1283] of Object.entries(_0x5d84f8.files)) {
      const _0x4e30db = _0x5d84f8.deleteFiles;
      for (const [_0xf9f39e, _0x1017c2] of Object.entries(_0x4e30db)) {
        console.log("\nDeleting file: " + _0xf9f39e + "\nNotice: " + _0x1017c2);
        deleteFile(_0xf9f39e, _0x1017c2);
      }
    }
  }
  if (_0x5d84f8 && _0x5d84f8.files) {
    console.log("Updating files for version: " + _0x45f66b);
    for (const [_0x102538, _0x2d3e1d] of Object.entries(_0x5d84f8.files)) {
      const _0x393d50 = path.join(__dirname, _0x102538);
      const _0x1e1d6b = startLoading("Updating/Creating file: " + _0x102538);
      try {
        const _0x159177 = await fetchFileContent(_0x102538);
        const _0x4e15ff = _0x159177 ? '' + _0x159177 : '' + _0x2d3e1d;
        if (!fs.existsSync(_0x393d50)) {
          const _0x2d0471 = path.dirname(_0x393d50);
          fs.mkdirSync(_0x2d0471, {
            'recursive': true
          });
          fs.writeFileSync(_0x393d50, _0x4e15ff, "utf-8");
          stopLoading(_0x1e1d6b, true, "Created file: " + _0x102538 + "\nNotice: " + _0x2d3e1d + "\n");
        } else {
          fs.writeFileSync(_0x393d50, _0x4e15ff, "utf-8");
          stopLoading(_0x1e1d6b, true, "Updated file: " + _0x102538 + "\nNotice: " + _0x2d3e1d + "\n");
        }
      } catch (_0x149e92) {
        stopLoading(_0x1e1d6b, false, "Error updating/creating file: " + _0x102538);
        console.error(_0x149e92.message);
      }
    }
  } else {
    console.log("No matching version found in version.json for version: " + _0x45f66b + ". No updates applied.");
  }
}
(async () => {
  const _0x561d5b = await fetchVersionFile();
  const _0x4410d6 = await fetchPackageJson();
  if (_0x4410d6) {
    const _0x15308e = _0x4410d6.version;
    const _0xbb9dc7 = require("./package.json");
    const _0x10da0b = _0xbb9dc7.version;
    if (_0x10da0b == _0x15308e) {
      console.log("✔️ You are using the latest version");
    } else {
      await updateFiles(_0x561d5b, _0x15308e);
      await updatePackageJson();
    }
  }
})();
