import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import socket from './socket';

function Square({ value, onSquareClick, isWinning }) {
  const className = "square" + (isWinning ? " winning" : "");
  return (
    <button className={className} onClick={onSquareClick}>
      {value}
    </button>
  );
}

function Board({ xIsNext, squares, onPlay }) {
  function handleClick(i) {
    if (squares[i] || calculateWinner(squares)) {
      return;
    }
    const nextSquares = squares.slice();
    if (xIsNext) {
      nextSquares[i] = "X";
    } else {
      nextSquares[i] = "O";
    }
    onPlay(nextSquares);
  }

  const winner = calculateWinner(squares);
  let status;
  if (winner) {
    status = "Winner: " + winner.winner;
  } else if (!squares.includes(null)) {
    status = "Result: Draw";
  } else {
    status = "Next player: " + (xIsNext ? "X" : "O");
  }

  const boardRows =[];
  for (let row = 0; row < 3; row++) {
    const squaresInRow = [];
    for (let col = 0; col < 3; col++) {
      const squareIdx = row * 3 + col;
      squaresInRow.push(
        <Square
          key={squareIdx}
          value={squares[squareIdx]}
          onSquareClick={() => handleClick(squareIdx)}
          isWinning={winner && winner.line.includes(squareIdx)}
        />
      );
    }
    boardRows.push(<div key={row} className='board-row'>{squaresInRow}</div>);
  }

  return (
    <>
      <div className="status">{status}</div>
      {boardRows}
    </>
  );
}

export default function Game() {
  const { roomId } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    if (roomId) {
      socket.emit('join_room', roomId);
      console.log(`User is joining Room: ${roomId}`);
    }
  }, [roomId]);

  useEffect(() => {
    const handleEventDeleted = (deletedEventId) => {
      if (deletedEventId === roomId) {
        alert('The game room was closed by owner.');
        navigate('/events');
      }
    };
    socket.on('event_deleted', handleEventDeleted);

    return () => {
      socket.off('event_deleted, handleEventDeleted');
    }
  }, [roomId, navigate]);

  const [history, setHistory] = useState([Array(9).fill(null)]);
  const [currentMove, setCurrentMove] = useState(0);
  const xIsNext = currentMove % 2 == 0;
  const currentSquares = history[currentMove];

  useEffect(() => {
    const handleGameUpdate = (newSquares) => {
      console.log('Received game update from server:', newSquares);
      const nextHistory = [...history.slice(0, currentMove + 1), newSquares];
      setHistory(nextHistory);
      setCurrentMove(nextHistory.length - 1);
    };
    socket.on('update_game', handleGameUpdate);
    return ()=> {
      socket.off('update_game', handleGameUpdate);
    };
  }, [history, currentMove]);

  function handlePlay(nextSquares) {
    const nextHistory = [...history.slice(0, currentMove + 1), nextSquares];
    setHistory(nextHistory);
    setCurrentMove(nextHistory.length - 1);

    socket.emit('make_move', { roomId, squares: nextSquares });
  }

  function jumpTo(nextMove) {
    setCurrentMove(nextMove);
  }

  const moves = history.map((squares, move) => {
    let description;
    if (move > 0) {
      if (move === currentMove) {
        return <li key={move}>You are at move {currentMove}</li>
      } else {
      description = "Go to move #" + move;
      }
    } else {
      description = "Go to game start";
    }
    return (
      <li key={move}>
        <button onClick={() => jumpTo(move)}>{description}</button>
      </li>
    );
  });

  return (
    <>
      <h2>Game Room ID: {roomId}</h2>
      <div className="game">
        <div className="game-board">
          <Board xIsNext={xIsNext} squares={currentSquares} onPlay={handlePlay} />
        </div>
        <div className="game-info">
          <ol>{moves}</ol>
        </div>
      </div>
    </>
  );
}

function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return {winner: squares[a], line: lines[i] };
    }
  }
  return null;
}


