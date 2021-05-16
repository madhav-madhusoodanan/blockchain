// these use jest functions
const Block = require("../block");
const Account = require("../account");

describe("Block", () => {
  it("generates a block that is valid", () => {
    const data = `bar`;
    const
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
    expect(Block.is_valid(block)).toEqual(true);
  });
});
