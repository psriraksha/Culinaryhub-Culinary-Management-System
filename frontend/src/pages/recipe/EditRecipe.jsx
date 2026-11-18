import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchRecipe } from '../../redux/slices/recipeSlice';
import RecipeForm from '../../components/recipe/RecipeForm';
import LoadingSpinner from '../../components/common/LoadingSpinner';

const EditRecipe = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const { currentRecipe, loading } = useSelector(state => state.recipes);

  useEffect(() => {
    dispatch(fetchRecipe(id));
  }, [id, dispatch]);

  if (loading) return <LoadingSpinner text="Loading recipe..." />;

  return (
    <div className="page-container max-w-3xl">
      <div className="mb-8">
        <h1 className="section-title mb-2">Edit Recipe</h1>
        <p className="text-gray-500">Update your recipe details. Edited recipes will be re-submitted for review.</p>
      </div>
      <div className="card p-8">
        {currentRecipe ? <RecipeForm existingRecipe={currentRecipe} /> : <p className="text-gray-500">Recipe not found.</p>}
      </div>
    </div>
  );
};

export default EditRecipe;
