"use strict";
const { SHA256 } = require("./crypto-hash");
describe("cryptoHash()", () => {
    it("generates a SHA-256 hashed output", () => {
        expect(SHA256("foo")).toEqual("b2213295d564916f89a6a42455567c87c3f480fcd7a1c15e220f17d7169a790b");
    });
    it("produces the same hash with same inputs arguments in any order", () => {
        expect(SHA256("one", "two", "three")).toEqual(SHA256("three", "one", "two"));
    });
    it("produces a unique hash when the properties have changed on an input", () => {
        var foo = { a: "b" };
        const originalHash = SHA256(foo);
        foo.a = "a";
        expect(SHA256(foo)).not.toEqual(originalHash);
    });
});
