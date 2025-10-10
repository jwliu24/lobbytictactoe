import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import socket from './socket';

function Events() {
  const [eventList, setEventList] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    socket.on('response_for_listEvents', (data) => {
      // console.log('Received events from server:', data);
      setEventList(data);
    });

    socket.on('new_event_available', (newEvent) => {
      setEventList((prevEvents) => [...prevEvents, newEvent]);
    });

    socket.on('event_created', (newEvent) => {
      navigate(`/tictactoe/${newEvent.id}`);
    });

    socket.emit('request_to_listEvents');

    return () => {
      socket.off('response_for_listEvents');
      socket.off('new_event_available');
      socket.off('event_created');
    }
  }, [navigate]);

  const handleCreateEvent = () => {
    const eventName = prompt('Enter a name for your new game room:');
    if (eventName) {
      socket.emit('create_event', { name: eventName });
    }
  };

  return (
    <div className='events-page-container'>
      <h1>Events</h1>
      <p>Join an existing game room or create a new one.</p>
      <button onClick={handleCreateEvent} className='auth-button primary' style={{marginBottom: '30px'}}>
        Create New Game
      </button>

      <ul>
        {eventList.length > 0 ? (
          eventList.map((event) => (
            <li key={event.id}>
              <Link to={`/tictactoe/${event.id}`}>{event.name}</Link>
            </li>
          ))
        ) : (
          <p>No active games. Create a new one?</p> 
        )}
      </ul>

      <br />
    </div>
  );
}

export default Events;