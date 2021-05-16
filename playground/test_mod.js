var EC = require("elliptic").ec;
var curve = new EC("ed25519");
const { SHA256 } = require("../util");

var key_1 = curve.genKeyPair();

console.log(key_1.getPrivate('hex'));
console.log(SHA256('abc'));
