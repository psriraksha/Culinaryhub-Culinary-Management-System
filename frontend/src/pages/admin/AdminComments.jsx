import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import AdminSidebar from '../../components/admin/AdminSidebar';
import api from '../../utils/api';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import toast from 'react-hot-toast';

const AdminComments = () => {
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState(null);
  const [page, setPage] = useState(1);

  const loadComments = async () => {
    setLoading(true);
    try {
      const res = await api.get(`/admin/comments?page=${page}&limit=20`);
      setComments(res.data.comments);
      setPagination(res.data.pagination);
    } catch { toast.error('Failed to load comments'); }
    finally { setLoading(false); }
  };

  useEffect(() => { loadComments(); }, [page]);

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this comment?')) return;
    try {
      await api.delete(`/admin/comments/${id}`);
      toast.success('Comment deleted');
      loadComments();
    } catch { toast.error('Failed to delete comment'); }
  };

  return (
    <div className="flex min-h-screen bg-warm-gradient">
      <AdminSidebar />
      <main className="flex-1 p-8 overflow-auto">
        <div className="mb-8">
          <h1 className="section-title mb-1">Comments & Reviews</h1>
          <p className="text-gray-500">Moderate user reviews and comments</p>
        </div>

        {loading ? <LoadingSpinner /> : (
          <div className="card overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-orange-50 border-b border-orange-100">
                  <tr>
                    {['User', 'Comment', 'Recipe', 'Rating', 'Date', 'Actions'].map(h => (
                      <th key={h} className="px-5 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-orange-50">
                  {comments.map(c => (
                    <tr key={c._id} className="hover:bg-orange-50/30 transition-colors">
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-orange-300 to-amber-300 flex items-center justify-center text-white text-sm font-bold flex-shrink-0">
                            {c.user?.name?.charAt(0)}
                          </div>
                          <div>
                            <p className="text-sm font-semibold text-gray-800">{c.user?.name}</p>
                            <p className="text-xs text-gray-400 truncate max-w-24">{c.user?.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-5 py-4">
                        <p className="text-sm text-gray-700 max-w-xs">{c.comment}</p>
                        {c.isEdited && <span className="text-xs text-gray-400">(edited)</span>}
                      </td>
                      <td className="px-5 py-4">
                        <Link
                          to={`/recipes/${c.recipe?._id}`}
                          className="text-sm text-orange-600 hover:text-orange-700 font-medium truncate block max-w-32"
                        >
                          {c.recipe?.title || 'Deleted Recipe'}
                        </Link>
                      </td>
                      <td className="px-5 py-4">
                        {c.rating ? (
                          <div className="flex gap-0.5">
                            {[1,2,3,4,5].map(i => (
                              <span key={i} className={`text-sm ${i <= c.rating ? 'text-amber-400' : 'text-gray-200'}`}>★</span>
                            ))}
                          </div>
                        ) : (
                          <span className="text-gray-300 text-sm">—</span>
                        )}
                      </td>
                      <td className="px-5 py-4 text-xs text-gray-400">
                        {new Date(c.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                      </td>
                      <td className="px-5 py-4">
                        <button
                          onClick={() => handleDelete(c._id)}
                          className="text-xs px-3 py-1.5 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 font-medium transition-colors"
                        >
                          🗑️ Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                  {comments.length === 0 && (
                    <tr>
                      <td colSpan={6} className="text-center py-12 text-gray-400">
                        <div className="text-4xl mb-2">💬</div>
                        <p>No comments found</p>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {pagination && pagination.pages > 1 && (
              <div className="px-5 py-3 border-t border-orange-100 flex justify-between items-center bg-orange-50/50">
                <p className="text-sm text-gray-500">
                  Page <strong>{page}</strong> of <strong>{pagination.pages}</strong> ({pagination.total} total)
                </p>
                <div className="flex gap-2">
                  <button disabled={page === 1} onClick={() => setPage(p => p - 1)}
                    className="px-3 py-1.5 text-sm border border-orange-200 rounded-lg disabled:opacity-40 hover:bg-orange-50">← Prev</button>
                  <button disabled={page === pagination.pages} onClick={() => setPage(p => p + 1)}
                    className="px-3 py-1.5 text-sm border border-orange-200 rounded-lg disabled:opacity-40 hover:bg-orange-50">Next →</button>
                </div>
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
};

export default AdminComments;
