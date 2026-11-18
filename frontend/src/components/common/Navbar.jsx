import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../../redux/slices/authSlice';

const Navbar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { user, isAuthenticated } = useSelector(state => state.auth);
  const [menuOpen, setMenuOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
    setProfileOpen(false);
  };

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50 border-b-2 border-orange-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <div className="w-9 h-9 bg-gradient-to-br from-orange-500 to-amber-400 rounded-xl flex items-center justify-center shadow-md group-hover:shadow-lg transition-shadow">
              <span className="text-white text-lg">🍳</span>
            </div>
            <span className="font-display font-bold text-xl gradient-text hidden sm:block">
              CulinaryHub
            </span>
          </Link>

          {/* Desktop Nav Links */}
          <div className="hidden md:flex items-center gap-1">
            <Link to="/" className={`px-4 py-2 rounded-lg font-medium text-sm transition-all ${isActive('/') ? 'bg-orange-100 text-orange-700' : 'text-gray-600 hover:bg-orange-50 hover:text-orange-600'}`}>
              Home
            </Link>
            <Link to="/recipes" className={`px-4 py-2 rounded-lg font-medium text-sm transition-all ${isActive('/recipes') ? 'bg-orange-100 text-orange-700' : 'text-gray-600 hover:bg-orange-50 hover:text-orange-600'}`}>
              Recipes
            </Link>
            {isAuthenticated && (
              <>
                <Link to="/dashboard" className={`px-4 py-2 rounded-lg font-medium text-sm transition-all ${isActive('/dashboard') ? 'bg-orange-100 text-orange-700' : 'text-gray-600 hover:bg-orange-50 hover:text-orange-600'}`}>
                  My Recipes
                </Link>
                <Link to="/submit-recipe" className="btn-primary text-sm py-2 px-4 ml-2">
                  + Submit Recipe
                </Link>
              </>
            )}
          </div>

          {/* Right Side */}
          <div className="flex items-center gap-3">
            {isAuthenticated ? (
              <div className="relative">
                <button
                  onClick={() => setProfileOpen(!profileOpen)}
                  className="flex items-center gap-2 px-3 py-2 rounded-xl hover:bg-orange-50 transition-colors"
                >
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-orange-400 to-amber-400 flex items-center justify-center text-white font-bold text-sm overflow-hidden">
                    {user?.profileImage ? (
                      <img src={`http://localhost:5000${user.profileImage}`} alt="" className="w-full h-full object-cover" />
                    ) : (
                      user?.name?.charAt(0).toUpperCase()
                    )}
                  </div>
                  <span className="hidden md:block text-sm font-medium text-gray-700">{user?.name?.split(' ')[0]}</span>
                  <svg className="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                {profileOpen && (
                  <div className="absolute right-0 mt-2 w-52 bg-white rounded-2xl shadow-xl border border-orange-100 py-2 z-50 animate-fade-in">
                    <div className="px-4 py-2 border-b border-orange-50">
                      <p className="font-semibold text-gray-800 text-sm">{user?.name}</p>
                      <p className="text-xs text-gray-500">{user?.email}</p>
                      {user?.role === 'admin' && (
                        <span className="text-xs bg-orange-100 text-orange-700 px-2 py-0.5 rounded-full font-medium">Admin</span>
                      )}
                    </div>
                    {user?.role === 'admin' ? (
                      <Link to="/admin" onClick={() => setProfileOpen(false)} className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-orange-50 hover:text-orange-600 transition-colors">
                        <span>🛠️</span> Admin Dashboard
                      </Link>
                    ) : (
                      <>
                        <Link to="/profile" onClick={() => setProfileOpen(false)} className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-orange-50 hover:text-orange-600 transition-colors">
                          <span>👤</span> My Profile
                        </Link>
                        <Link to="/dashboard" onClick={() => setProfileOpen(false)} className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-orange-50 hover:text-orange-600 transition-colors">
                          <span>📋</span> My Recipes
                        </Link>
                        <Link to="/bookmarks" onClick={() => setProfileOpen(false)} className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-orange-50 hover:text-orange-600 transition-colors">
                          <span>🔖</span> Bookmarks
                        </Link>
                      </>
                    )}
                    <div className="border-t border-orange-50 mt-1 pt-1">
                      <button onClick={handleLogout} className="flex items-center gap-2 w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors">
                        <span>🚪</span> Sign Out
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link to="/login" className="btn-secondary text-sm py-2 px-4">Login</Link>
                <Link to="/register" className="btn-primary text-sm py-2 px-4">Sign Up</Link>
              </div>
            )}

            {/* Mobile menu button */}
            <button className="md:hidden p-2 rounded-lg text-gray-600 hover:bg-orange-50" onClick={() => setMenuOpen(!menuOpen)}>
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                {menuOpen ? <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /> :
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {menuOpen && (
          <div className="md:hidden py-3 border-t border-orange-100 animate-fade-in">
            <Link to="/" className="block px-4 py-2 text-sm text-gray-700 hover:bg-orange-50 rounded-lg" onClick={() => setMenuOpen(false)}>Home</Link>
            <Link to="/recipes" className="block px-4 py-2 text-sm text-gray-700 hover:bg-orange-50 rounded-lg" onClick={() => setMenuOpen(false)}>Recipes</Link>
            {isAuthenticated && (
              <>
                <Link to="/dashboard" className="block px-4 py-2 text-sm text-gray-700 hover:bg-orange-50 rounded-lg" onClick={() => setMenuOpen(false)}>My Recipes</Link>
                <Link to="/submit-recipe" className="block px-4 py-2 text-sm text-orange-600 font-medium hover:bg-orange-50 rounded-lg" onClick={() => setMenuOpen(false)}>+ Submit Recipe</Link>
              </>
            )}
          </div>
        )}
      </div>

      {/* Click outside to close */}
      {(profileOpen || menuOpen) && (
        <div className="fixed inset-0 z-40" onClick={() => { setProfileOpen(false); setMenuOpen(false); }} />
      )}
    </nav>
  );
};

export default Navbar;
