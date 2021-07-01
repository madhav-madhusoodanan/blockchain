import EventEmitter from "node:events";

class Examiner extends EventEmitter {
    public success: number;
    public failure: number
    constructor() {
        super();
        this.success = this.failure = 0;
    }

    test(result: boolean) {
        result? this.success += 1 : this.failure += 1
    }
}
class Test {
    public received: any;
    public examiner: Examiner;
    constructor(received: any, examiner: Examiner) {
        this.received = received;
        this.examiner = examiner;
    }
    toEqual(expected: any): void {
        return this.examiner.test(this.received === expected);
    }
}
const examiner = new EventEmitter();

examiner.on("print", (msg: string) => console.log(msg));

export const describe = (description: string, execute: () => undefined) => {
    console.log(description);
    execute();
};

export const it = (description: string, execute: () => undefined) => {
    console.log(description);
    execute();
};



export const expect = (received: any): Test => new Test(received)
