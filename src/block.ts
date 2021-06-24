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
const { DIFFICULTY, BETKEEPINGKEY, TYPE } = require("./config");
const { LASTHASH, SENDERPUBLIC } = require("./config").GENESISDATA;

interface BlockArgs {
    initialbalance: number,
    money: number,
    data: any,
    receiver: string,
    lasthash: string,
    referencehash: string, // for receive blocks to reference send blocks
    publickey: string,
    sender: string,
    tags: string[],
}

export class Block {
    private initialbalance : number;
    private money: number;
    private _data: any[];
    private verifications: string[];
    private _receiver!: string ;
    private timestamp: Date | string | number;
    private publickey: string | null;
    private nonce!: number ;
    private hash: (string | null)[];
    private type: TYPE;
    private sender: string;

    
    constructor({
        initialbalance,
        money,
        data,
        receiver,
        lasthash,
        referencehash, // for receive blocks to reference send blocks
        publickey,
        sender,
        tags,
    }: BlockArgs) {
        this.hash = [null, null, null];
        this._data = [null, {}]; // object as 2nd part so that we can expand this
        this.type = new TYPE(tags, money, data);
        this.initialbalance = initialbalance || 0;
        this.money = money || 0;
        this._data[0] = data || null;
        this.sender = sender;
        this.verifications = []; // proof of ppl 'yes'-ing its authenticity
        this._receiver = receiver || null;
        this.timestamp = Date.now();
        this.publickey = publickey || null; // the destination address
        this.nonce = 0; // null + number = number, so its okay :)
        this.hash[0] = null; // hash representation of block
        this.hash[1] = lasthash || LASTHASH; // hash of last block in blockchain
        this.hash[2] = referencehash || null; // hash of the send block, this block is its receive block
        this.mine();
    }
    get data() {
        return this._data[0];
    }
    get modifiabledata() {
        return this._data[1];
    }
    set modifiabledata(data) {
        // how do you add data to the 2nd part?
    }
    get receiver() {
        return this._receiver;
    }
    set receiver(value: string | null) {
        this._receiver = value;
    }
    set add_verifications(verification: string) {
        // add type checking
        if (verification) this.verifications.push(verification);
    }

    static isvalid(block: Block) {
        // data-only blocks return true
        // if (!(block instanceof Block) || block.type.isspam) return false;
        if (!block._receiver) {
            block._receiver = BETKEEPINGKEY;
        } else if (!block.money) {
            return true;
        }
        if (
            /* condition:
             * if not SENDERPUBLIC but negative total, then condition is true
             * rest all conditons, false
             *  */
            block.money + block.initialbalance < 0 &&
            block.sender !== SENDERPUBLIC
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
                block._data,
                block.money,
                block._receiver,
                block.nonce,
                block.initialbalance
            );
            return hash.substring(0, DIFFICULTY) === "0".repeat(DIFFICULTY);
        }
        // the block-pool will verify state changes...dont worry
    }
    mine() {
        do {
            ++this.nonce;
            this.hash[0] = SHA256(
                this.timestamp,
                this.hash[1],
                this._data[0],
                this.money,
                this._receiver,
                this.nonce,
                this.initialbalance
            );
        } while (
            this.hash && this.hash[0].substring(0, DIFFICULTY) !== "0".repeat(DIFFICULTY) &&
            this.money
        );
    }
    createinput() {}
    createoutputmap() {}
    update() {}
}

