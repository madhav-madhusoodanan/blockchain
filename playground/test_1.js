var EC = require("elliptic").ec;
var curve = new EC("ed25519");
var crypto = require("crypto");

// var priv_1 = new BN('0f797c8118f02dfb649607dd5d3f8c74fed2e26f1cb2bf73f85af36693270f59', 16); // hex string, array or Buffer
// var priv_2 = new BN('546d2b20000de58b037da0c0e18edd8885e1fbbb9ebf03e28ecdd4215aa44337', 16);

// var priv_1 = crypto.randomBytes(31);
// var priv_2 = crypto.randomBytes(31);

var key_1 = curve.genKeyPair();
var key_2 = curve.genKeyPair();

// var pub_1 = curve.g.mul(priv_1);
// var pub_2 = curve.g.mul(priv_2);

var pub_1 = curve.g.mul(key_1.getPrivate());
var pub_2 = curve.g.mul(key_2.getPrivate());

var res_1 = pub_1.mul(key_2.getPrivate());
var res_2 = pub_2.mul(key_1.getPrivate());

console.log(key_1.getPrivate());
console.log(key_2.getPrivate());
console.log(key_1.getPrivate().add(key_2.getPrivate()));