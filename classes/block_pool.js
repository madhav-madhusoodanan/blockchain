/* Any transaction pool has/can/is
 * 1. An array of transactions
 * 2. Kick transactions which arent accepted beyond a period of time
 * 3. Kick-gap time is completely upto the user/device
 * 4. inform other transaction pools
 * 5. if an address is updated, send the update to others too
 */
import Block from "./block";
import EventEmitter from "events";
class Block_pool {
  constructor() {
    this.old_send = [];
    this.new_send = [];
    this.new_receive = [];
    this.addresses = [];
    this.event = new EventEmitter();
    this.recycle_bin = []; // list of block hashes to delete
  }
  get pool() {
    return this.pool;
  }
  // addresses = [{public, money, timestamp}, {}] type
  // set addresses(addresses) {
  //   // addresses are not supposed to be erased
  //   // find a way to update addresses or add new ones
  //    if(addresses instanceof Array) this.addresses.concat(addresses);
  //    else if(addresses instanceof Object) this.addresses.append(addresses);
  // }
  clear() {}
  add({
    new_receive,
    new_send,
    addresses,
    network /* to find if network is strong or not */,
  }) {
    // first, preliminary checking
    // should we return true, or the block itself (in array.map function?)

    if (new_send) {
      new_send = new_send.map((block) => {
        if (Block.is_valid(block)) return block;
        else;
      });
      new_send.forEach((send) => {
        // switching on just the new send blocks will cover the old send blocks too
        if (!this.event.listenerCount(send.hash[0])) {
          this.event.on(send.hash[0], (receive) => {
            if (!(receive.money + send.money)) {
              this.event.off(send.hash[0], () => {});
              this.event.emit(receive.hash[0], true);
              this.recycle_bin.push(send.hash[0]);
            } else this.event.emit(receive.hash[0], false);
          });
        }
      });
    }

    if (new_receive) {
      new_receive = new_receive.map((block) => {
        if (Block.is_valid(block)) return block;
        else;
      });
      new_receive.forEach((receive) => {
        // status describes if receive block matched the money or not
        // on so that atleast one 'true' response will validate it
        this.event.on(receive.hash[0], (status) => {
          if (status) {
            this.new_receive.push(receive);
            this.event.off(receive.hash[0], () => {});
          }
        });
        this.event.emit(receive.hash[2], receive);
      });
    }

    new_send = new_send.map((send) => !(send.hash[0] in this.recycle_bin));
    this.recycle_bin = [];
    // remove both if both match, send the receive
    // remove just the receive if they dont match
    // add the pool to this.pool
    this.new_send.concat(new_send);
    this.new_receive.concat(new_receive);
    // look at each block and search for the corresponding sender address
    // if it exists
    // // 1. update the corresponding address state if timestamp is newer
    // // // 1. if that block's meant for you, take it in XD
    // // 2. sign on it
    // // 3. send it to others
    let new_set = [].append(this.new_receive, this.new_send);
    if (addresses) this.addresses.append(addresses);
    this.addresses = this.addresses.map((data) => {
      new_set.sort((a, b) => a.timestamp - b.timestamp);
      let block = new_set.find(
        (block) =>
          block.sender_public === data.public &&
          block.timestamp > data.timestamp
      );
      if (block.initial_balance === data.money) {
        data.money += block.money;
        data.timestamp = block.timestamp;
      }
    });
    new_set = null;
    // if an address has new timestamp
  }
  remove() {} // accepts an array of block hashes to remove
  return_existing() {}
  return_valid() {}
  set_map() {}
  clear_if_acepted() {}
}
module.expors = Block_pool;
