import React from 'react';
import RecipeForm from '../../components/recipe/RecipeForm';

const SubmitRecipe = () => (
  <div className="page-container max-w-3xl">
    <div className="mb-8">
      <h1 className="section-title mb-2">Submit a Recipe</h1>
      <p className="text-gray-500">Share your culinary masterpiece with the community. Your recipe will be reviewed before publishing.</p>
    </div>
    <div className="card p-8">
      <RecipeForm />
    </div>
  </div>
);

export default SubmitRecipe;
