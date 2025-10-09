import React, { useState } from 'react';

function LoginForm({ onLogin, onClose }) {
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (event) => {
    event.preventDefault();
    if (!name || !password) return;

    onLogin(name);
    onClose();
  };

  return (
    <div className='login-form-container'>
      <h2>Sign in or Sign up</h2>
      <form onSubmit={handleSubmit}>
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
        <button type='submit'>Continue</button>
      </form>
    </div>
  );
}

export default LoginForm;