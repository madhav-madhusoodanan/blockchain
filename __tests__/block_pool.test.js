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

        let pool = verifier.update_pool({
            addresses: [account_1.blockchain],
        });
        expect(account_1.blockchain.is_valid).toEqual(true);
        expect(pool.new_send.length).toEqual(0);
        expect(pool.addresses.length).toEqual(1);

        pool = verifier.update_pool({
            new_send: [g_block],
            addresses: [account_1.blockchain],
        });

        expect(pool.addresses[0].length).toEqual(0);
        expect(pool.addresses[0].balance()).toEqual(0);

        pool = account_1.update_pool({
            new_send: [g_block],
            addresses: [account_1.blockchain],
        });

        pool = verifier.update_pool(pool);

        expect(pool.addresses[0].length).toEqual(1);
        expect(pool.addresses[0].balance()).toEqual(50);

        const block = account_1.send({
            money: 20,
            data: "amount 20 sent",
            receiver_address: [account_2.public_key],
            tags: [],
        });

        pool = verifier.update_pool({
            new_send: [block],
        });

        expect(pool.addresses[0].length).toEqual(2);
        expect(pool.addresses[0].balance()).toEqual(30);

        account_2.update_pool({
            new_send: [block],
        });

        expect(account_2.balance).toEqual(20);
    });
});
