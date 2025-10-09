import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import socket from './socket';

function Events() {
  const [eventList, setEventList] = useState([]);

  useEffect(() => {
    socket.on('respoonse_for_listEvents', (data) => {
      console.log('Received events from server:', data);
      setEventList(data);
    });
    socket.emit('request_to_listEvents');

    return () => {
      socket.off('respoonse_for_listEvents');
    }
  }, []);

  return (
    <div className='events-page-container'>
      <h1>Events</h1>
      <p>Join an existing game room.</p>

      <ul>
        {eventList.length > 0 ? (
          eventList.map((event) => (
            <li key={event.id}>
              <Link to="/tictactoe">Tic-Tac-Toe</Link>
            </li>
          ))
        ) : (
          <p>No active game rooms found.</p> 
        )}
      </ul>

      <br />
    </div>
  );
}

export default Events;