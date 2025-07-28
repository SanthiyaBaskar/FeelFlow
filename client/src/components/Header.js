import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Header = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="header">
      <div className="container">
        <div className="header-content">
          <Link to="/" className="logo">
            🌈 Daily Mood Tracker
          </Link>
          
          {isAuthenticated() && (
            <>
              <nav>
                <ul className="nav-links">
                  <li><Link to="/dashboard">Dashboard</Link></li>
                  <li><Link to="/history">History</Link></li>
                  <li><Link to="/analytics">Analytics</Link></li>
                </ul>
              </nav>
              
              <div className="user-info">
                <span>Hello, {user?.email}</span>
                <button onClick={handleLogout} className="btn btn-secondary btn-small">
                  Logout
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;