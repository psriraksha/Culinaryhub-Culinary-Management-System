import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchMyRecipes, deleteRecipe } from '../../redux/slices/recipeSlice';
import RecipeCard from '../../components/recipe/RecipeCard';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import toast from 'react-hot-toast';

const FILTERS = ['All', 'Pending', 'Approved', 'Rejected'];

const Dashboard = () => {
  const dispatch = useDispatch();
  const { myRecipes, loading } = useSelector(state => state.recipes);
  const { user } = useSelector(state => state.auth);
  const [filter, setFilter] = useState('All');

  useEffect(() => {
    dispatch(fetchMyRecipes());
  }, [dispatch]);

  const filtered = filter === 'All' ? myRecipes : myRecipes.filter(r => r.approvalStatus === filter);

  const counts = {
    All: myRecipes.length,
    Pending: myRecipes.filter(r => r.approvalStatus === 'Pending').length,
    Approved: myRecipes.filter(r => r.approvalStatus === 'Approved').length,
    Rejected: myRecipes.filter(r => r.approvalStatus === 'Rejected').length,
  };

  const handleDelete = async (id, title) => {
    if (!window.confirm(`Delete "${title}"?`)) return;
    try {
      await dispatch(deleteRecipe(id)).unwrap();
      toast.success('Recipe deleted');
    } catch (err) {
      toast.error(err);
    }
  };

  return (
    <div className="page-container">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="section-title mb-1">My Recipes</h1>
          <p className="text-gray-500">Welcome back, <strong>{user?.name?.split(' ')[0]}</strong>! Manage your recipe submissions.</p>
        </div>
        <Link to="/submit-recipe" className="btn-primary">
          + New Recipe
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {[
          { label: 'Total', count: counts.All, color: 'from-orange-400 to-amber-400', emoji: '🍽️' },
          { label: 'Pending', count: counts.Pending, color: 'from-amber-400 to-yellow-400', emoji: '⏳' },
          { label: 'Approved', count: counts.Approved, color: 'from-green-400 to-emerald-400', emoji: '✅' },
          { label: 'Rejected', count: counts.Rejected, color: 'from-red-400 to-rose-400', emoji: '❌' },
        ].map(stat => (
          <div key={stat.label} className={`bg-gradient-to-br ${stat.color} rounded-2xl p-4 text-white shadow-md`}>
            <div className="text-2xl mb-1">{stat.emoji}</div>
            <div className="text-3xl font-bold">{stat.count}</div>
            <div className="text-white/80 text-sm">{stat.label}</div>
          </div>
        ))}
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-2 mb-6">
        {FILTERS.map(f => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all ${
              filter === f ? 'bg-orange-500 text-white shadow-sm' : 'bg-white text-gray-600 hover:bg-orange-50 border border-orange-100'
            }`}
          >
            {f} {counts[f] > 0 && <span className="ml-1 text-xs">({counts[f]})</span>}
          </button>
        ))}
      </div>

      {loading ? (
        <LoadingSpinner />
      ) : filtered.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-3xl shadow-sm">
          <div className="text-6xl mb-4">🍳</div>
          <h3 className="text-xl font-semibold text-gray-700 mb-2">
            {filter === 'All' ? 'No recipes yet' : `No ${filter} recipes`}
          </h3>
          <p className="text-gray-500 mb-6">
            {filter === 'All' ? 'Share your first recipe with the community!' : `You have no ${filter.toLowerCase()} recipes.`}
          </p>
          {filter === 'All' && <Link to="/submit-recipe" className="btn-primary">Submit Your First Recipe</Link>}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map(recipe => (
            <div key={recipe._id} className="relative">
              <RecipeCard recipe={recipe} showStatus={true} />
              <div className="flex gap-2 p-4 pt-0 bg-white -mt-1 rounded-b-2xl border-t border-orange-50">
                <Link
                  to={`/recipes/${recipe._id}/edit`}
                  className="flex-1 text-center py-2 text-sm font-semibold text-orange-600 border border-orange-200 rounded-xl hover:bg-orange-50 transition-colors"
                >
                  ✏️ Edit
                </Link>
                <button
                  onClick={() => handleDelete(recipe._id, recipe.title)}
                  className="flex-1 py-2 text-sm font-semibold text-red-500 border border-red-200 rounded-xl hover:bg-red-50 transition-colors"
                >
                  🗑️ Delete
                </button>
              </div>
              {recipe.approvalStatus === 'Rejected' && recipe.rejectionReason && (
                <div className="mx-1 mb-2 bg-red-50 border border-red-100 rounded-xl p-3 text-xs text-red-700">
                  <strong>Rejection reason:</strong> {recipe.rejectionReason}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Dashboard;
