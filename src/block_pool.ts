/* Any transaction pool has/can/is
 * 1. An array of transactions
 * 2. Kick transactions which arent accepted beyond a period of time
 * 3. Kick-gap time is completely upto the user/device
 * 4. inform other transaction pools
 * 5. if an address is updated, send the update to others too
 */

import EventEmitter from "events";
import { SHA256, verify_block } from "../util";
import { Block } from "./block";
import { Blockchain } from "./blockchain";

interface Add_props {
    new_receive?: Block[];
    new_send?: Block[];
    addresses?: Blockchain[];
    network?: any;
}

export class Block_pool {
    public old_send: Block[];
    public new_send: Block[];
    public new_receive: Block[];
    public addresses: Blockchain[];
    public event: EventEmitter;
    public recycle_bin: any[];
    private owners: string[];

    constructor(owners?: string[]) {
        this.old_send = [];
        this.new_send = [];
        this.new_receive = [];
        this.addresses = [];
        this.event = new EventEmitter();
        this.recycle_bin = [];
        this.owners = owners || [];
    }
    public get identifier() {
        return this.owners.map((account_public_key) =>
            SHA256(account_public_key)
        );
    }
    public set_owners(owners: string[]) {
        // focus on this set accessors
        // ideally, pass in private keys for verification
        this.owners = owners;
    }
    clear() {
        this.old_send = this.old_send.concat(this.new_send);
        var new_send = this.new_send;
        var new_receive = this.new_receive;
        this.new_send = this.new_receive = [];
        return { new_send, new_receive };
    }
    add({
        new_receive,
        new_send,
        addresses,
    }: /* network,  to find if network is strong or not */
    Add_props) {
        // first, preliminary checking
        // should we return true, or the block itself (in array.map function?)
        // filtering new_send and new_receive
        new_send = new_send ? new_send : [];
        new_receive = new_receive ? new_receive : [];
        addresses = addresses ? addresses : [];
        new_send = new_send
            .map((block) => {
                if (
                    /* block.public_key && */
                    verify_block(block) &&
                    Block.is_valid(block) &&
                    block.money <= 0
                )
                    return block;
                else return null;
            })
            .filter((send) => send) as Block[];
        new_receive = new_receive
            .map((block) => {
                if (
                    block instanceof Block &&
                    verify_block(block) &&
                    Block.is_valid(block) &&
                    block.money >= 0 &&
                    block.hash[2]
                )
                    return block;
                else return null;
            })
            .filter((receive) => receive) as Block[];

        // setting up listeners for corresponding receive_blocks
        new_send.forEach((send) => {
            // switching on just the new send blocks will cover the old send blocks too
            if (!send) return;
            if (send.type.is_no_reply) return;
            if (
                this.recycle_bin.find(
                    (hash) => hash === send.hash[0].substring(0, 20)
                )
            )
                return;
            if (!this.event.listenerCount(send.hash[0].substring(0, 20))) {
                // add quorum checking here. if false, return
                this.new_send.push(send);
                this.event.on(send.hash[0].substring(0, 20), (receive) => {
                    if (!(receive.money + send.money)) {
                        this.event.emit(receive.hash[0].substring(0, 20), true);
                        this.recycle_bin.push(send.hash[0].substring(0, 20));
                        this.new_send.splice(
                            this.new_send.findIndex(
                                (block) =>
                                    send.hash[0].substring(0, 20) ===
                                    block.hash[0].substring(0, 20)
                            ),
                            1
                        );
                    } else
                        this.event.emit(
                            receive.hash[0].substring(0, 20),
                            false
                        );
                });
            }
        });

        // triggering the respective send blocks
        new_receive.forEach((receive) => {
            if (
                !receive ||
                this.new_receive.find(
                    (block) =>
                        block.hash[0].substring(0, 20) ==
                        receive.hash[0].substring(0, 20)
                )
            )
                return;
            if (
                this.recycle_bin.find(
                    (hash) => hash === receive.hash[0].substring(0, 20)
                )
            )
                return;
            this.new_receive.push(receive);
            this.event.once(receive.hash[0].substring(0, 20), (status) => {
                this.recycle_bin.push(receive.hash[0].substring(0, 20));
                if (!status) {
                    this.new_receive.splice(
                        this.new_receive.findIndex(
                            (block) =>
                                receive.hash[0].substring(0, 20) ===
                                block.hash[0].substring(0, 20)
                        ),
                        1
                    );
                }
            });
            this.event.emit(
                (receive.hash[2] as string).substring(0, 20),
                receive
            );
        });

        new_receive.forEach((receive) => {
            // status describes if receive block matched the money or not
            // on so that atleast one 'true' response will validate it
            if (!receive) return;
            this.event.off(receive.hash[0].substring(0, 20), () => {});
        });
        this.recycle_bin.forEach((hash) => this.event.off(hash, () => {}));
        // remove both if both match, send the receive
        // remove just the receive if they dont match
        // add the pool to this.pool
        // look at each block and search for the corresponding sender address
        // if it exists
        // // 1. update the corresponding address state if timestamp is newer
        // // // 1. if that block's meant for you, take it in XD
        // // 2. sign on it (done after this, in the account/user part)
        // // 3. send it to others
        let new_set = this.new_receive.concat(this.new_send);
        new_set.sort((a, b) => a.timestamp - b.timestamp);

        // addresses manipulation
        addresses = addresses.filter(
            (blockchain) => blockchain && blockchain.is_valid()
        );
        this.addresses = this.addresses.concat(addresses);
        this.addresses.sort((a, b) => b.latest_update - a.latest_update);

        // finding unique addresses and addresses that actually belongs to me
        this.addresses = this.addresses.filter(
            (blockchain, index, addresses) => {
                return (
                    addresses.findIndex(
                        (item) => item.identifier === blockchain.identifier
                    ) === index &&
                    !this.identifier.find((id) => id === blockchain.identifier)
                ); // unique blockchains, and nothing about the original owner
            }
        );

        this.addresses = this.addresses.map((blockchain) => {
            const block = new_set.find(
                (block) =>
                    block.identifier === blockchain.identifier &&
                    block.hash[1] === blockchain.first.hash[0] &&
                    block.timestamp > blockchain.latest_update &&
                    block.money + blockchain.balance() > 0
            );
            if (block) blockchain.add_block(block);
            return blockchain;
        });
    }
}

/* send block ->
 *
 * 1. send all blocks after validating it
 * 2. process it only if it has quorum
 *
 * 3. add it to this.parts
 * 4. if a valid receive block is found, delete it
 * */
