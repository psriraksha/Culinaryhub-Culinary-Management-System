import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchRecipe, clearCurrentRecipe } from '../../redux/slices/recipeSlice';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import api from '../../utils/api';
import toast from 'react-hot-toast';

const StarInput = ({ value, onChange }) => (
  <div className="flex gap-1">
    {[1, 2, 3, 4, 5].map(i => (
      <button
        key={i} type="button" onClick={() => onChange(i)}
        className={`text-2xl transition-colors star ${i <= value ? 'filled text-amber-400' : 'text-gray-300 hover:text-amber-300'}`}
      >★</button>
    ))}
  </div>
);

const RecipeDetail = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { currentRecipe: recipe, comments, loading } = useSelector(state => state.recipes);
  const { user, isAuthenticated } = useSelector(state => state.auth);

  const [comment, setComment] = useState('');
  const [rating, setRating] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const [bookmarked, setBookmarked] = useState(false);
  const [activeTab, setActiveTab] = useState('ingredients');

  useEffect(() => {
    dispatch(fetchRecipe(id));
    return () => dispatch(clearCurrentRecipe());
  }, [id, dispatch]);

  useEffect(() => {
    if (user?.bookmarks && recipe) {
      setBookmarked(user.bookmarks.some(b => (typeof b === 'object' ? b._id : b) === recipe._id));
    }
  }, [user, recipe]);

  const handleBookmark = async () => {
    if (!isAuthenticated) return toast.error('Please login to bookmark recipes');
    try {
      const res = await api.post(`/recipes/${recipe._id}/bookmark`);
      setBookmarked(res.data.bookmarked);
      toast.success(res.data.message);
    } catch { toast.error('Failed to bookmark'); }
  };

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    if (!isAuthenticated) return toast.error('Please login to comment');
    setSubmitting(true);
    try {
      await api.post(`/comments/${recipe._id}`, { comment, rating: rating || undefined });
      toast.success('Comment added!');
      setComment('');
      setRating(0);
      dispatch(fetchRecipe(id));
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to add comment');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteComment = async (commentId) => {
    if (!window.confirm('Delete this comment?')) return;
    try {
      await api.delete(`/comments/${commentId}`);
      toast.success('Comment deleted');
      dispatch(fetchRecipe(id));
    } catch { toast.error('Failed to delete comment'); }
  };

  if (loading) return <LoadingSpinner text="Loading recipe..." />;
  if (!recipe) return (
    <div className="text-center py-20">
      <div className="text-6xl mb-4">😕</div>
      <h2 className="text-2xl font-bold text-gray-700 mb-4">Recipe not found</h2>
      <Link to="/recipes" className="btn-primary">Browse Recipes</Link>
    </div>
  );

  return (
    <div className="page-container max-w-5xl">
      {/* Hero */}
      <div className="relative rounded-3xl overflow-hidden mb-8 shadow-warm-lg">
        {recipe.image ? (
          <img src={`http://localhost:5000${recipe.image}`} alt={recipe.title} className="w-full h-80 object-cover" />
        ) : (
          <div className="w-full h-80 bg-gradient-to-br from-orange-200 to-amber-200 flex items-center justify-center">
            <span className="text-8xl">🍽️</span>
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-8">
          <div className="flex flex-wrap gap-2 mb-3">
            <span className="bg-orange-500 text-white text-xs font-bold px-3 py-1 rounded-full">{recipe.category}</span>
            <span className="bg-white/20 backdrop-blur text-white text-xs font-medium px-3 py-1 rounded-full">{recipe.difficulty}</span>
            {recipe.cuisine && <span className="bg-white/20 backdrop-blur text-white text-xs font-medium px-3 py-1 rounded-full">{recipe.cuisine}</span>}
          </div>
          <h1 className="font-display text-4xl font-bold text-white mb-2 drop-shadow-lg">{recipe.title}</h1>
          <div className="flex items-center gap-4 text-white/90 text-sm">
            <span className="flex items-center gap-1">
              {[1,2,3,4,5].map(i => <span key={i} className={i <= Math.round(recipe.averageRating) ? 'text-amber-400' : 'text-white/40'}>★</span>)}
              <span className="ml-1">{recipe.averageRating?.toFixed(1) || '0.0'} ({recipe.totalRatings || 0})</span>
            </span>
            <span>👁 {recipe.views} views</span>
          </div>
        </div>
        <div className="absolute top-4 right-4 flex gap-2">
          <button
            onClick={handleBookmark}
            className={`w-10 h-10 rounded-full flex items-center justify-center backdrop-blur transition-all ${bookmarked ? 'bg-orange-500 text-white' : 'bg-white/20 text-white hover:bg-white/40'}`}
          >
            {bookmarked ? '🔖' : '🏷️'}
          </button>
          {(user?._id === recipe.author?._id || user?.role === 'admin') && (
            <Link to={`/recipes/${recipe._id}/edit`} className="w-10 h-10 rounded-full bg-white/20 backdrop-blur text-white flex items-center justify-center hover:bg-white/40">
              ✏️
            </Link>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2">
          <p className="text-gray-600 text-lg leading-relaxed mb-6">{recipe.description}</p>

          {/* Tabs */}
          <div className="flex gap-2 mb-6 bg-orange-50 p-1.5 rounded-2xl">
            {[['ingredients', '🥕 Ingredients'], ['steps', '👨‍🍳 Instructions']].map(([tab, label]) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`flex-1 py-2.5 rounded-xl text-sm font-semibold transition-all ${activeTab === tab ? 'bg-white text-orange-600 shadow-md' : 'text-gray-500 hover:text-orange-500'}`}
              >
                {label}
              </button>
            ))}
          </div>

          {activeTab === 'ingredients' && (
            <div className="card p-6 animate-fade-in">
              <h2 className="font-display text-xl font-bold text-gray-800 mb-4">Ingredients</h2>
              <ul className="space-y-2">
                {recipe.ingredients?.map((ing, i) => (
                  <li key={i} className="flex items-center gap-3 py-2 border-b border-orange-50 last:border-0">
                    <span className="w-6 h-6 bg-orange-100 text-orange-600 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0">{i + 1}</span>
                    <span className="text-gray-700">
                      <strong>{ing.amount} {ing.unit}</strong> {ing.name}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {activeTab === 'steps' && (
            <div className="card p-6 animate-fade-in">
              <h2 className="font-display text-xl font-bold text-gray-800 mb-4">Instructions</h2>
              <ol className="space-y-4">
                {recipe.steps?.map((step, i) => (
                  <li key={i} className="flex gap-4">
                    <div className="w-8 h-8 bg-gradient-to-br from-orange-500 to-amber-400 text-white rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0">
                      {step.stepNumber || i + 1}
                    </div>
                    <div className="flex-1 pt-1">
                      <p className="text-gray-700 leading-relaxed">{step.instruction}</p>
                    </div>
                  </li>
                ))}
              </ol>
            </div>
          )}

          {/* Tags */}
          {recipe.tags?.length > 0 && (
            <div className="mt-6 flex flex-wrap gap-2">
              {recipe.tags.map(tag => (
                <span key={tag} className="bg-orange-100 text-orange-700 text-xs font-medium px-3 py-1.5 rounded-full">
                  #{tag}
                </span>
              ))}
            </div>
          )}

          {/* Comments */}
          <div className="mt-8">
            <h2 className="font-display text-2xl font-bold text-gray-800 mb-6">
              Reviews ({comments.length})
            </h2>

            {isAuthenticated ? (
              <form onSubmit={handleCommentSubmit} className="card p-5 mb-6">
                <h3 className="font-semibold text-gray-700 mb-3">Leave a Review</h3>
                <div className="mb-3">
                  <label className="label">Your Rating</label>
                  <StarInput value={rating} onChange={setRating} />
                </div>
                <textarea
                  value={comment} onChange={e => setComment(e.target.value)}
                  placeholder="Share your thoughts about this recipe..."
                  rows={3} required className="input-field resize-none mb-3"
                />
                <button type="submit" disabled={submitting} className="btn-primary text-sm">
                  {submitting ? 'Posting...' : 'Post Review'}
                </button>
              </form>
            ) : (
              <div className="bg-orange-50 rounded-2xl p-5 mb-6 text-center">
                <p className="text-gray-600 mb-3">Want to leave a review?</p>
                <Link to="/login" className="btn-primary text-sm">Sign In to Review</Link>
              </div>
            )}

            <div className="space-y-4">
              {comments.map(c => (
                <div key={c._id} className="card p-5">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-gradient-to-br from-orange-300 to-amber-300 flex items-center justify-center text-white font-bold overflow-hidden">
                        {c.user?.profileImage ? (
                          <img src={`http://localhost:5000${c.user.profileImage}`} alt="" className="w-full h-full object-cover" />
                        ) : c.user?.name?.charAt(0)}
                      </div>
                      <div>
                        <p className="font-semibold text-gray-800 text-sm">{c.user?.name}</p>
                        <div className="flex items-center gap-2">
                          {c.rating && (
                            <div className="flex">
                              {[1,2,3,4,5].map(i => <span key={i} className={`text-xs ${i <= c.rating ? 'text-amber-400' : 'text-gray-200'}`}>★</span>)}
                            </div>
                          )}
                          <span className="text-xs text-gray-400">{new Date(c.createdAt).toLocaleDateString()}</span>
                          {c.isEdited && <span className="text-xs text-gray-400">(edited)</span>}
                        </div>
                      </div>
                    </div>
                    {(user?._id === c.user?._id || user?.role === 'admin') && (
                      <button onClick={() => handleDeleteComment(c._id)} className="text-xs text-red-400 hover:text-red-600 px-2 py-1 rounded hover:bg-red-50">Delete</button>
                    )}
                  </div>
                  <p className="text-gray-600 text-sm leading-relaxed">{c.comment}</p>
                </div>
              ))}
              {comments.length === 0 && (
                <div className="text-center py-8 text-gray-400">
                  <div className="text-4xl mb-2">💬</div>
                  <p>No reviews yet. Be the first to review!</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-5">
          <div className="card p-5">
            <h3 className="font-display font-bold text-lg text-gray-800 mb-4">Recipe Info</h3>
            <div className="space-y-3">
              {[
                ['⏱ Prep Time', `${recipe.cookingTime?.prep || 0} min`],
                ['🔥 Cook Time', `${recipe.cookingTime?.cook || 0} min`],
                ['⌚ Total Time', `${recipe.cookingTime?.total || 0} min`],
                ['👥 Servings', `${recipe.servings || 4} people`],
                ['📊 Difficulty', recipe.difficulty || 'Medium'],
              ].map(([label, value]) => (
                <div key={label} className="flex justify-between items-center py-2 border-b border-orange-50 last:border-0">
                  <span className="text-gray-500 text-sm">{label}</span>
                  <span className="font-semibold text-gray-800 text-sm">{value}</span>
                </div>
              ))}
            </div>
          </div>

          {recipe.author && (
            <div className="card p-5">
              <h3 className="font-display font-bold text-lg text-gray-800 mb-4">Chef</h3>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-orange-300 to-amber-300 flex items-center justify-center text-white font-bold text-lg overflow-hidden">
                  {recipe.author.profileImage ? (
                    <img src={`http://localhost:5000${recipe.author.profileImage}`} alt="" className="w-full h-full object-cover" />
                  ) : recipe.author.name?.charAt(0)}
                </div>
                <div>
                  <p className="font-semibold text-gray-800">{recipe.author.name}</p>
                  {recipe.author.bio && <p className="text-xs text-gray-500 mt-0.5">{recipe.author.bio}</p>}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default RecipeDetail;
