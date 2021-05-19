/* Each user can have
 * 1. Any number of accounts
 *
 * Each of these accounts have
 * 1. A blockchain
 * 2. Only one key-pair
 * 3. Acts like a normal account as in Nanocurrency
 * 4. Will create the one-time public account
 *
 * Only one account can be the Genesis account
 * it gives the money to the account in the start
 * can generate money just like that
 */
const Block = require("./block");
const Blockchain = require("./blockchain");
const { genKeyPair, SHA256, genPublic, random } = require("../util");

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
  get public_key() {
    return this.#key_pair.getPublic().encode("hex");
  }

  // key is present only for debugging
  get private_key() {
    return this.#key_pair.getPrivate("hex");
  }
  get balance() {
    return this.blockchain.balance(this.base_balance);
  }
  get verify() {
    return this.blockchain.is_valid();
  }
  get account_verify() {
    var data = random();
    return [this.public_key, data, this.sign(data)];
  }

  create_block({ money, data, reference_hash, receiver_address, tags }) {
    // receiver_address is an array of public keys
    // keep tight block validity checking here
    // create a one-time receiver_address and signatures too
    // money is already negative if it is a send block
    var block;
    var last_hash = this.blockchain.first() ? this.blockchain.first().hash[0] : null,
    tags = tags || [];
    if (!(receiver_address instanceof Array)) return null;
    let initial_balance = this.balance || 0;
    if (receiver_address.length === 2) {
      // send block
      // create a receiver_key and block_public_key from receiver_address
      var random_key = genKeyPair(); // R = rG
      // verify and optimize the steps below
      var r = random_key.getPrivate();
      // make the below more efficient)
      var A = genPublic(receiver_address[0]);
      var B = genPublic(receiver_address[1]);
      var random_key_2 = genKeyPair(SHA256(A.mul(r).encode("hex")));
      A = r = null;
      var receiver_key = B.add(random_key_2.getPublic()); // receiver_key is of type point
      B = null;
      block = new Block({
        initial_balance,
        money,
        data,
        receiver_key: receiver_key.encode("hex"),
        reference_hash,
        last_hash,
        block_public_key: random_key.getPublic().encode("hex"), // let this specifically be of type point
        sender_public: this.#key_pair.getPublic().encode("hex"),
        tags,
      });
    } else if (receiver_address.length === 1) {
      // receive block
      block = new Block({
        initial_balance,
        money,
        data: "receive",
        receiver_key: receiver_address,
        reference_hash,
        last_hash,
        block_public_key: null, // let this specifically be of type point
        sender_public: this.#key_pair.getPublic().encode("hex"),
        tags,
      });
    } else return null;

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
