import React from 'react';
import { Link } from 'react-router-dom';

const StarRating = ({ rating, size = 'sm' }) => {
  const s = size === 'sm' ? 'text-sm' : 'text-base';
  return (
    <div className={`flex items-center gap-0.5 ${s}`}>
      {[1, 2, 3, 4, 5].map(i => (
        <span key={i} className={i <= Math.round(rating) ? 'text-amber-400' : 'text-gray-200'}>★</span>
      ))}
      <span className="text-gray-500 text-xs ml-1">{rating > 0 ? rating.toFixed(1) : 'New'}</span>
    </div>
  );
};

const RecipeCard = ({ recipe, showStatus = false }) => {
  const statusColors = {
    Pending: 'badge-pending',
    Approved: 'badge-approved',
    Rejected: 'badge-rejected',
  };

  const difficultyColors = {
    Easy: 'bg-green-100 text-green-700',
    Medium: 'bg-amber-100 text-amber-700',
    Hard: 'bg-red-100 text-red-700',
  };

  return (
    <div className="card recipe-card group cursor-pointer hover:-translate-y-1 transition-all duration-300">
      <Link to={`/recipes/${recipe._id}`}>
        <div className="relative overflow-hidden h-48">
          {recipe.image ? (
            <img
              src={`http://localhost:5000${recipe.image}`}
              alt={recipe.title}
              className="recipe-card-img"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-orange-100 to-amber-100 flex items-center justify-center">
              <span className="text-5xl">🍽️</span>
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
          <div className="absolute top-3 left-3 flex gap-2">
            <span className="bg-white/90 backdrop-blur-sm text-orange-700 text-xs font-semibold px-2.5 py-1 rounded-full">
              {recipe.category}
            </span>
            {recipe.difficulty && (
              <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${difficultyColors[recipe.difficulty] || 'bg-gray-100 text-gray-700'}`}>
                {recipe.difficulty}
              </span>
            )}
          </div>
          {showStatus && (
            <div className="absolute top-3 right-3">
              <span className={statusColors[recipe.approvalStatus]}>
                {recipe.approvalStatus}
              </span>
            </div>
          )}
          <div className="absolute bottom-3 left-3 right-3">
            <h3 className="text-white font-display font-bold text-lg leading-tight line-clamp-2 drop-shadow">
              {recipe.title}
            </h3>
          </div>
        </div>
      </Link>

      <div className="p-4">
        <p className="text-gray-500 text-sm line-clamp-2 mb-3">{recipe.description}</p>

        <div className="flex items-center justify-between mb-3">
          <StarRating rating={recipe.averageRating || 0} />
          <span className="text-xs text-gray-400">{recipe.totalRatings || 0} reviews</span>
        </div>

        <div className="flex items-center justify-between pt-3 border-t border-orange-50">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-full bg-gradient-to-br from-orange-300 to-amber-300 flex items-center justify-center text-white text-xs font-bold overflow-hidden">
              {recipe.author?.profileImage ? (
                <img src={`http://localhost:5000${recipe.author.profileImage}`} alt="" className="w-full h-full object-cover" />
              ) : (
                recipe.author?.name?.charAt(0) || '?'
              )}
            </div>
            <span className="text-xs text-gray-500 font-medium">{recipe.author?.name || 'Unknown'}</span>
          </div>
          <div className="flex items-center gap-3 text-xs text-gray-400">
            {recipe.cookingTime?.total > 0 && (
              <span className="flex items-center gap-1">
                <span>⏱</span> {recipe.cookingTime.total}m
              </span>
            )}
            {recipe.servings && (
              <span className="flex items-center gap-1">
                <span>👥</span> {recipe.servings}
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default RecipeCard;
