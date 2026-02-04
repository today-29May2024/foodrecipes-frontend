import React from 'react';
import { Link, useNavigate, useLocation, matchPath } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Navbar.css';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const routerlocation = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const editRecipeMatch = matchPath({path: '/recipes/edit/:id'}, routerlocation.pathname);
  const addRecipeMatch = matchPath({path: '/recipes/new'}, routerlocation.pathname);

  const hideAddRecipe = Boolean(editRecipeMatch || addRecipeMatch)

  if (process.env.NODE_ENV === 'development') {
      const navbar = document.getElementsByClassName("navbar");
      for (let i = 0; i < navbar.length; i++) {
        navbar[i].style.backgroundColor = "#66ccff";
      }
  }

  return (
    <nav className="navbar">
      <div className="nav-container">
        <Link to="/" className="nav-logo">
          🍕 Food Recipe Sharing
        </Link>
        <div className="nav-menu">
          {user ? (
            <>
              <Link to="/recipes" className="nav-link">Recipes</Link>
              {
                !hideAddRecipe && (
                  <Link to="/recipes/new" className="nav-link">Add Recipe</Link>
                )
              }         
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