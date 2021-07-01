"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SHA256 = void 0;
const crypto_1 = require("crypto");
const circularReplacer = () => {
    // Creating new WeakSet to keep
    // track of previously seen objects
    const seen = new WeakSet();
    return (key, value) => {
        // If type of value is an
        // object or value is null
        if (typeof value === "object" && value !== null) {
            // If it has been seen before
            if (seen.has(value)) {
                return;
            }
            // Add current value to the set
            seen.add(value);
        }
        // return the value
        return value;
    };
};
// variable argument number
const SHA256 = (...inputs) => {
    const hash = crypto_1.createHash("sha256");
    hash.update(inputs
        .map((input) => JSON.stringify(input, circularReplacer()))
        .sort()
        .join(" "));
    return hash.digest("hex").trim();
};
exports.SHA256 = SHA256;
