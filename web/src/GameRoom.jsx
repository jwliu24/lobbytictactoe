import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, useOutletContext } from 'react-router-dom';
import socket from './socket';

function GameRoom() {
  const { roomId } = useParams();
  const { user } = useOutletContext();
  const navigate = useNavigate();
  const [players, setPlayers] = useState([]);
  const [roomDetails, setRoomDetails] = useState(null);
  const [canStartGame, setCanStartGame] = useState(false);

  useEffect(() => {

    if (user && roomId) {

      socket.emit('get_room_details', roomId);
      socket.on('room_details', (details) => {
        setRoomDetails(details);
      
      })

      socket.emit('join_room', { roomId, user });

      socket.on('room_state_update', (data) => {
        if (data && data.players) {
          setPlayers(data.players);
          setCanStartGame(data.canStart);
        }
      });

      socket.on('start_game', () => {
        console.log("CLIENT received 'start_game' event! Navigating now...");
        navigate(`/tictactoe/${roomId}/play`);
      });

      socket.on('owner_left_room', () => {
        alert('The room owner has left. The room is now closed.');
        navigate('/events');
      });

    }

    return () => {
      socket.off('room_details');
      socket.off('room_state_update');
      socket.off('start_game');
      socket.off('owner_left_room');
    };
  }, [roomId, user, navigate]);

  const handleReadyClick = () => {
    socket.emit('player_ready', roomId);
  };

  const handleStartGameClick = () => {
    socket.emit('start_game_now', roomId);
  };

  const isOwner = roomDetails && roomDetails.ownerId === socket.id;

  return (

    <div className='lobby-container'>
      <h1>Game Room: {roomDetails ? roomDetails.name : 'Loading...'}</h1>

      <div className="player-grid">
        {Array.isArray(players) && players.map((player) => {
          const isCurrentUser = player.id === socket.id;
          
          return (
            <div key={player.id} className="player-card">
              <p className="player-name">
                {roomDetails && player.id === roomDetails.ownerId ? <strong>{player.name}</strong> : player.name}
              </p>
              
              {isCurrentUser ? (
                <button
                  onClick={handleReadyClick}
                  className={`status-button ${player.ready ? 'ready' : 'waiting'}`}
                >
                  {player.ready ? 'Ready' : "I'm Ready"}
                </button>
              ) : (

                <div className={`status-display ${player.ready ? 'ready' : 'waiting'}`}>
                  {player.ready ? 'Ready' : 'Waiting...'}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {isOwner && canStartGame && (
        <button onClick={handleStartGameClick} className='auth-button primary go-button'>
          Start Game
        </button>
      )}
    </div>

  );
}

export default GameRoom;