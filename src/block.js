/* Every transaction has
 * 1. An id
 * 2. Input and output
 * 3. Amount and/or data (no rate-limiting if amount is zero)
 * 4. Rate-limiting nonce to make an acceptable hash
 *
 * Features
 * 1. adding a signature is the job of the user/account
 * 2. -ve money indicates send, +ve money indicates receive
 * 3. private data members ensures data security
 * 4. receiver_key is of type bignum
 */
const { SHA256, verifySignature } = require("../util");
const { DIFFICULTY, BET_KEEPING_KEY, TYPE, PHILANTHROPIST } = require("./config");

class Block {
  #initial_balance;
  #money;
  #data;
  #sender_signatures;
  #verifications;
  #receiver_key;
  #timestamp;
  #block_public_key;
  #nonce;
  #hash;
  #type;
  #sender_public;

  constructor({
    initial_balance,
    money,
    data,
    receiver_key,
    last_hash,
    reference_hash, // for receive blocks to reference send blocks
    block_public_key,
    sender_public,
    tags,
  }) {
    this.#hash = [null, null, null];
    this.#initial_balance = initial_balance || 0;
    this.#money = money || null;
    this.#data = data || null;
    this.#sender_public = sender_public;
    this.#sender_signatures = [];
    this.#verifications = []; // proof of ppl 'yes'-ing its authenticity
    this.#receiver_key = receiver_key || null;
    this.#timestamp = Date.now();
    this.#block_public_key = block_public_key || null; // the destination address
    this.#nonce = null; // null + number = number, so its okay :)
    this.#hash[0] = null; // hash representation of block
    this.#hash[1] = last_hash || null; // hash of last block in blockchain
    this.#hash[2] = reference_hash || null; // hash of the send block, this block is its receive block
    this.#type = new TYPE(tags, money, data);
    this.mine();
  }
  get initial_balance() {
    return this.#initial_balance;
  }
  get money() {
    return this.#money;
  }
  get data() {
    return this.#data;
  }
  get sender_signatures() {
    return this.#sender_signatures;
  }
  get verifications() {
    return this.#verifications;
  }
  get receiver_key() {
    return this.#receiver_key;
  }
  get timestamp() {
    return this.#timestamp;
  }
  get block_public_key() {
    return this.#block_public_key;
  }
  get nonce() {
    return this.#nonce;
  }
  get hash() {
    return this.#hash;
  }
  get sender_public() {
    return this.#sender_public;
  }
  get type() {
    // one-time type casting
    return this.#type;
  }
  set add_verifications(verification) {
    if (verification) this.#verifications.push(verification);
  }

  get is_valid() {
    // data-only blocks return true
    if (!this.receiver_key) this.receiver_key = BET_KEEPING_KEY;
    if (!this) return false;
    else if (!this.money || (this.type.is_genesis && this.sender_public === PHILANTHROPIST)) return true;
    // A block is valid if a nonce exists
    // Not valid if money is Infinity
    else if (!this.nonce || this.money === Infinity) return false;
    // hashes exist
    // 2. hash is verified
    else if (!this.hash[0] || !this.hash[1]) return false;
    // else if (!(this.money > 0) || !this.hash[2]) return false;
    else if (
      !verifySignature({
        public_key:
          this.sender_public /* type hex string of the account that made it */,
        data: this.hash[0],
        signature: this.verifications[0],
      })
    )
      return false;
    else {
      const hash = SHA256(
        this.timestamp,
        this.hash[1],
        this.data,
        this.money,
        this.receiver_key,
        this.nonce,
        this.initial_balance
      );
      return hash.substring(0, DIFFICULTY) === "0".repeat(DIFFICULTY);
    }
    // the block-pool will verify state changes...dont worry
  }

  mine() {
    do {
      ++this.#nonce;
      this.#hash[0] = SHA256(
        this.#timestamp,
        this.#hash[1],
        this.#data,
        this.#money,
        this.#receiver_key,
        this.#nonce,
        this.#initial_balance
      );
    } while (
      this.#hash[0].substring(0, DIFFICULTY) !== "0".repeat(DIFFICULTY) &&
      this.#money
    );
  }
  create_input() {}
  create_output_map() {}
  update() {}
}

module.exports = Block;
