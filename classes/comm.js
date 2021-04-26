/* This is a communication device.
 * It uses Socket.io/WebRTC to communicate with the servers
 *
 * You can
 * 1. Send data
 * 2. Receive data
 */

class Comm {
    constructor() {}
    send(data_chunk) {} // returns a promise
    receive() {} // returns a promise
}
module.exports = Comm;