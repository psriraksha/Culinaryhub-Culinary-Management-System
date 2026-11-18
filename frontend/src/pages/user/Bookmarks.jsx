import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../../utils/api';
import RecipeCard from '../../components/recipe/RecipeCard';
import LoadingSpinner from '../../components/common/LoadingSpinner';

const Bookmarks = () => {
  const [bookmarks, setBookmarks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/users/bookmarks')
      .then(res => setBookmarks(res.data.bookmarks))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="page-container">
      <h1 className="section-title mb-2">My Bookmarks</h1>
      <p className="text-gray-500 mb-8">Recipes you've saved for later</p>

      {loading ? <LoadingSpinner /> : bookmarks.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-3xl shadow-sm">
          <div className="text-6xl mb-4">🔖</div>
          <h3 className="text-xl font-semibold text-gray-700 mb-2">No bookmarks yet</h3>
          <p className="text-gray-500 mb-6">Save recipes you love by clicking the bookmark icon.</p>
          <Link to="/recipes" className="btn-primary">Browse Recipes</Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {bookmarks.map(recipe => <RecipeCard key={recipe._id} recipe={recipe} />)}
        </div>
      )}
    </div>
  );
};

export default Bookmarks;
