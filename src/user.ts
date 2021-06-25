/* Every user has
 * 1. A transaction pool
 * 2. Two pairs of cryptographic keys (view pair and send pair)
 * 3. Local storage for temporary addresses
 *
 * Every user can
 * 1. Send either tokens or information
 * 2. Obfuscate their data before sending it (privacy oriented)
 * 3. Scan for stuff sent to them, and accept/reject them
 * 4. Clean their blockchain and local storage
 * 5. Cover its tracks by adding decoy signatures to transaction
 * 6. Keep a list of addresses and their timestamp and balance and last-hash
 * 7. Anyone with the addresses can verify the blocks and sign over it (and then update)
 * 8. If any block reaches quorum,
 *
 * No user can
 * 1. Spam transactions, because of rate-limiter
 * 2. Claim back tokens that are not accepted (poor send blocks)
 * 3. Send data by randomly initiating websockets and send data
 *    i. They must be properly logged in, jwt and refresh tokens etc etc can help
 *
 * Every signature has
 * 1. Two pairs of keys (view key and power key)
 *
 * Every signature can
 * 1. Sign on a transaction
 * 2. Return a corresponding private key for a public key sent to it, or null otherwise
 *
 * Notes for developers
 * 1. Make the signature in such a way that its existing methods are not replaced
 *      when the cryptography is changed to a post-quantum cryptography type
 */
import { Block, Block_Type } from "./block";
import { Block_pool_Type, Block_pool } from "./block_pool";
import { Account, Account_Type } from "./account";
import { Comm, Comm_Type } from "./comm";
import { TYPE_enum, Receiver_Address } from "./config";
import { SHA256, genKeyPair, genPublic, verify_block } from "../util";

interface Received {
    block: Block_Type;
    private_key?: string;
}

export class User {
    // declaration of private fields
    private _key_pair: any[];
    private _accounts: Account[];
    private block_pool: Block_pool_Type;
    private received: (Received | null | undefined)[];
    private comm: Comm_Type;

    constructor({
        comm,
        block_pool,
        key_pair,
        accounts,
    }: {
        comm: Comm_Type;
        block_pool: Block_pool_Type;
        key_pair: any[];
        accounts: Account_Type[];
    }) {
        this.block_pool = block_pool || new Block_pool();
        this._accounts = accounts || [];
        this._key_pair = key_pair || [genKeyPair(), genKeyPair()]; // this is an array of 2 key pairs
        this.received = [];
        this.comm =
            comm ||
            new Comm(
                `${SHA256(
                    this._key_pair[0].getPublic().encode("hex"),
                    this._key_pair[1].getPublic().encode("hex")
                )}`
            );
        this.comm.comm.on("data", (data: any) => {
            this.update_pool(data);
        });

        this._accounts.sort(
            (a, b) => a.balance - b.balance // ascending order of balance
        );
    }
    get tracking_key() {
        // should hex be changed to default type?
        return [
            this._key_pair[0].getPrivate("hex"),
            this._key_pair[1].getPublic("hex"),
        ];
    }

    // i guess the below is pretty useless
    // get private_user_key() {
    //   return [
    //     this._key_pair[0].getPrivate("hex"),
    //     this._key_pair[1].getPrivate("hex"),
    //   ];
    // }

    get public_key() {
        return [
            this._key_pair[0].getPublic().encode("hex"),
            this._key_pair[1].getPublic().encode("hex"),
        ];
    }
    get accounts() {
        return this._accounts;
    }
    get balance() {
        if (!(this._accounts instanceof Array)) return 0;
        return this._accounts.reduce(
            (prev_total, account) => prev_total + account.balance,
            0
        );
    }
    send_large_data({
        data,
        receiver_address,
        tags,
    }: {
        data: any;
        receiver_address: Receiver_Address;
        tags: TYPE_enum[];
    }) {
        // break the data into smaller chunks to
        let data_chunk: any;
        while (data_chunk)
            this.send({
                money: 0,
                data: data_chunk as any,
                receiver_address: receiver_address as Receiver_Address,
                tags: [TYPE_enum.speed].concat(tags),
            });
    }
    send({
        money,
        data,
        receiver_address,
        tags /* only for independent types */,
    }: /* sender account preferences */
    {
        money: number;
        data: any;
        receiver_address: Receiver_Address;
        tags: TYPE_enum[];
    }) {
        try {
            let i = 0;
            if (money < 0 || money === Infinity) money = 0;
            if (!money && "speed" in tags /* check for HIGH_SPEED tag */) {
                const block = this._accounts[0].create_block({
                    money: 0,
                    data,
                    receiver_address,
                    tags,
                });

                if (Block.is_valid(block) && verify_block(block))
                    this.comm.send(block);
            } else {
                // no problem if money is negative or Infinity then (above)
                // what if money is null?
                // then the 1st part of "while" condition is false (below)
                while (money > 0 || data) {
                    const balance = this._accounts[i].balance;
                    if (balance === Infinity) continue;

                    const block = this._accounts[i].create_block({
                        money: money > balance ? -1 * balance : -1 * money,
                        data,
                        receiver_address,
                        tags,
                    });

                    if (Block.is_valid(block) && verify_block(block)) {
                        money += (block as Block).money;
                        data = null;
                        this.comm.send(block);
                    }
                    ++i;

                    // if the block was a spam block, dont transact and continue
                    // can happen if the first few blocks have zero balance
                    // zero balance may appear due to empty accounts
                    // usually only archived accounts have Infinity balance
                }
            }
            if (money) throw new Error("insufficient Balance. Emptied it");
            // if account is empty, archive it
            this._accounts.forEach((account) => {
                if (!account.balance) {
                    // archive!
                    account.balance = Infinity;
                    // that way all these "archived" accounts will be at the end or the accounts array
                    // when it is sorted
                }
            });

            this._accounts.sort(
                (a, b) => a.balance - b.balance // ascending order of balance
            );

            return true;
        } catch (error) {
            console.error(error);
            return false;
        }
    }
    receive() {
        /* not like send()
         * makes just a receive block and returns it
         * 1. check if you have addresses of same private key
         * 2. mostly gonna be a NO. build an account
         * finding/creating the account
         * replace each block with a receive block
         */

        this.received = this.received.map(({ block, private_key }) => {
            const index = this._accounts.findIndex(
                (account) => account.public_key === block.receiver
            );
            if (index < 0) {
                // no existing account is found, most common
                const account = new Account({ private_key });
                const new_block = account.create_block({
                    money: -1 * block.money, // transform the block money to +ve number
                    reference_hash: block.hash[0],
                    receiver_address: [block.sender],
                    tags: [] as TYPE_enum[],
                });
                if (new_block) {
                    this._accounts.push(account);
                    return new_block;
                } else return;
            } else {
                // there is an account
                const new_block = this._accounts[index].create_block({
                    money: -1 * block.money, // transform the block money
                    reference_hash: block.hash[0],
                    receiver_address: [block.sender],
                    tags: [],
                });
                if (new_block) return new_block;
                else return;
            }
        });
    }
    update_pool(data: any) {
        try {
            // transit data type: { new_receive, new_send, addresses, network }
            this.block_pool.add(data);
            return this.scan(); // the pool makes sure only legit blocks are passed
        } catch (error) {
            return false;
        }
    }
    sign(data_chunk: any) {
        return this._key_pair[1].sign(data_chunk).toDER("hex");
    }
    scan() {
        this.received = this.block_pool.new_send.map((block) => {
            if (block.money > 0) return;
            const private_key = this.is_for_me(block);
            // find a way to store the private key within the block
            if (private_key) return { block, private_key };
        });
        this.receive(); // creates receive blocks for all of em
        this.block_pool.add({ new_receive: this.received });
        const new_blocks = this.block_pool.clear();
        new_blocks.new_send = new_blocks.new_send.map((block) => {
            block.add_verifications = this.sign(block.hash[0]);
            return block;
        });
        new_blocks.new_receive = new_blocks.new_receive.map((block) => {
            block.add_verifications = this.sign(block.hash[0]);
            return block;
        });
        this.comm.send(new_blocks);
        return new_blocks;
    }
    is_for_me(block: Block_Type) {
        try {
            // memory refresher: if private key is a, then public key is A = aG
            // where G is generator in elliptic curve

            // 1. Take the random data
            // var R = block.public_key;
            var a = this._key_pair[0].getPrivate(); // a is 1st private key
            // making key-pair whose private key is SHA256 hash of (a*R)
            var temp_key = genKeyPair(
                SHA256(genPublic(block.public_key).mul(a).encode("hex")) // block.public_key is of type Point
            );
            var B = this._key_pair[1].getPublic(); // 2nd public key
            var temp = temp_key.getPublic();
            // 2. calculate P' = SHA256(a*R)G + B
            var P_prime = temp.add(B);
            // 3. If P' = P(receiver address in the block)
            //  // then return its private key
            //  // else return null
            if (P_prime.eq(genPublic(block.receiver))) {
                // private key (p) for the one time account is SHA256(a*R) + b
                // so that P = pG
                temp = temp_key.getPrivate();
                var b = this._key_pair[1].getPrivate();
                return b.add(temp);
            } else return null;
        } catch (error) {
            return false;
        }
    }
    clean() {}
    static count() {}
    // can we really count the number of users on the system?
    // would help in quorum if that was possible
    // possible i guess: counting the number of websocket channels at any time
    join() {}
    leave() {
        this.comm.comm.disconnect();
        // clear the block_pool, keep the addresses
        // try to "save" user data locally
    }
}
