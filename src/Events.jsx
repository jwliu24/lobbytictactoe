import React from 'react';
import { Link } from 'react-router-dom';

function Events() {
  return (
    <div className='events-page-container'>
      <h1>Events</h1>
      <p>Please choose a game to play.</p>

      <ul>
        <li>
          <Link to="/tictactoe">Tic-Tac-Toe</Link>
        </li>
        <li>
          {/* another game? */}
        </li>
      </ul>

      <br />
    </div>
  );
}

export default Events;