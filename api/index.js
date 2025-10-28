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
];

app.get('/', (req, res) => {
  res.send('<h1>API Server is running</h1>');
});

const gameRooms = {};

io.on('connection', (socket) => {
  console.log(`A user connected: ${socket.id}`);

  socket.on('get_room_details', (roomId) => {
    const room = events.find(event => event.id === roomId);
    socket.emit('room_details', room);
  });


  socket.on('join_room', (data) => {
    const { roomId, user } = data;
    socket.join(roomId);

    if (!gameRooms[roomId]) {
      gameRooms[roomId] = [];
    }
    const room = gameRooms[roomId];
    
    if (!room.some(p => p.id === socket.id)) {
      room.push({ id: socket.id, name: user.name, ready: false });
    }

    const allReady = room.length > 1 && room.every(p => p.ready);
    io.to(roomId).emit('room_state_update', {
      players: room,
      canStart: allReady
    });
  });
  

  socket.on('player_ready', (roomId) => {
    const room = gameRooms[roomId];
    if (room) {
      const player = room.find((p) => p.id === socket.id);
      if (player) {
        player.ready = !player.ready;
      }

      const allReady = room.length > 1 && room.every(p => p.ready);
      io.to(roomId).emit('room_state_update', { 
        players: room, 
        canStart: allReady 
      });

    }
  });

  socket.on('start_game_now', (roomId) => {
    io.to(roomId).emit('start_game');
    console.log(`Game is starting in room: ${roomId}`);
  });

  socket.on('disconnect', () => {
    console.log(`--- User disconnected: ${socket.id} ---`);
    
    const eventOwned = events.find(event => event.ownerId === socket.id);

    if (eventOwned) {
      console.log(`Owner of Room ${eventOwned.name} disconnect. Deleting room.`)
      events = events.filter(event => event.id !== eventOwned.id);
      
      io.emit('event_deleted', eventOwned.id);
      return;
    }

    for (const roomId in gameRooms) {
      const room = gameRooms[roomId];
      const playerIndex = room.findIndex((p) => p.id === socket.id);

      if (playerIndex !== -1) {
        room.splice(playerIndex, 1);
        const allReady = room.length > 1 && room.every(p => p.ready);
        io.to(roomId).emit('room_state_update', {
          players: room,
          canStart: allReady
        });

        console.log(`Player left room ${roomId}. Updated lobby sent.`);
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