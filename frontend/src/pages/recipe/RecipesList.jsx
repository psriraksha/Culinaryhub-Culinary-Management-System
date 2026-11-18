import React, { useEffect, useState, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useSearchParams } from 'react-router-dom';
import { fetchRecipes } from '../../redux/slices/recipeSlice';
import RecipeCard from '../../components/recipe/RecipeCard';
import LoadingSpinner from '../../components/common/LoadingSpinner';

const CATEGORIES = ['All', 'Breakfast', 'Lunch', 'Dinner', 'Snack', 'Dessert', 'Beverage', 'Appetizer', 'Soup', 'Salad', 'Bread', 'Other'];
const DIFFICULTIES = ['All', 'Easy', 'Medium', 'Hard'];
const SORTS = [
  { value: 'newest', label: 'Newest First' },
  { value: 'rating', label: 'Top Rated' },
  { value: 'popular', label: 'Most Popular' },
  { value: 'oldest', label: 'Oldest First' },
];

const RecipesList = () => {
  const dispatch = useDispatch();
  const [searchParams, setSearchParams] = useSearchParams();
  const { recipes, loading, pagination } = useSelector(state => state.recipes);

  const [search, setSearch] = useState(searchParams.get('search') || '');
  const [category, setCategory] = useState(searchParams.get('category') || '');
  const [difficulty, setDifficulty] = useState('');
  const [sort, setSort] = useState('newest');
  const [page, setPage] = useState(1);

  const loadRecipes = useCallback(() => {
    const params = { page, limit: 12, sort };
    if (search) params.search = search;
    if (category && category !== 'All') params.category = category;
    if (difficulty && difficulty !== 'All') params.difficulty = difficulty;
    dispatch(fetchRecipes(params));
  }, [dispatch, search, category, difficulty, sort, page]);

  useEffect(() => { loadRecipes(); }, [loadRecipes]);

  const handleSearch = (e) => {
    e.preventDefault();
    setPage(1);
    loadRecipes();
  };

  return (
    <div className="page-container">
      {/* Header */}
      <div className="mb-8">
        <h1 className="section-title mb-2">Explore Recipes</h1>
        <p className="text-gray-500">Discover delicious recipes from our community</p>
      </div>

      {/* Search & Filters */}
      <div className="bg-white rounded-2xl p-5 shadow-sm border border-orange-100 mb-8">
        <form onSubmit={handleSearch} className="flex gap-3 mb-4">
          <div className="flex-1 relative">
            <span className="absolute left-4 top-3.5 text-gray-400 text-lg">🔍</span>
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search recipes by name, ingredient..."
              className="input-field pl-11"
            />
          </div>
          <button type="submit" className="btn-primary px-6">Search</button>
        </form>

        <div className="flex gap-4 flex-wrap items-center">
          <div className="flex items-center gap-2">
            <span className="text-sm font-semibold text-gray-600">Category:</span>
            <div className="flex gap-1 flex-wrap">
              {CATEGORIES.map(cat => (
                <button
                  key={cat}
                  onClick={() => { setCategory(cat === 'All' ? '' : cat); setPage(1); }}
                  className={`text-xs px-3 py-1.5 rounded-full font-medium transition-all ${
                    (category === cat) || (cat === 'All' && !category)
                      ? 'bg-orange-500 text-white shadow-sm'
                      : 'bg-orange-50 text-gray-600 hover:bg-orange-100'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="flex gap-4 mt-3 flex-wrap">
          <select
            value={difficulty}
            onChange={e => { setDifficulty(e.target.value); setPage(1); }}
            className="text-sm border border-orange-200 rounded-xl px-3 py-2 focus:outline-none focus:border-orange-400 bg-white"
          >
            {DIFFICULTIES.map(d => <option key={d} value={d === 'All' ? '' : d}>{d} Difficulty</option>)}
          </select>
          <select
            value={sort}
            onChange={e => { setSort(e.target.value); setPage(1); }}
            className="text-sm border border-orange-200 rounded-xl px-3 py-2 focus:outline-none focus:border-orange-400 bg-white"
          >
            {SORTS.map(s => <option key={s.value} value={s.value}>{s.label}</option>)}
          </select>
          {(search || category || difficulty) && (
            <button
              onClick={() => { setSearch(''); setCategory(''); setDifficulty(''); setPage(1); }}
              className="text-sm text-red-500 hover:text-red-700 font-medium px-3 py-2 rounded-xl hover:bg-red-50"
            >
              ✕ Clear filters
            </button>
          )}
        </div>
      </div>

      {/* Results */}
      {loading ? (
        <LoadingSpinner text="Finding delicious recipes..." />
      ) : recipes.length === 0 ? (
        <div className="text-center py-20">
          <div className="text-6xl mb-4">🔍</div>
          <h3 className="text-xl font-semibold text-gray-700 mb-2">No recipes found</h3>
          <p className="text-gray-500">Try adjusting your search or filters</p>
        </div>
      ) : (
        <>
          <div className="flex items-center justify-between mb-4">
            <p className="text-sm text-gray-500">
              Showing <strong>{recipes.length}</strong> of <strong>{pagination?.total || 0}</strong> recipes
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {recipes.map(recipe => (
              <RecipeCard key={recipe._id} recipe={recipe} />
            ))}
          </div>

          {/* Pagination */}
          {pagination && pagination.pages > 1 && (
            <div className="flex justify-center gap-2 mt-10">
              <button disabled={page === 1} onClick={() => setPage(p => p - 1)} className="px-4 py-2 rounded-xl border border-orange-200 text-orange-600 disabled:opacity-40 hover:bg-orange-50">← Prev</button>
              {Array.from({ length: pagination.pages }, (_, i) => i + 1).map(p => (
                <button
                  key={p}
                  onClick={() => setPage(p)}
                  className={`w-10 h-10 rounded-xl font-medium ${p === page ? 'bg-orange-500 text-white' : 'border border-orange-200 text-gray-600 hover:bg-orange-50'}`}
                >
                  {p}
                </button>
              ))}
              <button disabled={page === pagination.pages} onClick={() => setPage(p => p + 1)} className="px-4 py-2 rounded-xl border border-orange-200 text-orange-600 disabled:opacity-40 hover:bg-orange-50">Next →</button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default RecipesList;
