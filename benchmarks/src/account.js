/* Each user can have
 * 1. Any number of accounts
 *
 * Each of these accounts have
 * 1. A blockchain
 * 2. Only one key-pair
 * 3. Acts like a normal account as in Nanocurrency
 * 4. Will create the one-time public account
 *
 * Only one account can be the Genesis account
 * it gives the money to the account in the start
 * can generate money just like that
 */
import { Block } from "./block.js";
import { Blockchain } from "./blockchain.js";
import { Block_pool } from "./block_pool.js";
import { genKeyPair, SHA256, genPublic, random, verify_block } from "../util/index.js";
import { TYPE_enum, GENESIS_DATA } from "./config.js";
export class Account {
    // declaration of private fields
    _key_pair;
    _base_balance;
    blockchain;
    standalone;
    block_pool;
    constructor({ blockchain, key_pair, private_key, standalone, }) {
        this.blockchain = blockchain || new Blockchain();
        if (standalone) {
            this.standalone = true;
            this.block_pool = new Block_pool();
        }
        else {
            this.standalone = false;
            this.block_pool = undefined;
        }
        if (key_pair)
            this._key_pair = key_pair;
        else
            this._key_pair = genKeyPair(private_key);
        // its okay even if private key is null
        this._base_balance = 0; // will come in necessary when clearing blockchains
    }
    get public_key() {
        return this._key_pair.getPublic().encode("hex");
    }
    set balance(balance) {
        balance === Infinity ? (this._base_balance = Infinity) : null;
    }
    // key is present only for debugging
    get private_key() {
        return this._key_pair.getPrivate("hex");
    }
    get balance() {
        return this.blockchain.balance(this._base_balance);
    }
    get verify() {
        return this.blockchain.is_valid();
    }
    get account_verify() {
        let data = random();
        return [this.public_key, data, this.sign(data)];
    }
    create_block({ money, data, reference_hash, receiver_address, tags, }) {
        // receiver_address is an array of public keys
        // keep tight block validity checking here
        // create a one-time receiver_address and signatures too
        // money is already negative if it is a send block
        let block;
        let last_hash = this.blockchain.first()
            ? this.blockchain.first().hash[0]
            : GENESIS_DATA.LAST_HASH;
        if (!(receiver_address instanceof Array))
            return null;
        let initial_balance = this.balance || 0;
        if (receiver_address.length === 2) {
            // send block
            // create a receiver and public_key from receiver_address
            let random_key = genKeyPair(); // R = rG
            // verify and optimize the steps below
            let r = random_key.getPrivate();
            // make the below more efficient)
            let A = genPublic(receiver_address[0]);
            let B = genPublic(receiver_address[1]);
            let random_key_2 = genKeyPair(SHA256(A.mul(r).encode("hex")));
            A = r = null;
            let receiver = B.add(random_key_2.getPublic()); // receiver is of type point
            B = null;
            block = new Block({
                initial_balance,
                money,
                data,
                receiver: receiver.encode("hex"),
                reference_hash,
                last_hash,
                public_key: random_key.getPublic().encode("hex"),
                sender: this._key_pair.getPublic().encode("hex"),
                tags: tags,
            });
        }
        else if (receiver_address.length === 1) {
            // receive block
            block = new Block({
                initial_balance,
                money,
                data: data || "receive",
                receiver: receiver_address[0],
                reference_hash,
                last_hash,
                public_key: null,
                sender: this._key_pair.getPublic().encode("hex"),
                tags,
            });
        }
        else
            return null;
        block.add_verifications = this.sign(block.hash[0]);
        this.blockchain.add_block(block);
        return block;
    }
    sign(data_chunk) {
        // // add rng signatures only if block is a send block
        // else make just a normal signature
        return this._key_pair.sign(data_chunk).toDER("hex");
    }
    send_large_data({ data, receiver_address, tags, }) {
        // break the data into smaller chunks to
        let data_chunk;
        const arr = [];
        while (data_chunk)
            arr.push(this.send({
                money: 0,
                data: data_chunk,
                receiver_address,
                tags: [TYPE_enum.speed].concat(tags),
            }));
        return arr;
    }
    send({ money, data, receiver_address, tags /* only for independent types */, }) {
        if (
        // guard clauses
        !this.standalone &&
            receiver_address instanceof Array &&
            receiver_address.length !== 1 &&
            this.balance)
            return null;
        try {
            if (money < 0 || money === Infinity)
                money = 0;
            else if (!money && "speed" in tags /* check for HIGH_SPEED tag */) {
                const block = this.create_block({
                    money: 0,
                    data,
                    receiver_address,
                    tags,
                });
                if (Block.is_valid(block) && verify_block(block))
                    return block;
            }
            else {
                // no problem if money is negative or Infinity then (above)
                // what if money is null?
                // then the 1st part of "while" condition is false (below)
                const balance = this.balance;
                if (balance === Infinity)
                    return null;
                const block = this.create_block({
                    money: money > balance ? -1 * balance : -1 * money,
                    data,
                    receiver_address,
                    tags,
                });
                if (Block.is_valid(block) && verify_block(block)) {
                    money += block.money;
                    data = null;
                    return block;
                }
                // if the block was a spam block, dont transact and continue
                // can happen if the first few blocks have zero balance
                // zero balance may appear due to empty accounts
                // usually only archived accounts have Infinity balance
            }
            if (money)
                throw new Error("insufficient Balance. Emptied it");
            // if account is empty, archive it
            return true;
        }
        catch (error) {
            console.error(error);
            return false;
        }
    }
    receive(receives) {
        if (!this.standalone)
            return undefined;
        receives = receives
            .map((block) => {
            if (!(block instanceof Block))
                return;
            const new_block = this.create_block({
                data: block.data,
                money: -1 * block.money,
                reference_hash: block.hash[0],
                receiver_address: [block.sender],
                tags: [],
            });
            if (new_block instanceof Block)
                return new_block;
            else
                return;
        })
            .filter((block) => block);
        return receives;
    }
    update_pool(data) {
        if (!this.standalone)
            return false;
        try {
            // transit data type: { new_receive, new_send, addresses, network }
            this.block_pool.add(data); // the pool makes sure only legit blocks are passed
            return this.scan();
        }
        catch (error) {
            console.error(error);
            return false;
        }
    }
    scan() {
        if (!this.standalone)
            return null;
        let receives = this.block_pool.new_send.filter((block) => 
        // find a way to store the private key within the block
        this.is_for_me(block) && block.money <= 0);
        this.block_pool.add({
            new_receive: this.receive(receives),
        });
        const new_blocks = this.block_pool.clear();
        new_blocks.new_send = new_blocks.new_send
            .map((block) => {
            if (!block)
                return;
            block.add_verifications = this.sign(block.hash[0]);
            return block;
        })
            .filter((send) => send);
        new_blocks.new_receive = new_blocks.new_receive
            .map((block) => {
            if (!block)
                return;
            if (this.is_for_me(block))
                return block;
            block.add_verifications = this.sign(block.hash[0]);
            return block;
        })
            .filter((receive) => receive);
        return new_blocks;
    }
    is_for_me(block) {
        if (!this.standalone)
            return false;
        if (this.public_key === block.receiver)
            return true;
        if (this.public_key === block.sender)
            return true;
        else
            return false;
    }
    clean() { }
}
