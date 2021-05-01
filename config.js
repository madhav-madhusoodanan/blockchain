const express = require("express");
const mongoose = require("mongoose");
const MINE_RATE = 1000;
const DIFFICULTY = 3;
const BET_KEEPING_KEY = "hehe-lolol";
const GENESIS_DATA = {
  timestamp: 1,
  lastHash: "-----",
  hash: "hash-one",
  difficulty: DIFFICULTY,
  nonce: 0,
  data: [],
};

const TYPE = {
    // combinations are possible
  DATABASE: "B", // if receiver_key is null but sender_keys are present
  CONTRACT: "C",
  DATA: "D",
  MONEY: "M",
  NFT: "N",
  SPAM: "S",
};

const STARTING_BALANCE = 1000;

const REWARD_INPUT = {
  address: "oracle",
};

const MINING_REWARD = 50;

module.exports = {
  express,
  mongoose,
  GENESIS_DATA,
  MINE_RATE,
  STARTING_BALANCE,
  REWARD_INPUT,
  MINING_REWARD,
  DIFFICULTY,
  TYPE,
  BET_KEEPING_KEY,
};
