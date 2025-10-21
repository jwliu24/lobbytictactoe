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

const gameRooms = {};

io.on('connection', (socket) => {
  console.log(`A user connected: ${socket.id}`);

  socket.on('join_room', (data) => {
    const { roomId, user } = data;
    if (!roomId || !user) {
      console.error('Join room request failed: missing missing roomId or user data');
      return;
    }
    socket.join(roomId);

    if (!gameRooms[roomId]) {
      gameRooms[roomId] = [];
    }

    const isPlayerInRoom = gameRooms[roomId].some(player => player.id === socket.id);

    if (!isPlayerInRoom) {
      gameRooms[roomId].push({ id: socket.id, name: user.name, ready: false});
    }

    console.log(`User ${user.name} (${socket.id}) joined room: ${roomId}`);

    io.to(roomId).emit('update_player_list', gameRooms[roomId]);
  });

  socket.on('player_ready', (roomId) => {
    const room = gameRooms[roomId];
    if (room) {
      const player = room.find((p) => p.id === socket.id);
      if (player) {
        player.ready = !player.ready;
      }
      io.to(roomId).emit('update_player_list', room);
    }
  });

  socket.on('disconnect', () => {
    console.log(`User disconnected: ${socket.id}`);
    // console.log('Checking for owned rooms. Current events array:', events);
    // const eventOwned = events.find(event => event.ownerId === socket.id);
    // if (eventOwned) {
    //   console.log(`Owner of Room ${eventOwned.name} disconnect. Deleting room.`)
    //   events = events.filter(event => event.id !== eventOwned.id);
    //   io.emit('event_deleted', eventOwned.id);
    // }
    for (const roomId in gameRooms) {
      const room = gameRooms[roomId];
      const playerIndex = room.findIndex((p) => p.id === socket.id);

      if (playerIndex !== -1) {
        room.splice(playerIndex, 1);
        io.to(roomId).emit('update_player_list', room);
        break;
      }
    }
  });

  socket.on('make_move', (data) => {
    socket.to(data.roomId).emit('update_game', data.squares);
    console.log(`Move made in room ${data.roomId}`);
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
    io.emit('new_event_available', newEvent);
  });
  
  
});

server.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});