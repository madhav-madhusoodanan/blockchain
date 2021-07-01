const { Account, Block } = require("../dist/src");
const { verify_block } = require("../dist/util");
describe("The user", () => {
    it("can send any amount successfully within his limit", () => {
        const account_1 = new Account({ standalone: true });
        const account_2 = new Account({ standalone: true });
        const verifier = new Account({ standalone: true });
        const genesis = new Account({
            // the secret key for the genesis account
            private_key:
                "06ab59ce90ef681fa5cf632e402e8fc17e1485952ea3f68b2ac451eb01af8955",
        });

        const g_block = genesis.create_block({
            money: -50,
            data: "no anonymity",
            reference_hash: null,
            receiver_address: [account_1.public_key], // i badly need money to test this...
            tags: [],
        });

        expect(verify_block(g_block)).toEqual(true);
        expect(g_block.money <= 0).toEqual(true);
        expect(g_block instanceof Block).toEqual(true);

        let pool = verifier.update_pool({
            new_send: [g_block],
        });
        expect(pool.new_send.length).toEqual(1);
        expect(pool.new_send[0].verifications.length).toEqual(2);

        let pool_1 = account_1.update_pool(pool);
        expect(account_1.balance).toEqual(50);
        expect(pool_1.new_send.length).toEqual(0); // gotta be 0, temporarily changing to 1
        expect(pool_1.new_receive.length).toEqual(1);
        expect(pool_1.new_receive[0].verifications.length).toEqual(1);

        const block = account_1.send({
            money: 20,
            data: "amount 20 sent",
            receiver_address: [account_2.public_key],
            tags: [],
        });

        expect(Block.is_valid(block)).toEqual(true);
        expect(block.verifications.length).toEqual(1);
        expect(account_1.blockchain.length).toEqual(2);
        expect(account_1.balance).toEqual(30);

        account_2.update_pool({
            new_send: [block],
        });

        expect(account_2.balance).toEqual(20);
    });
});
