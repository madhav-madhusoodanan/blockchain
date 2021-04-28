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
import Blockchain from "./blockchain";
import Comm from "./comm";
const Signature = require('./signature');

class Account {
    constructor({blockchain, key_pair, comm}) {
        this.blockchain = blockchain || new Blockchain();
        this.key_pair = key_pair;
        this.comm = comm || new Comm();
    }
    create_block({money, data, receiver_address}) {
        const block = this.blockchain[0];

        // create a one-time receiver_address and signatures too
        block = new Block({money, data, receiver_address, lastHash: block.hash, random});
        this.blockchain.add_block(block);
    }
    sign() {
        return Signature.sign(key_pair, data_chunk);
    }
    clean() {}
}
module.exports = Account;