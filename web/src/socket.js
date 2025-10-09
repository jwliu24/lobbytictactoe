import { io } from 'socket.io-client';

// Connect your React app to the backend server
const socket = io('http://localhost:3000');

export default socket;