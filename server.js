const express = require('express');
const net = require('net');

const app = express();
const port = 3000;

// Create a TCP server
const server = net.createServer(socket => {
  console.log('Client connected');

  // Send message to the client
  socket.write('Hello from server!\r\n');

  // Close the connection
  socket.end();
});

// Start the TCP server
server.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});

// Handle errors
server.on('error', err => {
  console.error('Server error:', err);
});
