const express = require('express');
const http = require('http');
const socketIo = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

let client1Socket;
let client2Socket;

io.on('connection', (socket) => {
    console.log('A client connected');

    // Handle client ID assignment
    socket.on('setClientId', (clientId) => {
        if (clientId === 'Client 1') {
            client1Socket = socket;
            console.log(`Client 1 connected with ID: ${clientId}`);
        } else if (clientId === 'Client 2') {
            client2Socket = socket;
            console.log(`Client 2 connected with ID: ${clientId}`);
        }
    });

    // Handle messages from client 1 and forward to client 2
    socket.on('message', (data) => {
        if (socket === client1Socket && client2Socket) {
            console.log(`Message from Client 1: ${data}`);
            client2Socket.emit('forwardToClient2', data);
            console.log(`Message forwarded to Client 2: ${data}`);
        }
    });

    // Handle client disconnection
    socket.on('disconnect', () => {
        if (socket === client1Socket) {
            console.log('Client 1 disconnected');
            client1Socket = null;
        } else if (socket === client2Socket) {
            console.log('Client 2 disconnected');
            client2Socket = null;
        }
    });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
});
