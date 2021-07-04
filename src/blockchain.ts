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
import { verify_block, SHA256 } from "../util";
import { Block } from "./block";

export class Blockchain {
    private chain: Block[];
    private owner: string;
    private base_balance: number;

    constructor(owner: string) {
        this.chain = [];
        this.owner = owner;
        this.base_balance = 0
    }
    // set chain(chain) {
    //   this.chain = chain;
    //   this.balance(0);
    // }
    public get length() {
        return this.chain.length;
    }
    public get identifier() {
        return SHA256(this.owner);
    }
    add_block(block: Block) {
        // "M" for money
        // other letters for different types
        if (
            block &&
            Block.is_valid(block) &&
            verify_block(block) &&
            (block.sender === this.owner || block.receiver === this.owner)
        ) {
            this.chain = [block].concat(this.chain);
            // adds blocks to the start
            return true;
        } else return false;
    }
    public get first() {
        return this.chain[0];
    }
    public get latest_update() {
        try {
            this.sort();
            return this.first.timestamp;
        } catch {
            return 0;
        }
    }
    remove_block() {}
    balance(initial_balance?: number) {
        this.base_balance = initial_balance || this.base_balance;
        if (!(this.chain instanceof Array)) return initial_balance || 0;
        return this.chain.reduce(
            (prev_total, curr) => prev_total + curr.money,
            initial_balance || 0
        );
    }
    is_valid() {
        try {
            return (
                this.balance(0) ===
                    this.first.initial_balance + this.first.money &&
                this.chain.map((block: Block) => {
                    if (
                        this.owner === block.sender ||
                        this.owner === block.receiver
                    ) {
                        return true;
                    } else throw new Error("multiple personality syndrome :(");
                }) &&
                true
            );
        } catch (error) {
            return false;
        }
    }
    sort() {
        this.chain.sort((a, b) => b.timestamp - a.timestamp);
    }
    prune() {
        
    }
}
