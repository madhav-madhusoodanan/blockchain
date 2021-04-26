/* Every user has
 * 1. A personal blockchain
 * 2. A transaction pool
 * 3. Two pairs of cryptographic keys (view pair and send pair)
 * 4. Local storage for temporary addresses
 * 
 * Every user can
 * 1. Send either tokens or information
 * 2. Obfuscate their data before sending it (privacy oriented)
 * 3. Scan for stuff sent to them, and accept/reject them
 * 4. Clean their blockchain and local storage
 * 5. Cover its tracks by adding decoy signatures to transaction
 * 
 * No user can
 * 1. Spam transactions, because of rate-limiter
 * 2. Claim back tokens that are not accepted
 */

class User {
  constructor() {}
  send() {}
  sign() {}
  scan() {}
  clean() {}
}
