import { useState, useEffect, useCallback } from 'react';
import { Search, Trash2, UserCheck, UserX, Shield } from 'lucide-react';
import { adminAPI } from '../../services/api';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import Pagination from '../../components/common/Pagination';
import toast from 'react-hot-toast';
import { useAuth } from '../../context/AuthContext';

const ROLE_BADGE = { admin: 'badge badge-danger', owner: 'badge badge-warning', buyer: 'badge badge-info' };

export default function AdminUsers() {
  const { user: me } = useAuth();
  const [users, setUsers]         = useState([]);
  const [loading, setLoading]     = useState(true);
  const [total, setTotal]         = useState(0);
  const [pages, setPages]         = useState(1);
  const [page, setPage]           = useState(1);
  const [search, setSearch]       = useState('');
  const [roleFilter, setRoleFilter] = useState('');
  const [updating, setUpdating]   = useState(null);

  const load = useCallback(async (p = 1) => {
    setLoading(true);
    try {
      const params = { page: p, limit: 10 };
      if (search)     params.search = search;
      if (roleFilter) params.role   = roleFilter;
      const { data } = await adminAPI.getUsers(params);
      setUsers(data.users);
      setTotal(data.total);
      setPages(data.pages);
      setPage(p);
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  }, [search, roleFilter]);

  useEffect(() => { load(1); }, [load]);

  const toggleActive = async (id, current) => {
    setUpdating(id);
    try {
      await adminAPI.updateUser(id, { isActive: !current });
      toast.success(!current ? 'User activated' : 'User deactivated');
      load(page);
    } catch { toast.error('Update failed'); }
    finally { setUpdating(null); }
  };

  const deleteUser = async (id) => {
    if (!confirm('Delete this user permanently?')) return;
    try {
      await adminAPI.deleteUser(id);
      toast.success('User deleted');
      load(page);
    } catch (err) { toast.error(err.response?.data?.message || 'Delete failed'); }
  };

  return (
    <div className="page-enter min-h-screen bg-slate-50">
      <div className="page-container py-8">
        <div className="mb-6 flex items-center gap-3">
          <div className="w-10 h-10 bg-primary-500 rounded-xl flex items-center justify-center shadow-sm">
            <Shield size={19} className="text-white" />
          </div>
          <div>
            <h1 className="font-display text-2xl font-bold text-slate-900">User Management</h1>
            <p className="text-slate-500 text-sm">{total} registered users</p>
          </div>
        </div>

        {/* Filters */}
        <div className="card p-4 mb-5 flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text" className="input-field pl-10 text-sm py-2.5"
              placeholder="Search by name or email…"
              value={search} onChange={e => setSearch(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && load(1)}
            />
          </div>
          <select
            className="select-field sm:w-40 text-sm py-2.5"
            value={roleFilter} onChange={e => setRoleFilter(e.target.value)}
          >
            <option value="">All Roles</option>
            <option value="buyer">Buyer</option>
            <option value="owner">Owner</option>
            <option value="admin">Admin</option>
          </select>
          <button onClick={() => load(1)} className="btn-primary py-2.5 text-sm">
            <Search size={15} /> Search
          </button>
        </div>

        {loading ? (
          <div className="flex justify-center py-20">
            <LoadingSpinner size="lg" text="Loading users…" />
          </div>
        ) : (
          <>
            <div className="card overflow-hidden">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-slate-100 bg-slate-50">
                    {['User', 'Role', 'Joined', 'Status', 'Actions'].map((h, i) => (
                      <th
                        key={h}
                        className={`text-left px-5 py-3.5 text-xs font-bold text-slate-400 uppercase tracking-wider ${
                          i === 1 ? 'hidden sm:table-cell' :
                          i === 2 ? 'hidden md:table-cell' :
                          i === 4 ? 'text-right' : ''
                        }`}
                      >
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {users.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="text-center py-12 text-slate-400">No users found</td>
                    </tr>
                  ) : users.map(u => (
                    <tr key={u._id} className="hover:bg-slate-50/70 transition-colors">
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 bg-gradient-to-br from-primary-500 to-primary-700 rounded-full flex items-center justify-center text-white text-sm font-bold shrink-0">
                            {u.name?.charAt(0)}
                          </div>
                          <div>
                            <p className="font-semibold text-slate-800 text-sm">{u.name}</p>
                            <p className="text-xs text-slate-400">{u.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-5 py-4 hidden sm:table-cell">
                        <span className={`capitalize ${ROLE_BADGE[u.role] || 'badge badge-slate'}`}>{u.role}</span>
                      </td>
                      <td className="px-5 py-4 hidden md:table-cell">
                        <p className="text-sm text-slate-500">{new Date(u.createdAt).toLocaleDateString()}</p>
                      </td>
                      <td className="px-5 py-4">
                        <span className={`badge ${u.isActive ? 'badge-success' : 'badge-danger'}`}>
                          {u.isActive ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                      <td className="px-5 py-4">
                        <div className="flex items-center justify-end gap-2">
                          {u._id !== me?._id ? (
                            <>
                              <button
                                onClick={() => toggleActive(u._id, u.isActive)}
                                disabled={updating === u._id}
                                title={u.isActive ? 'Deactivate' : 'Activate'}
                                className={`w-8 h-8 rounded-xl flex items-center justify-center transition-colors ${
                                  u.isActive
                                    ? 'bg-amber-50 hover:bg-amber-100 text-amber-600'
                                    : 'bg-emerald-50 hover:bg-emerald-100 text-emerald-600'
                                }`}
                              >
                                {updating === u._id
                                  ? <LoadingSpinner size="sm" color="slate" inline />
                                  : u.isActive ? <UserX size={15} /> : <UserCheck size={15} />}
                              </button>
                              <button
                                onClick={() => deleteUser(u._id)}
                                title="Delete"
                                className="w-8 h-8 rounded-xl bg-red-50 hover:bg-red-100 text-red-500 flex items-center justify-center transition-colors"
                              >
                                <Trash2 size={15} />
                              </button>
                            </>
                          ) : (
                            <span className="text-xs text-slate-400 italic pr-1">You</span>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <Pagination currentPage={page} totalPages={pages} onPageChange={load} />
          </>
        )}
      </div>
    </div>
  );
}
