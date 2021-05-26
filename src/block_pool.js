/* Any transaction pool has/can/is
 * 1. An array of transactions
 * 2. Kick transactions which arent accepted beyond a period of time
 * 3. Kick-gap time is completely upto the user/device
 * 4. inform other transaction pools
 * 5. if an address is updated, send the update to others too
 */
const Block = require("./block");
const EventEmitter = require("events");
const { verify_block } = require("../util");
class Block_pool {
    constructor() {
        this.old_send = [];
        this.new_send = [];
        this.new_receive = [];
        this.addresses = [];
        this.event = new EventEmitter();
        this.recycle_bin = [];
    }
    get pool() {
        return this.pool;
    }
    // addresses = [{public, money, timestamp, last_block}, {}] type
    // set addresses(addresses) {
    //   // addresses are not supposed to be erased
    //   // find a way to update addresses or add new ones
    //    if(addresses instanceof Array) this.addresses.concat(addresses);
    //    else if(addresses instanceof Object) this.addresses.append(addresses);
    // }
    clear() {
        this.old_send = this.old_send.concat(this.new_send);
        var new_send = this.new_send;
        var new_receive = this.new_receive;
        this.new_send = this.new_receive = [];
        return { new_send, new_receive };
    }
    add({
        new_receive,
        new_send,
        addresses,
        network /* to find if network is strong or not */,
    }) {
        // first, preliminary checking
        // should we return true, or the block itself (in array.map function?)

        if (!(new_send instanceof Array)) new_send = [];
        if (!(new_receive instanceof Array)) new_receive = [];
        if (!(addresses instanceof Array)) addresses = [];

        // filtering new_send and new_receive
        new_send = new_send.map((block) => {
            if (
                block instanceof Block &&
                /* block.public_key && */
                verify_block(block) &&
                Block.is_valid(block) &&
                block.money <= 0
            )
                return block;
            else return null;
        });
        new_receive = new_receive.map((block) => {
            if (
                block instanceof Block &&
                verify_block(block) &&
                Block.is_valid(block) &&
                block.money >= 0
            )
                return block;
            else return null;
        });

        // setting up listeners for corresponding receive_blocks
        new_send.forEach((send) => {
            // switching on just the new send blocks will cover the old send blocks too
            if (!send) return;
            if (send.type.is_no_reply) return;
            if (
                this.recycle_bin.find(
                    (hash) => hash === send.hash[0].substring(0, 20)
                )
            )
                return;
            if (!this.event.listenerCount(send.hash[0].substring(0, 20))) {
                // add quorum checking here. if false, return
                this.new_send.push(send);
                this.event.on(send.hash[0].substring(0, 20), (receive) => {
                    if (!(receive.money + send.money)) {
                        this.event.emit(receive.hash[0].substring(0, 20), true);
                        this.recycle_bin.push(send.hash[0].substring(0, 20));
                        this.new_send.splice(
                            this.new_send.findIndex(
                                (block) =>
                                    send.hash[0].substring(0, 20) ===
                                    block.hash[0].substring(0, 20)
                            ),
                            1
                        );
                    } else
                        this.event.emit(
                            receive.hash[0].substring(0, 20),
                            false
                        );
                });
            }
        });

        // triggering the respective send blocks
        new_receive.forEach((receive) => {
            if (
                !receive ||
                this.new_receive.find(
                    (block) =>
                        block.hash[0].substring(0, 20) ==
                        receive.hash[0].substring(0, 20)
                )
            )
                return;
            if (
                this.recycle_bin.find(
                    (hash) => hash === receive.hash[0].substring(0, 20)
                )
            )
                return;
            this.new_receive.push(receive);
            this.event.once(receive.hash[0].substring(0, 20), (status) => {
                this.recycle_bin.push(receive.hash[0].substring(0, 20));
                if (!status) {
                    this.new_receive.splice(
                        this.new_receive.findIndex(
                            (block) =>
                                receive.hash[0].substring(0, 20) ===
                                block.hash[0].substring(0, 20)
                        ),
                        1
                    );
                }
            });
            this.event.emit(receive.hash[2].substring(0, 20), receive);
        });

        new_receive.forEach((receive) => {
            // status describes if receive block matched the money or not
            // on so that atleast one 'true' response will validate it
            if (!receive) return;
            this.event.off(receive.hash[0].substring(0, 20), () => {});
        });
        this.recycle_bin.forEach((hash) => this.event.off(hash, () => {}));
        // remove both if both match, send the receive
        // remove just the receive if they dont match
        // add the pool to this.pool
        // look at each block and search for the corresponding sender address
        // if it exists
        // // 1. update the corresponding address state if timestamp is newer
        // // // 1. if that block's meant for you, take it in XD
        // // 2. sign on it (done after this, in the account/user part)
        // // 3. send it to others
        let new_set = this.new_receive.concat(this.new_send);
        new_set.sort((a, b) => a.timestamp - b.timestamp);
        this.addresses = this.addresses.concat(addresses);
        this.addresses.sort((a, b) => a.timestamp - b.timestamp);
        this.addresses = this.addresses.map((data) => {
            let block = new_set.find(
                (
                    block // shouldnt this function be optimised?
                ) =>
                    block.sender === data.public &&
                    block.timestamp > data.timestamp
            );
            if (block.initial_balance === data.money) {
                data.money += block.money;
                data.timestamp = block.timestamp;
            }
        });
        // if an address has new timestamp
    }
    remove() {} // accepts an array of block hashes to remove
    return_existing() {}
    return_valid() {}
    set_map() {}
    clear_if_acepted() {}
}
module.exports = Block_pool;

/* send block ->
 *
 * 1. send all blocks after validating it
 * 2. process it only if it has quorum
 *
 * 3. add it to this.parts
 * 4. if a valid receive block is found, delete it
 * */
