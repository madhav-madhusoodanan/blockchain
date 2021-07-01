// let { Account } = require("./dist/src")
import { Account } from "./src/index.js";
import fs from "fs";

const run = async () => {
    let benchmarks /* = {
    "genesis account makes a send block": [],
    "the receiver updates his account": [],
    "the account makes a send block to a 3rd account": [],
    "the 3rd account is updated": []
} */,
        time;

    fs.readFile("./benchmarks.json", "utf8", (err, data) => {
        if (err) {
            console.log("File read failed:", err);
            return;
        }
        benchmarks = JSON.parse(data);
        let account_1 = new Account({ standalone: true });
        let account_2 = new Account({ standalone: true });
        let genesis = new Account({
            // the secret key for the genesis account
            private_key:
                "06ab59ce90ef681fa5cf632e402e8fc17e1485952ea3f68b2ac451eb01af8955",
        });

        // step 1
        time = Date.now();
        console.time("genesis account makes a send block");
        let g_block = genesis.create_block({
            money: -50,
            data: "no anonymity",
            receiver_address: [account_1.public_key], // i badly need money to test this :) ...
            tags: [],
        });
        console.timeEnd("genesis account makes a send block"); // 47.146ms 55.117ms 47.548ms
        benchmarks["genesis account makes a send block"].push(
            Date.now() - time
        );

        // step 2
        time = Date.now();
        console.time("the receiver updates his account");
        account_1.update_pool({
            new_send: [g_block],
        });
        console.timeEnd("the receiver updates his account"); // 38.701ms 40.532ms 40.28ms
        benchmarks["the receiver updates his account"].push(Date.now() - time);

        // step 3
        time = Date.now();
        console.time("the account makes a send block to a 3rd account");
        let block = account_1.send({
            money: 20,
            data: "amount 20 sent",
            receiver_address: [account_2.public_key],
            tags: [],
        });
        console.timeEnd("the account makes a send block to a 3rd account"); // 29.687ms 32.604ms 31.749ms
        benchmarks["the account makes a send block to a 3rd account"].push(
            Date.now() - time
        );

        // step 4
        time = Date.now();
        console.time("the 3rd account is updated");
        account_2.update_pool({
            new_send: [block],
        });
        console.timeEnd("the 3rd account is updated"); // 30.768ms 36.299 ms 27.565ms
        benchmarks["the 3rd account is updated"].push(Date.now() - time);

        fs.writeFile("./benchmarks.json", JSON.stringify(benchmarks), (err) => {
            if (err) {
                console.log("Error conducting the benchmarks ", err);
            } else {
                console.log("Successfully updated the benchmarks");
            }
        });
    });
};

run();
