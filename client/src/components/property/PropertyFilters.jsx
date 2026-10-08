export default function PropertyFilters({ filters, onChange, onReset }) {
  const set = (key, val) => onChange({ ...filters, [key]: val })

  return (
    <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5 space-y-5">
      <div className="flex items-center justify-between">
        <h3 className="font-display font-semibold text-gray-900">Filters</h3>
        <button onClick={onReset} className="text-xs text-primary-500 hover:text-primary-600 font-medium">Reset All</button>
      </div>

      <div>
        <label className="block text-xs font-medium text-gray-500 uppercase tracking-wider mb-2">Category</label>
        <div className="grid grid-cols-2 gap-2">
          {['', 'rent', 'sale'].map(c => (
            <button key={c} onClick={() => set('category', c)} className={`py-2 text-sm rounded-lg border transition-colors ${filters.category === c ? 'bg-primary-500 text-white border-primary-500' : 'border-gray-200 text-gray-600 hover:border-primary-300'}`}>
              {c === '' ? 'All' : c === 'rent' ? 'Rent' : 'Sale'}
            </button>
          ))}
        </div>
      </div>

      <div>
        <label className="block text-xs font-medium text-gray-500 uppercase tracking-wider mb-2">Property Type</label>
        <select value={filters.type} onChange={e => set('type', e.target.value)} className="input-field">
          <option value="">All Types</option>
          {['apartment','house','villa','studio','commercial','plot','penthouse'].map(t => (
            <option key={t} value={t} className="capitalize">{t.charAt(0).toUpperCase() + t.slice(1)}</option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-xs font-medium text-gray-500 uppercase tracking-wider mb-2">Price Range (₹)</label>
        <div className="grid grid-cols-2 gap-2">
          <input type="number" placeholder="Min" value={filters.minPrice} onChange={e => set('minPrice', e.target.value)} className="input-field" />
          <input type="number" placeholder="Max" value={filters.maxPrice} onChange={e => set('maxPrice', e.target.value)} className="input-field" />
        </div>
      </div>

      <div>
        <label className="block text-xs font-medium text-gray-500 uppercase tracking-wider mb-2">Bedrooms</label>
        <div className="flex gap-2">
          {['', '1', '2', '3', '4'].map(b => (
            <button key={b} onClick={() => set('bedrooms', b)} className={`flex-1 py-1.5 text-sm rounded-lg border transition-colors ${filters.bedrooms === b ? 'bg-primary-500 text-white border-primary-500' : 'border-gray-200 text-gray-600 hover:border-primary-300'}`}>
              {b === '' ? 'Any' : b === '4' ? '4+' : b}
            </button>
          ))}
        </div>
      </div>

      <div>
        <label className="block text-xs font-medium text-gray-500 uppercase tracking-wider mb-2">Furnishing</label>
        <select value={filters.furnishing} onChange={e => set('furnishing', e.target.value)} className="input-field">
          <option value="">Any</option>
          <option value="unfurnished">Unfurnished</option>
          <option value="semi-furnished">Semi-Furnished</option>
          <option value="fully-furnished">Fully Furnished</option>
        </select>
      </div>

      <div>
        <label className="block text-xs font-medium text-gray-500 uppercase tracking-wider mb-2">City</label>
        <input type="text" placeholder="Enter city..." value={filters.city} onChange={e => set('city', e.target.value)} className="input-field" />
      </div>
    </div>
  )
}
