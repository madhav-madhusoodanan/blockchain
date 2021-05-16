const EC = require("elliptic").ec;
const SHA256 = require("./crypto-hash");
const curve = new EC("ed25519");

const verifySignature = ({
  publicKey /* type hex string */,
  data, /* type hex string (SHA256 hash already) */
  signature,
}) => {
  const keyFromPublic = curve.keyFromPublic(publicKey, "hex");
  return keyFromPublic.verify(data, signature);
};
const genKeyPair = (private_key ) => {
  let key_pair;
  if (typeof private_key === object /* how to add buffer? */) {
    key_pair = curve.keyFromPrivate(private_key);
  } else if (typeof private_key === String)
    key_pair = curve.keyFromPrivate(private_key, "hex");
  else key_pair = curve.genKeyPair();

  return key_pair;
};

// is this the fastest way for genPublic?
const genPublic = (public_key /* hex string type */ ) =>
  curve.keyFromPublic(public_key, "hex").getPublic();

curve.keyFromPublic(receiver_address[0], "hex").getPublic();
module.exports = { verifySignature, SHA256, genKeyPair, curve, genPublic };
