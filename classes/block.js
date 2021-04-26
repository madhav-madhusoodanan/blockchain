/* Every transaction has
 * 1. An id
 * 2. Input and output
 * 3. Amount and/or data (no rate-limiting if amount is zero)
 * 4. Rate-limiting nonce to make an acceptable hash
 */
import { cryptoHash } from "./util";
import { DIFFICULTY } from "../config";
import hexToBinary from "hex-to-binary";

const TYPE = {
    MONEY: "MONEY",
    DATA: "DATA",
    NFT: "NFT",
    SPAM: "SPAM",
  };

class Block {
    constructor({money, data, sender_signatures, receiver_address, nonce, hash}) {
        this.money = money;
        this.data = data;
        this.sender_signatures = sender_signatures; 
        this.receiver_address = receiver_address;
        this.nonce = 0;
        this.lastHash = 0;
        this.hash = "";
        this.type = null;
        this.timestamp = Date.now();
        this.mine();
    }
    static is_valid() {
        // A block is valid if: 
        // 1. the state changes tally up
        //    // find a way to do 1
        // 2. a nonce exists
        
    }
    mine() {
        if(money && data) this.type = TYPE.NFT;
        else if(money) this.type = TYPE.MONEY;
        else if(data) this.type = TYPE.DATA;
        else this.type = TYPE.SPAM;

        do {
            this.nonce++;
            difficulty = DIFFICULTY;
            this.hash = cryptoHash(this.timestamp, this.lastHash, this.data, this.money, this.receiver_address, this.nonce);
          } while (
            hexToBinary(this.hash).substring(0, DIFFICULTY) !== "0".repeat(DIFFICULTY)
          );
    }
    create_input() {}
    create_output_map() {}
    update () {}
}

module.exports = Block;