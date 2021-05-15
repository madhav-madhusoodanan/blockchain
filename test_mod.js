import { EventEmitter } from "events";
const event = new EventEmitter();

const obj = { num1: 1, num2: 2 };

event.on("event", callback);

event.emit("event", )