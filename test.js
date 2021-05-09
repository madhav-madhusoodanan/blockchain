const EventEmitter = require("events");
const event = new EventEmitter();

let arr = [1, 2, 3, 4, 5];
arr.sort((a, b) => a-b);
console.log(arr)
