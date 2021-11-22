# Blockchain
This is a DAG blockchain client library ( inspired by [Nano](https://content.nano.org/whitepaper/Nano_Whitepaper_en.pdf) ) that implements untraceability ( inspired by Monero's [research](https://github.com/monero-project/research-lab/blob/master/whitepaper/whitepaper.pdf) ).<br />

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

