/* Every user has
 * 1. A transaction pool
 * 2. Two pairs of cryptographic keys (view pair and send pair)
 * 3. Local storage for temporary addresses
 *
 * Every user can
 * 1. Send either tokens or information
 * 2. Obfuscate their data before sending it (privacy oriented)
 * 3. Scan for stuff sent to them, and accept/reject them
 * 4. Clean their blockchain and local storage
 * 5. Cover its tracks by adding decoy signatures to transaction
 * 6. Keep a list of addresses and their timestamp and balance and last-hash
 * 7. Anyone with the addresses can verify the blocks and sign over it (and then update)
 * 8. If any block reaches quorum,
 *
 * No user can
 * 1. Spam transactions, because of rate-limiter
 * 2. Claim back tokens that are not accepted
 * 3. Send data by randomly initiating websockets and send data
 *    i. They must be properly logged in, jwt and refresh tokens etc etc can help
 */
const { TYPE } = require("../config");
const Signature = require("./signature");
const Account = require("./account");
class User {
  // declaration of private fields
  #key_pair;
  #accounts;

  constructor({ comm, block_pool, key_pair, accounts }) {
    this.block_pool = block_pool;
    this.comm = comm;
    this.#accounts = accounts || [];
    this.#key_pair = key_pair; // this is an array of 2 key pairs
    this.received = [];
    this.#accounts.sort(
      // ascending order of balance
      (a, b) => a.balance - b.balance
    );
  }
  get tracking_key() {
    return [
      this.#key_pair[0].getPrivate("hex"),
      this.#key_pair[1].getPublic("hex"),
    ];
  }
  get private_user_key() {
    return [
      this.#key_pair[0].getPrivate("hex"),
      this.#key_pair[1].getPrivate("hex"),
    ];
  }
  send({ money, data_chunk, receiver_address }) {
    try {
      const i = 0;
      // what if money is null?
      // then the 1st part of "while" condition is false
      while (money > 0 || data_chunk) {
        const balance = this.#accounts[i].balance;

        const block = this.#accounts[i].create_block({
          money: money > balance ? -1 * balance : -1 * money,
          data,
          receiver_address,
        });

        money += block.money;
        ++i;
        data_chunk = null;

        // if the block was a spam block, dont transact and continue
        // can happen if the first few blocks have zero balance
        if (block.type === TYPE.SPAM) continue;

        this.comm.send(block);
      }

      // if account is empty, archive it
      this.#accounts.forEach((account) => {
        if (!account.balance) {
          // archive!
        }
      });
      return true;
    } catch (error) {
      return false;
    }
  }
  receive() {
    // not like send()
    // makes just a receive block and returns it
    // 1. check if you have addresses of same private key
    // 2. mostly gonna be a NO. build an account
    // finding/creating the account
    // replace each block with a receive block
    this.received.forEach((block) => {
      // construct the private key into private_key
      const index = this.#accounts.findIndex(
        (account) => account.public_key === block.receiver_key
      );
      if (index < 0) {
        const account = new Account({ private_key });
        account.receive(block);
      } else {
        this.#accounts[index].receive(block);
      }
    });
  }
  update_pool() {
    try {
      const { pool, addresses } = this.comm.receive();
      this.block_pool.add({ pool, addresses });
      return true;
    } catch (error) {
      return false;
    }
  }
  sign(data_chunk) {
    return Signature.sign(this.#key_pair, data_chunk);
  }
  scan() {
    this.update_pool();
    this.received = this.block_pool.pool.map((block) => {
      const private_key = Signature.is_for_me(this.tracking_Key, block);
      // find a way to store the private key within the block
      if (private_key) return block;
    });
    this.receive(); // creates receive blocks for all of em
    this.block_pool.add({ pool: this.received, addresses: [] });
  }
  clean() {}
  static count() {}
  // can we really count the number of users on the system?
  // would help in quorum if that was possible
  // possible i guess: counting the number of websocket channels at any time
  join() {}
  leave() {}
}
module.exports = User;
