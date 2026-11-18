import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { adminLogin, clearError } from '../../redux/slices/authSlice';
import toast from 'react-hot-toast';

const AdminLogin = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error, isAuthenticated, user } = useSelector(state => state.auth);
  const [form, setForm] = useState({ email: '', password: '' });

  useEffect(() => {
    if (isAuthenticated && user?.role === 'admin') navigate('/admin');
    return () => dispatch(clearError());
  }, [isAuthenticated]);

  useEffect(() => {
    if (error) { toast.error(error); dispatch(clearError()); }
  }, [error]);

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(adminLogin(form));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-orange-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-3xl p-8 shadow-2xl animate-slide-up">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-amber-400 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-warm">
              <span className="text-3xl">🛠️</span>
            </div>
            <h1 className="font-display text-3xl font-bold text-gray-900">Admin Access</h1>
            <p className="text-gray-500 mt-2">Restricted to administrators only</p>
          </div>

          <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-6 text-sm text-amber-800">
            <strong>⚠️ Authorized Personnel Only</strong>
            <p className="mt-1">This area is restricted to system administrators.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="label">Admin Email</label>
              <input
                type="email" placeholder="admin@culinaryhub.com" required
                value={form.email} onChange={e => setForm(p => ({ ...p, email: e.target.value }))}
                className="input-field"
              />
            </div>
            <div>
              <label className="label">Admin Password</label>
              <input
                type="password" placeholder="Enter admin password" required
                value={form.password} onChange={e => setForm(p => ({ ...p, password: e.target.value }))}
                className="input-field"
              />
            </div>

            <button type="submit" disabled={loading} className="w-full py-3.5 bg-gradient-to-r from-gray-800 to-gray-700 text-white font-bold rounded-xl hover:from-gray-700 hover:to-gray-600 transition-all">
              {loading ? (
                <span className="flex items-center gap-2 justify-center">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Authenticating...
                </span>
              ) : '🔐 Sign In as Admin'}
            </button>
          </form>

          <p className="text-center text-sm text-gray-500 mt-6">
            <Link to="/login" className="text-orange-600 hover:text-orange-700">← Back to User Login</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
