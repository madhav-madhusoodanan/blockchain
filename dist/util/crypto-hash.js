"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SHA256 = void 0;
var crypto_1 = require("crypto");
var circularReplacer = function () {
    // Creating new WeakSet to keep
    // track of previously seen objects
    var seen = new WeakSet();
    return function (key, value) {
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
var SHA256 = function () {
    var inputs = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        inputs[_i] = arguments[_i];
    }
    var hash = crypto_1.createHash("sha256");
    hash.update(inputs
        .map(function (input) { return JSON.stringify(input, circularReplacer()); })
        .sort()
        .join(" "));
    return hash.digest("hex").trim();
};
exports.SHA256 = SHA256;
