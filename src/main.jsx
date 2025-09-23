import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router';
import Game from './TicTacToe.jsx';
import Lobby from './Lobby.jsx';
import Events from './Events.jsx';

const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Lobby />} />
        <Route path="/events" element={<Events />} />
        <Route path="/tictactoe" element={<Game />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);