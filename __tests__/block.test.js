// these use jest functions
const Block = require("../block");

describe("Block", () => {
  let data, block;

  beforeEach(() => {
    data = `bar`;
    const block = new Block({
      initial_balance: 0,
      money: 30,
      data,
      receiver_key: null,
      last_hash: "yo",
      reference_hash: "woohoo", // for receive blocks to reference send blocks
      block_public_key: "yeye",
      sender_public: "send",
      tags: ["data", "money"],
    });
  });

  it("generates a block that is valid", () => {
    expect(Block.is_valid(block)).toEqual(true);
  });
});
