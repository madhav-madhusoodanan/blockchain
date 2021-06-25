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
import { SHA256 } from "../util"
import { DIFFICULTY, BET_KEEPING_KEY, TYPE, TYPE_enum} from "./config"
const {  LAST_HASH, SENDERPUBLIC } = require("./config").GENESISDATA

interface Block_Args {
    initial_balance: number
    money: number
    data: any
    receiver: string
    last_hash: string
    reference_hash?: string // for receive blocks to reference send blocks
    public_key: string | null
    sender: string
    tags: TYPE_enum[]
}

interface Hash {
    0: string
    1: string | null
    2: string | null
}

interface Data {
    0: any,
    1: object
}

export class Block {
    private _initial_balance: number
    private _money: number
    private _data: Data
    private _verifications: string[]
    private _receiver!: string
    private _timestamp: number
    private _public_key: string | null
    private _nonce!: number
    private _hash: Hash
    private _type: TYPE
    private _sender: string

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
    }: Block_Args) {
        this._hash = ["", last_hash || null, reference_hash || null]
        this._data = [null, {}] // object as 2nd part so that we can expand this
        this._type = new TYPE(tags, money, data)
        this._initial_balance = initial_balance || 0
        this._money = money || 0
        this._data[0] = data || null
        this._sender = sender
        this._verifications = [] // proof of ppl 'yes'-ing its authenticity
        this._receiver = receiver || ""
        this._timestamp = Date.now()
        this._public_key = public_key || null; // the destination address
        this._nonce = 0 // null + number = number, so its okay :)
        this._hash[0] = "" // hash representation of block
        this._hash[1] = last_hash || LAST_HASH // hash of last block in blockchain
        this._hash[2] = reference_hash || null // hash of the send block, this block is its receive block
        this.mine()
    }


    public get verifications(): string[] {
        return this._verifications
    }
    public get timestamp(): number {
        return this._timestamp
    }
    public get public_key(): string | null {
        return this._public_key
    }
    public get sender(): string {
        return this._sender
    }
    public get type(): TYPE {
        return this._type
    }
    public get nonce(): number {
        return this._nonce
    }
    public get hash(): Hash {
        return this._hash
    }
    public get money(): number {
        return this._money
    }
    public get initial_balance(): number {
        return this._initial_balance
    }
    public get data() {
        return this._data[0]
    }
    public get modifiable_data() {
        return this._data[1]
    }
    public set modifiable_data(data: object) {
        // how do you add data to the 2nd part?
    }
    public get receiver() {
        return this._receiver
    }
    public set receiver(value: string) {
        this._receiver = value
    }
    public set add_verifications(verification: string) {
        // add type checking
        if (verification) this._verifications.push(verification)
    }

    static is_valid(block: Block | null) {
        // data-only blocks return true
        // if (!(block instanceof Block) || block.type.isspam) return false
        try {
            if(!block) return false;
            if (!block._receiver) {
                block._receiver = BET_KEEPING_KEY
            } else if (!block._money) {
                return true
            }
            if (
                /* condition:
                 * if not SENDERPUBLIC but negative total, then condition is true
                 * rest all conditons, false
                 *  */
                block._money + block._initial_balance < 0 &&
                block._sender !== SENDERPUBLIC
            ) {
                return false
            }
            // A block is valid if a nonce exists
            // Not valid if money is Infinity
            if (!block._nonce || block._money === Infinity) return false
            // hashes exist
            // 2. hash is verified
            if (!block._hash[0] || !block._hash[1]) return false
            // else if (!(block.money > 0) || !block.hash[2]) return false
            else {
                const hash = SHA256(
                    block._timestamp,
                    block._hash[1],
                    block._data,
                    block._money,
                    block._receiver,
                    block._nonce,
                    block._initial_balance
                )
                return hash.substring(0, DIFFICULTY) === "0".repeat(DIFFICULTY)
            }
            // the block-pool will verify state changes...dont worry
        } catch (err) {
            return false;
        }
        
    }
    mine() {
        do {
            ++this._nonce
            this._hash[0] = SHA256(
                this._timestamp,
                this._hash[1],
                this._data[0],
                this._money,
                this._receiver,
                this._nonce,
                this._initial_balance
            )
        } while (
            this._hash &&
            this._hash[0].substring(0, DIFFICULTY) !== "0".repeat(DIFFICULTY) &&
            this._money
        )
    }
    create_input() {}
    create_output_map() {}
    update() {}
}
