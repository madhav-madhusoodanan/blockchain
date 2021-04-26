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

class Blockchain {
    constructor() {
        this.balance = 0;
        this.chain = [];
    }
    get chain(chain)
    {
        this.chain = chain;
        this.balance(0);
    }
    add_block({type, block}) {
        // "M" for money
        // other letters for different types
    }
    remove_block() {}
    static is_valid() {}
    balance(initial_balance){
        this.balance = this.chain.reduce((prev_total, curr) => (prev_total + curr.money), initial_balance || 0);
    }

}
module.exports = Blockchain;