import React from 'react';
import { Link } from 'react-router-dom';

function Lobby() {
    return (
        <div>
            <h1>Welcome!</h1>
            <p>Time to unwind. Find your game.</p>
            <Link to="/events">Go to Events</Link>
        </div>
    );
}

export default Lobby;