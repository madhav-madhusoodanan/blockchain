/* This is a communication device.
 * It uses Socket.io/WebRTC to communicate with the servers
 *
 * You can
 * 1. Send data
 * 2. Receive data
 *
 * Need to find out a way to:
 * 1. Scan for servers and choose the least overloaded one
 */
const io = require("socket.io-client");
class Comm {
  constructor(id) {
    this.comm = io();
    // job of the server to handle the rooms
    this.comm.emit("join", { id }, (error) => {
      if (error) alert(error);
    });
  }
  // data_chunk must always be in object/json format
  // {new_send, new_receive, addresses, network}
  send(data_chunk) {
    // format the data structure
    this.comm.emit("data", data_chunk);
  }
}
module.exports = Comm;
