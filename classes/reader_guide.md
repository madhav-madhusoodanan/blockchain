# Guide
Start with user.js.
Its is where all the classes' code come together.

Then move to transaction.js.
its the medium of communication between users.

transaction_pool.js outlines how a transaction will be handled during its lifetime.
The lifetime is defined as the period from its send process to its receive process.

The signature ensures that things are cryptographically secured.

The blockchain is what keeps track of the user's activity.
The blocks are arranged chronologically, with newest blocks first.
Users are required to maintain it (atleast the hashes of the blocks).
Users can delete it after they are verified.

Users can also (optionally) store a list of addresses, their timestamp and balance.
Any user with that sender address can verify by signing on the block.
once the balance hit zero, they may safely delete the addresses.


# Possible Feature(s):
1. Plead to change a specific detail, and changes occur if proof exists, within some time
    Like, a block that was accidentally wronged

Opinions needed:
1. Do we need checks, hashes, etc for information-only blocks? There is nothing to verify, however  verifications may cause longer latency
2. Data-only blocks without sender signatures can be deleted after 1 hour of their timestamp. Do they need a receive block?
3. Blocks without a receiver-key are automatically filled with a "bet-keeping-address" key...
If a block is accepted and then it passes a day, users are then allowed to delete 
the block without resending it to others
4. Is a data_chunk a piece of info that is constant? i hope so...
5. send blocks always have -ve money, receive blocks always have +ve money 
6. Private_key -> bigNum, Public_key -> curve.g.mul(bigNum) :)

# Functionality
The User does all the tasks
All the other objects just allow the user to do its job faster

# Checks for basic blockchain completeness
1. Create a send block
2. Send it to the network
3. send it to 1 imaginary person
4. send that to the receiver
5. let receiver generate a receive block
6. send it to the network