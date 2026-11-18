import React, { useEffect, useState } from 'react';
import AdminSidebar from '../../components/admin/AdminSidebar';
import api from '../../utils/api';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import toast from 'react-hot-toast';

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState(null);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [page, setPage] = useState(1);

  const loadUsers = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ page, limit: 10 });
      if (search) params.append('search', search);
      if (statusFilter) params.append('status', statusFilter);
      const res = await api.get(`/admin/users?${params}`);
      setUsers(res.data.users);
      setPagination(res.data.pagination);
    } catch { toast.error('Failed to load users'); }
    finally { setLoading(false); }
  };

  useEffect(() => { loadUsers(); }, [page, statusFilter]);

  const handleStatusToggle = async (user) => {
    const newStatus = user.status === 'active' ? 'suspended' : 'active';
    if (!window.confirm(`${newStatus === 'suspended' ? 'Suspend' : 'Activate'} user "${user.name}"?`)) return;
    try {
      await api.put(`/admin/users/${user._id}/status`, { status: newStatus });
      toast.success(`User ${newStatus === 'active' ? 'activated' : 'suspended'}`);
      loadUsers();
    } catch { toast.error('Failed to update user status'); }
  };

  const handleDelete = async (user) => {
    if (!window.confirm(`Permanently delete "${user.name}" and all their data? This cannot be undone.`)) return;
    try {
      await api.delete(`/admin/users/${user._id}`);
      toast.success('User deleted');
      loadUsers();
    } catch { toast.error('Failed to delete user'); }
  };

  return (
    <div className="flex min-h-screen bg-warm-gradient">
      <AdminSidebar />
      <main className="flex-1 p-8 overflow-auto">
        <div className="mb-8">
          <h1 className="section-title mb-1">Users</h1>
          <p className="text-gray-500">Manage all registered users</p>
        </div>

        {/* Filters */}
        <div className="card p-4 mb-6 flex gap-3 flex-wrap items-center">
          <div className="flex-1 min-w-48 relative">
            <span className="absolute left-3 top-3 text-gray-400">🔍</span>
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && loadUsers()}
              placeholder="Search by name or email..."
              className="input-field pl-9 py-2.5"
            />
          </div>
          <select
            value={statusFilter}
            onChange={e => { setStatusFilter(e.target.value); setPage(1); }}
            className="input-field py-2.5 w-40"
          >
            <option value="">All Status</option>
            <option value="active">Active</option>
            <option value="suspended">Suspended</option>
          </select>
          <button onClick={() => { setPage(1); loadUsers(); }} className="btn-primary py-2.5 px-5">Search</button>
        </div>

        {/* Table */}
        {loading ? <LoadingSpinner /> : (
          <div className="card overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-orange-50 border-b border-orange-100">
                  <tr>
                    {['User', 'Email', 'Status', 'Joined', 'Actions'].map(h => (
                      <th key={h} className="px-5 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-orange-50">
                  {users.map(user => (
                    <tr key={user._id} className="hover:bg-orange-50/50 transition-colors">
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-orange-300 to-amber-300 flex items-center justify-center text-white font-bold overflow-hidden flex-shrink-0">
                            {user.profileImage
                              ? <img src={`http://localhost:5000${user.profileImage}`} alt="" className="w-full h-full object-cover" />
                              : user.name?.charAt(0)
                            }
                          </div>
                          <div>
                            <p className="font-semibold text-gray-800 text-sm">{user.name}</p>
                            <span className="text-xs bg-orange-50 text-orange-600 px-2 py-0.5 rounded-full">User</span>
                          </div>
                        </div>
                      </td>
                      <td className="px-5 py-4 text-sm text-gray-600">{user.email}</td>
                      <td className="px-5 py-4">
                        <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${
                          user.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                        }`}>
                          {user.status === 'active' ? '● Active' : '● Suspended'}
                        </span>
                      </td>
                      <td className="px-5 py-4 text-xs text-gray-400">
                        {new Date(user.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}
                      </td>
                      <td className="px-5 py-4">
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleStatusToggle(user)}
                            className={`text-xs px-3 py-1.5 rounded-lg font-medium transition-colors ${
                              user.status === 'active'
                                ? 'bg-amber-50 text-amber-700 hover:bg-amber-100'
                                : 'bg-green-50 text-green-700 hover:bg-green-100'
                            }`}
                          >
                            {user.status === 'active' ? '🚫 Suspend' : '✅ Activate'}
                          </button>
                          <button
                            onClick={() => handleDelete(user)}
                            className="text-xs px-3 py-1.5 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 font-medium"
                          >
                            🗑️ Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {users.length === 0 && (
                    <tr>
                      <td colSpan={5} className="text-center py-12 text-gray-400">
                        <div className="text-4xl mb-2">👥</div>
                        <p>No users found</p>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {pagination && pagination.pages > 1 && (
              <div className="px-5 py-3 border-t border-orange-100 flex justify-between items-center bg-orange-50/50">
                <p className="text-sm text-gray-500">
                  Showing {users.length} of <strong>{pagination.total}</strong> users
                </p>
                <div className="flex gap-2">
                  <button disabled={page === 1} onClick={() => setPage(p => p - 1)}
                    className="px-3 py-1.5 text-sm border border-orange-200 rounded-lg disabled:opacity-40 hover:bg-orange-50 transition-colors">
                    ← Prev
                  </button>
                  {Array.from({ length: Math.min(pagination.pages, 5) }, (_, i) => i + 1).map(p => (
                    <button key={p} onClick={() => setPage(p)}
                      className={`w-8 h-8 text-sm rounded-lg font-medium ${p === page ? 'bg-orange-500 text-white' : 'border border-orange-200 text-gray-600 hover:bg-orange-50'}`}>
                      {p}
                    </button>
                  ))}
                  <button disabled={page === pagination.pages} onClick={() => setPage(p => p + 1)}
                    className="px-3 py-1.5 text-sm border border-orange-200 rounded-lg disabled:opacity-40 hover:bg-orange-50 transition-colors">
                    Next →
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
};

export default AdminUsers;
