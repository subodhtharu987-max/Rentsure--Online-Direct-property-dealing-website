import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Plus, Edit2, Trash2, Eye, MapPin, Bed } from 'lucide-react';
import { propertyAPI } from '../../services/api';
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

const PLACEHOLDER = 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=300&q=60';

function formatPrice(price) {
  if (price >= 10000000) return `₹${(price / 10000000).toFixed(1)}Cr`;
  if (price >= 100000)   return `₹${(price / 100000).toFixed(1)}L`;
  return `₹${price?.toLocaleString('en-IN')}`;
}

export default function ManageListingsPage() {
  const navigate = useNavigate();
  const [properties, setProperties] = useState([]);
  const [loading, setLoading]       = useState(true);
  const [total, setTotal]           = useState(0);
  const [pages, setPages]           = useState(1);
  const [page, setPage]             = useState(1);
  const [deleting, setDeleting]     = useState(null);

  const load = async (p = 1) => {
    setLoading(true);
    try {
      const { data } = await propertyAPI.getMyListings({ page: p, limit: 10 });
      setProperties(data.properties);
      setTotal(data.total);
      setPages(data.pages);
      setPage(p);
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  };

  useEffect(() => { load(); }, []);

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this listing?')) return;
    setDeleting(id);
    try {
      await propertyAPI.delete(id);
      toast.success('Listing deleted');
      load(page);
    } catch { toast.error('Failed to delete'); }
    finally { setDeleting(null); }
  };

  return (
    <div className="page-enter min-h-screen bg-slate-50">
      <div className="page-container py-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="font-display text-2xl font-bold text-slate-900">My Listings</h1>
            <p className="text-slate-500 text-sm mt-1">{total} total {total === 1 ? 'listing' : 'listings'}</p>
          </div>
          <Link to="/owner/add-property" className="btn-primary">
            <Plus size={16} /> Add New
          </Link>
        </div>

        {loading ? (
          <div className="flex justify-center py-20">
            <LoadingSpinner size="lg" text="Loading listings…" />
          </div>
        ) : properties.length === 0 ? (
          <div className="text-center py-24">
            <div className="w-16 h-16 bg-slate-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Plus size={28} className="text-slate-400" />
            </div>
            <h2 className="font-display text-xl font-bold text-slate-700 mb-2">No listings yet</h2>
            <p className="text-slate-400 text-sm mb-6">Create your first property listing to get started</p>
            <Link to="/owner/add-property" className="btn-primary">Add Property</Link>
          </div>
        ) : (
          <>
            <div className="space-y-4">
              {properties.map(p => (
                <div key={p._id} className="card p-4 flex items-center gap-4">
                  {/* Thumbnail */}
                  <img
                    src={p.images?.[0] || PLACEHOLDER}
                    alt={p.title}
                    className="w-20 h-16 object-cover rounded-xl shrink-0 bg-slate-100"
                    onError={e => { e.target.src = PLACEHOLDER; }}
                  />

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2 flex-wrap">
                      <div>
                        <p className="font-semibold text-slate-900 text-sm line-clamp-1">{p.title}</p>
                        <div className="flex items-center gap-1 text-xs text-slate-400 mt-0.5">
                          <MapPin size={11} className="text-primary-500 shrink-0" />
                          {p.location?.city}, {p.location?.state}
                        </div>
                      </div>
                      <span className={`${STATUS_BADGE[p.status] || 'badge badge-slate'} shrink-0`}>{p.status}</span>
                    </div>
                    <div className="flex items-center gap-3 mt-2 flex-wrap">
                      <span className="font-bold text-primary-700 text-sm">
                        {formatPrice(p.price)}{p.priceType === 'per_month' ? '/mo' : ''}
                      </span>
                      <span className="text-xs text-slate-400 capitalize">{p.type} · For {p.category}</span>
                      {p.bedrooms > 0 && (
                        <span className="text-xs text-slate-400 flex items-center gap-1">
                          <Bed size={11} /> {p.bedrooms} bed
                        </span>
                      )}
                      <span className="text-xs text-slate-400 flex items-center gap-1">
                        <Eye size={11} /> {p.views ?? 0} views
                      </span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 shrink-0">
                    <Link
                      to={`/properties/${p._id}`}
                      className="w-8 h-8 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center transition-colors"
                      title="View"
                    >
                      <Eye size={15} />
                    </Link>
                    <button
                      onClick={() => navigate(`/owner/edit/${p._id}`)}
                      className="w-8 h-8 rounded-xl bg-blue-50 hover:bg-blue-100 text-blue-600 flex items-center justify-center transition-colors"
                      title="Edit"
                    >
                      <Edit2 size={15} />
                    </button>
                    <button
                      onClick={() => handleDelete(p._id)}
                      disabled={deleting === p._id}
                      className="w-8 h-8 rounded-xl bg-red-50 hover:bg-red-100 text-red-500 flex items-center justify-center transition-colors disabled:opacity-50"
                      title="Delete"
                    >
                      {deleting === p._id
                        ? <LoadingSpinner size="sm" color="slate" inline />
                        : <Trash2 size={15} />}
                    </button>
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
