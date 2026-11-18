import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../../redux/slices/authSlice';

const navItems = [
  { path: '/admin', label: 'Dashboard', icon: '📊', exact: true },
  { path: '/admin/users', label: 'Users', icon: '👥' },
  { path: '/admin/recipes', label: 'All Recipes', icon: '🍽️' },
  { path: '/admin/pending', label: 'Pending Review', icon: '⏳' },
  { path: '/admin/comments', label: 'Comments', icon: '💬' },
];

const AdminSidebar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector(state => state.auth);

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  return (
    <aside className="w-64 min-h-screen bg-white border-r border-orange-100 flex flex-col shadow-sm">
      {/* Header */}
      <div className="p-5 border-b border-orange-100">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-amber-400 rounded-xl flex items-center justify-center shadow-md">
            <span className="text-white text-xl">🍳</span>
          </div>
          <div>
            <h1 className="font-display font-bold text-lg gradient-text">CulinaryHub</h1>
            <p className="text-xs text-gray-400">Admin Panel</p>
          </div>
        </div>
      </div>

      {/* Admin Profile */}
      <div className="p-4 m-3 bg-orange-50 rounded-2xl">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-orange-400 to-amber-300 flex items-center justify-center text-white font-bold overflow-hidden">
            {user?.profileImage ? (
              <img src={`http://localhost:5000${user.profileImage}`} alt="" className="w-full h-full object-cover" />
            ) : user?.name?.charAt(0)}
          </div>
          <div>
            <p className="text-sm font-semibold text-gray-800">{user?.name}</p>
            <span className="text-xs bg-orange-200 text-orange-800 px-2 py-0.5 rounded-full font-medium">Admin</span>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 pb-4">
        <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider px-4 mb-2">Menu</p>
        <ul className="space-y-1">
          {navItems.map(item => (
            <li key={item.path}>
              <NavLink
                to={item.path}
                end={item.exact}
                className={({ isActive }) =>
                  `sidebar-link ${isActive ? 'active' : ''}`
                }
              >
                <span className="text-lg">{item.icon}</span>
                <span>{item.label}</span>
              </NavLink>
            </li>
          ))}
        </ul>

        <div className="mt-4 pt-4 border-t border-orange-100">
          <NavLink to="/" className="sidebar-link">
            <span className="text-lg">🌐</span>
            <span>View Site</span>
          </NavLink>
        </div>
      </nav>

      {/* Logout */}
      <div className="p-3 border-t border-orange-100">
        <button
          onClick={handleLogout}
          className="sidebar-link w-full text-red-500 hover:bg-red-50 hover:text-red-600"
        >
          <span className="text-lg">🚪</span>
          <span>Sign Out</span>
        </button>
      </div>
    </aside>
  );
};

export default AdminSidebar;
