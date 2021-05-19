// these use jest functions
// the values in comments are the corresponding values intended for the genesis block
const User = require("../src/user");
const Account = require("../src/account");
const { PHILANTHROPIST } = require("../src/config");

describe("User", () => {
  it("can accept an amount successfully", () => {
    const user_1 = new User({});

    const account = new Account({});
    account.create_block({
      money: 30,
      data: "genesis",
      reference_hash: "dead",
      receiver_address: PHILANTHROPIST, // i badly need money to test this...
      tags: ["genesis"],
    });

    const block = account.create_block({
      money: -10,
      data: "1st transaction",
      reference_hash: null,
      receiver_address: user_1.public_key,
      tags: [],
    });

    user_1.update_pool({
      new_send: [block],
    });
    user_1.scan();
    expect(block.is_valid).toEqual(true);
    expect(account.balance).toEqual(20);
    expect(account.verify).toEqual(true);
    expect(user_1.accounts.length).toEqual(1);
    expect(user_1.accounts[0].public_key).toEqual(block.receiver_key);
    expect(user_1.accounts[0].verify).toEqual(true);
    expect(user_1.balance).toEqual(10);
  });
});



