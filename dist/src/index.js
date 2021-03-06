"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BET_KEEPING_KEY = exports.TYPE = exports.DIFFICULTY = exports.MINING_REWARD = exports.REWARD_INPUT = exports.STARTING_BALANCE = exports.MINE_RATE = exports.GENESIS_DATA = exports.Block_pool = exports.Comm = exports.User = exports.Account = exports.Blockchain = exports.Block = void 0;
var block_1 = require("./block");
Object.defineProperty(exports, "Block", { enumerable: true, get: function () { return block_1.Block; } });
var blockchain_1 = require("./blockchain");
Object.defineProperty(exports, "Blockchain", { enumerable: true, get: function () { return blockchain_1.Blockchain; } });
var account_1 = require("./account");
Object.defineProperty(exports, "Account", { enumerable: true, get: function () { return account_1.Account; } });
var user_1 = require("./user");
Object.defineProperty(exports, "User", { enumerable: true, get: function () { return user_1.User; } });
var comm_1 = require("./comm");
Object.defineProperty(exports, "Comm", { enumerable: true, get: function () { return comm_1.Comm; } });
var block_pool_1 = require("./block_pool");
Object.defineProperty(exports, "Block_pool", { enumerable: true, get: function () { return block_pool_1.Block_pool; } });
var config_1 = require("./config");
Object.defineProperty(exports, "GENESIS_DATA", { enumerable: true, get: function () { return config_1.GENESIS_DATA; } });
Object.defineProperty(exports, "MINE_RATE", { enumerable: true, get: function () { return config_1.MINE_RATE; } });
Object.defineProperty(exports, "STARTING_BALANCE", { enumerable: true, get: function () { return config_1.STARTING_BALANCE; } });
Object.defineProperty(exports, "REWARD_INPUT", { enumerable: true, get: function () { return config_1.REWARD_INPUT; } });
Object.defineProperty(exports, "MINING_REWARD", { enumerable: true, get: function () { return config_1.MINING_REWARD; } });
Object.defineProperty(exports, "DIFFICULTY", { enumerable: true, get: function () { return config_1.DIFFICULTY; } });
Object.defineProperty(exports, "TYPE", { enumerable: true, get: function () { return config_1.TYPE; } });
Object.defineProperty(exports, "BET_KEEPING_KEY", { enumerable: true, get: function () { return config_1.BET_KEEPING_KEY; } });
