const Block = require("./block");
const Blockchain = require("./blockchain");
const Account = require("./account");
const User = require("./user");
const Comm = require("./comm");
const Block_pool = require("./block_pool");
const {
    GENESIS_DATA,
    MINE_RATE,
    STARTING_BALANCE,
    REWARD_INPUT,
    MINING_REWARD,
    DIFFICULTY,
    TYPE,
    BET_KEEPING_KEY,
} = require("./config");

module.exports = {
    GENESIS_DATA,
    MINE_RATE,
    STARTING_BALANCE,
    REWARD_INPUT,
    MINING_REWARD,
    DIFFICULTY,
    TYPE,
    BET_KEEPING_KEY,

    Block,
    Block_pool,
    Blockchain,
    Account,
    User,
    Comm,
};
