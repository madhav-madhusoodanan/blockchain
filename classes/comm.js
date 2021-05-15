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
        this.data = []; // temporary storage
        // job of the server to handle the rooms
        this.comm.emit("join", { public_user_key }, (error) => {
            if (error) {
              alert(error);
            }
          });
          this.comm.on("data", (data) => {
              this.data.append(data);
          });
    }
    // data_chunk must always be in object/json format
    send(data_chunk) {
        // format the data structure
        this.comm.emit("data", data_chunk);
    } 
    receive() {
        // format the data
        var data = this.data;
        this.data = [];
        return data;    
    } // returns {new_send, new_receive, addresses, network}
}
export default Comm;