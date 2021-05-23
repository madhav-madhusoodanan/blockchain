const EC = require("elliptic").ec;
const SHA256 = require("./crypto-hash");
const curve = new EC("ed25519");
var crypto = require("crypto");

function roughSizeOfObject(object) {
    var objectList = [];

    var recurse = function (value) {
        var bytes = 0;

        if (typeof value === "boolean") {
            bytes = 4;
        } else if (typeof value === "string") {
            bytes = value.length * 2;
        } else if (typeof value === "number") {
            bytes = 8;
        } else if (
            typeof value === "object" &&
            objectList.indexOf(value) === -1
        ) {
            objectList[objectList.length] = value;

            for (i in value) {
                bytes += 8; // an assumed existence overhead
                bytes += recurse(value[i]);
            }
        }

        return bytes;
    };

    return recurse(object);
}

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
};

const random = () => crypto.randomBytes(32).toString("hex");
const verify_block = (block) =>
    verifySignature({
        public_key:
            block.sender_public /* type hex string of the account that made it */,
        data: block.hash[0],
        signature: block.verifications[0],
    });
module.exports = {
    verifySignature,
    SHA256,
    genKeyPair,
    curve,
    genPublic,
    random,
    verify_block,
    roughSizeOfObject,
};
