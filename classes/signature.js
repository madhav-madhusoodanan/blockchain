/* Every signature has
 * 1. Two pairs of keys (view key and power key)
 *
 * Every signature can
 * 1. Sign on a transaction
 * 2. Return a corresponding private key for a public key sent to it, or null otherwise
 */
const eliptic = require("elliptic");
const crypto = require("crypto");
const cryptoHash = require("./util");

class Signature {
    constructor() {}
    static sign(key_pair, data) {
        return key_pair.sign(cryptoHash(data));
    }
    static is_for_me(view_key, block) {
        // 1. Take the random data
        // 2. calculate P'
        // 3. If P' = P(receiver address in the block) 
        //  // then return its private key
        //  // else return null 
    }
}
module.exports = Signature;