"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verify_block = exports.random = exports.genPublic = exports.genKeyPair = exports.verifySignature = exports.roughSizeOfObject = exports.curve = exports.SHA256 = void 0;
const EC = require("elliptic").ec;
var crypto_hash_1 = require("./crypto-hash");
Object.defineProperty(exports, "SHA256", { enumerable: true, get: function () { return crypto_hash_1.SHA256; } });
exports.curve = new EC("ed25519");
const crypto_1 = __importDefault(require("crypto"));
const roughSizeOfObject = (object) => {
    var objectList = [];
    var i;
    var recurse = function (value) {
        var bytes = 0;
        if (typeof value === "boolean") {
            bytes = 4;
        }
        else if (typeof value === "string") {
            bytes = value.length * 2;
        }
        else if (typeof value === "number") {
            bytes = 8;
        }
        else if (typeof value === "object" &&
            objectList.indexOf(value) === -1) {
            objectList[objectList.length] = value;
            for (i in value) {
                bytes += 8; // an assumed existence overhead
                bytes += recurse(value[i]);
            }
        }
        return bytes;
    };
    return recurse(object);
};
exports.roughSizeOfObject = roughSizeOfObject;
const verifySignature = ({ public_key /* type hex string */, data /* type hex string (SHA256 hash already) */, signature, }) => {
    // console.log(public_key)
    // console.log(data)
    // console.log(signature)
    const keyFromPublic = exports.curve.keyFromPublic(public_key, "hex");
    return keyFromPublic.verify(data, signature);
};
exports.verifySignature = verifySignature;
const genKeyPair = (private_key) => {
    let key_pair;
    /* how to add buffer? */
    if (private_key instanceof Object)
        key_pair = exports.curve.keyFromPrivate(private_key);
    else if (typeof private_key === typeof "")
        key_pair = exports.curve.keyFromPrivate(private_key, "hex");
    else
        key_pair = exports.curve.keyFromPrivate(crypto_1.default.randomBytes(32));
    return key_pair;
};
exports.genKeyPair = genKeyPair;
// is this the fastest way for genPublic?
const genPublic = (public_key) => {
    if (!public_key)
        throw new Error("Empty public key string");
    return exports.curve.keyFromPublic(public_key, "hex").getPublic();
};
exports.genPublic = genPublic;
const random = () => crypto_1.default.randomBytes(32).toString("hex");
exports.random = random;
const verify_block = (block) => {
    try {
        if (!block)
            return false;
        return exports.verifySignature({
            public_key: block.sender /* type hex string of the account that made it */,
            data: block.hash[0],
            signature: block.verifications[0],
        });
    }
    catch (error) {
        return false;
    }
};
exports.verify_block = verify_block;
