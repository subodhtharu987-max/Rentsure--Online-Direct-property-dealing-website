import { useState, useEffect } from 'react';
import { Search, SlidersHorizontal, X, ChevronDown } from 'lucide-react';

const PROPERTY_TYPES = ['apartment', 'house', 'villa', 'studio', 'commercial', 'plot', 'penthouse'];
const FURNISHING_TYPES = ['unfurnished', 'semi-furnished', 'fully-furnished'];

export default function SearchFilters({ onFilter, initialFilters = {} }) {
  const [filters, setFilters] = useState({
    search: '', category: '', type: '', city: '',
    minPrice: '', maxPrice: '', bedrooms: '', bathrooms: '',
    furnishing: '', ...initialFilters
  });
  const [showAdvanced, setShowAdvanced] = useState(false);

  const set = (key, val) => setFilters(prev => ({ ...prev, [key]: val }));

  const apply = () => {
    const clean = Object.fromEntries(Object.entries(filters).filter(([, v]) => v !== ''));
    onFilter(clean);
  };

  const reset = () => {
    const empty = Object.fromEntries(Object.keys(filters).map(k => [k, '']));
    setFilters(empty);
    onFilter({});
  };

  const hasFilters = Object.values(filters).some(v => v !== '');

  return (
    <div className="card p-4 space-y-4">
      {/* Search bar */}
      <div className="relative">
        <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
        <input
          type="text"
          placeholder="Search by title, location, city..."
          value={filters.search}
          onChange={e => set('search', e.target.value)}
          onKeyDown={e => e.key === 'Enter' && apply()}
          className="input-field pl-10 pr-4"
        />
      </div>

      {/* Category + Type + City */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div>
          <label className="label">Category</label>
          <select className="select-field" value={filters.category} onChange={e => set('category', e.target.value)}>
            <option value="">All Categories</option>
            <option value="rent">For Rent</option>
            <option value="sale">For Sale</option>
          </select>
        </div>
        <div>
          <label className="label">Property Type</label>
          <select className="select-field" value={filters.type} onChange={e => set('type', e.target.value)}>
            <option value="">All Types</option>
            {PROPERTY_TYPES.map(t => (
              <option key={t} value={t} className="capitalize">{t.charAt(0).toUpperCase() + t.slice(1)}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="label">City</label>
          <input
            type="text"
            placeholder="Enter city..."
            className="input-field"
            value={filters.city}
            onChange={e => set('city', e.target.value)}
          />
        </div>
      </div>

      {/* Price range */}
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="label">Min Price (₹)</label>
          <input type="number" className="input-field" placeholder="0" value={filters.minPrice} onChange={e => set('minPrice', e.target.value)} />
        </div>
        <div>
          <label className="label">Max Price (₹)</label>
          <input type="number" className="input-field" placeholder="Any" value={filters.maxPrice} onChange={e => set('maxPrice', e.target.value)} />
        </div>
      </div>

      {/* Advanced toggle */}
      <button
        type="button"
        onClick={() => setShowAdvanced(!showAdvanced)}
        className="flex items-center gap-2 text-sm text-primary-600 font-medium hover:text-primary-700"
      >
        <SlidersHorizontal size={14} />
        {showAdvanced ? 'Hide' : 'Show'} Advanced Filters
        <ChevronDown size={14} className={`transition-transform ${showAdvanced ? 'rotate-180' : ''}`} />
      </button>

      {showAdvanced && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1 border-t border-slate-100 animate-slide-up">
          <div>
            <label className="label">Bedrooms (min)</label>
            <select className="select-field" value={filters.bedrooms} onChange={e => set('bedrooms', e.target.value)}>
              <option value="">Any</option>
              {[1, 2, 3, 4, 5].map(n => <option key={n} value={n}>{n}+</option>)}
            </select>
          </div>
          <div>
            <label className="label">Bathrooms (min)</label>
            <select className="select-field" value={filters.bathrooms} onChange={e => set('bathrooms', e.target.value)}>
              <option value="">Any</option>
              {[1, 2, 3, 4].map(n => <option key={n} value={n}>{n}+</option>)}
            </select>
          </div>
          <div>
            <label className="label">Furnishing</label>
            <select className="select-field" value={filters.furnishing} onChange={e => set('furnishing', e.target.value)}>
              <option value="">Any</option>
              {FURNISHING_TYPES.map(f => <option key={f} value={f} className="capitalize">{f}</option>)}
            </select>
          </div>
        </div>
      )}

      {/* Actions */}
      <div className="flex items-center gap-3 pt-2">
        <button onClick={apply} className="btn-primary flex-1 justify-center">
          <Search size={16} /> Search Properties
        </button>
        {hasFilters && (
          <button onClick={reset} className="btn-secondary gap-1.5">
            <X size={14} /> Clear
          </button>
        )}
      </div>
    </div>
  );
}
