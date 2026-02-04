import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { prodApi, devApi } from '../api/axios';
import './Recipe.css';

let api = devApi;

if (process.env.NODE_ENV === 'development') {
  api = devApi;
} 

if (process.env.NODE_ENV === 'production')  {
  api = prodApi;
}

const RecipeList = () => {
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { user, checkingAuth } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (checkingAuth) return;
    if (!user) {
      navigate('/login');
      return;
    }
    fetchRecipes();
  }, [user, checkingAuth, navigate]);

  const fetchRecipes = async () => {
    try {
      const response = await api.get('/recipes');
      setRecipes(response.data);
    } catch (err) {
      setError('Failed to fetch recipes');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this recipe?')) {
      try {
        await api.delete(`/recipes/${id}`);
        setRecipes(recipes.filter(recipe => recipe.id !== id));
      } catch (err) {
        alert('Failed to delete recipe');
      }
    }
  };

  if (loading) return <div className="loading">Loading recipes...</div>;
  if (error) return <div className="error-message">{error}</div>;

  return (
    <div className="recipe-list-container">
      <div className="recipe-list-header">
        <h2>All Recipes</h2>
        <Link to="/recipes/new" className="btn-primary" 
            style={{ backgroundColor: process.env.NODE_ENV === 'development' ? '#66ccff': 
                                      process.env.NODE_ENV === 'production' ? '#4CAF50' :
                                      '#4CAF50'}}>
            Add New Recipe</Link>
      </div>
      
      {recipes.length === 0 ? (
        <p className="no-recipes">No recipes found. Create your first recipe!</p>
      ) : (
        <div className="recipe-grid">
          {recipes.map(recipe => (
            <div key={recipe.id} className="recipe-card">
              <h3>{recipe.title}</h3>
              <p className="recipe-description">{recipe.description}</p>
              <div className="recipe-meta">
                <span>👤 {recipe.username}</span>
                <span>⏱️ {recipe.prepTime + recipe.cookTime} mins</span>
                <span>🍽️ {recipe.servings} servings</span>
              </div>
              <div className="recipe-actions">
                <Link to={`/recipes/${recipe.id}`} className="btn-view">View</Link>
                {user && user.id === recipe.userId && (
                  <>
                    <Link to={`/recipes/edit/${recipe.id}`} className="btn-edit">Edit</Link>
                    <button onClick={() => handleDelete(recipe.id)} className="btn-delete">
                      Delete
                    </button>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default RecipeList;