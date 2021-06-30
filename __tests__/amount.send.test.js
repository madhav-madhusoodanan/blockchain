const { User, Account, Block } = require("../dist/src");

describe("The user", () => {
    it("can send any amount successfully within his limit", () => {
        const user_1 = new User({});
        const user_2 = new User({});
        const genesis = new Account({
            // the secret key for the genesis account
            private_key:
                "06ab59ce90ef681fa5cf632e402e8fc17e1485952ea3f68b2ac451eb01af8955",
        });
        const g_block = genesis.create_block({
            money: -80,
            data: "",
            reference_hash: null,
            receiver_address: user_1.public_key, // i badly need money to test this...
            tags: [],
        });
        g_block.money = 20;
        console.log(g_block)
        expect(Block.is_valid(g_block)).toEqual(true);
        user_1.update_pool({
            new_send: [g_block],
        });

        expect(user_1.balance).toEqual(80);
        user_1.send({
            money: 50,
            data: "yee",
            receiver_address: user_2.public_key,
            tags: [],
        });

        expect(user_1.accounts[0].blockchain.length).toEqual(2);
        expect(user_1.balance).toEqual(30);
    });
});
