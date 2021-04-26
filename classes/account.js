/* Each user can have
 * 1. Any number of accounts
 * 
 * Each of these accounts have
 * 1. A blockchain
 * 2. Only one key-pair
 * 3. Acts like a normal account as in Nanocurrency
 */
import Transaction from './block';

class Account {
    constructor(blockchain, key_pair, comm) {
        this.blockchain = blockchain;
        this.key_pair = key_pair;
        this.comm = comm;
    }
    send(money, data) {
        const transaction = Transaction.create()
    }
    sign() {}
    scan() {}
    clean() {}
}