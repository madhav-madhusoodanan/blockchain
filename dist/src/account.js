"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Account = void 0;
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
var block_1 = require("./block");
var blockchain_1 = require("./blockchain");
var block_pool_1 = require("./block_pool");
var util_1 = require("../util");
var config_1 = require("./config");
var Account = /** @class */ (function () {
    function Account(_a) {
        var blockchain = _a.blockchain, key_pair = _a.key_pair, private_key = _a.private_key, standalone = _a.standalone;
        if (key_pair)
            this._key_pair = key_pair;
        else
            this._key_pair = util_1.genKeyPair(private_key);
        this.blockchain =
            blockchain ||
                new blockchain_1.Blockchain(this._key_pair.getPublic().encode("hex"));
        // its okay even if private key is null
        if (standalone) {
            this.standalone = true;
            this.block_pool = new block_pool_1.Block_pool([this._key_pair.getPublic().encode("hex")]);
        }
        else {
            this.standalone = false;
            this.block_pool = undefined;
        }
        this._base_balance = 0; // will come in necessary when clearing blockchains
    }
    Object.defineProperty(Account.prototype, "public_key", {
        get: function () {
            return this._key_pair.getPublic().encode("hex");
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Account.prototype, "balance", {
        get: function () {
            return this.blockchain.balance(this._base_balance);
        },
        set: function (balance) {
            balance === Infinity ? (this._base_balance = Infinity) : null;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Account.prototype, "private_key", {
        // key is present only for debugging
        get: function () {
            return this._key_pair.getPrivate("hex");
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Account.prototype, "verify", {
        get: function () {
            return this.blockchain.is_valid;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Account.prototype, "account_verify", {
        get: function () {
            var data = util_1.random();
            return [this.public_key, data, this.sign(data)];
        },
        enumerable: false,
        configurable: true
    });
    Account.prototype.create_block = function (_a) {
        var money = _a.money, data = _a.data, reference_hash = _a.reference_hash, receiver_address = _a.receiver_address, tags = _a.tags;
        // receiver_address is an array of public keys
        // keep tight block validity checking here
        // create a one-time receiver_address and signatures too
        // money is already negative if it is a send block
        var block;
        var last_hash = this.blockchain.first
            ? this.blockchain.first.hash[0]
            : config_1.GENESIS_DATA.LAST_HASH;
        if (!(receiver_address instanceof Array))
            return null;
        var initial_balance = this.balance || 0;
        if (receiver_address.length === 2) {
            // send block
            // create a receiver and public_key from receiver_address
            var random_key = util_1.genKeyPair(); // R = rG
            // verify and optimize the steps below
            var r = random_key.getPrivate();
            // make the below more efficient)
            var A = util_1.genPublic(receiver_address[0]);
            var B = util_1.genPublic(receiver_address[1]);
            var random_key_2 = util_1.genKeyPair(util_1.SHA256(A.mul(r).encode("hex")));
            A = r = null;
            var receiver = B.add(random_key_2.getPublic()); // receiver is of type point
            B = null;
            block = new block_1.Block({
                initial_balance: initial_balance,
                money: money,
                data: data,
                receiver: receiver.encode("hex"),
                reference_hash: reference_hash,
                last_hash: last_hash,
                public_key: random_key.getPublic().encode("hex"),
                sender: this._key_pair.getPublic().encode("hex"),
                tags: tags,
            });
        }
        else if (receiver_address.length === 1) {
            // receive block
            block = new block_1.Block({
                initial_balance: initial_balance,
                money: money,
                data: data || "receive",
                receiver: receiver_address[0],
                reference_hash: reference_hash,
                last_hash: last_hash,
                public_key: null,
                sender: this._key_pair.getPublic().encode("hex"),
                tags: tags,
            });
        }
        else
            return null;
        block.add_verifications = this.sign(block.hash[0]);
        this.blockchain.add_block(block);
        return block;
    };
    Account.prototype.sign = function (data_chunk) {
        // // add rng signatures only if block is a send block
        // else make just a normal signature
        return this._key_pair.sign(data_chunk).toDER("hex");
    };
    Account.prototype.send_large_data = function (_a) {
        var data = _a.data, receiver_address = _a.receiver_address, tags = _a.tags;
        // break the data into smaller chunks to
        var data_chunk;
        var arr = [];
        while (data_chunk)
            arr.push(this.send({
                money: 0,
                data: data_chunk,
                receiver_address: receiver_address,
                tags: [config_1.TYPE_enum.speed].concat(tags),
            }));
        return arr;
    };
    Account.prototype.send = function (_a) {
        var money = _a.money, data = _a.data, receiver_address = _a.receiver_address, tags = _a.tags /* only for independent types */;
        if (
        // guard clauses
        !this.standalone &&
            receiver_address instanceof Array &&
            receiver_address.length !== 1 &&
            this.balance)
            return null;
        try {
            if (money < 0 || money === Infinity)
                money = 0;
            else if (!money && "speed" in tags /* check for HIGH_SPEED tag */) {
                var block = this.create_block({
                    money: 0,
                    data: data,
                    receiver_address: receiver_address,
                    tags: tags,
                });
                if (block_1.Block.is_valid(block) && util_1.verify_block(block))
                    return block;
            }
            else {
                // no problem if money is negative or Infinity then (above)
                // what if money is null?
                // then the 1st part of "while" condition is false (below)
                var balance = this.balance;
                if (balance === Infinity)
                    return null;
                var block = this.create_block({
                    money: money > balance ? -1 * balance : -1 * money,
                    data: data,
                    receiver_address: receiver_address,
                    tags: tags,
                });
                if (block_1.Block.is_valid(block) && util_1.verify_block(block)) {
                    money += block.money;
                    data = null;
                    return block;
                }
                // if the block was a spam block, dont transact and continue
                // can happen if the first few blocks have zero balance
                // zero balance may appear due to empty accounts
                // usually only archived accounts have Infinity balance
            }
            if (money)
                throw new Error("insufficient Balance. Emptied it");
            // if account is empty, archive it
            return true;
        }
        catch (error) {
            console.error(error);
            return false;
        }
    };
    Account.prototype.receive = function (receives) {
        var _this = this;
        if (!this.standalone)
            return undefined;
        receives = receives
            .map(function (block) {
            if (!(block instanceof block_1.Block))
                return;
            var new_block = _this.create_block({
                data: block.data,
                money: -1 * block.money,
                reference_hash: block.hash[0],
                receiver_address: [block.sender],
                tags: [],
            });
            if (new_block instanceof block_1.Block)
                return new_block;
            else
                return;
        })
            .filter(function (block) { return block; });
        return receives;
    };
    Account.prototype.update_pool = function (data) {
        if (!this.standalone)
            return false;
        try {
            // transit data type: { new_receive, new_send, addresses, network }
            this.block_pool.add(data); // the pool makes sure only legit blocks are passed
            return this.scan();
        }
        catch (error) {
            console.error(error);
            return false;
        }
    };
    Account.prototype.scan = function () {
        var _this = this;
        if (!this.standalone)
            return null;
        var receives = this.block_pool.new_send.filter(function (block) {
            // find a way to store the private key within the block
            return _this.is_for_me(block) && block.money <= 0;
        });
        this.block_pool.add({
            new_receive: this.receive(receives),
        });
        var new_blocks = this.block_pool.clear();
        new_blocks.new_send = new_blocks.new_send
            .map(function (block) {
            if (!block)
                return;
            block.add_verifications = _this.sign(block.hash[0]);
            return block;
        })
            .filter(function (send) { return send; });
        new_blocks.new_receive = new_blocks.new_receive
            .map(function (block) {
            if (!block)
                return;
            if (_this.is_for_me(block))
                return block;
            block.add_verifications = _this.sign(block.hash[0]);
            return block;
        })
            .filter(function (receive) { return receive; });
        return new_blocks;
    };
    Account.prototype.is_for_me = function (block) {
        if (!this.standalone)
            return false;
        if (this.public_key === block.receiver)
            return true;
        if (this.public_key === block.sender)
            return true;
        else
            return false;
    };
    Account.prototype.clean = function () { };
    return Account;
}());
exports.Account = Account;
