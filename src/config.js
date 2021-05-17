const MINE_RATE = 1000;
const DIFFICULTY = 1;
const BET_KEEPING_KEY = "hehe-lolol";
const GENESIS_DATA = {
  money: 30,
  data: "genesis",
  receiver_key: "0413dd4863ef381742f66331fc94546c73c1e50411bf2788df1a07ce826f7421e405bd375ccc6f5e962dd44322afd4e6495109bced07f1d90c389bd030321c4dde",
  last_hash: "0008451beb1a6f2e3952152c64fe0a50e1ee098160d4674317a3649294857d55",
  reference_hash: null, // for receive blocks to reference send blocks
  block_public_key: "0471d295e25f2677bdbb135a2fc37bd99b6625f70e0126b23ec0d8c6974fa3d37d5b53730930cf29bc417dc9238c4ddf8a08a585853abc114bef644f307675d484",
  sender_public: "0412254552711e5bbe936b1b66ff889966ff31d87a9ddd8f6061de7fc68ead1c1a6c25c3b9e56859eb51c1c5deb27cb30212c6db815d10a05b9a4c35bb9704bd6a",
  tags: ["genesis"],
};

class TYPE {
  #type;
  constructor() {
    this.#type = 0;
  }
  set type(tags) {
    /* process all the tags 
       everything is bit-encoded for efficiency*/
    this.#type = 0;
    if (!(tag instanceof Array)) return false;
    else {
      tags.forEach((tag) => {
        // check if we can reduce the size

        // a |= 1 is the exact same as a = a | 1, (bitwise OR operation)
        // if regex search is successful, the index number is returned or else -1 is
        if(tag.search(/genesis/)) this.#type = Infinity;
        else if (tag.search(/data/) + 1) this.#type |= 1;
        else if (tag.search(/speed/) + 1) this.#type |= 32;
        // kept it here for efficiency
        else if (tag.search(/nft/) + 1) this.#type |= 2;
        else if (tag.search(/money/) + 1) this.#type |= 4;
        else if (tag.search(/db/) + 1) this.#type |= 8;
        else if (tag.search(/contract/) + 1) this.#type |= 16;
        else if (tag.search(/noreply/) + 1) this.#type |= 64;
        else if (tag.search(/loan/) + 1) this.#type |= 128;
      });
      // add additional checks
      return true;
    }
  }
  // return true if yes, false if no
  get is_genesis() {
    return this.#type === Infinity;
  }
  get is_spam() {
    return !(this.#type | 0);
  }
  get is_data() {
    return this.#type & 1;
  }
  get is_nft() {
    return this.#type & 2;
  }
  get is_money() {
    return this.#type & 4;
  }
  get is_database() {
    return this.#type & 8;
  }
  get is_contract() {
    return this.#type & 16;
  }
  get is_speed() {
    return this.#type & 32;
  }
  get is_no_reply() {
    return this.#type & 64;
  }
}

// convert to an object where types are bit strings in future (chars for now)
// const TYPE = {
//   // fundamental types
//   DATA: "D",
//   MONEY: "M",
//   NFT: "N",
//   SPAM: "S",
//   // independent types
//   DATABASE: "B", // if receiver_key is null but sender_keys are present
//   CONTRACT: "C",
//   HIGH_SPEED: "H",
//   NO_REPLY: "R", // when no_receive block is required and when money is zero
//   // work not done on it yet
// };

const ASSIGN_TYPE = (block) => {
  // fundamental type assigning
  if (!block.money && block.data) {
    if (!block.receiver_key && block.sender_signatures) return TYPE.DATABASE;
    else return TYPE.DATA;
  } // kept it at first to optimise speed
  else if (money && data) return TYPE.NFT;
  else if (money) return TYPE.MONEY;
  else return TYPE.SPAM;

  // independent type assigning
};
const ASSESS_TAGS = (tags) => {};

const STARTING_BALANCE = 1000;

const REWARD_INPUT = {
  address: "oracle",
};

const MINING_REWARD = 50;

module.exports = {
  GENESIS_DATA,
  MINE_RATE,
  STARTING_BALANCE,
  REWARD_INPUT,
  MINING_REWARD,
  DIFFICULTY,
  TYPE,
  BET_KEEPING_KEY,
  ASSIGN_TYPE,
  ASSESS_TAGS,
};
