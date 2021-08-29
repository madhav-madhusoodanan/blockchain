# Scripting Language basics
Data that is stored on the blockchain can be divided into 2 types: State variables and Path variables<br /><br />

State variables are commutative on the path taken to achieve its current state (ie, the order of changes does not matter, but the ways can be controlled)<br />
Path variables are NOT commutative (ie, the order of changes DO matter and they are visible)

The advantage of providing a scripting language with such features is storage management.<br/>
State variable history can be aggressively culled <br />
Path variable history cannot <br /><br />

For example, a chat application may allow users to create a path variable called LATEST_CHAT (the history of the variable is equivalent to the chat history)<br /><br />

The first (and the most important) state variable is the amount of money owned (since the order of transactions does not matter assuming no transaction makes it negative)<br />
While the account-chain head block can be considered a path variable.

# Scripting Language syntax
<ol>
<li /> Write each instruction on a new line
<li /> Blocks of code are separated from each other by 2 newlines
<li />
</ol>

