"use strict";
/* Any transaction pool has/can/is
 * 1. An array of transactions
 * 2. Kick transactions which arent accepted beyond a period of time
 * 3. Kick-gap time is completely upto the user/device
 * 4. inform other transaction pools
 * 5. if an address is updated, send the update to others too
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Block_pool = void 0;
var events_1 = __importDefault(require("events"));
var util_1 = require("../util");
var block_1 = require("./block");
var Block_pool = /** @class */ (function () {
    function Block_pool(owners) {
        this.old_send = [];
        this.new_send = [];
        this.new_receive = [];
        this.addresses = [];
        this.event = new events_1.default();
        this.recycle_bin = [];
        this.owners = owners || [];
    }
    Object.defineProperty(Block_pool.prototype, "identifier", {
        get: function () {
            return this.owners.map(function (account_public_key) {
                return util_1.SHA256(account_public_key);
            });
        },
        enumerable: false,
        configurable: true
    });
    Block_pool.prototype.set_owners = function (owners) {
        // focus on this set accessors
        // ideally, pass in private keys for verification
        this.owners = owners;
    };
    Block_pool.prototype.clear = function () {
        this.old_send = this.old_send.concat(this.new_send);
        var new_send = this.new_send;
        var new_receive = this.new_receive;
        this.new_send = this.new_receive = [];
        return { new_send: new_send, new_receive: new_receive, addresses: this.addresses };
    };
    Block_pool.prototype.add = function (_a) {
        var _this = this;
        var new_receive = _a.new_receive, new_send = _a.new_send, addresses = _a.addresses;
        // first, preliminary checking
        // should we return true, or the block itself (in array.map function?)
        // filtering new_send and new_receive
        new_send = new_send ? new_send : [];
        new_receive = new_receive ? new_receive : [];
        addresses = addresses ? addresses : [];
        new_send = new_send
            .map(function (block) {
            if (
            /* block.public_key && */
            util_1.verify_block(block) &&
                block_1.Block.is_valid(block) &&
                block.money <= 0)
                return block;
            else
                return null;
        })
            .filter(function (send) { return send; });
        new_receive = new_receive
            .map(function (block) {
            if (block instanceof block_1.Block &&
                util_1.verify_block(block) &&
                block_1.Block.is_valid(block) &&
                block.money >= 0 &&
                block.hash[2])
                return block;
            else
                return null;
        })
            .filter(function (receive) { return receive; });
        // setting up listeners for corresponding receive_blocks
        new_send.forEach(function (send) {
            // switching on just the new send blocks will cover the old send blocks too
            if (!send)
                return;
            if (send.type.is_no_reply)
                return;
            if (_this.recycle_bin.find(function (hash) { return hash === send.hash[0].substring(0, 20); }))
                return;
            if (!_this.event.listenerCount(send.hash[0].substring(0, 20))) {
                // add quorum checking here. if false, return
                _this.new_send.push(send);
                _this.event.on(send.hash[0].substring(0, 20), function (receive) {
                    if (!(receive.money + send.money)) {
                        _this.event.emit(receive.hash[0].substring(0, 20), true);
                        _this.recycle_bin.push(send.hash[0].substring(0, 20));
                        _this.new_send.splice(_this.new_send.findIndex(function (block) {
                            return send.hash[0].substring(0, 20) ===
                                block.hash[0].substring(0, 20);
                        }), 1);
                    }
                    else
                        _this.event.emit(receive.hash[0].substring(0, 20), false);
                });
            }
        });
        // triggering the respective send blocks
        new_receive.forEach(function (receive) {
            if (!receive ||
                _this.new_receive.find(function (block) {
                    return block.hash[0].substring(0, 20) ==
                        receive.hash[0].substring(0, 20);
                }))
                return;
            if (_this.recycle_bin.find(function (hash) { return hash === receive.hash[0].substring(0, 20); }))
                return;
            _this.new_receive.push(receive);
            _this.event.once(receive.hash[0].substring(0, 20), function (status) {
                _this.recycle_bin.push(receive.hash[0].substring(0, 20));
                if (!status) {
                    _this.new_receive.splice(_this.new_receive.findIndex(function (block) {
                        return receive.hash[0].substring(0, 20) ===
                            block.hash[0].substring(0, 20);
                    }), 1);
                }
            });
            _this.event.emit(receive.hash[2].substring(0, 20), receive);
        });
        new_receive.forEach(function (receive) {
            // status describes if receive block matched the money or not
            // on so that atleast one 'true' response will validate it
            if (!receive)
                return;
            _this.event.off(receive.hash[0].substring(0, 20), function () { });
        });
        this.recycle_bin.forEach(function (hash) { return _this.event.off(hash, function () { }); });
        // remove both if both match, send the receive
        // remove just the receive if they dont match
        // add the pool to this.pool
        // look at each block and search for the corresponding sender address
        // if it exists
        // // 1. update the corresponding address state if timestamp is newer
        // // // 1. if that block's meant for you, take it in XD
        // // 2. sign on it (done after this, in the account/user part)
        // // 3. send it to others
        var new_set = this.new_receive.concat(this.new_send);
        new_set.sort(function (a, b) { return a.timestamp - b.timestamp; });
        // addresses manipulation
        this.addresses = this.addresses.concat(addresses);
        this.addresses = this.addresses.filter(function (blockchain) { return blockchain && blockchain.is_valid; });
        this.addresses.sort(function (a, b) { return b.timestamp - a.timestamp; });
        // finding unique addresses and addresses that actually belongs to me
        this.addresses = this.addresses.filter(function (blockchain, index, addresses) {
            return (addresses.findIndex(function (item) { return item.identifier === blockchain.identifier; }) === index &&
                !_this.identifier.find(function (id) { return id === blockchain.identifier; })); // unique blockchains, and nothing about the original owner
        });
        var block;
        this.addresses = this.addresses.map(function (blockchain) {
            block = new_set.find(function (block) {
                return block.sender === blockchain.identifier &&
                    block.money + blockchain.balance() > 0 &&
                    (blockchain.length === 0 ||
                        block.hash[1] === blockchain.first.hash[0]) &&
                    block.timestamp > blockchain.timestamp;
            });
            if (block) {
                console.log("dude");
                blockchain.add_block(block);
            }
            return blockchain;
        });
    };
    return Block_pool;
}());
exports.Block_pool = Block_pool;
/* send block ->
 *
 * 1. send all blocks after validating it
 * 2. process it only if it has quorum
 *
 * 3. add it to this.parts
 * 4. if a valid receive block is found, delete it
 * */
