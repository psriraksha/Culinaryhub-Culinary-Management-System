import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { createRecipe, updateRecipe, clearRecipeState } from '../../redux/slices/recipeSlice';
import toast from 'react-hot-toast';

const CATEGORIES = ['Breakfast', 'Lunch', 'Dinner', 'Snack', 'Dessert', 'Beverage', 'Appetizer', 'Soup', 'Salad', 'Bread', 'Other'];
const DIFFICULTIES = ['Easy', 'Medium', 'Hard'];

const RecipeForm = ({ existingRecipe = null }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error, success } = useSelector(state => state.recipes);

  const [form, setForm] = useState({
    title: '', description: '', category: '', cuisine: '', difficulty: 'Medium',
    servings: 4,
    cookingTime: { prep: 0, cook: 0, total: 0 },
    tags: '',
  });
  const [ingredients, setIngredients] = useState([{ name: '', amount: '', unit: '' }]);
  const [steps, setSteps] = useState([{ stepNumber: 1, instruction: '' }]);
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [activeTab, setActiveTab] = useState('basic');

  useEffect(() => {
    if (existingRecipe) {
      setForm({
        title: existingRecipe.title || '',
        description: existingRecipe.description || '',
        category: existingRecipe.category || '',
        cuisine: existingRecipe.cuisine || '',
        difficulty: existingRecipe.difficulty || 'Medium',
        servings: existingRecipe.servings || 4,
        cookingTime: existingRecipe.cookingTime || { prep: 0, cook: 0, total: 0 },
        tags: (existingRecipe.tags || []).join(', '),
      });
      setIngredients(existingRecipe.ingredients?.length ? existingRecipe.ingredients : [{ name: '', amount: '', unit: '' }]);
      setSteps(existingRecipe.steps?.length ? existingRecipe.steps : [{ stepNumber: 1, instruction: '' }]);
      if (existingRecipe.image) setImagePreview(`http://localhost:5000${existingRecipe.image}`);
    }
  }, [existingRecipe]);

  useEffect(() => {
    if (success) {
      toast.success(success);
      dispatch(clearRecipeState());
      navigate('/dashboard');
    }
    if (error) {
      toast.error(error);
      dispatch(clearRecipeState());
    }
  }, [success, error]);

  const handleChange = (e) => setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));

  const handleTimeChange = (field, value) => {
    const updated = { ...form.cookingTime, [field]: parseInt(value) || 0 };
    updated.total = updated.prep + updated.cook;
    setForm(prev => ({ ...prev, cookingTime: updated }));
  };

  const handleIngredientChange = (idx, field, value) => {
    setIngredients(prev => prev.map((ing, i) => i === idx ? { ...ing, [field]: value } : ing));
  };
  const addIngredient = () => setIngredients(prev => [...prev, { name: '', amount: '', unit: '' }]);
  const removeIngredient = (idx) => setIngredients(prev => prev.filter((_, i) => i !== idx));

  const handleStepChange = (idx, value) => {
    setSteps(prev => prev.map((step, i) => i === idx ? { ...step, instruction: value } : step));
  };
  const addStep = () => setSteps(prev => [...prev, { stepNumber: prev.length + 1, instruction: '' }]);
  const removeStep = (idx) => setSteps(prev => prev.filter((_, i) => i !== idx).map((s, i) => ({ ...s, stepNumber: i + 1 })));

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const fd = new FormData();
    Object.entries(form).forEach(([k, v]) => {
      if (k === 'cookingTime') fd.append(k, JSON.stringify(v));
      else fd.append(k, v);
    });
    fd.append('ingredients', JSON.stringify(ingredients.filter(i => i.name.trim())));
    fd.append('steps', JSON.stringify(steps.filter(s => s.instruction.trim())));
    fd.append('tags', JSON.stringify(form.tags.split(',').map(t => t.trim()).filter(Boolean)));
    if (image) fd.append('recipeImage', image);

    if (existingRecipe) {
      dispatch(updateRecipe({ id: existingRecipe._id, formData: fd }));
    } else {
      dispatch(createRecipe(fd));
    }
  };

  const tabs = [
    { id: 'basic', label: '📝 Basic Info' },
    { id: 'ingredients', label: '🥕 Ingredients' },
    { id: 'steps', label: '👨‍🍳 Steps' },
    { id: 'media', label: '📸 Photo' },
  ];

  return (
    <form onSubmit={handleSubmit}>
      {/* Tab Navigation */}
      <div className="flex gap-2 mb-6 bg-orange-50 p-1.5 rounded-2xl">
        {tabs.map(tab => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setActiveTab(tab.id)}
            className={`flex-1 px-3 py-2.5 rounded-xl text-sm font-semibold transition-all ${
              activeTab === tab.id
                ? 'bg-white text-orange-600 shadow-md'
                : 'text-gray-500 hover:text-orange-500'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Basic Info Tab */}
      {activeTab === 'basic' && (
        <div className="space-y-5 animate-fade-in">
          <div>
            <label className="label">Recipe Title *</label>
            <input name="title" value={form.title} onChange={handleChange} placeholder="e.g. Creamy Butter Chicken" required className="input-field" />
          </div>
          <div>
            <label className="label">Description *</label>
            <textarea name="description" value={form.description} onChange={handleChange} placeholder="Describe your recipe..." required rows={3} className="input-field resize-none" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="label">Category *</label>
              <select name="category" value={form.category} onChange={handleChange} required className="input-field">
                <option value="">Select category</option>
                {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label className="label">Difficulty</label>
              <select name="difficulty" value={form.difficulty} onChange={handleChange} className="input-field">
                {DIFFICULTIES.map(d => <option key={d} value={d}>{d}</option>)}
              </select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="label">Cuisine</label>
              <input name="cuisine" value={form.cuisine} onChange={handleChange} placeholder="e.g. Indian, Italian" className="input-field" />
            </div>
            <div>
              <label className="label">Servings</label>
              <input type="number" name="servings" value={form.servings} onChange={handleChange} min={1} max={100} className="input-field" />
            </div>
          </div>
          <div>
            <label className="label">⏱ Cooking Time (minutes)</label>
            <div className="grid grid-cols-3 gap-3">
              {[['prep', 'Prep'], ['cook', 'Cook'], ['total', 'Total']].map(([field, label]) => (
                <div key={field}>
                  <label className="text-xs text-gray-500 mb-1 block">{label}</label>
                  <input
                    type="number" min={0}
                    value={form.cookingTime[field]}
                    onChange={e => handleTimeChange(field, e.target.value)}
                    readOnly={field === 'total'}
                    className={`input-field text-center ${field === 'total' ? 'bg-orange-50 text-orange-600 font-bold' : ''}`}
                  />
                </div>
              ))}
            </div>
          </div>
          <div>
            <label className="label">Tags (comma separated)</label>
            <input name="tags" value={form.tags} onChange={handleChange} placeholder="e.g. spicy, quick, vegetarian" className="input-field" />
          </div>
        </div>
      )}

      {/* Ingredients Tab */}
      {activeTab === 'ingredients' && (
        <div className="animate-fade-in">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-gray-700">Ingredients ({ingredients.length})</h3>
            <button type="button" onClick={addIngredient} className="btn-primary py-2 px-4 text-sm">+ Add</button>
          </div>
          <div className="space-y-3">
            {ingredients.map((ing, idx) => (
              <div key={idx} className="flex gap-2 items-start bg-orange-50 p-3 rounded-xl">
                <div className="w-7 h-7 bg-orange-200 text-orange-700 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 mt-1">
                  {idx + 1}
                </div>
                <div className="flex-1 grid grid-cols-3 gap-2">
                  <input value={ing.name} onChange={e => handleIngredientChange(idx, 'name', e.target.value)} placeholder="Ingredient" className="input-field text-sm col-span-3 sm:col-span-1" />
                  <input value={ing.amount} onChange={e => handleIngredientChange(idx, 'amount', e.target.value)} placeholder="Amount" className="input-field text-sm" />
                  <input value={ing.unit} onChange={e => handleIngredientChange(idx, 'unit', e.target.value)} placeholder="Unit (g, ml...)" className="input-field text-sm" />
                </div>
                {ingredients.length > 1 && (
                  <button type="button" onClick={() => removeIngredient(idx)} className="text-red-400 hover:text-red-600 text-xl leading-none mt-1">×</button>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Steps Tab */}
      {activeTab === 'steps' && (
        <div className="animate-fade-in">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-gray-700">Cooking Steps ({steps.length})</h3>
            <button type="button" onClick={addStep} className="btn-primary py-2 px-4 text-sm">+ Add Step</button>
          </div>
          <div className="space-y-3">
            {steps.map((step, idx) => (
              <div key={idx} className="flex gap-3 items-start bg-orange-50 p-4 rounded-xl">
                <div className="w-8 h-8 bg-gradient-to-br from-orange-500 to-amber-400 text-white rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0">
                  {step.stepNumber}
                </div>
                <textarea
                  value={step.instruction}
                  onChange={e => handleStepChange(idx, e.target.value)}
                  placeholder={`Describe step ${step.stepNumber}...`}
                  rows={2}
                  className="input-field text-sm resize-none flex-1"
                />
                {steps.length > 1 && (
                  <button type="button" onClick={() => removeStep(idx)} className="text-red-400 hover:text-red-600 text-xl leading-none">×</button>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Media Tab */}
      {activeTab === 'media' && (
        <div className="animate-fade-in">
          <label className="label">Recipe Photo</label>
          <div
            className={`border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer transition-all ${imagePreview ? 'border-orange-300 bg-orange-50' : 'border-orange-200 hover:border-orange-400 hover:bg-orange-50'}`}
            onClick={() => document.getElementById('recipeImageInput').click()}
          >
            {imagePreview ? (
              <div>
                <img src={imagePreview} alt="Preview" className="max-h-48 mx-auto rounded-xl object-cover mb-3" />
                <p className="text-sm text-orange-600 font-medium">Click to change photo</p>
              </div>
            ) : (
              <div>
                <div className="text-5xl mb-3">📸</div>
                <p className="text-gray-600 font-medium">Upload a photo of your dish</p>
                <p className="text-gray-400 text-sm mt-1">JPG, PNG, GIF up to 5MB</p>
              </div>
            )}
            <input id="recipeImageInput" type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
          </div>
        </div>
      )}

      {/* Submit */}
      <div className="mt-8 flex gap-3 justify-end border-t border-orange-100 pt-6">
        <button type="button" onClick={() => navigate(-1)} className="btn-secondary">Cancel</button>
        <button type="submit" disabled={loading} className="btn-primary min-w-32">
          {loading ? (
            <span className="flex items-center gap-2 justify-center">
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              Saving...
            </span>
          ) : existingRecipe ? 'Update Recipe' : 'Submit Recipe'}
        </button>
      </div>
    </form>
  );
};

export default RecipeForm;
