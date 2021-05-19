const EC = require("elliptic").ec;
const SHA256 = require("./crypto-hash");
const curve = new EC("ed25519");
var crypto = require("crypto");

const verifySignature = ({
  public_key /* type hex string */,
  data /* type hex string (SHA256 hash already) */,
  signature,
}) => {
  // console.log(public_key);
  // console.log(data);
  // console.log(signature);
  const keyFromPublic = curve.keyFromPublic(public_key, "hex");
  return keyFromPublic.verify(data, signature);
};
const genKeyPair = (private_key) => {
  let key_pair;
  /* how to add buffer? */
  if (private_key instanceof Object)
    key_pair = curve.keyFromPrivate(private_key);
  else if (typeof private_key === typeof "")
    key_pair = curve.keyFromPrivate(private_key, "hex");
  else key_pair = curve.keyFromPrivate(crypto.randomBytes(32));

  return key_pair;
};

// is this the fastest way for genPublic?
const genPublic = (public_key) => {
  if (typeof public_key === typeof "")
    return curve.keyFromPublic(public_key, "hex").getPublic();
  if (typeof public_key === typeof curve.g)
    return public_key.encode("hex");
};

module.exports = { verifySignature, SHA256, genKeyPair, curve, genPublic };
