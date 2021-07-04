"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Blockchain = void 0;
/* This is a blockchain.
 *
 * Musts:
 * 1. Users must keep the hashes of their blocks at all times
 *
 * Cans:
 * 1. users can delete a part of their blockchain after verifying
 *
 * Cannots:
 * 1. Only the blockchain owner (user) has the power to write their own blockchain
 */
// const Block = require("./block");
var util_1 = require("../util");
var block_1 = require("./block");
var Blockchain = /** @class */ (function () {
    function Blockchain(owner) {
        this.chain = [];
        this.owner = owner;
        this.base_balance = 0;
    }
    Object.defineProperty(Blockchain.prototype, "length", {
        // set chain(chain) {
        //   this.chain = chain;
        //   this.balance(0);
        // }
        get: function () {
            return this.chain.length;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Blockchain.prototype, "identifier", {
        get: function () {
            return util_1.SHA256(this.owner);
        },
        enumerable: false,
        configurable: true
    });
    Blockchain.prototype.add_block = function (block) {
        // "M" for money
        // other letters for different types
        if (block &&
            block_1.Block.is_valid(block) &&
            util_1.verify_block(block) &&
            (block.sender === this.owner || block.receiver === this.owner)) {
            this.chain = [block].concat(this.chain);
            // adds blocks to the start
            return true;
        }
        else
            return false;
    };
    Object.defineProperty(Blockchain.prototype, "first", {
        get: function () {
            return this.chain[0];
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Blockchain.prototype, "latest_update", {
        get: function () {
            try {
                this.sort();
                return this.first.timestamp;
            }
            catch (_a) {
                return 0;
            }
        },
        enumerable: false,
        configurable: true
    });
    Blockchain.prototype.remove_block = function () { };
    Blockchain.prototype.balance = function (initial_balance) {
        this.base_balance = initial_balance || this.base_balance;
        if (!(this.chain instanceof Array))
            return initial_balance || 0;
        return this.chain.reduce(function (prev_total, curr) { return prev_total + curr.money; }, initial_balance || 0);
    };
    Blockchain.prototype.is_valid = function () {
        var _this = this;
        try {
            return (this.balance(0) ===
                this.first.initial_balance + this.first.money &&
                this.chain.map(function (block) {
                    if (_this.owner === block.sender ||
                        _this.owner === block.receiver) {
                        return true;
                    }
                    else
                        throw new Error("multiple personality syndrome :(");
                }) &&
                true);
        }
        catch (error) {
            return false;
        }
    };
    Blockchain.prototype.sort = function () {
        this.chain.sort(function (a, b) { return b.timestamp - a.timestamp; });
    };
    Blockchain.prototype.prune = function () {
    };
    return Blockchain;
}());
exports.Blockchain = Blockchain;
