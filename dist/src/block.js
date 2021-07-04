"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Block = void 0;
/* Every transaction has
 * 1. An id
 * 2. Input and output
 * 3. Amount and/or data (no rate-limiting if amount is zero)
 * 4. Rate-limiting nonce to make an acceptable hash
 *
 * Features
 * 1. adding a signature is the job of the user/account
 * 2. -ve money indicates send, +ve money indicates receive
 * 3. private data members ensures data security
 * 4. receiver is of type bignum
 */
var util_1 = require("../util");
var config_1 = require("./config");
var LAST_HASH = config_1.GENESIS_DATA.LAST_HASH, SENDER_PUBLIC = config_1.GENESIS_DATA.SENDER_PUBLIC;
var Block = /** @class */ (function () {
    function Block(_a) {
        var initial_balance = _a.initial_balance, money = _a.money, data = _a.data, receiver = _a.receiver, last_hash = _a.last_hash, reference_hash = _a.reference_hash, // for receive blocks to reference send blocks
        public_key = _a.public_key, sender = _a.sender, tags = _a.tags;
        this._hash = ["", last_hash || null, reference_hash || null];
        this._data = [null, {}]; // object as 2nd part so that we can expand this
        this._type = new config_1.TYPE(tags, money, data);
        this._initial_balance = initial_balance || 0;
        this._money = money || 0;
        this._data[0] = data || null;
        this._sender = sender;
        this._verifications = []; // proof of ppl 'yes'-ing its authenticity
        this._receiver = receiver || "";
        this._timestamp = Date.now();
        this._public_key = public_key || null; // the destination address
        this._nonce = 0; // null + number = number, so its okay :)
        this._hash[0] = ""; // hash representation of block
        this._hash[1] = last_hash || LAST_HASH; // hash of last block in blockchain
        this._hash[2] = reference_hash || null; // hash of the send block, this block is its receive block
        this.mine();
    }
    Object.defineProperty(Block.prototype, "verifications", {
        get: function () {
            return this._verifications;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Block.prototype, "timestamp", {
        get: function () {
            return this._timestamp;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Block.prototype, "public_key", {
        get: function () {
            return this._public_key;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Block.prototype, "sender", {
        get: function () {
            return this._sender;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Block.prototype, "type", {
        get: function () {
            return this._type;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Block.prototype, "nonce", {
        get: function () {
            return this._nonce;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Block.prototype, "hash", {
        get: function () {
            return this._hash;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Block.prototype, "money", {
        get: function () {
            return this._money;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Block.prototype, "initial_balance", {
        get: function () {
            return this._initial_balance;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Block.prototype, "data", {
        get: function () {
            return this._data[0];
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Block.prototype, "modifiable_data", {
        get: function () {
            return this._data[1];
        },
        set: function (data) {
            // how do you add data to the 2nd part?
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Block.prototype, "receiver", {
        get: function () {
            return this._receiver;
        },
        set: function (value) {
            this._receiver = value;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Block.prototype, "add_verifications", {
        set: function (verification) {
            // add type checking
            if (verification)
                this._verifications.push(verification);
        },
        enumerable: false,
        configurable: true
    });
    Block.is_valid = function (block) {
        // data-only blocks return true
        // if (!(block instanceof Block) || block.type.isspam) return false
        try {
            if (!block)
                return false;
            if (!block._receiver) {
                block._receiver = config_1.BET_KEEPING_KEY;
            }
            else if (!block._money) {
                return true;
            }
            if (
            /* condition:
             * if not SENDERPUBLIC but negative total, then condition is true
             * rest all conditons, false
             *  */
            block._money + block._initial_balance < 0 &&
                block._sender !== SENDER_PUBLIC) {
                return false;
            }
            // A block is valid if a nonce exists
            // Not valid if money is Infinity
            if (!block._nonce || block._money === Infinity)
                return false;
            // hashes exist
            // 2. hash is verified
            if (!block._hash[0] || !block._hash[1])
                return false;
            // else if (!(block.money > 0) || !block.hash[2]) return false
            else {
                var hash = util_1.SHA256(block.timestamp, block.hash[1], block.data, block.money, block.receiver, block.nonce, block.initial_balance);
                return hash.substring(0, config_1.DIFFICULTY) === "0".repeat(config_1.DIFFICULTY);
            }
            // the block-pool will verify state changes...dont worry
        }
        catch (err) {
            return false;
        }
    };
    Block.prototype.mine = function () {
        do {
            ++this._nonce;
            this._hash[0] = util_1.SHA256(this._timestamp, this._hash[1], this._data[0], this._money, this._receiver, this._nonce, this._initial_balance);
        } while (this._hash &&
            this._hash[0].substring(0, config_1.DIFFICULTY) !== "0".repeat(config_1.DIFFICULTY) &&
            this._money);
    };
    Block.prototype.create_input = function () { };
    Block.prototype.create_output_map = function () { };
    Block.prototype.update = function () { };
    return Block;
}());
exports.Block = Block;
