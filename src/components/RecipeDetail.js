import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';
import './Recipe.css';

const RecipeDetail = () => {
  const [recipe, setRecipe] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    fetchRecipe();
  }, [id]);

  const fetchRecipe = async () => {
    try {
      const response = await api.get(`/recipes/${id}`);
      setRecipe(response.data);
    } catch (err) {
      setError('Failed to load recipe');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this recipe?')) {
      try {
        await api.delete(`/recipes/${id}`);
        alert('Recipe deleted successfully!');
        navigate('/recipes');
      } catch (err) {
        alert('Failed to delete recipe');
      }
    }
  };

  if (loading) return <div className="loading">Loading recipe...</div>;
  if (error) return <div className="error-message">{error}</div>;
  if (!recipe) return <div>Recipe not found</div>;

  return (
    <div className="recipe-detail-container">
      <div className="recipe-detail-card">
        <div className="recipe-detail-header">
          <h1>{recipe.title}</h1>
          {user && user.id === recipe.userId && (
            <div className="recipe-actions">
              <Link to={`/recipes/edit/${recipe.id}`} className="btn-edit">Edit</Link>
              <button onClick={handleDelete} className="btn-delete">Delete</button>
            </div>
          )}
        </div>

        <div className="recipe-meta-detail">
          <span>👤 By {recipe.username}</span>
          <span>⏱️ Prep: {recipe.prepTime} mins</span>
          <span>🍳 Cook: {recipe.cookTime} mins</span>
          <span>🍽️ Servings: {recipe.servings}</span>
        </div>

        {recipe.description && (
          <div className="recipe-section">
            <p className="recipe-description-detail">{recipe.description}</p>
          </div>
        )}

        <div className="recipe-section">
          <h2>Ingredients</h2>
          <pre className="recipe-content">{recipe.ingredients}</pre>
        </div>

        <div className="recipe-section">
          <h2>Instructions</h2>
          <pre className="recipe-content">{recipe.instructions}</pre>
        </div>

        <button onClick={() => navigate('/recipes')} className="btn-back">
          Back to Recipes
        </button>
      </div>
    </div>
  );
};

export default RecipeDetail;