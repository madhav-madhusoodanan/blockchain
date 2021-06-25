/* This is a communication device.
 * It uses Socket.io/WebRTC to communicate with the servers
 *
 * You can
 * 1. Send data
 * 2. Receive data
 *
 * Need to find out a way to:
 * 1. Scan for servers and choose the least overloaded one
 * <script src="https://unpkg.com/peerjs@1.3.1/dist/peerjs.min.js"></script> for the html
 */

import {io} from "socket.io-client";
export class Comm {
    comm: io;

    constructor(id: string) {
        this.comm = io();
        // job of the server to handle the rooms
        this.comm.emit("join", { id }, (error: Error) => {
            if (error) alert(error);
        });
    }
    // data_chunk must always be in object/json format
    // {new_send, new_receive, addresses, network}
    send(data_chunk: any) {
        /* this.comm.emit("data", data_chunk); */
        return data_chunk; // for testing in amount.send
    }
}
