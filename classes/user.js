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

const Signature = require('./signature');
class User {
  constructor({ blockchain, comm, block_pool, key_pair, accounts }) {
    this.blockchain = blockchain;
    this.block_pool = block_pool;
    this.comm = comm;
    this.accounts = accounts;
    this.key_pair = key_pair;   // simplify this
    this.received = [];
  };
  get tracking_key() {
    return [key_pair[0].getPrivate('hex'), key_pair[1].getPublic('hex')];
  }
  get private_user_key() {
    return [key_pair[0].getPrivate('hex'), key_pair[1].getPrivate('hex')];
  }
  send(data_chunk) {
    try {
      // search for an appropriate account to release data from
      // create a block, share it
      // and append to its blockchain
      // if account is empty, archive it
      this.comm.send(data_chunk);
      return true;
    } catch (error) {
      return false;
    }
  }
  receive() {
    this.received.forEach(block => this.blockchain.add_block(block));
  }
  update_pool() {
    try {
      this.block_pool = this.comm.receive();
      return true;
    } catch (error) {
      return false;
    }
  }
  sign(data_chunk) {
    return Signature.sign(key_pair, data_chunk);
  }
  scan() {
    this.update_pool();
    this.received = this.block_pool.pool.map((block) => {
      let temporary_block;
      if(temporary_block = Signature.is_for_me(this.tracking_Key, block && temporary_block))
        return block;
    })
    receive();
    this.received = [];
  }
  clean() {}
  static count() {} 
      // can we really count the number of users on the system?
      // would help in quorum if that was possible
  join() {}
  leave() {}
}
module.exports = User;