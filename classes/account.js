/* Each user can have
 * 1. Any number of accounts
 *
 * Each of these accounts have
 * 1. A blockchain
 * 2. Only one key-pair
 * 3. Acts like a normal account as in Nanocurrency
 * 4. Will create the one-time public account
 */
import Block from "./block";
import Blockchain from "./blockchain";
import Comm from "./comm";
import { GENESIS_DATA } from "../config";
const Signature = require("./signature");
import { genKeyPair } from "./util";

class Account {
  // declaration of private fields
  #key_pair;
  
  constructor({ blockchain, key_pair, private_key, comm }) {
    this.blockchain = blockchain || new Blockchain();

    if (key_pair) this.#key_pair = key_pair;
    else this.#key_pair = genKeyPair({private_key});

    this.comm = comm || new Comm();
    this.blockchain.add_block(GENESIS_DATA);
  }
  create_block({ money, data, receiver_address }) {
    const block = this.blockchain[0];

    // create a one-time receiver_address and signatures too
    block = new Block({
      money,
      data,
      receiver_address,
      lastHash: block.hash,
      random,
    });
    this.blockchain.add_block(block);
  }
  sign() {
    // will this private method work?
    return Signature.sign(this.#key_pair, data_chunk);
  }
  clean() {}
}
module.exports = Account;
