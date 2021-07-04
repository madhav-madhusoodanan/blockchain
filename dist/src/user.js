"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.User = void 0;
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
 * 2. Claim back tokens that are not accepted (poor send blocks)
 * 3. Send data by randomly initiating websockets and send data
 *    i. They must be properly logged in, jwt and refresh tokens etc etc can help
 *
 * Every signature has
 * 1. Two pairs of keys (view key and power key)
 *
 * Every signature can
 * 1. Sign on a transaction
 * 2. Return a corresponding private key for a public key sent to it, or null otherwise
 *
 * Notes for developers
 * 1. Make the signature in such a way that its existing methods are not replaced
 *      when the cryptography is changed to a post-quantum cryptography type
 */
var block_1 = require("./block");
var block_pool_1 = require("./block_pool");
var account_1 = require("./account");
var comm_1 = require("./comm");
var config_1 = require("./config");
var util_1 = require("../util");
var User = /** @class */ (function () {
    function User(_a) {
        var _this = this;
        var comm = _a.comm, block_pool = _a.block_pool, key_pair = _a.key_pair, accounts = _a.accounts;
        this.block_pool = block_pool || new block_pool_1.Block_pool();
        this._accounts = accounts || [];
        this._key_pair = key_pair || [util_1.genKeyPair(), util_1.genKeyPair()]; // this is an array of 2 key pairs
        this.received = [];
        this.comm =
            comm ||
                new comm_1.Comm("" + util_1.SHA256(this._key_pair[0].getPublic().encode("hex"), this._key_pair[1].getPublic().encode("hex")));
        this.comm.comm.on("data", function (data) {
            _this.update_pool(data);
        });
        this._accounts.sort(function (a, b) { return a.balance - b.balance; } // ascending order of balance
        );
    }
    Object.defineProperty(User.prototype, "tracking_key", {
        get: function () {
            // should hex be changed to default type?
            return [
                this._key_pair[0].getPrivate("hex"),
                this._key_pair[1].getPublic("hex"),
            ];
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(User.prototype, "public_key", {
        // i guess the below is pretty useless
        // get private_user_key() {
        //   return [
        //     this._key_pair[0].getPrivate("hex"),
        //     this._key_pair[1].getPrivate("hex"),
        //   ];
        // }
        get: function () {
            return [
                this._key_pair[0].getPublic().encode("hex"),
                this._key_pair[1].getPublic().encode("hex"),
            ];
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(User.prototype, "accounts", {
        get: function () {
            return this._accounts;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(User.prototype, "balance", {
        get: function () {
            if (!(this._accounts instanceof Array))
                return 0;
            return this._accounts.reduce(function (prev_total, account) { return prev_total + account.balance; }, 0);
        },
        enumerable: false,
        configurable: true
    });
    User.prototype.send_large_data = function (_a) {
        var data = _a.data, receiver_address = _a.receiver_address, tags = _a.tags;
        // break the data into smaller chunks to
        var data_chunk;
        while (data_chunk)
            this.send({
                money: 0,
                data: data_chunk,
                receiver_address: receiver_address,
                tags: [config_1.TYPE_enum.speed].concat(tags),
            });
    };
    User.prototype.send = function (_a) {
        var money = _a.money, data = _a.data, receiver_address = _a.receiver_address, tags = _a.tags /* only for independent types */;
        try {
            var i = 0;
            if (money < 0 || money === Infinity)
                money = 0;
            if (!money && "speed" in tags /* check for HIGH_SPEED tag */) {
                var block = this._accounts[0].create_block({
                    money: 0,
                    data: data,
                    receiver_address: receiver_address,
                    tags: tags,
                });
                if (block_1.Block.is_valid(block) && util_1.verify_block(block))
                    this.comm.send(block);
            }
            else {
                // no problem if money is negative or Infinity then (above)
                // what if money is null?
                // then the 1st part of "while" condition is false (below)
                while (money > 0 || data) {
                    var balance = this._accounts[i].balance;
                    if (balance === Infinity)
                        continue;
                    var block = this._accounts[i].create_block({
                        money: money > balance ? -1 * balance : -1 * money,
                        data: data,
                        receiver_address: receiver_address,
                        tags: tags,
                    });
                    if (block_1.Block.is_valid(block) && util_1.verify_block(block)) {
                        money += block.money;
                        data = null;
                        this.comm.send(block);
                    }
                    ++i;
                    // if the block was a spam block, dont transact and continue
                    // can happen if the first few blocks have zero balance
                    // zero balance may appear due to empty accounts
                    // usually only archived accounts have Infinity balance
                }
            }
            if (money)
                throw new Error("insufficient Balance. Emptied it");
            // if account is empty, archive it
            this._accounts.forEach(function (account) {
                if (!account.balance) {
                    // archive!
                    account.balance = Infinity;
                    // that way all these "archived" accounts will be at the end or the accounts array
                    // when it is sorted
                }
            });
            this._accounts.sort(function (a, b) { return a.balance - b.balance; } // ascending order of balance
            );
            return true;
        }
        catch (error) {
            console.error(error);
            return false;
        }
    };
    User.prototype.receive = function () {
        /* not like send()
         * makes just a receive block and returns it
         * 1. check if you have addresses of same private key
         * 2. mostly gonna be a NO. build an account
         * finding/creating the account
         * replace each block with a receive block
         */
        var _this = this;
        this.received = this.received.map(function (_a) {
            var block = _a.block, private_key = _a.private_key;
            var index = _this._accounts.findIndex(function (account) { return account.public_key === block.receiver; });
            if (index < 0) {
                // no existing account is found, most common
                var account = new account_1.Account({ private_key: private_key });
                var new_block = account.create_block({
                    money: -1 * block.money,
                    reference_hash: block.hash[0],
                    receiver_address: [block.sender],
                    tags: [],
                });
                if (new_block) {
                    _this._accounts.push(account);
                    _this.block_pool.set_owners(_this._accounts.map(function (account) { return account.public_key; }));
                    return { block: new_block, private_key: private_key };
                }
                else
                    return;
            }
            else {
                // there is an account
                var new_block = _this._accounts[index].create_block({
                    money: -1 * block.money,
                    reference_hash: block.hash[0],
                    receiver_address: [block.sender],
                    tags: [],
                });
                if (new_block)
                    return { block: new_block, private_key: private_key };
                else
                    return;
            }
        }).filter(function (item) { return item; });
    };
    User.prototype.update_pool = function (data) {
        try {
            // transit data type: { new_receive, new_send, addresses, network }
            this.block_pool.add(data);
            return this.scan(); // the pool makes sure only legit blocks are passed
        }
        catch (error) {
            return false;
        }
    };
    User.prototype.sign = function (data_chunk) {
        return this._key_pair[1].sign(data_chunk).toDER("hex");
    };
    User.prototype.scan = function () {
        var _this = this;
        this.block_pool.new_send.forEach(function (block) {
            if (block.money > 0)
                return;
            var private_key = _this.is_for_me(block);
            // find a way to store the private key within the block
            if (private_key)
                _this.received.push({ block: block, private_key: private_key });
        });
        this.receive(); // creates receive blocks for all of em
        this.block_pool.add({
            new_receive: this.received.map(function (receive) { return receive.block; }),
        });
        var new_blocks = this.block_pool.clear();
        new_blocks.new_send = new_blocks.new_send.map(function (block) {
            block.add_verifications = _this.sign(block.hash[0]);
            return block;
        });
        new_blocks.new_receive = new_blocks.new_receive.map(function (block) {
            block.add_verifications = _this.sign(block.hash[0]);
            return block;
        });
        this.comm.send(new_blocks);
        return new_blocks;
    };
    User.prototype.is_for_me = function (block) {
        try {
            // memory refresher: if private key is a, then public key is A = aG
            // where G is generator in elliptic curve
            // 1. Take the random data
            // var R = block.public_key;
            var a = this._key_pair[0].getPrivate(); // a is 1st private key
            // making key-pair whose private key is SHA256 hash of (a*R)
            var temp_key = util_1.genKeyPair(util_1.SHA256(util_1.genPublic(block.public_key).mul(a).encode("hex")) // block.public_key is of type Point
            );
            var B = this._key_pair[1].getPublic(); // 2nd public key
            var temp = temp_key.getPublic();
            // 2. calculate P' = SHA256(a*R)G + B
            var P_prime = temp.add(B);
            // 3. If P' = P(receiver address in the block)
            //  // then return its private key
            //  // else return null
            if (P_prime.eq(util_1.genPublic(block.receiver))) {
                // private key (p) for the one time account is SHA256(a*R) + b
                // so that P = pG
                temp = temp_key.getPrivate();
                var b = this._key_pair[1].getPrivate();
                return b.add(temp);
            }
            else
                return null;
        }
        catch (error) {
            return false;
        }
    };
    User.prototype.clean = function () { };
    User.count = function () { };
    // can we really count the number of users on the system?
    // would help in quorum if that was possible
    // possible i guess: counting the number of websocket channels at any time
    User.prototype.join = function () { };
    User.prototype.leave = function () {
        this.comm.comm.disconnect();
        // clear the block_pool, keep the addresses
        // try to "save" user data locally
    };
    return User;
}());
exports.User = User;
