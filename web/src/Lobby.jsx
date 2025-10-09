import React, { useState } from 'react';
import { useNavigate, useOutletContext } from 'react-router-dom';

function Lobby() {
  // const [name, setName] = useState('');
  // const [password, setPassword] = useState('');

  // const { onLogin } = useOutletContext();
  // const navigate = useNavigate();

  // const handleSubmit = (event) => {
  //     event. preventDefault();
  //     if (!name | !password) return;

  //     onLogin(name);

  //     navigate('/events');
  // }

  return (
    <div className='lobby-container'>
      <h1>Welcome! Please sign in.</h1>
      {/* <form onSubmit={handleSubmit}>
                <input 
                type='text' 
                placeholder='username' 
                value={name} 
                onChange={(e) => setName(e.target.value)}
                />
                <input 
                type='password' 
                placeholder='password' 
                value={password} 
                onChange={(e) => setPassword(e.target.value)}
                />
            <button type='submit'>Submit</button>
            </form> */}
    </div>
  );
}

export default Lobby;