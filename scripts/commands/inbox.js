module.exports.config = {
name: "inbox",
version: "",
permssion: 2,
credits: "Nayan",
description: "",
category: "spam",
usages: "inbox",
prefix: true,
cooldowns: 5,
dependencies: "",
};

module.exports.run = async function ({
api: _0xb5e05c,
event: _0x21cca6,
Users: _0x6f322,
args: _0x44a203
}) {
var _0x1fac7a = Object.keys(_0x21cca6.mentions)[0] || _0x21cca6.senderID;
var _0x529d83 = await _0x6f322.getNameUser(_0x1fac7a);
if (!_0x44a203[0]) {
_0xb5e05c.sendMessage("✅ SUCCESSFULLY SEND MSG\n\n🔰 [" + _0x529d83 + "] PLEASE CK YOUR INBOX OR MSG REQUEST BOX", _0x21cca6.threadID);
}
var {
threadID: _0x275a5c,
messageID: _0x40f737
} = _0x21cca6;
var _0x4039f = function (_0x52106e) {
_0xb5e05c.sendMessage(_0x52106e, _0x1fac7a);
};
const _0x3f93b5 = "✅ SUCCESSFULLY ALLOW\n🔰 NOW YOU CAN USE " + global.config.BOTNAME + " HERE";
{
_0x4039f('' + _0x3f93b5);
}
};


