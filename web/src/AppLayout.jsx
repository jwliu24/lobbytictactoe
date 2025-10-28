import React, { useState, useEffect } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import Modal from './components/Modal';
import LoginForm from './components/LoginForm';
import socket from './socket';

function AppLayout() {
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('user');
    return savedUser ? JSON.parse(savedUser) : null;
  });

  const [isModalOpen, setIsModalOpen] = useState(false);

  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      socket.connect();
    } else {
      socket.disconnect();
    }

    return () => {
      socket.disconnect();
    }
  }, [user]);

  const handleLogin = (username) => {
    const userObject = { name: username};
    setUser(userObject);
    localStorage.setItem('user', JSON.stringify(userObject));
    navigate('/events');
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('user');

    navigate('/');
  }

  return (
    <div className='app-container'>
      <header>
        {location.pathname === '/' ? (
          <div className="user-controls auth-only">
            <button onClick={() => setIsModalOpen(true)} className="auth-button">Sign In</button>
            {/* <button onClick={() => setIsModalOpen(true)} className="auth-button primary">Sign Up</button> */}
          </div>
        ) : (
          <>
            <nav>
              <Link to="/">Home</Link>
              {user && <Link to="/events">Events</Link>}
            </nav>
            <div className="user-controls">
              {user ? (
                <>
                  <span className="welcome-message">Welcome, {user.name}!</span>
                  <button onClick={handleLogout} className="auth-button">Sign Out</button>
                </>
              ) : (
                <>
                  <button onClick={() => setIsModalOpen(true)} className="auth-button primary">Sign In / Sign Up</button>
                  {/* <button onClick={() => setIsModalOpen(true)} className="auth-button primary">Sign Up</button> */}
                </>
              )}
            </div>
          </>
        )}
      </header>
 
      <main>
        <Outlet context={{ user }} />
      </main>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <LoginForm onLogin={handleLogin} onClose={() => setIsModalOpen(false)} />
      </Modal>
    </div>
  );
}

export default AppLayout;