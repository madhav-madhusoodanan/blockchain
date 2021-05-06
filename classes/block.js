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
 */
import { cryptoHash } from "./util";
import { DIFFICULTY, BET_KEEPING_KEY, ASSIGN_TYPE } from "../config";
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

  
  constructor({
    initial_balance,
    money,
    data,
    receiver_key,
    last_hash,
    reference_hash,
    block_public_key,
  }) {
    this.#initial_balance = initial_balance || null;
    this.#money = money || null;
    this.#data = data || null;
    this.#sender_signatures = [];
    this.#verifications = []; // proof of ppl 'yes'-ing its authenticity
    this.#receiver_key = receiver_key;
    this.#timestamp = Date.now();
    this.#block_public_key = block_public_key; // the destination address
    this.#nonce = 0;
    this.#hash[0] = null; // hash representation of block
    this.#hash[1] = last_hash || null; // hash of last block in blockchain
    this.#hash[2] = reference_hash || null; // hash of the send block, this block is its receive block
    this.#type = null;
    this.assign_type();
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
  set type(type) {
      // one-time type casting
    if(!this.#type) this.#type = type;
  }
  set verifications(verification) {
    this.#verifications.append(verification);
  }

  static is_valid(block) {
    // data-only blocks return true
    if (!block.money) return true;
    // A block is valid if:
    // 1. a nonce exists
    else if (!block.nonce) return false;
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

  assign_type()
  {
    this.#type = ASSIGN_TYPE(this);
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
