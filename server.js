// const express = require('express');
// const net = require('net');

// const app = express();
// const port = 3000;

// // Create a TCP server
// const server = net.createServer(socket => {
//   console.log('Client connected');

//   // Send message to the client
//   socket.write('Hello from server!\r\n');

//   // Close the connection
//   socket.end();
// });

// // Start the TCP server
// server.listen(port, () => {
//   console.log(`Server listening on port ${port}`);
// });

// // Handle errors
// server.on('error', err => {
//   console.error('Server error:', err);
// });


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

    // Handle messages from client 1 and send to client 2
    socket.on('message', (data) => {
        if (socket === client1Socket && client2Socket) {
            console.log(`Message from Client 1: ${data}`);
            client2Socket.emit('message', data);
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
