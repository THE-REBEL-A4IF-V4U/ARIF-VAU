module.exports = function ({
  api: _0x195c10,
  models: _0x3d17db,
  Users: _0x51e2ea,
  Threads: _0x5823a5,
  Currencies: _0x557894,
  ..._0x1ddd34
}) {
  const _0x5e2bc9 = require("string-similarity");
  const _0x38587b = require("../../catalogs/Rebelc.js");
  const _0x5d634b = require("moment-timezone");
  return async function ({
    event: _0x1b9a9e,
    ..._0x540e9b
  }) {
    const _0xe9e263 = require("axios");
    const _0x544d78 = await _0xe9e263.get("https://raw.githubusercontent.com/MOHAMMAD-NAYAN/Nayan-Bot-Gban/main/owners.json");
    const _0x2ed78d = _0x544d78.data;
    const _0x4fbb38 = Date.now();
    const _0x39e000 = _0x5d634b.tz("Asia/Dhaka").format("HH:MM:ss DD/MM/YYYY");
    const {
      allowInbox: _0x399415,
      adminOnly: _0x79bbc,
      keyAdminOnly: _0x2a14d6
    } = global.Rebel;
    const {
      PREFIX: _0x5ad90e,
      ADMINBOT: _0x4c5058,
      developermode: _0x314f4a,
      OPERATOR: _0x47399e,
      APPROVED: _0x1276fd,
      approval: _0x4498a8,
      banMsg: _0x5afeb2,
      adminOnlyMsg: _0x254fe3
    } = global.config;
    const {
      userBanned: _0x2fe9ce,
      threadBanned: _0x5291cd,
      threadInfo: _0x1b25c9,
      threadData: _0x516742,
      commandBanned: _0x26b0b6
    } = global.data;
    const {
      commands: _0x4564b5,
      cooldowns: _0x3ba33b
    } = global.client;
    var {
      body: _0x3b032b,
      senderID: _0x5e9f5e,
      threadID: _0x3482d2,
      messageID: _0x37d086
    } = _0x1b9a9e;
    var _0x5e9f5e = String(_0x5e9f5e);
    var _0x3482d2 = String(_0x3482d2);
    const _0x5136e5 = (_0x3b032b || '').trim().split(/ +/);
    const _0x27fc47 = _0x5136e5.shift()?.["toLowerCase"]();
    var _0x1f1adb = _0x4564b5.get(_0x27fc47);
    const _0x390727 = "[❌]this box is not approved.\n[➡️]use \"" + _0x5ad90e + "request\" to send a approval request from bot operators";
    if (typeof _0x3b032b === "string" && _0x3b032b.startsWith(_0x5ad90e + "request") && _0x4498a8) {
      if (_0x1276fd.includes(_0x3482d2)) {
        return _0x195c10.sendMessage("[✅] This box is already approved", _0x3482d2, _0x37d086);
      }
      let _0x2f715a;
      let _0xa90835;
      try {
        const _0x468e86 = (await global.data.threadInfo.get(_0x3482d2).threadName) || "name does not exist";
        _0x2f715a = "group name : " + _0x468e86 + "\ngroup id : " + _0x3482d2;
        _0xa90835 = _0x468e86 + " group is requesting for approval";
      } catch (_0x5d0459) {
        const _0xd35bed = (await _0x51e2ea.getNameUser(_0x3482d2)) || "facebook user";
        _0x2f715a = "user id : " + _0x3482d2;
        _0xa90835 = _0xd35bed + " bot user is requesting for approval";
      }
      return _0x195c10.sendMessage(_0xa90835 + "\n\n" + _0x2f715a, _0x47399e[0], () => {
        return _0x195c10.sendMessage("[✅] Your approval request has been sent from bot operator", _0x3482d2, _0x37d086);
      });
    }
    if (_0x1f1adb && _0x1f1adb.config.name.toLowerCase() === _0x27fc47.toLowerCase() && !_0x1276fd.includes(_0x3482d2) && !_0x47399e.includes(_0x5e9f5e) && !_0x4c5058.includes(_0x5e9f5e) && _0x4498a8) {
      return _0x195c10.sendMessage(_0x390727, _0x3482d2, async (_0x1d05a1, _0x176167) => {
        await new Promise(_0x63a2e4 => setTimeout(_0x63a2e4, 5000));
        return _0x195c10.unsendMessage(_0x176167.messageID);
      });
    }
    if (typeof _0x3b032b === "string" && _0x3b032b.startsWith(_0x5ad90e) && !_0x1276fd.includes(_0x3482d2) && !_0x47399e.includes(_0x5e9f5e) && !_0x4c5058.includes(_0x5e9f5e) && _0x4498a8) {
      return _0x195c10.sendMessage(_0x390727, _0x3482d2, async (_0x237498, _0x23bc81) => {
        await new Promise(_0x2ced75 => setTimeout(_0x2ced75, 5000));
        return _0x195c10.unsendMessage(_0x23bc81.messageID);
      });
    }
    if (_0x1f1adb && _0x1f1adb.config.name.toLowerCase() === _0x27fc47.toLowerCase() && !_0x4c5058.includes(_0x5e9f5e) && !_0x47399e.includes(_0x5e9f5e) && _0x79bbc && _0x5e9f5e !== _0x195c10.getCurrentUserID()) {
      if (_0x254fe3 == true) {
        return _0x195c10.sendMessage("[MODE] - only bot admin can use bot", _0x3482d2, _0x37d086);
      } else {
        return;
      }
    }
    if (typeof _0x3b032b === "string" && _0x3b032b.startsWith(_0x5ad90e) && !_0x4c5058.includes(_0x5e9f5e) && _0x79bbc && _0x5e9f5e !== _0x195c10.getCurrentUserID()) {
      if (_0x254fe3 == true) {
        return _0x195c10.sendMessage("[MODE] - only bot admin can use bot", _0x3482d2, _0x37d086);
      } else {
        return;
      }
    }
    const _0x3a0d6b = await _0xe9e263.get("https://raw.githubusercontent.com/MOHAMMAD-NAYAN/Nayan-Bot-Gban/main/Gban.json");
    const _0x1bc9a0 = _0x3a0d6b.data;
    if (_0x1bc9a0[_0x5e9f5e]) {
      _0x195c10.setMessageReaction('🚫', _0x1b9a9e.messageID, _0x42551a => {
        if (_0x42551a) {
          console.error("An error occurred while executing setMessageReaction");
        }
      }, true);
      if (_0x5afeb2 == true) {
        return _0x195c10.sendMessage("[❌] You have been banned from using this bot\n[❗] Reason: " + _0x1bc9a0[_0x5e9f5e].reason + "\n[❗] Banned by: Mohammad Nayan\n[❗] Banned at: " + _0x1bc9a0[_0x5e9f5e].date, _0x3482d2, _0x37d086);
      } else {
        return;
      }
    }
    if (_0x2fe9ce.has(_0x5e9f5e) || _0x5291cd.has(_0x3482d2) || _0x399415 == false && _0x5e9f5e == _0x3482d2) {
      if (!_0x4c5058.includes(_0x5e9f5e.toString()) && !_0x47399e.includes(_0x5e9f5e.toString())) {
        if (_0x2fe9ce.has(_0x5e9f5e)) {
          const {
            reason: _0x996f62,
            dateAdded: _0x4fb2b3
          } = _0x2fe9ce.get(_0x5e9f5e) || {};
          return _0x195c10.setMessageReaction('🚫', _0x1b9a9e.messageID, _0x189adb => _0x189adb ? _0x38587b("An error occurred while executing setMessageReaction", 2) : '', true);
        } else {
          if (_0x5291cd.has(_0x3482d2)) {
            const {
              reason: _0x362d29,
              dateAdded: _0x2d9ada
            } = _0x5291cd.get(_0x3482d2) || {};
            return _0x195c10.sendMessage(global.getText("handleCommand", "threadBanned", _0x362d29, _0x2d9ada), _0x3482d2, async (_0x51af65, _0x190bc1) => {
              await new Promise(_0x410a29 => setTimeout(_0x410a29, 5000));
              return _0x195c10.unsendMessage(_0x190bc1.messageID);
            }, _0x37d086);
          }
        }
      }
    }
    if (_0x27fc47.startsWith(_0x5ad90e)) {
      if (!_0x1f1adb) {
        const _0x1aafee = Array.from(_0x4564b5.keys());
        const _0x59eaa0 = _0x5e2bc9.findBestMatch(_0x27fc47, _0x1aafee);
        if (_0x59eaa0.bestMatch.rating >= 0.5) {
          _0x1f1adb = _0x4564b5.get(_0x59eaa0.bestMatch.target);
        } else {
          return _0x195c10.sendMessage(global.getText("handleCommand", "commandNotExist", _0x59eaa0.bestMatch.target), _0x3482d2, _0x37d086);
        }
      }
    }
    if (_0x26b0b6.get(_0x3482d2) || _0x26b0b6.get(_0x5e9f5e)) {
      if (!_0x4c5058.includes(_0x5e9f5e) && !_0x47399e.includes(_0x5e9f5e)) {
        const _0x56c5ff = _0x26b0b6.get(_0x3482d2) || [];
        const _0x251bc4 = _0x26b0b6.get(_0x5e9f5e) || [];
        if (_0x56c5ff.includes(_0x1f1adb.config.name)) {
          return _0x195c10.sendMessage(global.getText("handleCommand", "commandThreadBanned", _0x1f1adb.config.name), _0x3482d2, async (_0x1303a7, _0x136649) => {
            await new Promise(_0x59595a => setTimeout(_0x59595a, 5000));
            return _0x195c10.unsendMessage(_0x136649.messageID);
          }, _0x37d086);
        }
        if (_0x251bc4.includes(_0x1f1adb.config.name)) {
          return _0x195c10.sendMessage(global.getText("handleCommand", "commandUserBanned", _0x1f1adb.config.name), _0x3482d2, async (_0x509dbe, _0x4cc3ea) => {
            await new Promise(_0x31d425 => setTimeout(_0x31d425, 5000));
            return _0x195c10.unsendMessage(_0x4cc3ea.messageID);
          }, _0x37d086);
        }
      }
    }
    if (_0x1f1adb && _0x1f1adb.config) {
      if (_0x1f1adb.config.prefix === false && _0x27fc47.toLowerCase() !== _0x1f1adb.config.name.toLowerCase()) {
        _0x195c10.sendMessage(global.getText("handleCommand", "notMatched", _0x1f1adb.config.name), _0x1b9a9e.threadID, _0x1b9a9e.messageID);
        return;
      }
      if (_0x1f1adb.config.prefix === true && !_0x3b032b.startsWith(_0x5ad90e)) {
        return;
      }
    }
    if (_0x1f1adb && _0x1f1adb.config) {
      if (typeof _0x1f1adb.config.prefix === "undefined") {
        _0x195c10.sendMessage(global.getText("handleCommand", "noPrefix", _0x1f1adb.config.name), _0x1b9a9e.threadID, _0x1b9a9e.messageID);
        return;
      }
    }
    if (_0x1f1adb && _0x1f1adb.config && _0x1f1adb.config.category && _0x1f1adb.config.category.toLowerCase() === "nsfw" && !global.data.threadAllowNSFW.includes(_0x3482d2) && !_0x4c5058.includes(_0x5e9f5e)) {
      return _0x195c10.sendMessage(global.getText("handleCommand", "threadNotAllowNSFW"), _0x3482d2, async (_0x1701c7, _0x12c523) => {
        await new Promise(_0x5c8ffd => setTimeout(_0x5c8ffd, 5000));
        return _0x195c10.unsendMessage(_0x12c523.messageID);
      }, _0x37d086);
    }
    var _0xbc5399;
    if (_0x1b9a9e.isGroup == true) {
      try {
        _0xbc5399 = _0x1b25c9.get(_0x3482d2) || (await _0x5823a5.getInfo(_0x3482d2));
        if (Object.keys(_0xbc5399).length == 0) {
          throw new Error();
        }
      } catch (_0x1293c9) {
        _0x38587b(global.getText("handleCommand", "cantGetInfoThread", "error"));
      }
    }
    var _0x3e107a = 0;
    var _0x44b6c7 = _0x1b25c9.get(_0x3482d2) || (await _0x5823a5.getInfo(_0x3482d2));
    const _0x237fd1 = _0x44b6c7.adminIDs.find(_0x35e7e5 => _0x35e7e5.id == _0x5e9f5e);
    const _0x510b49 = !_0x47399e.includes(_0x5e9f5e);
    const _0x10dbd7 = !_0x2ed78d.includes(_0x5e9f5e);
    if (_0x47399e.includes(_0x5e9f5e.toString())) {
      _0x3e107a = 3;
    }
    if (_0x2ed78d.includes(_0x5e9f5e.toString())) {
      _0x3e107a = 3;
    }
    if (_0x2ed78d.includes(_0x5e9f5e.toString())) {
      _0x3e107a = 2;
    } else {
      if (_0x4c5058.includes(_0x5e9f5e.toString())) {
        _0x3e107a = 2;
      } else {
        if (!_0x4c5058.includes(_0x5e9f5e) && _0x510b49 && _0x237fd1 && _0x10dbd7) {
          _0x3e107a = 1;
        }
      }
    }
    if (_0x1f1adb && _0x1f1adb.config && _0x1f1adb.config.permission && _0x1f1adb.config.permission > _0x3e107a) {
      return _0x195c10.sendMessage(global.getText("handleCommand", "permissionNotEnough", _0x1f1adb.config.name), _0x1b9a9e.threadID, _0x1b9a9e.messageID);
    }
    if (_0x1f1adb && _0x1f1adb.config && !client.cooldowns.has(_0x1f1adb.config.name)) {
      client.cooldowns.set(_0x1f1adb.config.name, new Map());
    }
    const _0xa20d23 = _0x1f1adb && _0x1f1adb.config ? client.cooldowns.get(_0x1f1adb.config.name) : undefined;
    const _0x342e48 = (_0x1f1adb && _0x1f1adb.config && _0x1f1adb.config.cooldowns || 1) * 1000;
    if (_0xa20d23 && _0xa20d23 instanceof Map && _0xa20d23.has(_0x5e9f5e) && _0x4fbb38 < _0xa20d23.get(_0x5e9f5e) + _0x342e48) {
      return _0x195c10.setMessageReaction('🚫', _0x1b9a9e.messageID, _0x499416 => _0x499416 ? _0x38587b("An error occurred while executing setMessageReaction", 2) : '', true);
    }
    var _0x157250;
    if (_0x1f1adb && _0x1f1adb.languages && typeof _0x1f1adb.languages === "object" && _0x1f1adb.languages.hasOwnProperty(global.config.language)) {
      _0x157250 = (..._0x44a3f1) => {
        var _0x21b57e = _0x1f1adb.languages[global.config.language][_0x44a3f1[0]] || '';
        for (var _0x14ebc1 = _0x44a3f1.length; _0x14ebc1 > 0; _0x14ebc1--) {
          const _0x124ebc = RegExp('%' + _0x14ebc1, 'g');
          _0x21b57e = _0x21b57e.replace(_0x124ebc, _0x44a3f1[_0x14ebc1]);
        }
        return _0x21b57e;
      };
    } else {
      _0x157250 = () => {};
    }
    try {
      const _0x22135d = {
        'api': _0x195c10,
        'event': _0x1b9a9e,
        'args': _0x5136e5,
        'models': _0x3d17db,
        'Users': _0x51e2ea,
        'Threads': _0x5823a5,
        'Currencies': _0x557894,
        'permssion': _0x3e107a,
        'getText': _0x157250,
        ..._0x1ddd34,
        ..._0x540e9b
      };
      if (_0x1f1adb && typeof _0x1f1adb.run === "function") {
        _0x1f1adb.run(_0x22135d);
        _0xa20d23.set(_0x5e9f5e, _0x4fbb38);
        if (_0x314f4a == true) {
          _0x38587b(global.getText("handleCommand", "executeCommand", _0x39e000, _0x27fc47, _0x5e9f5e, _0x3482d2, _0x5136e5.join(' '), Date.now() - _0x4fbb38) + "\n", "command");
        }
        return;
      }
    } catch (_0x72dc3e) {
      return _0x195c10.sendMessage(global.getText("handleCommand", "commandError", _0x27fc47, _0x72dc3e), _0x3482d2);
    }
    try {
      const _0x29f188 = {
        'nayan': _0x195c10,
        'events': _0x1b9a9e,
        'args': _0x5136e5,
        'models': _0x3d17db,
        'Users': _0x51e2ea,
        'Threads': _0x5823a5,
        'Currencies': _0x557894,
        'permssion': _0x3e107a,
        'lang': _0x157250,
        ..._0x1ddd34,
        ..._0x540e9b
      };
      if (_0x1f1adb && typeof _0x1f1adb.start === "function") {
        _0x1f1adb.start(_0x29f188);
        _0xa20d23.set(_0x5e9f5e, _0x4fbb38);
        if (_0x314f4a == true) {
          _0x38587b(global.getText("handleCommand", "executeCommand", _0x39e000, _0x27fc47, _0x5e9f5e, _0x3482d2, _0x5136e5.join(' '), Date.now() - _0x4fbb38) + "\n", "command");
        }
        return;
      }
    } catch (_0x35bd82) {
      return _0x195c10.sendMessage(global.getText("handleCommand", "commandError", _0x27fc47, _0x35bd82), _0x3482d2);
    }
  };
};
