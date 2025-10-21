import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useOutletContext } from 'react-router-dom';
import socket from './socket';

function Events() {
  const [eventList, setEventList] = useState([]);
  const navigate = useNavigate();
  const { user } = useOutletContext();
  const [newEventName, setNewEventName] = useState('');
  const [selectedGame, setSelectedGame] = useState('Tic-Tac-Toe');
  const availableGames = ['Tic-Tac-Toe'];

  useEffect(() => {
    socket.on('response_for_listEvents', (data) => {
      setEventList(data);
    });

    socket.on('new_event_available', (newEvent) => {
      setEventList((prevEvents) => [...prevEvents, newEvent]);
    });

    socket.on('event_deleted', (deletedEventId) => {
      console.log(`Event ${deletedEventId} was deleted by the owner.`);
      setEventList((prevEvents) => 
        prevEvents.filter(event => event.id !== deletedEventId)
    );

    socket.emit('request_to_listEvents');
    return () => {
      socket.off('response_for_listEvents');
      socket.off('new_event_available');
      socket.off('event_deleted');
    };
  }, []);

  const handleCreateEvent = (e) => {
    e.preventDefault();
    if (newEventName) {
      socket.emit('create_event', { name: newEventName });
      setNewEventName('');
    } else {
      alert('Please eneter a name for the room.');
    }
  };    

    return () => {
      socket.off('response_for_listEvents');
      socket.off('new_event_available');
      socket.off('event_created');
      socket.off('event_deleted');
    }
  }, [navigate]);

  const handleCreateEvent = (e) => {
    // const eventName = prompt('Enter a name for your new game room:');
    e.preventDefault();
    if (newEventName) {
      socket.emit('create_event', { name: newEventName });
      setNewEventName('');
    }
  };

  return (
    <div className='events-layout-container'>
      {/* Left Panel: Create Event */}
      <div className='event-panel create-event-panel'>
        <h2>Welcome, {user ? user.name : 'Player'}!</h2>
        <form onSubmit={handleCreateEvent}>
          <label>Select Game</label>
          <select value={selectedGame} onChange={(e) => selectedGame(e.target.value)}>
            {availableGames.map(game => (
              <option key={game} value={game}>{game}</option>
            ))}
          </select>

          <label>Create a New Event</label>
          <input 
            type='text'
            value={newEventName}
            onChange={(e) => setNewEventName(e.target.value)}
            placeholder='Enter a room name'
          />
          <button type='submit' className='auth-button primary'>
          Create Event
          </button>
      </form>
    </div>

    {/* Right Panel: Available Events */}
    <div>
      <h2>Available Events</h2>
      {eventList.length > 0 ? (
        <ul>
          {eventList.map((event) => (
            <li key={event.id}>
              <span>{event.name}</span>
              <Link to={`/tictactoe/${event.id}`} className='join-button'>
                Join
              </Link>
            </li>
          ))}
        </ul>
      ) : (
        <p>No active events yet</p>
      )}
    </div>
  </div>
  );
}

export default Events;