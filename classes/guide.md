# Guide
Start with user.js.
Its is where all the classes' code come together.

Then move to transaction.js.
its the medium of communication between users.

transaction_pool.js outlines how a transaction will be handled during its lifetime.
The lifetime is defined as the period from its send process to its receive process.

The signature ensures that things are cryptographically secured.

The blockchain is what keeps track of the user's activity.
Users are required to maintain it (atleast the hashes of the blocks).
Users can delete it after they are verified.

Users can also (optionally) store a list of addresses, their timestamp and balance.
Any user with that sender address can verify by signing on the block.
once the balance hit zero, they may safely delete the addresses.

New accounts are supposed to indicate "new" on the block (indicates initial balance as 0)
else they may risk the possibility of nobody voting on it and failing quorum.

# To do
<ol>
<li> Confirm the consensus mechanism
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
</ol>