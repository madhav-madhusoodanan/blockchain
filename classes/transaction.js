/* Every transaction has
 * 1. An id
 * 2. Input and output
 * 3. Amount and/or data (no rate-limiting if amount is zero)
 * 4. Rate-limiting nonce to make an acceptable hash
 */

class Transaction {
    constructor() {}
    static create() {}
    static is_valid() {}
    create_input() {}
    create_output_map() {}
    update () {}
}
