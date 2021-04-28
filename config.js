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
  MONEY: "M",
  DATA: "D",
  NFT: "N",
  SPAM: "S",
  DATABASE: "D", // if receiver_key is null but sender_keys are present
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
