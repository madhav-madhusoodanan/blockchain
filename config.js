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
  NO_RECEIVE: "R", // when no_receive block and when money is zero
                   // work not done on it yet
};

const ASSIGN_TYPE = (block) => {
  // is this field even needed?
  if (!block.#money && block.#data) {
    if (!block.#receiver_key && block.#sender_signatures) return TYPE.DATABASE;
    else return TYPE.DATA;
  } // kept it at first to optimise speed
  else if (money && data) return TYPE.NFT;
  else if (money) return TYPE.MONEY;
  else return TYPE.SPAM;
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
  ASSIGN_TYPE,
};
