const net = require('net');

const HOST = '13.239.147.208'; // Change this to the IP address of the server
const PORT = 3000; // Change this to the port the server is listening on

const client = new net.Socket();

// Connect to the server
client.connect(PORT, HOST, () => {
  console.log('Connected to server');
});

// Handle data received from the server
client.on('data', (data) => {
  console.log('Message from server:', data.toString());
});

// Handle connection closed
client.on('close', () => {
  console.log('Connection closed');
});
