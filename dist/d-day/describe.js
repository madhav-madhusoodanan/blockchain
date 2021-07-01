"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.expect = exports.it = exports.describe = void 0;
const node_events_1 = __importDefault(require("node:events"));
class Examiner extends node_events_1.default {
    success;
    failure;
    constructor() {
        super();
        this.success = this.failure = 0;
    }
    test(result) {
        result ? this.success += 1 : this.failure += 1;
    }
}
class Test {
    received;
    examiner;
    constructor(received, examiner) {
        this.received = received;
        this.examiner = examiner;
    }
    toEqual(expected) {
        return this.examiner.test(this.received === expected);
    }
}
const examiner = new node_events_1.default();
examiner.on("print", (msg) => console.log(msg));
const describe = (description, execute) => {
    console.log(description);
    execute();
};
exports.describe = describe;
const it = (description, execute) => {
    console.log(description);
    execute();
};
exports.it = it;
const expect = (received) => new Test(received);
exports.expect = expect;
