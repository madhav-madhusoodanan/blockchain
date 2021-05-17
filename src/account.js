/* Each user can have
 * 1. Any number of accounts
 *
 * Each of these accounts have
 * 1. A blockchain
 * 2. Only one key-pair
 * 3. Acts like a normal account as in Nanocurrency
 * 4. Will create the one-time public account
 */
const Block = require("./block");
const Blockchain = require("./blockchain");
const { genKeyPair, SHA256, genPublic } = require("../util");

class Account {
  // declaration of private fields
  #key_pair;

  constructor({ blockchain, key_pair, private_key }) {
    this.blockchain = blockchain || new Blockchain();

    if (key_pair) this.#key_pair = key_pair;
    else this.#key_pair = genKeyPair(private_key);
    // its okay even if private key is null

    this.base_balance = 0; // will come in necessary when clearing blockchains
  }

  get lock() {
    return this.#key_pair.getPublic().encode("hex");
  }

  // key is present only for debugging
  get key() {
    return this.#key_pair.getPrivate("hex");
  }
  get balance() {
    return this.blockchain.balance(this.base_balance);
  }

  create_block({ money, data, reference_hash, receiver_address, tags }) {
    // receiver_address is an array of public keys
    // keep tight block validity checking here
    // create a one-time receiver_address and signatures too
    // money is already negative if it is a send block
    const balance = this.balance;

    // create a receiver_key and block_public_key from receiver_address
    // if its a receive block then it is null

    var random_key = genKeyPair(); // R = rG
    // verify and optimize the steps below
    var r = random_key.getPrivate();
    // make the below more efficient)
    var A = genPublic(receiver_address[0]);
    var B = genPublic(receiver_address[1]);

    var random_key_2 = genKeyPair(SHA256(A.mul(r)));
    A = r = null;
    var receiver_key = B.add(random_key_2.getPublic()); // receiver_key is of type point
    B = null;
    const block = new Block({
      initial_balance: balance,
      money, 
      data,
      receiver_key: genPublic(receiver_key),
      reference_hash,
      last_hash: /* this.blockchain.first().hash[0] || */ "dead",
      block_public_key: random_key.getPublic().encode("hex"), // let this specifically be of type point
      sender_public: this.#key_pair.getPublic().encode("hex"),
      tags,
    });

    block.add_verifications = this.sign(block.hash[0]);
    this.blockchain.add_block(block);

    return block;
  }
  sign(data_chunk) {
    // // add rng signatures only if block is a send block
    // else make just a normal signature
    return this.#key_pair.sign(data_chunk);
  }
  clean() {}
}
module.exports = Account;
