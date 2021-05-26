// these use jest functions
// the values in comments are the corresponding values intended for the genesis block
const { User, Account, Block } = require("../src");

describe("The Genesis account", () => {
    it("can send any amount successfully", () => {
        const user_1 = new User({});

        const genesis = new Account({
            // the secret key for the genesis account
            private_key:
                "06ab59ce90ef681fa5cf632e402e8fc17e1485952ea3f68b2ac451eb01af8955",
        });

        const g_block = genesis.create_block({
            money: -70,
            data: "",
            reference_hash: null,
            receiver_address: user_1.public_key, // i badly need money to test this...
            tags: [],
        });

        expect(Block.is_valid(g_block)).toEqual(true);
        user_1.update_pool({
            new_send: [g_block],
        });
        expect(user_1.accounts.length).toEqual(1);
        expect(user_1.accounts[0].public_key).toEqual(g_block.receiver);
        expect(user_1.accounts[0].verify).toEqual(true);
        expect(user_1.balance).toEqual(70);
    });
    it("can send any amount", () => {});
});
