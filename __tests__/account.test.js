// these use jest functions
// the values in comments are the corresponding values intended for the genesis block
const { User, Account, Block } = require("../src");

describe("A normal account", () => {
    it("cannot send any amount successfully", () => {
        const user_1 = new User({});
        const account = new Account({});

        const block = account.create_block({
            money: -30,
            data: "",
            reference_hash: null,
            receiver_address: user_1.public_key,
            tags: [],
        });

        expect(Block.is_valid(block)).toEqual(false);
        expect(block.initial_balance).toEqual(0);
        expect(block.money).toEqual(-30);

        user_1.update_pool({
            new_send: [block],
        });
        user_1.scan();

        expect(user_1.accounts.length).toEqual(0);
        expect(user_1.balance).toEqual(0);
    });
});
