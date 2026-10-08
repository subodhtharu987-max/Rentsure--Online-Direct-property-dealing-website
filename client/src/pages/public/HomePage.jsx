import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Search, MapPin, TrendingUp, Shield, Star, ChevronRight,
  Building2, Home, Warehouse, Trees, Sparkles
} from 'lucide-react';
import PropertyCard from '../../components/property/PropertyCard';
import { propertyAPI } from '../../services/api';

const STATS = [
  { label: 'Active Listings',  value: '10,000+' },
  { label: 'Happy Customers',  value: '25,000+' },
  { label: 'Cities Covered',   value: '50+'     },
  { label: 'Expert Agents',    value: '500+'    },
];

const FEATURES = [
  { icon: <Search size={22} />,    title: 'Smart Search',      desc: 'Advanced filters — by location, price, type, and more — to pinpoint exactly what you need.' },
  { icon: <Shield size={22} />,    title: 'Verified Listings', desc: 'Every property is reviewed and verified by our admin team before going live.' },
  { icon: <TrendingUp size={22} />,title: 'Market Insights',   desc: 'Real-time pricing data and market trends to help you make informed decisions.' },
  { icon: <Star size={22} />,      title: 'Top-Rated Owners',  desc: 'Connect directly with highly-rated property owners for seamless transactions.' },
];

const CATEGORIES = [
  { icon: <Building2 size={24} />, label: 'Apartments', type: 'apartment', color: 'from-blue-500 to-blue-600' },
  { icon: <Home size={24} />,      label: 'Houses',     type: 'house',     color: 'from-emerald-500 to-emerald-600' },
  { icon: <Warehouse size={24} />, label: 'Villas',     type: 'villa',     color: 'from-purple-500 to-purple-600' },
  { icon: <Trees size={24} />,     label: 'Plots',      type: 'plot',      color: 'from-amber-500 to-amber-600' },
];

export default function HomePage() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [category, setCategory] = useState('');
  const [featured, setFeatured] = useState([]);
  const [recent, setRecent] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const [featRes, recRes] = await Promise.all([
          propertyAPI.getAll({ status: 'approved', limit: 4, featured: 'true' }),
          propertyAPI.getAll({ status: 'approved', limit: 8 }),
        ]);
        setFeatured(featRes.data.properties);
        setRecent(recRes.data.properties);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const handleSearch = () => {
    const params = new URLSearchParams();
    if (searchQuery) params.set('search', searchQuery);
    if (category)     params.set('category', category);
    navigate(`/properties?${params.toString()}`);
  };

  return (
    <div className="page-enter">

      {/* ── HERO ── */}
      <section className="hero-gradient relative overflow-hidden">
        {/* Ambient blobs */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute -top-40 -right-40 w-[500px] h-[500px] bg-primary-500/15 rounded-full blur-3xl" />
          <div className="absolute top-1/2 -left-20 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl" />
          <div className="absolute -bottom-20 right-1/3 w-64 h-64 bg-primary-400/10 rounded-full blur-2xl" />
        </div>

        <div className="page-container py-24 md:py-32 relative">
          <div className="max-w-3xl">
            {/* Trust badge */}
            <div className="inline-flex items-center gap-2 glass px-4 py-2 rounded-full text-sm text-white/80 mb-6">
              <Sparkles size={13} className="text-amber-400" />
              India's Most Trusted Real Estate Platform
            </div>

            <h1 className="font-display text-4xl sm:text-5xl md:text-6xl font-bold text-white leading-[1.1] mb-5">
              Find Your Perfect<br />
              <span className="text-primary-300 italic">Dream Home</span>
            </h1>
            <p className="text-white/60 text-lg mb-10 max-w-xl leading-relaxed">
              Explore thousands of verified properties across 50+ cities. Rent or buy — we make it effortless.
            </p>

            {/* Search box */}
            <div className="bg-white rounded-2xl p-2.5 shadow-2xl flex flex-col sm:flex-row gap-2.5 max-w-2xl">
              <div className="flex items-center gap-2 flex-1 px-3">
                <MapPin size={18} className="text-primary-500 shrink-0" />
                <input
                  type="text"
                  placeholder="Search by city, location, or keyword…"
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && handleSearch()}
                  className="flex-1 outline-none text-slate-800 placeholder:text-slate-400 text-sm py-1.5 bg-transparent"
                />
              </div>
              <select
                value={category}
                onChange={e => setCategory(e.target.value)}
                className="px-4 py-2.5 border-l border-slate-200 sm:border-none text-sm text-slate-600 bg-transparent focus:outline-none sm:rounded-xl sm:bg-slate-50 sm:border sm:border-slate-200"
              >
                <option value="">All Types</option>
                <option value="rent">For Rent</option>
                <option value="sale">For Sale</option>
              </select>
              <button onClick={handleSearch} className="btn-primary justify-center whitespace-nowrap px-6 py-3 rounded-xl">
                <Search size={16} /> Search Now
              </button>
            </div>

            {/* Quick city tags */}
            <div className="flex flex-wrap gap-2 mt-5">
              {['Mumbai', 'Delhi', 'Bangalore', 'Pune', 'Hyderabad'].map(city => (
                <button
                  key={city}
                  onClick={() => navigate(`/properties?city=${city}`)}
                  className="text-white/60 hover:text-white text-xs px-3.5 py-1.5 glass rounded-full transition-colors hover:bg-white/20"
                >
                  {city}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── STATS ── */}
      <section className="bg-white border-b border-slate-100">
        <div className="page-container py-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {STATS.map(({ label, value }) => (
              <div key={label} className="text-center">
                <p className="font-display text-3xl font-bold text-primary-600">{value}</p>
                <p className="text-slate-500 text-sm mt-1">{label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CATEGORIES ── */}
      <section className="page-container py-16">
        <div className="flex items-center justify-between mb-8">
          <div>
            <p className="text-primary-600 text-xs font-bold uppercase tracking-widest mb-1.5">Browse by Type</p>
            <h2 className="section-title">Property Categories</h2>
          </div>
          <button onClick={() => navigate('/properties')} className="btn-ghost hidden sm:flex">
            View All <ChevronRight size={16} />
          </button>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {CATEGORIES.map(({ icon, label, type, color }) => (
            <button
              key={type}
              onClick={() => navigate(`/properties?type=${type}`)}
              className="card p-6 text-center hover:shadow-lg hover:-translate-y-1 transition-all duration-300 group cursor-pointer"
            >
              <div className={`w-14 h-14 bg-gradient-to-br ${color} rounded-2xl flex items-center justify-center mx-auto mb-3 text-white group-hover:scale-110 transition-transform duration-300`}>
                {icon}
              </div>
              <p className="font-semibold text-slate-800 text-sm">{label}</p>
              <p className="text-xs text-slate-400 mt-0.5">Browse listings</p>
            </button>
          ))}
        </div>
      </section>

      {/* ── FEATURED ── */}
      {(loading || featured.length > 0) && (
        <section className="bg-gradient-to-b from-slate-50 to-white py-16">
          <div className="page-container">
            <div className="flex items-center justify-between mb-8">
              <div>
                <p className="text-primary-600 text-xs font-bold uppercase tracking-widest mb-1.5">Hand-picked</p>
                <h2 className="section-title">Featured Properties</h2>
              </div>
              <button onClick={() => navigate('/properties?featured=true')} className="btn-ghost hidden sm:flex">
                View All <ChevronRight size={16} />
              </button>
            </div>
            {loading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                {[...Array(4)].map((_, i) => <SkeletonCard key={i} />)}
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                {featured.map(p => <PropertyCard key={p._id} property={p} />)}
              </div>
            )}
          </div>
        </section>
      )}

      {/* ── RECENT ── */}
      <section className="page-container py-16">
        <div className="flex items-center justify-between mb-8">
          <div>
            <p className="text-primary-600 text-xs font-bold uppercase tracking-widest mb-1.5">Just Added</p>
            <h2 className="section-title">Latest Listings</h2>
          </div>
          <button onClick={() => navigate('/properties')} className="btn-ghost hidden sm:flex">
            View All <ChevronRight size={16} />
          </button>
        </div>
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {[...Array(8)].map((_, i) => <SkeletonCard key={i} />)}
          </div>
        ) : recent.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {recent.map(p => <PropertyCard key={p._id} property={p} />)}
          </div>
        ) : (
          <div className="text-center py-20 text-slate-400">
            <Building2 size={48} className="mx-auto mb-3 opacity-20" />
            <p className="font-medium">No properties listed yet</p>
          </div>
        )}
      </section>

      {/* ── WHY US ── */}
      <section className="bg-slate-900 text-white py-20">
        <div className="page-container">
          <div className="text-center mb-14">
            <p className="text-primary-400 text-xs font-bold uppercase tracking-widest mb-2">Why EstateVista?</p>
            <h2 className="font-display text-3xl md:text-4xl font-bold">Built for Modern Real Estate</h2>
            <p className="text-slate-400 mt-3 max-w-xl mx-auto">Everything you need to find, save, and connect — all in one platform.</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {FEATURES.map(({ icon, title, desc }) => (
              <div key={title} className="text-center p-6 rounded-2xl bg-slate-800/50 hover:bg-slate-800 transition-colors">
                <div className="w-12 h-12 bg-primary-500/20 text-primary-400 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  {icon}
                </div>
                <h3 className="font-semibold text-base mb-2">{title}</h3>
                <p className="text-slate-400 text-sm leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="page-container py-16">
        <div className="bg-gradient-to-br from-primary-600 via-primary-500 to-orange-400 rounded-3xl p-10 md:p-16 text-center text-white relative overflow-hidden">
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute top-0 right-0 w-72 h-72 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2" />
            <div className="absolute bottom-0 left-0 w-56 h-56 bg-white/10 rounded-full translate-y-1/2 -translate-x-1/2" />
          </div>
          <div className="relative">
            <h2 className="font-display text-3xl md:text-4xl font-bold mb-3">Own a Property? List it Today.</h2>
            <p className="text-white/80 mb-8 max-w-xl mx-auto text-base">
              Reach thousands of verified buyers and renters. Add your listing in under 5 minutes — completely free.
            </p>
            <button
              onClick={() => navigate('/register')}
              className="bg-white text-primary-700 hover:bg-primary-50 font-semibold px-8 py-3.5 rounded-2xl transition-colors shadow-lg inline-flex items-center gap-2"
            >
              Get Started Free <ChevronRight size={16} />
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}

function SkeletonCard() {
  return (
    <div className="card overflow-hidden">
      <div className="aspect-[4/3] skeleton" />
      <div className="p-4 space-y-3">
        <div className="h-4 skeleton rounded-lg w-3/4" />
        <div className="h-3 skeleton rounded-lg w-1/2" />
        <div className="flex gap-2">
          <div className="h-3 skeleton rounded-lg w-16" />
          <div className="h-3 skeleton rounded-lg w-16" />
        </div>
        <div className="h-5 skeleton rounded-lg w-1/3 mt-2" />
      </div>
    </div>
  );
}
