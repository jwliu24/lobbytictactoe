const express = require('express');
const http = require('http');
const { Server } = require("socket.io");
const cors = require('cors');

const app = express();
app.use(cors());

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"]
  }
});

const PORT = 3000;

function generateRoomId(){
  return Math.floor(1000 + Math.random() * 9000).toString();
}

let events = [
  { id: generateRoomId(), name: "Tic-Tac-Toe Room" }
];

app.get('/', (req, res) => {
  res.send('<h1>API Server is running</h1>');
});

io.on('connection', (socket) => {
  console.log(`A user connected: ${socket.id}`);

  socket.on('request_to_listEvents', () => {
    console.log(`User ${socket.id} is requesting the event list.`);
    socket.emit('response_for_listEvents', events);
  });

  socket.on('create_event', (data) => {
    console.log('Creating a new event:', data.name);
    const newEvent = {
      id: generateRoomId(),
      name: data.name
    };
    events.push(newEvent);

    socket.emit('event_created', newEvent);
    socket.broadcast.emit('new_event_available', newEvent);
  });
  
  socket.on('disconnect', () => {
    console.log(`User disconnected: ${socket.id}`);
  });
});

server.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});