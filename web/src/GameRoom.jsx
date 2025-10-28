import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, useOutletContext } from 'react-router-dom';
import socket from './socket';

function GameRoom() {
  const { roomId } = useParams();
  const { user } = useOutletContext();
  const navigate = useNavigate();
  const [players, setPlayers] = useState([]);
  // const [roomName, setRoomName] = useState('');
  const [roomDetails, setRoomDetails] = useState(null);
  const [canStartGame, setCanStartGame] = useState(false);

  useEffect(() => {

    if (user && roomId) {

      socket.emit('get_room_details', roomId);
      socket.on('room_details', (details) => {
        setRoomDetails(details);
        // if (eventDetails) {
        //   setRoomName(eventDetails.name);
        // }
      })

      socket.emit('join_room', { roomId, user });

      socket.on('room_state_update', (data) => {
        if (data && data.players) {
          setPlayers(data.players);
          setCanStartGame(data.canStart);
        }
      });

      // socket.on('update_player_list', (playerList) => {
      //   setPlayers(playerList);
      // });

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
      // socket.off('update_player_list');
      socket.off('start_game');
      socket.off('owner_left_room');
    };
  }, [roomId, user, navigate]);

  const handleReadyClick = () => {
    socket.emit('player_ready', roomId);
  };

  // const allReady = players.length > 0 && players.every(p => p.ready);
  const handleStartGameClick = () => {
    socket.emit('start_game_now', roomId);
  };

  const isOwner = roomDetails && roomDetails.ownerId === socket.id;

  return (

    <div className='lobby-container'>
      <h1>Game Room: {roomDetails ? roomDetails.name : 'Loading...'}</h1>

      {/* UPDATED: Complete overhaul of the player display */}
      <div className="player-grid">
        {Array.isArray(players) && players.map((player) => {
          // Check if the card we're rendering is for the current user
          const isCurrentUser = player.id === socket.id;
          
          return (
            <div key={player.id} className="player-card">
              <p className="player-name">
                {roomDetails && player.id === roomDetails.ownerId ? <strong>{player.name}</strong> : player.name}
              </p>
              
              {/* If this card is for the currently logged-in user, show a button */}
              {isCurrentUser ? (
                <button
                  onClick={handleReadyClick}
                  className={`status-button ${player.ready ? 'ready' : 'waiting'}`}
                >
                  {player.ready ? 'Ready' : "I'm Ready"}
                </button>
              ) : (
                /* If this card is for another player, show a static display */
                <div className={`status-display ${player.ready ? 'ready' : 'waiting'}`}>
                  {player.ready ? 'Ready' : 'Waiting...'}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* NEW: Conditional "Start Game" button for the owner */}
      {isOwner && canStartGame && (
        <button onClick={handleStartGameClick} className='auth-button primary go-button'>
          Start Game
        </button>
      )}
    </div>

    // <div className='room-container'>
    //   <h1>Game Room: {roomName || 'Loading...'}</h1>
    //   <p>Waiting for players to get ready...</p>

    //   <ul className='player-list'>
    //     {players.map((player) => (
    //       <li key={player.id} className={player.ready ? 'ready' : ''}>
    //         {player.name}
    //         <span>{player.ready ? 'Ready' : 'Waiting...'}</span>
    //       </li>
    //     ))}
    //   </ul>

    //   <button onClick={handleReadyClick} className='auth-button primary'>
    //     Ready
    //   </button>
    //   {allReady && <p>All players are ready! Starting game...</p>}
    // </div>

  );
}

export default GameRoom;