/* Every signature has
 * 1. Two pairs of keys (view key and power key)
 *
 * Every signature can
 * 1. Sign on a transaction
 * 2. Return a corresponding private key for a public key sent to it, or null otherwise
 *
 * Notes for developers
 * 1. Make the signature in such a way that its existing methods are not replaced
 *      when the cryptography is changed to a post-quantum cryptography type
 */

// const elliptic = require("elliptic");
// const crypto = require("crypto");
const cryptoHash = require("./util");

class Signature {
  constructor() {}

  static is_for_me(view_key, block) {
    // 1. Take the random data
    // 2. calculate P'
    // 3. If P' = P(receiver address in the block)
    //  // then return its private key
    //  // else return null
  }
}
module.exports = Signature;
