# Blockchain
This is a DAG blockchain client library ( inspired by Nano [blockchain](https://content.nano.org/whitepaper/Nano_Whitepaper_en.pdf) ) that implements untraceability ( inspired by Monero blockchain's [research](https://github.com/monero-project/research-lab/blob/master/whitepaper/whitepaper.pdf) ).<br />

# Guide
Start with **user.ts**. on folder **src/**
Its is where all the classes' code come together.

Then move to **block.ts**.
its the medium of communication between users.

**block_pool.ts** outlines how a transaction will be handled during its lifetime.
The lifetime is defined as the period from its send process to its receive process.

The signature ensures that blocks are cryptographically secured.
Untraceability singatures and receiver data are made only for send blocks. <br />
Also, send blocks are made in such a way that the sender remains anonymous :)

The **blockchain.ts** file outlines how the user's activity is kept track of.
The blocks are arranged chronologically, with newest blocks first.
Users are required to maintain it (atleast the hashes of the blocks).
Users can delete it after they are verified.

Users can also (optionally) store a list of peer addresses, their timestamp and balance.
Any user with that sender address can verify by signing on the block.
once the balance hit zero, they may safely delete the addresses.

Navigate to the [docs](https://github.com/madhav-madhusoodanan/blockchain/tree/main/docs) folder for more details

# File structure
```
.
├── benchmarks
│   ├── local.transaction.js
│   ├── src
│   │   ├── account.js
│   │   ├── blockchain.js
│   │   ├── block.js
│   │   ├── block_pool.js
│   │   ├── comm.js
│   │   ├── config.js
│   │   ├── index.js
│   │   └── user.js
│   └── util
│       ├── crypto-hash.js
│       └── index.js
├── benchmarks.json
├── dist
│   ├── README.md
│   ├── src
│   │   ├── account.js
│   │   ├── blockchain.js
│   │   ├── block.js
│   │   ├── block_pool.js
│   │   ├── comm.js
│   │   ├── config.js
│   │   ├── index.js
│   │   └── user.js
│   └── util
│       ├── crypto-hash.js
│       └── index.js
├── docs
│   ├── compatibility.md
│   ├── developer_guide.md
│   ├── reader_guide.md
│   └── server.md
├── package.json
├── package-lock.json
├── playground
│   ├── test_1.js
│   └── test_mod.js
├── README.md
├── src
│   ├── account.ts
│   ├── blockchain.ts
│   ├── block_pool.ts
│   ├── block.ts
│   ├── comm.ts
│   ├── config.ts
│   ├── index.ts
│   └── user.ts
├── __tests__
│   ├── account_hack.test.js
│   ├── account.test.js
│   ├── amount.send.test.js
│   ├── crypto-hash.test.js
│   ├── genesis.test.js
│   ├── no_anonymity.send.test.js
│   └── verifications.test.js
├── tsconfig.json
└── util
    ├── crypto-hash.ts
    └── index.ts

11 directories, 50 files
```

