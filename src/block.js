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
const { SHA256 } = require("../util");
const { DIFFICULTY, BET_KEEPING_KEY, TYPE } = require("./config");
const { LAST_HASH, SENDER_PUBLIC } = require("./config").GENESIS_DATA;

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
    this.#hash[1] = last_hash || LAST_HASH; // hash of last block in blockchain
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

  static is_valid(block) {
    // data-only blocks return true
    if (!block || block.type.is_spam) return false;
    if (!block.receiver_key) {
      console.log("no receiver");
      block.receiver_key = BET_KEEPING_KEY;
    } else if (!block.money) {
      return true;
    } 
    if (
      /* condition:
       * if not SENDER_PUBLIC but negative total, true
       * rest all false
       *  */
      block.money + block.initial_balance < 0 &&
      block.sender_public !== SENDER_PUBLIC
    ) {
      return false;
    }
    // A block is valid if a nonce exists
    // Not valid if money is Infinity
    if (!block.nonce || block.money === Infinity) return false;
    // hashes exist
    // 2. hash is verified
    if (!block.hash[0] || !block.hash[1]) return false;
    // else if (!(block.money > 0) || !block.hash[2]) return false;
    else {
      const hash = SHA256(
        block.timestamp,
        block.hash[1],
        block.data,
        block.money,
        block.receiver_key,
        block.nonce,
        block.initial_balance
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
