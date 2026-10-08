import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Users, Building2, MessageSquare, Clock, CheckCircle2, XCircle,
  TrendingUp, ChevronRight, AlertCircle, LayoutDashboard
} from 'lucide-react';
import { adminAPI } from '../../services/api';
import LoadingSpinner from '../../components/common/LoadingSpinner';

const PLACEHOLDER = 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=200&q=60';

export default function AdminDashboard() {
  const [data, setData]     = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    adminAPI.getStats()
      .then(r => setData(r.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center">
      <LoadingSpinner size="lg" text="Loading dashboard…" />
    </div>
  );

  const { stats, recentProperties = [], recentUsers = [] } = data || {};

  const statCards = [
    { label: 'Total Users',       value: stats?.totalUsers,          icon: <Users size={20} />,        color: 'text-blue-600 bg-blue-50'    },
    { label: 'Total Properties',  value: stats?.totalProperties,     icon: <Building2 size={20} />,    color: 'text-emerald-600 bg-emerald-50' },
    { label: 'Pending Approval',  value: stats?.pendingProperties,   icon: <Clock size={20} />,        color: 'text-amber-600 bg-amber-50'  },
    { label: 'Total Inquiries',   value: stats?.totalInquiries,      icon: <MessageSquare size={20} />,color: 'text-purple-600 bg-purple-50' },
    { label: 'Approved',          value: stats?.approvedProperties,  icon: <CheckCircle2 size={20} />, color: 'text-green-600 bg-green-50'  },
    { label: 'Rejected',          value: stats?.rejectedProperties,  icon: <XCircle size={20} />,      color: 'text-red-600 bg-red-50'      },
    { label: 'Buyers',            value: stats?.buyerCount,          icon: <Users size={20} />,        color: 'text-sky-600 bg-sky-50'      },
    { label: 'Owners',            value: stats?.ownerCount,          icon: <TrendingUp size={20} />,   color: 'text-orange-600 bg-orange-50' },
  ];

  const ROLE_BADGE = { admin: 'badge badge-danger', owner: 'badge badge-warning', buyer: 'badge badge-info' };

  return (
    <div className="page-enter min-h-screen bg-slate-50">
      <div className="page-container py-8">

        {/* Header */}
        <div className="mb-7 flex items-center gap-3">
          <div className="w-10 h-10 bg-primary-500 rounded-xl flex items-center justify-center shadow-sm">
            <LayoutDashboard size={19} className="text-white" />
          </div>
          <div>
            <h1 className="font-display text-2xl font-bold text-slate-900">Admin Dashboard</h1>
            <p className="text-slate-500 text-sm">Overview of your platform's performance</p>
          </div>
        </div>

        {/* Pending alert */}
        {stats?.pendingProperties > 0 && (
          <div className="mb-6 flex items-center gap-3 bg-amber-50 border border-amber-200 rounded-2xl p-4">
            <AlertCircle size={20} className="text-amber-600 shrink-0" />
            <p className="text-sm text-amber-700 font-medium">
              {stats.pendingProperties} propert{stats.pendingProperties === 1 ? 'y' : 'ies'} awaiting approval
            </p>
            <Link to="/admin/listings?status=pending" className="ml-auto text-sm text-amber-700 font-bold hover:underline whitespace-nowrap">
              Review now →
            </Link>
          </div>
        )}

        {/* Stat cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
          {statCards.map(({ label, value, icon, color }) => (
            <div key={label} className="card p-5">
              <div className={`w-11 h-11 rounded-2xl ${color} flex items-center justify-center mb-3`}>
                {icon}
              </div>
              <p className="font-display text-2xl font-bold text-slate-900">{value ?? '—'}</p>
              <p className="text-sm text-slate-500 mt-0.5">{label}</p>
            </div>
          ))}
        </div>

        {/* Recent tables */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {/* Recent Properties */}
          <div className="card p-6">
            <div className="flex items-center justify-between mb-5">
              <h2 className="font-display text-lg font-bold text-slate-900">Recent Properties</h2>
              <Link to="/admin/listings" className="text-primary-600 text-sm font-medium hover:underline flex items-center gap-1">
                View all <ChevronRight size={14} />
              </Link>
            </div>
            <div className="space-y-3">
              {recentProperties.length === 0 ? (
                <p className="text-slate-400 text-sm text-center py-4">No properties yet</p>
              ) : recentProperties.map(p => (
                <div key={p._id} className="flex items-center gap-3 py-2.5 border-b border-slate-50 last:border-0">
                  <img
                    src={p.images?.[0] || PLACEHOLDER} alt={p.title}
                    className="w-12 h-10 rounded-xl object-cover bg-slate-100 shrink-0"
                    onError={e => { e.target.src = PLACEHOLDER; }}
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-slate-800 truncate">{p.title}</p>
                    <p className="text-xs text-slate-400">{p.ownerId?.name} · {p.location?.city}</p>
                  </div>
                  <span className={`shrink-0 ${
                    p.status === 'approved' ? 'badge badge-success'
                    : p.status === 'pending' ? 'badge badge-warning'
                    : 'badge badge-danger'
                  }`}>{p.status}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Users */}
          <div className="card p-6">
            <div className="flex items-center justify-between mb-5">
              <h2 className="font-display text-lg font-bold text-slate-900">Recent Users</h2>
              <Link to="/admin/users" className="text-primary-600 text-sm font-medium hover:underline flex items-center gap-1">
                View all <ChevronRight size={14} />
              </Link>
            </div>
            <div className="space-y-3">
              {recentUsers.length === 0 ? (
                <p className="text-slate-400 text-sm text-center py-4">No users yet</p>
              ) : recentUsers.map(u => (
                <div key={u._id} className="flex items-center gap-3 py-2.5 border-b border-slate-50 last:border-0">
                  <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-primary-700 rounded-full flex items-center justify-center text-white text-sm font-bold shrink-0">
                    {u.name?.charAt(0)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-slate-800 truncate">{u.name}</p>
                    <p className="text-xs text-slate-400 truncate">{u.email}</p>
                  </div>
                  <div className="text-right shrink-0">
                    <span className={`capitalize ${ROLE_BADGE[u.role] || 'badge badge-slate'}`}>{u.role}</span>
                    <p className="text-xs text-slate-400 mt-1">{u.isActive ? '✓ Active' : '✗ Inactive'}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Quick links */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[
            { to: '/admin/listings?status=pending', icon: <Clock size={20} />,     label: 'Review Pending', desc: `${stats?.pendingProperties ?? 0} to review`,    color: 'bg-amber-50   border-amber-200   text-amber-700'   },
            { to: '/admin/users',                   icon: <Users size={20} />,     label: 'Manage Users',   desc: `${stats?.totalUsers ?? 0} total users`,           color: 'bg-blue-50    border-blue-200    text-blue-700'    },
            { to: '/admin/listings',                icon: <Building2 size={20} />, label: 'All Listings',   desc: `${stats?.totalProperties ?? 0} properties`,        color: 'bg-emerald-50 border-emerald-200 text-emerald-700' },
          ].map(({ to, icon, label, desc, color }) => (
            <Link
              key={to} to={to}
              className={`card border p-5 flex items-center gap-4 hover:shadow-md transition-all ${color}`}
            >
              <div className="shrink-0">{icon}</div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-sm">{label}</p>
                <p className="text-xs opacity-60 mt-0.5">{desc}</p>
              </div>
              <ChevronRight size={16} className="opacity-40 shrink-0" />
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
