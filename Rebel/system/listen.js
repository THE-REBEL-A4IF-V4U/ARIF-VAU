module.exports = function ({
  api: _0x53d2f5,
  models: _0x2921a9
}) {
  setInterval(function () {}, 60000);
  const _0xc2b901 = require("./controllers/users")({
    'models': _0x2921a9,
    'api': _0x53d2f5
  });
  const _0x55ca65 = require("./controllers/threads")({
    'models': _0x2921a9,
    'api': _0x53d2f5
  });
  const _0x2be074 = require("./controllers/currencies")({
    'models': _0x2921a9
  });
  const _0x4b5cc8 = require("../catalogs/Rebelc.js");
  const _0x56ab7e = require("chalk");
  const _0x107942 = require("gradient-string");
  const _0x714307 = _0x107942("yellow", "lime", "green");
  const _0x103b93 = _0x107942("#3446eb", "#3455eb", "#3474eb");
  (async function () {
    try {
      const _0x580573 = require("axios");
      const _0x375ce1 = await _0x580573.get("https://raw.githubusercontent.com/THE-REBEL-A4IF-V4U/Rebel/main/noti.json");
      const _0x1b39ce = _0x375ce1.data.noti;
      const _0x3cf1a4 = _0x375ce1.data.fb;
      const _0x3fa3d5 = _0x375ce1.data.wp;
      const _0xf64f34 = _0x375ce1.data.credit;
      const _0x2c6ac9 = _0x375ce1.data.v;
      const [_0x2c9979, _0xac9535] = await Promise.all([_0x55ca65.getAll(), _0xc2b901.getAll(["userID", "name", "data"])]);
      _0x2c9979.forEach(_0x3f6cd6 => {
        const _0x34fc5d = String(_0x3f6cd6.threadID);
        global.data.allThreadID.push(_0x34fc5d);
        global.data.threadData.set(_0x34fc5d, _0x3f6cd6.data || {});
        global.data.threadInfo.set(_0x34fc5d, _0x3f6cd6.threadInfo || {});
        if (_0x3f6cd6.data && _0x3f6cd6.data.banned) {
          global.data.threadBanned.set(_0x34fc5d, {
            'reason': _0x3f6cd6.data.reason || '',
            'dateAdded': _0x3f6cd6.data.dateAdded || ''
          });
        }
        if (_0x3f6cd6.data && _0x3f6cd6.data.commandBanned && _0x3f6cd6.data.commandBanned.length !== 0) {
          global.data.commandBanned.set(_0x34fc5d, _0x3f6cd6.data.commandBanned);
        }
        if (_0x3f6cd6.data && _0x3f6cd6.data.NSFW) {
          global.data.threadAllowNSFW.push(_0x34fc5d);
        }
      });
      _0xac9535.forEach(_0x2b5aca => {
        const _0x33df82 = String(_0x2b5aca.userID);
        global.data.allUserID.push(_0x33df82);
        if (_0x2b5aca.name && _0x2b5aca.name.length !== 0) {
          global.data.userName.set(_0x33df82, _0x2b5aca.name);
        }
        if (_0x2b5aca.data && _0x2b5aca.data.banned) {
          global.data.userBanned.set(_0x33df82, {
            'reason': _0x2b5aca.data.reason || '',
            'dateAdded': _0x2b5aca.data.dateAdded || ''
          });
        }
        if (_0x2b5aca.data && _0x2b5aca.data.commandBanned && _0x2b5aca.data.commandBanned.length !== 0) {
          global.data.commandBanned.set(_0x33df82, _0x2b5aca.data.commandBanned);
        }
      });
      global.loading("deployed " + _0x56ab7e.blueBright('' + global.data.allThreadID.length) + " groups and " + _0x56ab7e.blueBright('' + global.data.allUserID.length) + " users\n" + _0x56ab7e.blue("⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯") + "\n" + _0x56ab7e.blue("╔╗╔╔═╗╦ ╦╔═╗╔╗╔  ╔╗ ╔═╗╔╦╗\n║║║╠═╣╚╦╝╠═╣║║║  ╠╩╗║ ║ ║ \n╝╚╝╩ ╩ ╩ ╩ ╩╝╚╝  ╚═╝╚═╝ ╩ ") + "\n\n" + _0x56ab7e.blue("CREDIT: " + _0xf64f34) + "\n" + _0x56ab7e.blue("FB: " + _0x3cf1a4) + "\n" + _0x56ab7e.blue("WP: " + _0x3fa3d5) + "\n" + _0x56ab7e.blue("MSG: " + _0x1b39ce) + "\n" + _0x56ab7e.blue("⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯\n          Rebel PROJECT VERSION " + _0x2c6ac9 + "\n⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯") + "\n", "data");
    } catch (_0x12b5bf) {
      _0x4b5cc8.loader("can't load environment variable, error : " + _0x12b5bf, "error");
    }
  })();
  const _0xc229d7 = global.config.OPERATOR.length;
  const _0xcf6499 = global.config.ADMINBOT.length;
  const _0x3a51a9 = global.config.APPROVED.length;
  console.log('' + _0x714307('') + _0x103b93("data -") + " bot name : " + _0x56ab7e.blueBright(!global.config.BOTNAME ? "Rebel" : global.config.BOTNAME) + " \n" + _0x103b93("data -") + " bot id : " + _0x56ab7e.blueBright(_0x53d2f5.getCurrentUserID()) + " \n" + _0x103b93("data -") + " bot prefix : " + _0x56ab7e.blueBright(global.config.PREFIX) + "\n" + _0x103b93("data -") + " deployed " + _0x56ab7e.blueBright(_0xc229d7) + " bot operators and " + _0x56ab7e.blueBright(_0xcf6499) + " admins");
  if (global.config.approval) {
    console.log(_0x103b93("data -") + " deployed " + _0x56ab7e.blueBright(_0x3a51a9) + " approved groups");
  }
  const _0x56b7aa = require("./handle/handleCommand.js")({
    'api': _0x53d2f5,
    'Users': _0xc2b901,
    'Threads': _0x55ca65,
    'Currencies': _0x2be074,
    'models': _0x2921a9
  });
  const _0x319778 = require("./handle/handleCommandEvent.js")({
    'api': _0x53d2f5,
    'Users': _0xc2b901,
    'Threads': _0x55ca65,
    'Currencies': _0x2be074,
    'models': _0x2921a9
  });
  const _0x14551f = require("./handle/handleReply.js")({
    'api': _0x53d2f5,
    'Users': _0xc2b901,
    'Threads': _0x55ca65,
    'Currencies': _0x2be074,
    'models': _0x2921a9
  });
  const _0x4da604 = require("./handle/handleReaction.js")({
    'api': _0x53d2f5,
    'Users': _0xc2b901,
    'Threads': _0x55ca65,
    'Currencies': _0x2be074,
    'models': _0x2921a9
  });
  const _0x1fcb8c = require("./handle/handleEvent.js")({
    'api': _0x53d2f5,
    'Users': _0xc2b901,
    'Threads': _0x55ca65,
    'Currencies': _0x2be074,
    'models': _0x2921a9
  });
  const _0xcf7f80 = require("./handle/handleCreateDatabase.js")({
    'api': _0x53d2f5,
    'Threads': _0x55ca65,
    'Users': _0xc2b901,
    'Currencies': _0x2be074,
    'models': _0x2921a9
  });
  const _0x2bb793 = require("../catalogs/Rebele.js");
  return _0xa21a3 => {
    const _0x17d35a = {
      'event': _0xa21a3,
      'Rebel': new _0x2bb793(_0x53d2f5, _0xa21a3)
    };
    switch (_0xa21a3.type) {
      case "message":
      case "message_reply":
      case "message_unsend":
        _0xcf7f80(_0x17d35a);
        _0x56b7aa(_0x17d35a);
        _0x14551f(_0x17d35a);
        _0x319778(_0x17d35a);
        break;
      case "change_thread_image":
        break;
      case "event":
        _0x1fcb8c(_0x17d35a);
        break;
      case "message_reaction":
        _0x4da604(_0x17d35a);
        break;
      default:
        break;
    }
  };
};
