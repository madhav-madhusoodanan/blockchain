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
import { verify_block } from "../util/index.js";
import { Block } from "./block.js";
export class Blockchain {
    chain;
    owner;
    base_balance;
    update;
    constructor(owner) {
        this.chain = [];
        this.owner = owner;
        this.base_balance = 0;
        this.update = Date.now();
    }
    // set chain(chain) {
    //   this.chain = chain;
    //   this.balance(0);
    // }
    get length() {
        return this.chain.length;
    }
    get identifier() {
        return this.owner;
    }
    add_block(block) {
        // "M" for money
        // other letters for different types
        if (block &&
            Block.is_valid(block) &&
            verify_block(block) &&
            (block.sender === this.owner || block.receiver === this.owner)) {
            this.chain = [block].concat(this.chain);
            this.update = block.timestamp;
            // adds blocks to the start
            return true;
        }
        else
            return false;
    }
    get first() {
        return this.chain[0];
    }
    get timestamp() {
        try {
            this.sort();
            return this.update;
        }
        catch {
            return 0;
        }
    }
    remove_block() { }
    balance(initial_balance) {
        this.base_balance = initial_balance || this.base_balance;
        if (!(this.chain instanceof Array))
            return initial_balance || 0;
        return this.chain.reduce((prev_total, curr) => prev_total + curr.money, initial_balance || 0);
    }
    get is_valid() {
        try {
            return (this.chain.length === 0 ||
                (this.balance(0) ===
                    this.first.initial_balance + this.first.money &&
                    this.chain.map((block) => {
                        if (this.owner === block.sender ||
                            this.owner === block.receiver) {
                            return true;
                        }
                        else
                            throw new Error("multiple personality syndrome :(");
                    }) &&
                    true));
        }
        catch (error) {
            return false;
        }
    }
    sort() {
        this.chain.sort((a, b) => b.timestamp - a.timestamp);
    }
    prune() { }
}
