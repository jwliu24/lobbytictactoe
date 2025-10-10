import React, { useState } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import Modal from './components/Modal';
import LoginForm from './components/LoginForm';

function AppLayout() {
  const [user, setUser] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const location = useLocation();
  const navigate = useNavigate();

  const handleLogin = (username) => {
    setUser({ name: username });
    navigate('/events');
  };

  const handleLogout = () => {
    setUser(null);
    navigate('/');
  }

  return (
    <div className='app-container'>
      <header>
        {location.pathname === '/' ? (
          <div className="user-controls auth-only">
            <button onClick={() => setIsModalOpen(true)} className="auth-button">Sign In</button>
            <button onClick={() => setIsModalOpen(true)} className="auth-button primary">Sign Up</button>
          </div>
        ) : (
          <>
            <nav>
              <Link to="/">Lobby</Link>
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
                  <button onClick={() => setIsModalOpen(true)} className="auth-button">Sign In</button>
                  <button onClick={() => setIsModalOpen(true)} className="auth-button primary">Sign Up</button>
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