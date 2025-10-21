import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './styles.css';
import AppLayout from './AppLayout.jsx';
import Game from './TicTacToe.jsx';
import Lobby from './Lobby.jsx';
import Events from './Events.jsx';
import GameRoom from './GameRoom.jsx';

const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<AppLayout />}>
          <Route index element={<Lobby />} />
          <Route path="/events" element={<Events />} />
          <Route path="/tictactoe/:roomId" element={<GameRoom />} />
          <Route path="/tictactoe/:roomId/play" element={<Game />} />
        </Route>
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);