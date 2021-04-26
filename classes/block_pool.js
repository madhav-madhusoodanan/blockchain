/* Any transaction pool has/can/is
 * 1. An array of transactions
 * 2. Kick transactions which arent accepted beyond a period of time
 * 3. Kick-gap time is completely upto the user/device
 * 4. inform other transaction pools
 */

class Block_pool {
    constructor() {
        this.addresses = [];
        this.pool = [];
    }
    get pool(pool)
    {
        this.pool = pool;
    }
    get addresses(addresses)
    {
        this.addresses = addresses;
    }
    clear() {}
    add({pool, addresses}) {
        // verify status
    }
    return_existing() {}
    return_valid() {}
    set_map() {}
    clear_if_acepted() {}
}
module.expors = Block_pool;