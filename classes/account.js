/* Each user can have
 * 1. Any number of accounts
 * 
 * Each of these accounts have
 * 1. A blockchain
 * 2. Only one key-pair
 * 3. Acts like a normal account as in Nanocurrency
 * 4. Will create the one-time public account
 */
import Block from './block';
const Signature = require('./signature');

class Account {
    constructor(blockchain, key_pair, comm) {
        this.blockchain = blockchain;
        this.key_pair = key_pair;
        this.comm = comm;
    }
    create_block({type, money, data, receiver_address}) {
        const block = this.blockchain[this.blockchain.chain.length - 1];
        // create a one-time receiver_address and signatures too
        block = new Block({money, data, receiver_address, lastHash: block.hash, random});
        this.blockchain.chain = [...(this.blockchain.chain), block];

    }
    sign() {}
    clean() {}
}
module.exports = Account;