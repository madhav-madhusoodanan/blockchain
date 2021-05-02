const EC = require("elliptic").ec;
const cryptoHash = require("./crypto-hash");

const curve = new EC("secp256k1");

const verifySignature = ({ publicKey, data, signature }) => {
  const keyFromPublic = curve.keyFromPublic(publicKey, "hex");
  return keyFromPublic.verify(cryptoHash(data), signature);
};
const genKeyPair = ({ private_key }) => {
  if (private_key) {
    key_pair = curve.keyFromPrivate(private_key);
  } else key_pair = curve.genKeyPair();

  return key_pair;
};

module.exports = { ec, verifySignature, cryptoHash, genKeyPair };
