import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
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

const RecipeForm = () => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    ingredients: '',
    instructions: '',
    prepTime: '',
    cookTime: '',
    servings: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { user, checkingAuth } = useAuth();
  const navigate = useNavigate();
  const { id } = useParams();
  const isEdit = Boolean(id);

  useEffect(() => {
    if (checkingAuth) return;
    if (!user) {
      navigate('/login');
      return;
    }
    if (isEdit) {
      fetchRecipe();
    }
  }, [id, user, checkingAuth, navigate]);

  const fetchRecipe = async () => {
    try {
      const response = await api.get(`/recipes/${id}`);
      const recipe = response.data;
      setFormData({
        title: recipe.title,
        description: recipe.description || '',
        ingredients: recipe.ingredients,
        instructions: recipe.instructions,
        prepTime: recipe.prepTime || '',
        cookTime: recipe.cookTime || '',
        servings: recipe.servings || '',
      });
    } catch (err) {
      setError('Failed to load recipe');
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const payload = {
      ...formData,
      prepTime: parseInt(formData.prepTime) || null,
      cookTime: parseInt(formData.cookTime) || null,
      servings: parseInt(formData.servings) || null,
      userId: user.id,
    };

    try {
      if (isEdit) {
        await api.put(`/recipes/${id}`, payload);
        alert('Recipe updated successfully!');
      } else {
        await api.post('/recipes', payload);
        alert('Recipe created successfully!');
      }
      navigate('/recipes');
    } catch (err) {
      setError(err.response?.data || 'Failed to save recipe');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="recipe-form-container">
      <div className="recipe-form-card">
        <h2>{isEdit ? 'Edit Recipe' : 'Create New Recipe'}</h2>
        {error && <div className="error-message">{error}</div>}
        
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Title *</label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows="3"
              required
            />
          </div>

          <div className="form-group">
            <label>Ingredients *</label>
            <textarea
              name="ingredients"
              value={formData.ingredients}
              onChange={handleChange}
              rows="5"
              placeholder="List ingredients, one per line"
              required
            />
          </div>

          <div className="form-group">
            <label>Instructions *</label>
            <textarea
              name="instructions"
              value={formData.instructions}
              onChange={handleChange}
              rows="8"
              placeholder="Step-by-step instructions"
              required
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Prep Time (minutes)</label>
              <input
                type="number"
                name="prepTime"
                value={formData.prepTime}
                onChange={handleChange}
                min="0"
              />
            </div>

            <div className="form-group">
              <label>Cook Time (minutes)</label>
              <input
                type="number"
                name="cookTime"
                value={formData.cookTime}
                onChange={handleChange}
                min="0"
              />
            </div>

            <div className="form-group">
              <label>Servings</label>
              <input
                type="number"
                name="servings"
                value={formData.servings}
                onChange={handleChange}
                min="1"
              />
            </div>
          </div>

          <div className="form-actions">
            <button type="submit" disabled={loading} 
                    style={{ backgroundColor: process.env.NODE_ENV === 'development' ? '#66ccff': 
                                              process.env.NODE_ENV === 'production' ? '#4CAF50' :
                                              '#4CAF50'}}>
              {loading ? 'Saving...' : (isEdit ? 'Update Recipe' : 'Create Recipe')}
            </button>
            <button type="button" onClick={() => navigate('/recipes')} className="btn-cancel">
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RecipeForm;