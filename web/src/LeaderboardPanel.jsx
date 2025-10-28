import React, { useState, useEffect } from 'react';
// import { Link } from 'react-router-dom';
import { getLeaderboardScores } from './ScoreManager';

function Leaderboard() {
  const [scores, setScores] = useState([]);
  // const [loading, setLoading] = useState(true);

  useEffect(() => {
    const scoresData = getLeaderboardScores();
    setScores(scoresData);
    // setLoading(false);
  }, []);

  return (
    <div className='leaderboard-panel'>
      <h1>Leaderboard</h1>
      <p>All-time player rankings.</p>

      { scores.length === 0 ? (
        <p>No scores recorded yet.</p>
      ) : (
        <ol className='leaderboard-list'>
          {scores.map((player, index) => (
            <li key={player.name} className='leaderboard-item'>
              <span className='rank'>{index + 1}</span>
              <span className='name'>{player.name}</span>
              <span className='wins'>{player.wins}</span>
            </li>
          ))}
        </ol>
      )}

      {/* <Link to='/events' className='auth-button primary' style={{marginTop: '20px'}}>
        Back to Events
      </Link> */}
    </div>
  );

}

export default Leaderboard;