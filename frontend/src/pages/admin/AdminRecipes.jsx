import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import AdminSidebar from '../../components/admin/AdminSidebar';
import api from '../../utils/api';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import toast from 'react-hot-toast';

const AdminRecipes = ({ pendingOnly = false }) => {
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState(null);
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState(pendingOnly ? 'Pending' : '');
  const [page, setPage] = useState(1);
  const [rejectModal, setRejectModal] = useState(null);
  const [rejectReason, setRejectReason] = useState('');

  const loadRecipes = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ page, limit: 10 });
      if (search) params.append('search', search);
      if (status) params.append('status', status);
      const res = await api.get(`/admin/recipes?${params}`);
      setRecipes(res.data.recipes);
      setPagination(res.data.pagination);
    } catch { toast.error('Failed to load recipes'); }
    finally { setLoading(false); }
  };

  useEffect(() => { loadRecipes(); }, [page, status]);

  const handleStatusUpdate = async (id, newStatus, reason = '') => {
    try {
      await api.put(`/admin/recipes/${id}/status`, { status: newStatus, rejectionReason: reason });
      toast.success(`Recipe ${newStatus.toLowerCase()}!`);
      loadRecipes();
      setRejectModal(null);
      setRejectReason('');
    } catch (err) { toast.error(err.response?.data?.message || 'Failed to update'); }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this recipe permanently?')) return;
    try {
      await api.delete(`/recipes/${id}`);
      toast.success('Recipe deleted');
      loadRecipes();
    } catch { toast.error('Failed to delete'); }
  };

  return (
    <div className="flex min-h-screen bg-warm-gradient">
      <AdminSidebar />
      <main className="flex-1 p-8 overflow-auto">
        <div className="mb-8">
          <h1 className="section-title mb-1">{pendingOnly ? 'Pending Review' : 'All Recipes'}</h1>
          <p className="text-gray-500">{pendingOnly ? 'Recipes awaiting your approval' : 'Manage all recipe submissions'}</p>
        </div>

        {/* Filters */}
        <div className="card p-4 mb-6 flex gap-3 flex-wrap items-center">
          <div className="flex-1 min-w-48 relative">
            <span className="absolute left-3 top-3 text-gray-400">🔍</span>
            <input value={search} onChange={e => setSearch(e.target.value)} onKeyDown={e => e.key === 'Enter' && loadRecipes()} placeholder="Search by title..." className="input-field pl-9 py-2.5" />
          </div>
          {!pendingOnly && (
            <select value={status} onChange={e => { setStatus(e.target.value); setPage(1); }} className="input-field py-2.5 w-40">
              <option value="">All Status</option>
              <option value="Pending">Pending</option>
              <option value="Approved">Approved</option>
              <option value="Rejected">Rejected</option>
            </select>
          )}
          <button onClick={() => { setPage(1); loadRecipes(); }} className="btn-primary py-2.5 px-5">Search</button>
        </div>

        {/* Table */}
        {loading ? <LoadingSpinner /> : (
          <div className="card overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-orange-50 border-b border-orange-100">
                  <tr>
                    {['Recipe', 'Category', 'Author', 'Status', 'Date', 'Actions'].map(h => (
                      <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-orange-50">
                  {recipes.map(recipe => (
                    <tr key={recipe._id} className="hover:bg-orange-50/50 transition-colors">
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl overflow-hidden bg-orange-100 flex-shrink-0">
                            {recipe.image ? (
                              <img src={`http://localhost:5000${recipe.image}`} alt="" className="w-full h-full object-cover" />
                            ) : <span className="w-full h-full flex items-center justify-center text-lg">🍽️</span>}
                          </div>
                          <div>
                            <p className="font-semibold text-gray-800 text-sm max-w-36 truncate">{recipe.title}</p>
                            <p className="text-xs text-gray-400">{recipe.difficulty}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-600">{recipe.category}</td>
                      <td className="px-4 py-3">
                        <p className="text-sm text-gray-700">{recipe.author?.name}</p>
                        <p className="text-xs text-gray-400">{recipe.author?.email}</p>
                      </td>
                      <td className="px-4 py-3">
                        <span className={recipe.approvalStatus === 'Approved' ? 'badge-approved' : recipe.approvalStatus === 'Pending' ? 'badge-pending' : 'badge-rejected'}>
                          {recipe.approvalStatus}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-xs text-gray-400">{new Date(recipe.createdAt).toLocaleDateString()}</td>
                      <td className="px-4 py-3">
                        <div className="flex gap-1 flex-wrap">
                          <Link to={`/recipes/${recipe._id}`} className="text-xs px-2.5 py-1.5 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 font-medium">View</Link>
                          {recipe.approvalStatus === 'Pending' && (
                            <>
                              <button onClick={() => handleStatusUpdate(recipe._id, 'Approved')} className="text-xs px-2.5 py-1.5 bg-green-50 text-green-600 rounded-lg hover:bg-green-100 font-medium">✓ Approve</button>
                              <button onClick={() => setRejectModal(recipe._id)} className="text-xs px-2.5 py-1.5 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 font-medium">✗ Reject</button>
                            </>
                          )}
                          {recipe.approvalStatus === 'Approved' && (
                            <button onClick={() => handleStatusUpdate(recipe._id, 'Rejected')} className="text-xs px-2.5 py-1.5 bg-amber-50 text-amber-600 rounded-lg hover:bg-amber-100 font-medium">Revoke</button>
                          )}
                          {recipe.approvalStatus === 'Rejected' && (
                            <button onClick={() => handleStatusUpdate(recipe._id, 'Approved')} className="text-xs px-2.5 py-1.5 bg-green-50 text-green-600 rounded-lg hover:bg-green-100 font-medium">Re-approve</button>
                          )}
                          <button onClick={() => handleDelete(recipe._id)} className="text-xs px-2.5 py-1.5 bg-red-50 text-red-500 rounded-lg hover:bg-red-100 font-medium">🗑</button>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {recipes.length === 0 && (
                    <tr><td colSpan={6} className="text-center py-12 text-gray-400">No recipes found</td></tr>
                  )}
                </tbody>
              </table>
            </div>

            {pagination && pagination.pages > 1 && (
              <div className="px-4 py-3 border-t border-orange-100 flex justify-between items-center">
                <p className="text-sm text-gray-500">Page {page} of {pagination.pages} ({pagination.total} total)</p>
                <div className="flex gap-2">
                  <button disabled={page === 1} onClick={() => setPage(p => p - 1)} className="px-3 py-1.5 text-sm border border-orange-200 rounded-lg disabled:opacity-40 hover:bg-orange-50">← Prev</button>
                  <button disabled={page === pagination.pages} onClick={() => setPage(p => p + 1)} className="px-3 py-1.5 text-sm border border-orange-200 rounded-lg disabled:opacity-40 hover:bg-orange-50">Next →</button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Reject Modal */}
        {rejectModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl p-6 max-w-md w-full shadow-2xl animate-slide-up">
              <h3 className="font-display text-xl font-bold text-gray-800 mb-2">Reject Recipe</h3>
              <p className="text-gray-500 text-sm mb-4">Provide a reason so the author can improve their submission.</p>
              <textarea
                value={rejectReason}
                onChange={e => setRejectReason(e.target.value)}
                placeholder="e.g. Recipe needs clearer instructions, missing ingredient quantities..."
                rows={3} className="input-field resize-none mb-4"
              />
              <div className="flex gap-3">
                <button onClick={() => handleStatusUpdate(rejectModal, 'Rejected', rejectReason)} className="btn-danger flex-1 py-2.5">Confirm Rejection</button>
                <button onClick={() => { setRejectModal(null); setRejectReason(''); }} className="btn-secondary flex-1 py-2.5">Cancel</button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default AdminRecipes;
