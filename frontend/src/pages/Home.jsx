import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchRecipes } from '../redux/slices/recipeSlice';
import RecipeCard from '../components/recipe/RecipeCard';
import LoadingSpinner from '../components/common/LoadingSpinner';

const CATEGORIES = [
  { name: 'Breakfast', emoji: '🌅' },
  { name: 'Lunch', emoji: '🌮' },
  { name: 'Dinner', emoji: '🍝' },
  { name: 'Dessert', emoji: '🍰' },
  { name: 'Snack', emoji: '🥨' },
  { name: 'Beverage', emoji: '🥤' },
];

const Home = () => {
  const dispatch = useDispatch();
  const { recipes, loading } = useSelector(state => state.recipes);

  useEffect(() => {
    dispatch(fetchRecipes({ limit: 8, sort: 'rating' }));
  }, [dispatch]);

  return (
    <div>
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-orange-500 via-orange-400 to-amber-400 text-white">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 text-8xl">🍳</div>
          <div className="absolute top-20 right-20 text-6xl">🥘</div>
          <div className="absolute bottom-10 left-1/4 text-7xl">🌿</div>
          <div className="absolute bottom-20 right-10 text-5xl">🍋</div>
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 relative">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full text-sm font-medium mb-6">
              <span>✨</span> Community Recipe Platform
            </div>
            <h1 className="font-display text-5xl md:text-6xl font-extrabold leading-tight mb-6">
              Share Your <br />
              <span className="text-amber-200">Culinary</span> Magic
            </h1>
            <p className="text-white/90 text-lg mb-8 leading-relaxed">
              Discover thousands of recipes from passionate home cooks. 
              Submit your own creations and inspire food lovers worldwide.
            </p>
            <div className="flex gap-4 flex-wrap">
              <Link to="/recipes" className="bg-white text-orange-600 font-bold px-8 py-4 rounded-2xl hover:bg-orange-50 transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5">
                Browse Recipes
              </Link>
              <Link to="/register" className="bg-white/20 backdrop-blur-sm border-2 border-white/40 text-white font-bold px-8 py-4 rounded-2xl hover:bg-white/30 transition-all">
                Join for Free
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Banner */}
      <section className="bg-white border-b border-orange-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="grid grid-cols-3 gap-8 text-center">
            {[['🍽️', '500+', 'Recipes'], ['👨‍🍳', '200+', 'Chefs'], ['⭐', '4.8', 'Avg Rating']].map(([emoji, num, label]) => (
              <div key={label}>
                <div className="text-2xl mb-1">{emoji}</div>
                <div className="text-2xl font-bold gradient-text">{num}</div>
                <div className="text-sm text-gray-500">{label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="page-container">
        <div className="text-center mb-8">
          <h2 className="section-title mb-2">Browse by Category</h2>
          <p className="text-gray-500">Find exactly what you're in the mood for</p>
        </div>
        <div className="grid grid-cols-3 md:grid-cols-6 gap-4">
          {CATEGORIES.map(cat => (
            <Link
              key={cat.name}
              to={`/recipes?category=${cat.name}`}
              className="group bg-white rounded-2xl p-4 text-center shadow-sm hover:shadow-md border-2 border-orange-50 hover:border-orange-300 transition-all duration-200 hover:-translate-y-1"
            >
              <div className="text-3xl mb-2 group-hover:scale-110 transition-transform duration-200">{cat.emoji}</div>
              <p className="text-sm font-semibold text-gray-700 group-hover:text-orange-600 transition-colors">{cat.name}</p>
            </Link>
          ))}
        </div>
      </section>

      {/* Featured Recipes */}
      <section className="page-container pt-0">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="section-title">Top Rated Recipes</h2>
            <p className="text-gray-500 text-sm mt-1">Loved by our community</p>
          </div>
          <Link to="/recipes" className="text-orange-600 font-semibold text-sm hover:text-orange-700 flex items-center gap-1">
            View All <span>→</span>
          </Link>
        </div>
        {loading ? (
          <LoadingSpinner />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {recipes.slice(0, 8).map(recipe => (
              <RecipeCard key={recipe._id} recipe={recipe} />
            ))}
          </div>
        )}
        {!loading && recipes.length === 0 && (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">🍽️</div>
            <h3 className="text-xl font-semibold text-gray-700 mb-2">No Recipes Yet</h3>
            <p className="text-gray-500 mb-6">Be the first to share a delicious recipe!</p>
            <Link to="/submit-recipe" className="btn-primary">Submit First Recipe</Link>
          </div>
        )}
      </section>

      {/* CTA Banner */}
      <section className="bg-gradient-to-r from-orange-500 to-amber-500 mx-4 md:mx-8 rounded-3xl p-12 text-center text-white mb-16">
        <div className="text-4xl mb-4">👨‍🍳</div>
        <h2 className="font-display text-3xl font-bold mb-3">Ready to Share Your Recipe?</h2>
        <p className="text-white/90 mb-6 max-w-md mx-auto">
          Join our growing community of food enthusiasts and share your favorite recipes with the world.
        </p>
        <Link to="/submit-recipe" className="bg-white text-orange-600 font-bold px-8 py-3 rounded-xl hover:bg-orange-50 transition-all shadow-lg">
          Submit a Recipe
        </Link>
      </section>
    </div>
  );
};

export default Home;
