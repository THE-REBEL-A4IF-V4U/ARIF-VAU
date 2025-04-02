module.exports.config = {
  name: "antichange",
  eventType: ["log:subscribe", "log:thread-name", "log:thread-image"],
  version: "1.0.0",
  credits: "Nayan",
  description: "Prevent unauthorized group changes",
};


module.exports.run = async ({
  api: _0x39854c,
  event: _0x24ba9e
}) => {
  const _0xb5cc40 = global.nodemodule["fs-extra"];
  const _0x34cf2d = require("request");
  const _0x4a4d54 = __dirname + "/Rebel/groupSettings.json";
  if (!_0xb5cc40.existsSync(_0x4a4d54)) {
    return;
  }
  const _0x14793e = JSON.parse(_0xb5cc40.readFileSync(_0x4a4d54));
  const _0x2a7d22 = _0x24ba9e.threadID;
  if (!_0x14793e[_0x2a7d22]) {
    return;
  }
  const _0x11de07 = _0x14793e[_0x2a7d22];
  const _0x510e4e = async _0x430dbf => {
    if (_0x430dbf !== _0x11de07.name) {
      await _0x39854c.setTitle(_0x11de07.name, _0x2a7d22);
      _0x39854c.reply("⚠️ Group name change detected and reverted.", _0x2a7d22);
    }
  };
  const _0x421acd = async _0x1a7085 => {
    if (_0x1a7085 !== _0x11de07.image) {
      _0x34cf2d(_0x11de07.image).pipe(_0xb5cc40.createWriteStream(__dirname + "/cache/revert.png")).on("close", () => {
        _0x39854c.changeGroupImage(_0xb5cc40.createReadStream(__dirname + "/cache/revert.png"), _0x2a7d22, () => {
          _0xb5cc40.unlinkSync(__dirname + "/cache/revert.png");
          _0x39854c.reply("⚠️ Group image change detected and reverted.", _0x2a7d22);
        });
      });
    }
  };
  switch (_0x24ba9e.logMessageType) {
    case "log:thread-name":
      const _0x221876 = await _0x39854c.getThreadInfo(_0x2a7d22);
      await _0x510e4e(_0x221876.threadName);
      break;
    case "log:thread-image":
      const _0x583075 = await _0x39854c.getThreadInfo(_0x2a7d22);
      await _0x421acd(_0x583075.imageSrc);
      break;
    default:
      break;
  }
};
