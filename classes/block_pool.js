/* Any transaction pool has/can/is
 * 1. An array of transactions
 * 2. Kick transactions which arent accepted beyond a period of time
 * 3. Kick-gap time is completely upto the user/device
 * 4. inform other transaction pools
 * 5. if an address is updated, send the update to others too
 */
import Block from "./block";
class Block_pool {
  constructor() {
    this.addresses = [];
    this.pool = [];
  }
  set pool(pool) {
    this.pool = pool;
  }
  set addresses(addresses) {
    // addresses are not supposed to be erased
    // find a way to update addresses or add new ones
    this.addresses = addresses;
  }
  clear() {}
  add({ pool, addresses }) {
    // first, preliminary checking
    pool = pool.map((block) => Block.is_valid(block));
    this.addresses = this.addresses.concat(addresses);

    // then, if pool has a receive block, check for a corresponding send block in ths.pool
    // remove both if both match
    // remove just the receive if they dont match
    // add the pool to this.pool
    this.pool.concat(pool);
    // look at each block and search for the corresponding sender address
    // if it exists
    // // 1. update the corresponding address state if timestamp is newer
    // // // 1. if that block's meant for you, take it in XD
    // // 2. sign on it
    // // 3. send it to others
    this.pool = this.pool.map((block) => {})
    
    // if an address has new timestamp
  }
  remove() // accepts an array of block hashes to remove
  return_existing() {}
  return_valid() {}
  set_map() {}
  clear_if_acepted() {}
}
module.expors = Block_pool;
