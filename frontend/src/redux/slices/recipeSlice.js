import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

export const fetchRecipes = createAsyncThunk('recipes/fetchAll', async (params = {}, { rejectWithValue }) => {
  try {
    const query = new URLSearchParams(params).toString();
    const res = await axios.get(`${API}/recipes?${query}`);
    return res.data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Failed to fetch recipes');
  }
});

export const fetchRecipe = createAsyncThunk('recipes/fetchOne', async (id, { rejectWithValue }) => {
  try {
    const res = await axios.get(`${API}/recipes/${id}`);
    return res.data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Failed to fetch recipe');
  }
});

export const createRecipe = createAsyncThunk('recipes/create', async (formData, { rejectWithValue }) => {
  try {
    const res = await axios.post(`${API}/recipes`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    return res.data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Failed to create recipe');
  }
});

export const updateRecipe = createAsyncThunk('recipes/update', async ({ id, formData }, { rejectWithValue }) => {
  try {
    const res = await axios.put(`${API}/recipes/${id}`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    return res.data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Failed to update recipe');
  }
});

export const deleteRecipe = createAsyncThunk('recipes/delete', async (id, { rejectWithValue }) => {
  try {
    await axios.delete(`${API}/recipes/${id}`);
    return id;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Failed to delete recipe');
  }
});

export const fetchMyRecipes = createAsyncThunk('recipes/fetchMine', async (params = {}, { rejectWithValue }) => {
  try {
    const query = new URLSearchParams(params).toString();
    const res = await axios.get(`${API}/recipes/my-recipes?${query}`);
    return res.data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Failed to fetch your recipes');
  }
});

export const rateRecipe = createAsyncThunk('recipes/rate', async ({ id, rating }, { rejectWithValue }) => {
  try {
    const res = await axios.post(`${API}/recipes/${id}/rate`, { rating });
    return { id, ...res.data };
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Failed to rate recipe');
  }
});

export const toggleBookmark = createAsyncThunk('recipes/bookmark', async (id, { rejectWithValue }) => {
  try {
    const res = await axios.post(`${API}/recipes/${id}/bookmark`);
    return res.data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Failed to bookmark recipe');
  }
});

const recipeSlice = createSlice({
  name: 'recipes',
  initialState: {
    recipes: [],
    currentRecipe: null,
    myRecipes: [],
    comments: [],
    pagination: null,
    loading: false,
    error: null,
    success: null,
  },
  reducers: {
    clearRecipeState: (state) => {
      state.error = null;
      state.success = null;
    },
    clearCurrentRecipe: (state) => {
      state.currentRecipe = null;
      state.comments = [];
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchRecipes.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(fetchRecipes.fulfilled, (state, action) => {
        state.loading = false;
        state.recipes = action.payload.recipes;
        state.pagination = action.payload.pagination;
      })
      .addCase(fetchRecipes.rejected, (state, action) => { state.loading = false; state.error = action.payload; })

      .addCase(fetchRecipe.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(fetchRecipe.fulfilled, (state, action) => {
        state.loading = false;
        state.currentRecipe = action.payload.recipe;
        state.comments = action.payload.comments;
      })
      .addCase(fetchRecipe.rejected, (state, action) => { state.loading = false; state.error = action.payload; })

      .addCase(createRecipe.pending, (state) => { state.loading = true; state.error = null; state.success = null; })
      .addCase(createRecipe.fulfilled, (state, action) => {
        state.loading = false;
        state.success = action.payload.message;
        state.myRecipes.unshift(action.payload.recipe);
      })
      .addCase(createRecipe.rejected, (state, action) => { state.loading = false; state.error = action.payload; })

      .addCase(updateRecipe.pending, (state) => { state.loading = true; state.error = null; state.success = null; })
      .addCase(updateRecipe.fulfilled, (state, action) => {
        state.loading = false;
        state.success = action.payload.message;
        const idx = state.myRecipes.findIndex(r => r._id === action.payload.recipe._id);
        if (idx > -1) state.myRecipes[idx] = action.payload.recipe;
      })
      .addCase(updateRecipe.rejected, (state, action) => { state.loading = false; state.error = action.payload; })

      .addCase(deleteRecipe.fulfilled, (state, action) => {
        state.myRecipes = state.myRecipes.filter(r => r._id !== action.payload);
        state.recipes = state.recipes.filter(r => r._id !== action.payload);
      })

      .addCase(fetchMyRecipes.pending, (state) => { state.loading = true; })
      .addCase(fetchMyRecipes.fulfilled, (state, action) => {
        state.loading = false;
        state.myRecipes = action.payload.recipes;
      })
      .addCase(fetchMyRecipes.rejected, (state, action) => { state.loading = false; state.error = action.payload; });
  }
});

export const { clearRecipeState, clearCurrentRecipe } = recipeSlice.actions;
export default recipeSlice.reducer;
