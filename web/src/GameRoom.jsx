import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, useOutletContext } from 'react-router-dom';
import socket from './socket';

function GameRoom() {
  const { roomId } = useParams();
  const { user } = useOutletContext();
  const navigate = useNavigate();
  const [players, setPlayers] = useState([]);
  const [roomName, setRoomName] = useState('');

  useEffect(() => {

    if (user && roomId) {

      socket.emit('get_room_details', roomId);
      socket.on('room_details', (eventDetails) => {
        if (eventDetails) {
          setRoomName(eventDetails.name);
        }
      })

      socket.emit('join_room', { roomId, user });

      socket.on('update_player_list', (playerList) => {
        setPlayers(playerList);
      });

      socket.on('start_game', () => {
        navigate(`/tictactoe/${roomId}/play`);
      });

    }

    return () => {
      socket.off('room_details');
      socket.off('update_player_list');
      socket.off('start_game');
    };
  }, [roomId, user, navigate]);

  const handleReadyClick = () => {
    socket.emit('player_ready', roomId);
  };

  const allReady = players.length > 0 && players.every(p => p.ready);

  return (

    <div className='room-container'>
      <h1>Game Room: {roomName || 'Loading...'}</h1>
      <p>Waiting for players to get ready...</p>

      <ul className='player-list'>
        {players.map((player) => (
          <li key={player.id} className={player.ready ? 'ready' : ''}>
            {player.name}
            <span>{player.ready ? 'Ready' : 'Waiting...'}</span>
          </li>
        ))}
      </ul>

      <button onClick={handleReadyClick} className='auth-button primary'>
        Ready
      </button>
      {allReady && <p>All players are ready! Starting game...</p>}
    </div>

  );
}

export default GameRoom;