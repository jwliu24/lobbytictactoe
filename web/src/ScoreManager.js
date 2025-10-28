
//  @returns {Array} 

export const getLeaderboardScores = () => {
  try {
    const scores = JSON.parse(localStorage.getItem('leaderboard') || '[]');
   
    scores.sort((a, b) => b.wins - a.wins);
    return scores;
  } catch (error) {
    console.error("Error reading leaderboard from localStorage:", error);
    return [];
  }
};


//  @param {string} playerName
 
export const updateLeaderboard = (playerName) => {
  if (!playerName) return;

  try {
    const scores = getLeaderboardScores();
    const player = scores.find(p => p.name === playerName);

    if (player) {
      
      player.wins += 1;
    } else {
      
      scores.push({ name: playerName, wins: 1 });
    }

    localStorage.setItem('leaderboard', JSON.stringify(scores));
    console.log(`Leaderboard updated for ${playerName}`);
    
  } catch (error) {
    console.error("Error saving leaderboard to localStorage:", error);
  }
};