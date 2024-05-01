// const express = require('express');
// const http = require('http');
// const socketIo = require('socket.io');

// const app = express();
// const server = http.createServer(app);
// const io = socketIo(server);

// let client1Socket;
// let client2Socket;

// io.on('connection', (socket) => {
//     console.log('A client connected');

//     // Handle client ID assignment
//     socket.on('setClientId', (clientId) => {
//         if (clientId === 'Client 1') {
//             client1Socket = socket;
//             console.log(`Client 1 connected with ID: ${clientId}`);
//         } else if (clientId === 'Client 2') {
//             client2Socket = socket;
//             console.log(`Client 2 connected with ID: ${clientId}`);
//         }
//     });

//     // Handle messages from client 1 and forward to client 2
//     socket.on('message', (data) => {
//         if (socket === client1Socket && client2Socket) {
//             console.log(`Message from Client 1: ${data}`);
//             client2Socket.emit('forwardToClient2', data);
//             console.log(`Message forwarded to Client 2: ${data}`);
//         }
//     });

//     // Handle client disconnection
//     socket.on('disconnect', () => {
//         if (socket === client1Socket) {
//             console.log('Client 1 disconnected');
//             client1Socket = null;
//         } else if (socket === client2Socket) {
//             console.log('Client 2 disconnected');
//             client2Socket = null;
//         }
//     });
// });

// const PORT = process.env.PORT || 3000;
// server.listen(PORT, () => {
//     console.log(`Server listening on port ${PORT}`);
// });


// const express = require('express');
// const bodyParser = require('body-parser');

// const app = express();
// const PORT = process.env.PORT || 3000;

// // Middleware to parse JSON bodies
// app.use(bodyParser.json());

// // Store client IDs
// let client1Id;
// let client2Id;

// // Endpoint to set client IDs
// app.post('/setClientId', (req, res) => {
//     const { clientId } = req.body;

//     if (!clientId) {
//         return res.status(400).json({ error: 'Client ID is required' });
//     }

//     if (!client1Id) {
//         client1Id = clientId;
//         console.log(`Client 1 connected with ID: ${client1Id}`);
//     } else if (!client2Id) {
//         client2Id = clientId;
//         console.log(`Client 2 connected with ID: ${client2Id}`);
//     }

//     res.status(200).json({ success: true });
// });

// // Endpoint to receive message from client 1 and forward to client 2
// app.post('/sendMessage', (req, res) => {
//     const { message } = req.body;

//     if (!client1Id || !client2Id) {
//         return res.status(400).json({ error: 'Both client IDs are required' });
//     }

//     console.log(`Message from Client 1: ${message}`);
//     // Forward the message to client 2 (you can implement this logic here)

//     res.status(200).json({ success: true });
// });

// // Start the server
// app.listen(PORT, () => {
//     console.log(`Server is running on port ${PORT}`);
// });

const net = require('net');

const PORT = 3000;
const clients = {};

const server = net.createServer((socket) => {
    let clientId = null;

    socket.on('data', (data) => {
        const message = data.toString().trim();
        if (!clientId) {
            // If client ID is not set, set it and store the socket
            clientId = message;
            clients[clientId] = socket;
            console.log(`Client ${clientId} connected.`);
        } 
            // If client ID is set, forward the message to the other client
            const receiverId = clientId === 'Client1' ? 'Client2' : 'Client1';
            const receiverSocket = clients[receiverId];
            if (receiverSocket) {
                console.log(`Received message from ${clientId}: ${message}`);
                console.log(`Forwarding message from ${clientId} to ${receiverId}: ${message}`);
                receiverSocket.write(`${clientId}: ${message}`);
            } else {
                console.log(`Client ${receiverId} is not connected.`);
            }
        
    });

    socket.on('end', () => {
        if (clientId) {
            console.log(`Client ${clientId} disconnected.`);
            delete clients[clientId];
        }
    });
});

server.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
});
