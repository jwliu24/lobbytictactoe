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
  { id: generateRoomId(), name: "Tic-Tac-Toe", ownerId: null }
];

app.get('/', (req, res) => {
  res.send('<h1>API Server is running</h1>');
});

io.on('connection', (socket) => {
  console.log(`A user connected: ${socket.id}`);

  socket.on('make_move', (data) => {
    socket.to(data.roomId).emit('update_game', data.squares);
    console.log(`Move made in room ${data.roomId}`);
  });

  socket.on('join_room', (roomId) => {
    socket.join(roomId);
    console.log(`User ${socket.id} joined room: ${roomId}`);
  });

  socket.on('request_to_listEvents', () => {
    console.log(`User ${socket.id} is requesting the event list.`);
    socket.emit('response_for_listEvents', events);
  });

  socket.on('create_event', (data) => {
    console.log('Creating a new event:', data.name);
    const newEvent = {
      id: generateRoomId(),
      name: data.name,
      ownerId: socket.id
    };
    events.push(newEvent);

    socket.emit('event_created', newEvent);
    socket.broadcast.emit('new_event_available', newEvent);
  });
  
  socket.on('disconnect', () => {
    console.log(`User disconnected: ${socket.id}`);
    console.log('Checking for owned rooms. Current events array:', events);
    const eventOwned = events.find(event => event.ownerId === socket.id);
    if (eventOwned) {
      console.log(`Owner of Room ${eventOwned.name} disconnect. Deleting room.`)
      events = events.filter(event => event.id !== eventOwned.id);
      io.emit('event_deleted', eventOwned.id);
    }
  });
});

server.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});