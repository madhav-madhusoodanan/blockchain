// these use jest functions
// the values in comments are the corresponding values intended for the genesis block
const { Account, Block } = require("../dist/src");
const { genKeyPair } = require("../dist/util");
describe("Account ", () => {
    it("tries to change its base balance but fails", () => {
        const data = "genesis";
        const account = new Account({});
        account.base_balance = 30;
        const A = genKeyPair();
        const B = genKeyPair();
        // console.log(account.key); //06ab59ce90ef681fa5cf632e402e8fc17e1485952ea3f68b2ac451eb01af8955
        // console.log(account.lock); //0412254552711e5bbe936b1b66ff889966ff31d87a9ddd8f6061de7fc68ead1c1a6c25c3b9e56859eb51c1c5deb27cb30212c6db815d10a05b9a4c35bb9704bd6a
        // console.log(A.getPrivate("hex")); //03fbc71aaee271f16478069862c31f21c83802f210ba3e4ec67aaa5be7952fdb
        // console.log(A.getPublic().encode("hex")); // 042d7ad770372693a8ef5c8c1b6dbb66e9df23357478fbfed419fff3434b5f32083acb7936016ad9079670dc23bb85a2c9dc6af20025b514fdfd94426324ae4ee3
        // console.log(B.getPrivate("hex")); //03001c60734231554a5636edb338d7a31e92bc88bc405fb26a04ca09adbba571
        // console.log(B.getPublic().encode("hex")); //0420c35897a0a40e25e735eb5c1e51f141072ee158da624614c25724b6bc073b4b7422399e5f5f9f545d3da946db795085c72b442f4235ef5565d48c5885de0874
        const block = account.create_block({
            money: -10,
            data,
            reference_hash: "dead",
            receiver_address: [
                A.getPublic().encode("hex"),
                B.getPublic().encode("hex"),
            ],
            tags: [],
        });
        // console.log(block.hash[0]); //0008451beb1a6f2e3952152c64fe0a50e1ee098160d4674317a3649294857d55
        expect(Block.is_valid(block)).toEqual(false);
        expect(account.balance).toEqual(0);
        
    });
});
