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
const { SHA256 } = require("../util");
const { DIFFICULTY, BET_KEEPING_KEY, TYPE } = require("./config");
const { LAST_HASH, SENDER_PUBLIC } = require("./config").GENESIS_DATA;

class Block {
    #initial_balance;
    #money;
    #data;
    #verifications;
    #receiver;
    #timestamp;
    #public_key;
    #nonce;
    #hash;
    #type;
    #sender;

    constructor({
        initial_balance,
        money,
        data,
        receiver,
        last_hash,
        reference_hash, // for receive blocks to reference send blocks
        public_key,
        sender,
        tags,
    }) {
        this.#hash = [null, null, null];
        this.#data = [null, {}]; // object as 2nd part so that we can expand this
        this.#type = new TYPE(tags, money, data);
        this.#initial_balance = initial_balance || 0;
        this.#money = money || null;
        this.#data[0] = data || null;
        this.#sender = sender;
        this.#verifications = []; // proof of ppl 'yes'-ing its authenticity
        this.#receiver = receiver || null;
        this.#timestamp = Date.now();
        this.#public_key = public_key || null; // the destination address
        this.#nonce = null; // null + number = number, so its okay :)
        this.#hash[0] = null; // hash representation of block
        this.#hash[1] = last_hash || LAST_HASH; // hash of last block in blockchain
        this.#hash[2] = reference_hash || null; // hash of the send block, this block is its receive block
        this.mine();
    }
    get initial_balance() {
        return this.#initial_balance;
    }
    get money() {
        return this.#money;
    }
    get data() {
        return this.#data[0];
    }
    get modifiable_data() {
        return this.#data[1];
    }
    set modifiable_data(data) {
        // how do you add data to the 2nd part?
    }
    get verifications() {
        return this.#verifications;
    }
    get receiver() {
        return this.#receiver;
    }
    get timestamp() {
        return this.#timestamp;
    }
    get public_key() {
        return this.#public_key;
    }
    get nonce() {
        return this.#nonce;
    }
    get hash() {
        return this.#hash;
    }
    get sender() {
        return this.#sender;
    }
    get type() {
        return this.#type;
    }
    set add_verifications(verification) {
        // add type checking
        if (verification) this.#verifications.push(verification);
    }

    static is_valid(block) {
        // data-only blocks return true
        if (!(block instanceof Block) || block.type.is_spam) return false;
        if (!block.receiver) {
            block.receiver = BET_KEEPING_KEY;
        } else if (!block.money) {
            return true;
        }
        if (
            /* condition:
             * if not SENDER_PUBLIC but negative total, then condition is true
             * rest all conditons, false
             *  */
            block.money + block.initial_balance < 0 &&
            block.sender !== SENDER_PUBLIC
        ) {
            return false;
        }
        // A block is valid if a nonce exists
        // Not valid if money is Infinity
        if (!block.nonce || block.money === Infinity) return false;
        // hashes exist
        // 2. hash is verified
        if (!block.hash[0] || !block.hash[1]) return false;
        // else if (!(block.money > 0) || !block.hash[2]) return false;
        else {
            const hash = SHA256(
                block.timestamp,
                block.hash[1],
                block.data,
                block.money,
                block.receiver,
                block.nonce,
                block.initial_balance
            );
            return hash.substring(0, DIFFICULTY) === "0".repeat(DIFFICULTY);
        }
        // the block-pool will verify state changes...dont worry
    }
    mine() {
        do {
            ++this.#nonce;
            this.#hash[0] = SHA256(
                this.#timestamp,
                this.#hash[1],
                this.#data[0],
                this.#money,
                this.#receiver,
                this.#nonce,
                this.#initial_balance
            );
        } while (
            this.#hash[0].substring(0, DIFFICULTY) !== "0".repeat(DIFFICULTY) &&
            this.#money
        );
    }
    create_input() {}
    create_output_map() {}
    update() {}
}

module.exports = Block;
