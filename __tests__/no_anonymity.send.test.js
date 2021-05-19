const { User, Account, Block } = require("../src");

describe("The user", () => {
  it("can send any amount successfully within his limit", () => {
    const account_1 = new User({});
    const account_2 = new User({});
    const genesis = new Account({
      // the secret key for the genesis account
      private_key:
        "06ab59ce90ef681fa5cf632e402e8fc17e1485952ea3f68b2ac451eb01af8955",
    });

    const g_block = genesis.create_block({
      money: -50,
      data: "genesis genius",
      reference_hash: null,
      receiver_address: account_1.public_key, // i badly need money to test this...
      tags: [],
    });
    
    account_1.update_pool({
      new_send: [g_block],
    });
    account_1.scan();

    account_1.send({
      money: 20,
      data: "yee",
      receiver_address: account_2.public_key,
      tags: [],
    });

    expect(account_1.accounts[0].blockchain.length).toEqual(2);
    expect(account_1.balance).toEqual(30);
  });
});
