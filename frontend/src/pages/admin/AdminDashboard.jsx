import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import AdminSidebar from '../../components/admin/AdminSidebar';
import api from '../../utils/api';
import LoadingSpinner from '../../components/common/LoadingSpinner';

const StatCard = ({ emoji, label, value, sub, color }) => (
  <div className={`stat-card border-l-4 ${color}`}>
    <div className="flex items-center justify-between">
      <div>
        <p className="text-sm text-gray-500 font-medium">{label}</p>
        <p className="text-3xl font-bold text-gray-800 mt-1">{value}</p>
        {sub && <p className="text-xs text-gray-400 mt-1">{sub}</p>}
      </div>
      <span className="text-4xl">{emoji}</span>
    </div>
  </div>
);

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/admin/stats').then(res => setStats(res.data)).catch(() => {}).finally(() => setLoading(false));
  }, []);

  return (
    <div className="flex min-h-screen bg-warm-gradient">
      <AdminSidebar />
      <main className="flex-1 p-8 overflow-auto">
        <div className="mb-8">
          <h1 className="section-title mb-1">Dashboard</h1>
          <p className="text-gray-500">Welcome to the CulinaryHub admin panel</p>
        </div>

        {loading ? <LoadingSpinner /> : !stats ? <p>Failed to load stats</p> : (
          <>
            {/* Stats Grid */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
              <StatCard emoji="👥" label="Total Users" value={stats.stats.users.total} sub={`${stats.stats.users.active} active`} color="border-blue-400" />
              <StatCard emoji="🍽️" label="Total Recipes" value={stats.stats.recipes.total} sub={`${stats.stats.recipes.approved} approved`} color="border-green-400" />
              <StatCard emoji="⏳" label="Pending Review" value={stats.stats.recipes.pending} sub="Awaiting approval" color="border-amber-400" />
              <StatCard emoji="💬" label="Comments" value={stats.stats.comments.total} sub="All reviews" color="border-orange-400" />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
              {/* Recipe Status Breakdown */}
              <div className="card p-6">
                <h2 className="font-display font-bold text-lg text-gray-800 mb-4">Recipe Status</h2>
                {[
                  { label: 'Approved', count: stats.stats.recipes.approved, color: 'bg-green-500', total: stats.stats.recipes.total },
                  { label: 'Pending', count: stats.stats.recipes.pending, color: 'bg-amber-500', total: stats.stats.recipes.total },
                  { label: 'Rejected', count: stats.stats.recipes.rejected, color: 'bg-red-500', total: stats.stats.recipes.total },
                ].map(item => (
                  <div key={item.label} className="mb-3">
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-gray-600">{item.label}</span>
                      <span className="font-semibold">{item.count}</span>
                    </div>
                    <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                      <div
                        className={`h-full ${item.color} rounded-full transition-all`}
                        style={{ width: item.total ? `${(item.count / item.total) * 100}%` : '0%' }}
                      />
                    </div>
                  </div>
                ))}
              </div>

              {/* Category Stats */}
              <div className="card p-6">
                <h2 className="font-display font-bold text-lg text-gray-800 mb-4">Top Categories</h2>
                <div className="space-y-2">
                  {stats.categoryStats.slice(0, 6).map((cat, i) => (
                    <div key={cat._id} className="flex items-center justify-between py-1.5">
                      <div className="flex items-center gap-2">
                        <span className="w-6 h-6 bg-orange-100 text-orange-600 rounded-full flex items-center justify-center text-xs font-bold">{i + 1}</span>
                        <span className="text-gray-700 text-sm">{cat._id}</span>
                      </div>
                      <span className="text-sm font-bold text-orange-600">{cat.count} recipes</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Recent Recipes */}
              <div className="card p-6">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="font-display font-bold text-lg text-gray-800">Recent Recipes</h2>
                  <Link to="/admin/recipes" className="text-xs text-orange-600 font-semibold hover:text-orange-700">View All →</Link>
                </div>
                <div className="space-y-3">
                  {stats.recentRecipes.map(r => (
                    <div key={r._id} className="flex items-center justify-between py-2 border-b border-orange-50 last:border-0">
                      <div>
                        <p className="text-sm font-semibold text-gray-800 truncate max-w-40">{r.title}</p>
                        <p className="text-xs text-gray-400">{r.author?.name} · {r.category}</p>
                      </div>
                      <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${
                        r.approvalStatus === 'Approved' ? 'bg-green-100 text-green-700' :
                        r.approvalStatus === 'Pending' ? 'bg-amber-100 text-amber-700' :
                        'bg-red-100 text-red-700'
                      }`}>{r.approvalStatus}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Recent Users */}
              <div className="card p-6">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="font-display font-bold text-lg text-gray-800">Recent Users</h2>
                  <Link to="/admin/users" className="text-xs text-orange-600 font-semibold hover:text-orange-700">View All →</Link>
                </div>
                <div className="space-y-3">
                  {stats.recentUsers.map(u => (
                    <div key={u._id} className="flex items-center gap-3 py-2 border-b border-orange-50 last:border-0">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-orange-300 to-amber-300 flex items-center justify-center text-white font-bold text-sm">
                        {u.name?.charAt(0)}
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-semibold text-gray-800">{u.name}</p>
                        <p className="text-xs text-gray-400">{u.email}</p>
                      </div>
                      <span className={`text-xs px-2 py-1 rounded-full font-medium ${u.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>{u.status}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </>
        )}
      </main>
    </div>
  );
};

export default AdminDashboard;
