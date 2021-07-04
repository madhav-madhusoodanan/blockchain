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
import { SHA256 } from "../util";
import { DIFFICULTY, BET_KEEPING_KEY, TYPE } from "./config";
import { GENESIS_DATA } from "./config";
const { LAST_HASH, SENDER_PUBLIC } = GENESIS_DATA;
export class Block {
    _initial_balance;
    _money;
    _data;
    _verifications;
    _receiver;
    _timestamp;
    _public_key;
    _nonce;
    _hash;
    _type;
    _sender;
    constructor({ initial_balance, money, data, receiver, last_hash, reference_hash, // for receive blocks to reference send blocks
    public_key, sender, tags, }) {
        this._hash = ["", last_hash || null, reference_hash || null];
        this._data = [null, {}]; // object as 2nd part so that we can expand this
        this._type = new TYPE(tags, money, data);
        this._initial_balance = initial_balance || 0;
        this._money = money || 0;
        this._data[0] = data || null;
        this._sender = sender;
        this._verifications = []; // proof of ppl 'yes'-ing its authenticity
        this._receiver = receiver || "";
        this._timestamp = Date.now();
        this._public_key = public_key || null; // the destination address
        this._nonce = 0; // null + number = number, so its okay :)
        this._hash[0] = ""; // hash representation of block
        this._hash[1] = last_hash || LAST_HASH; // hash of last block in blockchain
        this._hash[2] = reference_hash || null; // hash of the send block, this block is its receive block
        this.mine();
    }
    get verifications() {
        return this._verifications;
    }
    get timestamp() {
        return this._timestamp;
    }
    get public_key() {
        return this._public_key;
    }
    get sender() {
        return this._sender;
    }
    get type() {
        return this._type;
    }
    get nonce() {
        return this._nonce;
    }
    get hash() {
        return this._hash;
    }
    get money() {
        return this._money;
    }
    get initial_balance() {
        return this._initial_balance;
    }
    get data() {
        return this._data[0];
    }
    get modifiable_data() {
        return this._data[1];
    }
    set modifiable_data(data) {
        // how do you add data to the 2nd part?
    }
    get receiver() {
        return this._receiver;
    }
    set receiver(value) {
        this._receiver = value;
    }
    set add_verifications(verification) {
        // add type checking
        if (verification)
            this._verifications.push(verification);
    }
    static is_valid(block) {
        // data-only blocks return true
        // if (!(block instanceof Block) || block.type.isspam) return false
        try {
            if (!block)
                return false;
            if (!block._receiver) {
                block._receiver = BET_KEEPING_KEY;
            }
            else if (!block._money) {
                return true;
            }
            if (
            /* condition:
             * if not SENDERPUBLIC but negative total, then condition is true
             * rest all conditons, false
             *  */
            block._money + block._initial_balance < 0 &&
                block._sender !== SENDER_PUBLIC) {
                return false;
            }
            // A block is valid if a nonce exists
            // Not valid if money is Infinity
            if (!block._nonce || block._money === Infinity)
                return false;
            // hashes exist
            // 2. hash is verified
            if (!block._hash[0] || !block._hash[1])
                return false;
            // else if (!(block.money > 0) || !block.hash[2]) return false
            else {
                const hash = SHA256(block.timestamp, block.hash[1], block.data, block.money, block.receiver, block.nonce, block.initial_balance);
                return hash.substring(0, DIFFICULTY) === "0".repeat(DIFFICULTY);
            }
            // the block-pool will verify state changes...dont worry
        }
        catch (err) {
            return false;
        }
    }
    mine() {
        do {
            ++this._nonce;
            this._hash[0] = SHA256(this._timestamp, this._hash[1], this._data[0], this._money, this._receiver, this._nonce, this._initial_balance);
        } while (this._hash &&
            this._hash[0].substring(0, DIFFICULTY) !== "0".repeat(DIFFICULTY) &&
            this._money);
    }
    create_input() { }
    create_output_map() { }
    update() { }
}
