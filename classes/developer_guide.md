# Developer note
Start with an mvp dude
build a blockchain first
then make it as a library/api

in the future, extend to webRTC and hyper-optimization

# To do
<ol>
<li> Confirm the consensus mechanism (done)
<li> Then fill up in this order
    <ol>
    <li> Transaction
    <li> Communication
    <li> Transaction-pool
    <li> Block
    <li> Blockchain
    <li> Signature
    <li> User
    </ol>
<li> convert things that are supposed to be immutable into an object of private data types
<li> add functionality for NO_RECEIVE blocks
</ol>

# Checks for basic blockchain completeness
1. Create a send block
2. Send it to the network
3. send it to 1 imaginary person
4. send that to the receiver
5. let receiver generate a receive block
6. send it to the network

# Cryptography ideas
1. implement the <a href ="https://github.com/signalapp/libsignal-protocol-javascript"> Signal app cryptography </a>
2. gpu/asic resistance -> smart contract must be turing complete, 1 block mustn't fit in the cache

# Smart contract ideas
1. it can be written in any lang, starting with javascript -> python -> c/c++ -> etc...(markdown/latex?)
2. it must be transpiled into JSON (some sort of bytecode representation for now)
3. will be processed on a sandboxed code execution engine (mostly gonna be <a href="https://www.github.com/engineer-man/piston"> Piston </a>)
4. learn more to develop this, will have to build modules for the same purpose
5. prolly even need a web page that can graphically do the job and outputs bytecode (like ibm-q)
6. consider a contract like an NFT. if it changes, then its invalidated and the runner is not rewarded

# Opinions needed:
1. Do we need checks, hashes, etc for information-only blocks? There is nothing to verify, however  verifications may cause longer latency
2. Data-only blocks without sender signatures can be deleted after 1 hour of their timestamp. Do they need a receive block?
3. Blocks without a receiver-key are automatically filled with a "bet-keeping-address" key...
If a block is accepted and then it passes a day, users are then allowed to delete 
the block without resending it to others
4. Is a data_chunk a piece of info that is constant? i hope so...
5. send blocks always have -ve money, receive blocks always have +ve money 
6. Private_key -> bigNum, Public_key -> curve.g.mul(bigNum) :)
