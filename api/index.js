const express = require('express');
const http = require('http');
const { Server } = require("socket.io");
const cors = require('cors');
const { v4: uuidv4 } = require('uuid');

const app = express();
app.use(cors());

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173", // Or whatever port your React app runs on
    methods: ["GET", "POST"]
  }
});

const PORT = 3000;

// Store game rooms in memory
let events = [
  { id: uuidv4(), name: "Public Tic-Tac-Toe Room" }
];

// A test route to see if the server is alive
app.get('/', (req, res) => {
  res.send('<h1>API Server is running</h1>');
});

io.on('connection', (socket) => {
  console.log(`A user connected: ${socket.id}`);
  
  socket.on('disconnect', () => {
    console.log(`User disconnected: ${socket.id}`);
  });
});

server.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});