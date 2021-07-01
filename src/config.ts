export const MINE_RATE = 1000;
export const DIFFICULTY = 1;
export const BET_KEEPING_KEY = "hehe-lolol";
// const PHILANTHROPIST = [
//   "042d7ad770372693a8ef5c8c1b6dbb66e9df23357478fbfed419fff3434b5f32083acb7936016ad9079670dc23bb85a2c9dc6af20025b514fdfd94426324ae4ee3",
//   "0420c35897a0a40e25e735eb5c1e51f141072ee158da624614c25724b6bc073b4b7422399e5f5f9f545d3da946db795085c72b442f4235ef5565d48c5885de0874",
// ];
export const GENESIS_DATA = {
    money: 30,
    data: "genesis",
    RECEIVER_KEY:
        "0413dd4863ef381742f66331fc94546c73c1e50411bf2788df1a07ce826f7421e405bd375ccc6f5e962dd44322afd4e6495109bced07f1d90c389bd030321c4dde",
    LAST_HASH:
        "0008451beb1a6f2e3952152c64fe0a50e1ee098160d4674317a3649294857d55",
    SENDER_PUBLIC:
        "0412254552711e5bbe936b1b66ff889966ff31d87a9ddd8f6061de7fc68ead1c1a6c25c3b9e56859eb51c1c5deb27cb30212c6db815d10a05b9a4c35bb9704bd6a",
    tags: ["genesis"],
};

export class TYPE {
    private _type: string[];
    constructor(tags: string[], money: number, data: any) {
        /* process all the tags */
        if (!(tags instanceof Array)) tags = [];
        tags.forEach((tag) => {
            // check if we can reduce the size
            if (money || data) return "useful";
            if (tag.search(/nft/) + 1 || (data && money)) return "nft";
            else if (tag.search(/speed/) + 1 && !money) return "speed";
            else if (tag.search(/db/) + 1 && !money) return "db";
            else if (tag.search(/contract/) + 1 && !money) return "contract";
            else if (tag.search(/noreply/) + 1 && !money) return "noreply";
            else if (tag.search(/loan/) + 1 && !money) return "loan";
            else return "spam";
        });
        this._type = tags || [];
        // add additional checks
    }

    // return true if yes, false if no
    get is_spam() {
        return this._type.find((tag: string) => tag === "spam");
    }
    get is_nft() {
        return this._type.find((tag: string) => tag === "nft");
    }
    get is_database() {
        return this._type.find((tag: string) => tag === "db");
    }
    get is_contract() {
        return this._type.find((tag: string) => tag === "contract");
    }
    get is_speed() {
        return this._type.find((tag: string) => tag === "speed");
    }
    get is_no_reply() {
        return this._type.find((tag: string) => tag === "noreply");
    }
}

export enum TYPE_enum {
    nft = "nft",
    speed = "speed",
    contract = "contract",
    noreply = "noreply",
    spam = "spam",
    db = "db",
    loan = "loan",
}

export const STARTING_BALANCE = 1000;

export const REWARD_INPUT = {
    address: "oracle",
};

export const MINING_REWARD = 50;

export interface Receiver_Address {
    0: string;
    1?: string;
}

