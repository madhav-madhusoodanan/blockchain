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
import { GENESIS_DATA } from "../config";
import { genKeyPair, bignum, cryptoHash as SHA256 } from "./util";

class Account {
  // declaration of private fields
  #key_pair;

  constructor({ blockchain, key_pair, private_key }) {
    this.blockchain = blockchain || new Blockchain();

    if (key_pair) this.#key_pair = key_pair;
    else this.#key_pair = genKeyPair({ private_key });
    // its okay even if private key is null

    this.blockchain.add_block(GENESIS_DATA);
    this.base_balance = 0; // will come in necessary when clearing blockchains
  }
  get public_key() {
    return this.#key_pair.getPublic("hex");
  }
  get balance() {
    return this.blockchain.balance(this.base_balance);
  }
  set balance(balance) {
    this.base_balance = balance;
  }
  receive(block) {
    // make the block , add it and return it
  }
  create_block({ money, data, reference_hash, receiver_address, tags }) {
    // receiver_address is an array of public keys
    // keep tight block validity checking here
    // create a one-time receiver_address and signatures too
    // money is already negative if it is a send block
    const balance = this.balance;

    // create a receiver_key and block_public_key from receiver_address
    // if its a receive block then it is null
    
    const random_key = genKeyPair(); // R = rG
    // verify and optimize the steps below
    var r = bignum(random_key.getPrivate('hex'), 16);
    var A = bignum(receiver_address[0], 16);
    var B = bignum(receiver_address[1], 16);
    const random_key_2 = genKeyPair({private_key: SHA256(r.mul(A))});
    var temp = bignum(random_key_2.getPublic('hex'), 16);
    var receiver_key = temp.add(B); // receiver_key is of type bignum

    const block = new Block({
      initial_balance: balance,
      money, //: money > balance ? -1 * balance : -1 * money, // -ve money for send blocks
      data,
      receiver_key,
      reference_hash,
      last_hash: this.blockchain.first().hash[0],
      block_public_key: bignum(random_key.getPublic('hex'), 16),
      sender_public: bignum(this.key_pair.getPublic('hex'), 16),
      tags,
    });

    this.sign(block);
    this.blockchain.add_block(block);

    return block;
  }
  sign(data_chunk) {
    // // add rng signatures only if block is a send block
    // else make just a normal signature
    return this.#key_pair.sign(SHA256(data_chunk));
  }
  clean() {}
}
export default Account;
