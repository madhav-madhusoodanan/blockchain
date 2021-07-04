"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MINING_REWARD = exports.REWARD_INPUT = exports.STARTING_BALANCE = exports.TYPE_enum = exports.TYPE = exports.GENESIS_DATA = exports.BET_KEEPING_KEY = exports.DIFFICULTY = exports.MINE_RATE = void 0;
exports.MINE_RATE = 1000;
exports.DIFFICULTY = 1;
exports.BET_KEEPING_KEY = "hehe-lolol";
// const PHILANTHROPIST = [
//   "042d7ad770372693a8ef5c8c1b6dbb66e9df23357478fbfed419fff3434b5f32083acb7936016ad9079670dc23bb85a2c9dc6af20025b514fdfd94426324ae4ee3",
//   "0420c35897a0a40e25e735eb5c1e51f141072ee158da624614c25724b6bc073b4b7422399e5f5f9f545d3da946db795085c72b442f4235ef5565d48c5885de0874",
// ];
exports.GENESIS_DATA = {
    money: 30,
    data: "genesis",
    RECEIVER_KEY: "0413dd4863ef381742f66331fc94546c73c1e50411bf2788df1a07ce826f7421e405bd375ccc6f5e962dd44322afd4e6495109bced07f1d90c389bd030321c4dde",
    LAST_HASH: "0008451beb1a6f2e3952152c64fe0a50e1ee098160d4674317a3649294857d55",
    SENDER_PUBLIC: "0412254552711e5bbe936b1b66ff889966ff31d87a9ddd8f6061de7fc68ead1c1a6c25c3b9e56859eb51c1c5deb27cb30212c6db815d10a05b9a4c35bb9704bd6a",
    tags: ["genesis"],
};
var TYPE = /** @class */ (function () {
    function TYPE(tags, money, data) {
        /* process all the tags */
        if (!(tags instanceof Array))
            tags = [];
        tags.forEach(function (tag) {
            // check if we can reduce the size
            if (money || data)
                return "useful";
            if (tag.search(/nft/) + 1 || (data && money))
                return "nft";
            else if (tag.search(/speed/) + 1 && !money)
                return "speed";
            else if (tag.search(/db/) + 1 && !money)
                return "db";
            else if (tag.search(/contract/) + 1 && !money)
                return "contract";
            else if (tag.search(/noreply/) + 1 && !money)
                return "noreply";
            else if (tag.search(/loan/) + 1 && !money)
                return "loan";
            else
                return "spam";
        });
        this._type = tags || [];
        // add additional checks
    }
    Object.defineProperty(TYPE.prototype, "is_spam", {
        // return true if yes, false if no
        get: function () {
            return this._type.find(function (tag) { return tag === "spam"; });
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(TYPE.prototype, "is_nft", {
        get: function () {
            return this._type.find(function (tag) { return tag === "nft"; });
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(TYPE.prototype, "is_database", {
        get: function () {
            return this._type.find(function (tag) { return tag === "db"; });
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(TYPE.prototype, "is_contract", {
        get: function () {
            return this._type.find(function (tag) { return tag === "contract"; });
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(TYPE.prototype, "is_speed", {
        get: function () {
            return this._type.find(function (tag) { return tag === "speed"; });
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(TYPE.prototype, "is_no_reply", {
        get: function () {
            return this._type.find(function (tag) { return tag === "noreply"; });
        },
        enumerable: false,
        configurable: true
    });
    return TYPE;
}());
exports.TYPE = TYPE;
var TYPE_enum;
(function (TYPE_enum) {
    TYPE_enum["nft"] = "nft";
    TYPE_enum["speed"] = "speed";
    TYPE_enum["contract"] = "contract";
    TYPE_enum["noreply"] = "noreply";
    TYPE_enum["spam"] = "spam";
    TYPE_enum["db"] = "db";
    TYPE_enum["loan"] = "loan";
})(TYPE_enum = exports.TYPE_enum || (exports.TYPE_enum = {}));
exports.STARTING_BALANCE = 1000;
exports.REWARD_INPUT = {
    address: "oracle",
};
exports.MINING_REWARD = 50;
