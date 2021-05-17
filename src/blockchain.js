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
class Blockchain {
  #balance;
  constructor() {
    this.chain = [];
  }
  // set chain(chain) {
  //   this.chain = chain;
  //   this.balance(0);
  // }
  add_block(block) {
    // "M" for money
    // other letters for different types
    if (block && block.is_valid) {
      this.chain = [block, ...this.chain];
      // adds blocks to the start
      return true;
    } else return false;
  }
  first() {
    return this.chain[0];
  }
  remove_block() {}
  balance(initial_balance) {
    return this.chain.reduce(
      (prev_total, curr) => prev_total + curr.money,
      initial_balance || 0
    );
  }
}
module.exports = Blockchain;
