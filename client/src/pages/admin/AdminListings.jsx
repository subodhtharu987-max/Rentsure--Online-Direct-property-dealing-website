import { useState, useEffect, useCallback } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Search, CheckCircle, XCircle, Eye, Trash2, Building2, MapPin } from 'lucide-react';
import { adminAPI, propertyAPI } from '../../services/api';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import Pagination from '../../components/common/Pagination';
import toast from 'react-hot-toast';

const STATUS_BADGE = {
  approved: 'badge badge-success',
  pending:  'badge badge-warning',
  rejected: 'badge badge-danger',
  sold:     'badge badge-slate',
  rented:   'badge badge-slate',
};

const PLACEHOLDER = 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=200&q=60';

function formatPrice(p) {
  if (p >= 10000000) return `₹${(p / 10000000).toFixed(1)}Cr`;
  if (p >= 100000)   return `₹${(p / 100000).toFixed(1)}L`;
  return `₹${p?.toLocaleString('en-IN')}`;
}

export default function AdminListings() {
  const [urlParams] = useSearchParams();
  const [properties, setProperties] = useState([]);
  const [loading, setLoading]       = useState(true);
  const [total, setTotal]           = useState(0);
  const [pages, setPages]           = useState(1);
  const [page, setPage]             = useState(1);
  const [search, setSearch]         = useState('');
  const [statusFilter, setStatusFilter] = useState(urlParams.get('status') || '');
  const [updating, setUpdating]     = useState(null);

  const load = useCallback(async (p = 1) => {
    setLoading(true);
    try {
      const params = { page: p, limit: 10 };
      if (search)       params.search = search;
      if (statusFilter) params.status = statusFilter;
      const { data } = await adminAPI.getProperties(params);
      setProperties(data.properties);
      setTotal(data.total);
      setPages(data.pages);
      setPage(p);
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  }, [search, statusFilter]);

  useEffect(() => { load(1); }, [load]);

  const updateStatus = async (id, status) => {
    setUpdating(id + status);
    try {
      await adminAPI.updatePropertyStatus(id, status);
      toast.success(`Property ${status}!`);
      load(page);
    } catch { toast.error('Update failed'); }
    finally { setUpdating(null); }
  };

  const deleteProperty = async (id) => {
    if (!confirm('Delete this property permanently?')) return;
    try {
      await propertyAPI.delete(id);
      toast.success('Property deleted');
      load(page);
    } catch { toast.error('Delete failed'); }
  };

  return (
    <div className="page-enter min-h-screen bg-slate-50">
      <div className="page-container py-8">
        <div className="mb-6 flex items-center gap-3">
          <div className="w-10 h-10 bg-primary-500 rounded-xl flex items-center justify-center shadow-sm">
            <Building2 size={19} className="text-white" />
          </div>
          <div>
            <h1 className="font-display text-2xl font-bold text-slate-900">Listings Management</h1>
            <p className="text-slate-500 text-sm">{total} total listings</p>
          </div>
        </div>

        {/* Filters */}
        <div className="card p-4 mb-5 flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text" className="input-field pl-10 text-sm py-2.5"
              placeholder="Search by title or city…"
              value={search} onChange={e => setSearch(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && load(1)}
            />
          </div>
          <select
            className="select-field sm:w-44 text-sm py-2.5"
            value={statusFilter} onChange={e => setStatusFilter(e.target.value)}
          >
            <option value="">All Statuses</option>
            <option value="pending">Pending</option>
            <option value="approved">Approved</option>
            <option value="rejected">Rejected</option>
          </select>
          <button onClick={() => load(1)} className="btn-primary py-2.5 text-sm">
            <Search size={15} /> Search
          </button>
        </div>

        {loading ? (
          <div className="flex justify-center py-20">
            <LoadingSpinner size="lg" text="Loading listings…" />
          </div>
        ) : (
          <>
            <div className="space-y-4">
              {properties.length === 0 ? (
                <div className="card p-16 text-center text-slate-400">
                  <Building2 size={48} className="mx-auto mb-3 opacity-20" />
                  <p className="font-medium">No properties found</p>
                </div>
              ) : properties.map(p => (
                <div key={p._id} className="card p-4">
                  <div className="flex items-start gap-4">
                    <img
                      src={p.images?.[0] || PLACEHOLDER} alt={p.title}
                      className="w-20 h-16 rounded-xl object-cover bg-slate-100 shrink-0"
                      onError={e => { e.target.src = PLACEHOLDER; }}
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2 flex-wrap">
                        <div>
                          <p className="font-semibold text-slate-900 text-sm line-clamp-1">{p.title}</p>
                          <div className="flex items-center gap-1.5 text-xs text-slate-400 mt-0.5">
                            <MapPin size={11} className="text-primary-500" />
                            {p.location?.city}, {p.location?.state}
                          </div>
                        </div>
                        <span className={`shrink-0 ${STATUS_BADGE[p.status] || 'badge badge-slate'}`}>{p.status}</span>
                      </div>
                      <div className="flex items-center gap-3 mt-2 text-xs text-slate-500 flex-wrap">
                        <span className="font-bold text-primary-700">{formatPrice(p.price)}</span>
                        <span className="capitalize">{p.type}</span>
                        <span>For {p.category}</span>
                        {p.ownerId && <span>by <span className="font-medium text-slate-700">{p.ownerId.name}</span></span>}
                        <span>{new Date(p.createdAt).toLocaleDateString()}</span>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex flex-col sm:flex-row items-end sm:items-center gap-2 shrink-0">
                      <Link
                        to={`/properties/${p._id}`}
                        className="w-8 h-8 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center transition-colors"
                        title="View"
                      >
                        <Eye size={15} />
                      </Link>
                      {p.status !== 'approved' && (
                        <button
                          onClick={() => updateStatus(p._id, 'approved')}
                          disabled={!!updating}
                          className="w-8 h-8 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-600 flex items-center justify-center transition-colors disabled:opacity-50"
                          title="Approve"
                        >
                          {updating === p._id + 'approved'
                            ? <LoadingSpinner size="sm" color="slate" inline />
                            : <CheckCircle size={15} />}
                        </button>
                      )}
                      {p.status !== 'rejected' && (
                        <button
                          onClick={() => updateStatus(p._id, 'rejected')}
                          disabled={!!updating}
                          className="w-8 h-8 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-600 flex items-center justify-center transition-colors disabled:opacity-50"
                          title="Reject"
                        >
                          {updating === p._id + 'rejected'
                            ? <LoadingSpinner size="sm" color="slate" inline />
                            : <XCircle size={15} />}
                        </button>
                      )}
                      <button
                        onClick={() => deleteProperty(p._id)}
                        className="w-8 h-8 rounded-xl bg-red-50 hover:bg-red-100 text-red-500 flex items-center justify-center transition-colors"
                        title="Delete"
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <Pagination currentPage={page} totalPages={pages} onPageChange={load} />
          </>
        )}
      </div>
    </div>
  );
}
