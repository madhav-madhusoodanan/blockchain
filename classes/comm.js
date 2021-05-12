/* This is a communication device.
 * It uses Socket.io/WebRTC to communicate with the servers
 *
 * You can
 * 1. Send data
 * 2. Receive data
 */
import io from "socket.io-client"; 
class Comm {
    constructor(public_user_key) {
        this.comm = io();
        this.raw = [];
        // job of the server to handle the rooms
        socket.emit("join", { public_user_key }, (error) => {
            if (error) {
              alert(error);
            }
          });
          socket.on("data", (data) => {
              this.raw.append(data);
          });
    }
    // data_chunk must always be in object/json format
    send(data_chunk) {
        // format the data structure
        socket.emit("data", data_chunk);
    } 
    receive() {
        // format the data
        return this.raw;
        this.raw = [];
    } // returns {new_send, new_receive, addresses, network}
}
module.exports = Comm;