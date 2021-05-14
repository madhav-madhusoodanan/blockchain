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
import { cryptoHash } from "./util";
import { DIFFICULTY, BET_KEEPING_KEY, TYPE } from "../config";
import hexToBinary from "hex-to-binary";

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
    this.#initial_balance = initial_balance || null;
    this.#money = money || null;
    this.#data = data || null;
    this.sender_public = sender_public;
    this.#sender_signatures = [];
    this.#verifications = []; // proof of ppl 'yes'-ing its authenticity
    this.#receiver_key = receiver_key || null;
    this.#timestamp = Date.now();
    this.#block_public_key = block_public_key || null; // the destination address
    this.#nonce = null; // null + number = number, so its okay :)
    this.#hash[0] = null; // hash representation of block
    this.#hash[1] = last_hash || null; // hash of last block in blockchain
    this.#hash[2] = reference_hash || null; // hash of the send block, this block is its receive block
    this.#type = new TYPE(tags);
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
    return this.sender_public;
  }
  get type() {
    // one-time type casting
    return this.#type;
  }
  set add_verifications(verification) {
    this.#verifications.append(verification);
  }

  static is_valid(block) {
    // data-only blocks return true
    if (!block) return false;
    else if (!block.money) return true;
    // A block is valid if a nonce exists
    // Not valid if money is Infinity
    else if (!block.nonce || block.money === Infinity) return false;
    // hashes exist
    else if (!block.receiver_key) block.receiver_key = BET_KEEPING_KEY;
    // 2. hash is verified
    else if (!block.hash[0] && !block.hash[1]) return false;
    else {
      const hash = cryptoHash(
        block.timestamp,
        block.hash[1],
        block.data,
        block.money,
        block.receiver_key,
        block.nonce,
        block.initial_balance
      );
      return (
        hexToBinary(hash).substring(0, DIFFICULTY) === "0".repeat(DIFFICULTY)
      );
    }
    // the block-pool will verify state changes...dont worry
  }

  mine() {
    if (this.#money) {
      do {
        ++this.#nonce;
        this.#hash[0] = cryptoHash(
          this.#timestamp,
          this.#hash[1],
          this.#data,
          this.#money,
          this.#receiver_key,
          this.#nonce,
          this.#initial_balance
        );
      } while (
        hexToBinary(this.#hash[0]).substring(0, DIFFICULTY) !==
        "0".repeat(DIFFICULTY)
      );
    }
  }
  create_input() {}
  create_output_map() {}
  update() {}
}

module.exports = Block;
