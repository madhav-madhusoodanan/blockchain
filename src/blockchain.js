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
const { verify_block } = require("../util");
const Block = require("./block");
class Blockchain {
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
    if (block && Block.is_valid(block) && verify_block(block)) {
      this.chain = [block].concat(this.chain);
      // adds blocks to the start
      this.chain.forEach((block) => console.log(block.data));
      return true;
    } else return false;
  }
  first() {
    return this.chain[0];
  }
  remove_block() {}
  balance(initial_balance) {
    if (!(this.chain instanceof Array)) return initial_balance || 0;
    return this.chain.reduce(
      (prev_total, curr) => prev_total + curr.money,
      initial_balance || 0
    );
  }
  is_valid() {
    try {
      return (
        this.balance(0) === this.first().initial_balance + this.first().money
      );
    } catch (error) {
      return false;
    }
  }
}
module.exports = Blockchain;
