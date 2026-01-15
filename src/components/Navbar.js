import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Navbar.css';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="navbar">
      <div className="nav-container">
        <Link to="/" className="nav-logo">
          🍳 Recipe Sharing
        </Link>
        <div className="nav-menu">
          {user ? (
            <>
              <Link to="/recipes" className="nav-link">Recipes</Link>
              <Link to="/recipes/new" className="nav-link">Add Recipe</Link>
              <span className="nav-user">Welcome, {user.username}!</span>
              <button onClick={handleLogout} className="nav-logout">Logout</button>
            </>
          ) : (
            <>
              <Link to="/login" className="nav-link">Login</Link>
              <Link to="/register" className="nav-link">Register</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;