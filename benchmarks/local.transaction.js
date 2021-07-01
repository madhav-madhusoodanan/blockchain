// let { Account } = require("./dist/src")
import {Account} from "./src/index.js";

    let account_1 = new Account({ standalone: true });
    let account_2 = new Account({ standalone: true });
    let genesis = new Account({
        // the secret key for the genesis account
        private_key:
            "06ab59ce90ef681fa5cf632e402e8fc17e1485952ea3f68b2ac451eb01af8955",
    });

    console.time("genesis account makes a send block");
    let g_block = genesis.create_block({
        money: -50,
        data: "no anonymity",
        receiver_address: [account_1.public_key], // i badly need money to test this...
        tags: [],
    });

    console.timeEnd("genesis account makes a send block"); // 47.146ms 55.117ms 47.548ms
    console.time("the receiver updates his account");
    account_1.update_pool({
        new_send: [g_block],
    });

    console.timeEnd("the receiver updates his account"); // 38.701ms 40.532ms 40.28ms
    console.time("the account makes a send block to a 3rd account");
    let block = account_1.send({
        money: 20,
        data: "amount 20 sent",
        receiver_address: [account_2.public_key],
        tags: [],
    });
    console.timeEnd("the account makes a send block to a 3rd account"); // 29.687ms 32.604ms 31.749ms
    console.time("the 3rd account is updated");
    account_2.update_pool({
        new_send: [block],
    });
    console.timeEnd("the 3rd account is updated"); // 30.768ms 36.299 ms 27.565ms
