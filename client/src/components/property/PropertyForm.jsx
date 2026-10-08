import { useState } from 'react';
import { Plus, X, MapPin, ImageIcon } from 'lucide-react';
import LoadingSpinner from '../common/LoadingSpinner';

const TYPES = ['apartment', 'house', 'villa', 'studio', 'commercial', 'plot', 'penthouse'];
const AMENITIES_LIST = [
  'parking', 'gym', 'swimming pool', 'security', 'power backup', 'lift', 'garden',
  'balcony', 'wifi', 'ac', 'modular kitchen', 'pet friendly', 'club house', 'play area'
];

const DEFAULT_FORM = {
  title: '', description: '', price: '', priceType: 'total',
  category: 'sale', type: 'apartment',
  bedrooms: '', bathrooms: '', area: '', areaUnit: 'sq ft',
  floor: '', totalFloors: '', yearBuilt: '', furnishing: 'unfurnished',
  amenities: [], images: [],
  location: {
    address: '', city: '', state: '', country: 'India',
    zipCode: '', coordinates: { lat: '', lng: '' }
  },
};

export default function PropertyForm({ initialData = {}, onSubmit, loading, submitLabel = 'Submit' }) {
  // ✅ Fixed: no duplicate keys — merge cleanly
  const [form, setForm] = useState(() => ({
    ...DEFAULT_FORM,
    ...initialData,
    amenities: initialData.amenities || [],
    images:    initialData.images    || [],
    location:  initialData.location
      ? { ...DEFAULT_FORM.location, ...initialData.location }
      : DEFAULT_FORM.location,
  }));

  const [imgInput,     setImgInput]     = useState('');
  const [amenityInput, setAmenityInput] = useState('');

  const set    = (k, v) => setForm(p => ({ ...p, [k]: v }));
  const setLoc = (k, v) => setForm(p => ({ ...p, location: { ...p.location, [k]: v } }));
  const setCoord = (k, v) => setForm(p => ({
    ...p,
    location: { ...p.location, coordinates: { ...p.location.coordinates, [k]: v } }
  }));

  const toggleAmenity = (a) =>
    set('amenities', form.amenities.includes(a)
      ? form.amenities.filter(x => x !== a)
      : [...form.amenities, a]);

  const addCustomAmenity = () => {
    const val = amenityInput.trim().toLowerCase();
    if (val && !form.amenities.includes(val)) {
      set('amenities', [...form.amenities, val]);
      setAmenityInput('');
    }
  };

  const addImage = () => {
    const val = imgInput.trim();
    if (val && !form.images.includes(val)) {
      set('images', [...form.images, val]);
      setImgInput('');
    }
  };

  const removeImage = (i) => set('images', form.images.filter((_, idx) => idx !== i));

  const handleSubmit = (e) => {
    e.preventDefault();
    const data = {
      ...form,
      price:       Number(form.price)       || 0,
      bedrooms:    Number(form.bedrooms)    || 0,
      bathrooms:   Number(form.bathrooms)   || 0,
      area:        Number(form.area)        || undefined,
      floor:       Number(form.floor)       || undefined,
      totalFloors: Number(form.totalFloors) || undefined,
      yearBuilt:   Number(form.yearBuilt)   || undefined,
      location: {
        ...form.location,
        coordinates: {
          lat: Number(form.location.coordinates?.lat) || undefined,
          lng: Number(form.location.coordinates?.lng) || undefined,
        }
      }
    };
    onSubmit(data);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">

      {/* ── Basic Info ── */}
      <div className="card p-6">
        <h2 className="font-display text-lg font-bold text-slate-900 mb-4">Basic Information</h2>
        <div className="space-y-4">
          <div>
            <label className="label">Property Title *</label>
            <input required type="text" className="input-field"
              placeholder="e.g. Spacious 3BHK Apartment in Bandra"
              value={form.title} onChange={e => set('title', e.target.value)} />
          </div>
          <div>
            <label className="label">Description *</label>
            <textarea required rows={5} className="input-field resize-none"
              placeholder="Describe the property in detail..."
              value={form.description} onChange={e => set('description', e.target.value)} />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="label">Category *</label>
              <select required className="select-field" value={form.category}
                onChange={e => set('category', e.target.value)}>
                <option value="sale">For Sale</option>
                <option value="rent">For Rent</option>
              </select>
            </div>
            <div>
              <label className="label">Property Type *</label>
              <select required className="select-field" value={form.type}
                onChange={e => set('type', e.target.value)}>
                {TYPES.map(t => (
                  <option key={t} value={t} className="capitalize">
                    {t.charAt(0).toUpperCase() + t.slice(1)}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="label">Price (₹) *</label>
              <input required type="number" min="0" className="input-field"
                placeholder="Enter price"
                value={form.price} onChange={e => set('price', e.target.value)} />
            </div>
            <div>
              <label className="label">Price Type</label>
              <select className="select-field" value={form.priceType}
                onChange={e => set('priceType', e.target.value)}>
                <option value="total">Total Price</option>
                <option value="per_month">Per Month</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* ── Property Details ── */}
      <div className="card p-6">
        <h2 className="font-display text-lg font-bold text-slate-900 mb-4">Property Details</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          {[
            { label: 'Bedrooms',    key: 'bedrooms',    ph: '0'    },
            { label: 'Bathrooms',   key: 'bathrooms',   ph: '0'    },
            { label: 'Area',        key: 'area',        ph: '1200' },
            { label: 'Floor No.',   key: 'floor',       ph: '3'    },
            { label: 'Total Floors',key: 'totalFloors', ph: '10'   },
            { label: 'Year Built',  key: 'yearBuilt',   ph: '2020' },
          ].map(({ label, key, ph }) => (
            <div key={key}>
              <label className="label">{label}</label>
              <input type="number" min="0" className="input-field" placeholder={ph}
                value={form[key]} onChange={e => set(key, e.target.value)} />
            </div>
          ))}
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
          <div>
            <label className="label">Area Unit</label>
            <select className="select-field" value={form.areaUnit}
              onChange={e => set('areaUnit', e.target.value)}>
              <option value="sq ft">sq ft</option>
              <option value="sq m">sq m</option>
              <option value="sq yard">sq yard</option>
              <option value="acres">acres</option>
            </select>
          </div>
          <div>
            <label className="label">Furnishing</label>
            <select className="select-field" value={form.furnishing}
              onChange={e => set('furnishing', e.target.value)}>
              <option value="unfurnished">Unfurnished</option>
              <option value="semi-furnished">Semi-furnished</option>
              <option value="fully-furnished">Fully Furnished</option>
            </select>
          </div>
        </div>
      </div>

      {/* ── Location ── */}
      <div className="card p-6">
        <h2 className="font-display text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
          <MapPin size={18} className="text-primary-600" /> Location
        </h2>
        <div className="space-y-4">
          <div>
            <label className="label">Full Address *</label>
            <input required type="text" className="input-field"
              placeholder="Street address, building name..."
              value={form.location.address} onChange={e => setLoc('address', e.target.value)} />
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[
              { label: 'City *', key: 'city',    req: true,  ph: 'Mumbai'      },
              { label: 'State',  key: 'state',   req: false, ph: 'Maharashtra' },
              { label: 'Country',key: 'country', req: false, ph: 'India'       },
              { label: 'Zip',    key: 'zipCode', req: false, ph: '400001'      },
            ].map(({ label, key, req, ph }) => (
              <div key={key}>
                <label className="label">{label}</label>
                <input type="text" required={req} className="input-field" placeholder={ph}
                  value={form.location[key]} onChange={e => setLoc(key, e.target.value)} />
              </div>
            ))}
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="label">Latitude (for map)</label>
              <input type="number" step="any" className="input-field" placeholder="19.0760"
                value={form.location.coordinates?.lat || ''}
                onChange={e => setCoord('lat', e.target.value)} />
            </div>
            <div>
              <label className="label">Longitude (for map)</label>
              <input type="number" step="any" className="input-field" placeholder="72.8777"
                value={form.location.coordinates?.lng || ''}
                onChange={e => setCoord('lng', e.target.value)} />
            </div>
          </div>
        </div>
      </div>

      {/* ── Images ── */}
      <div className="card p-6">
        <h2 className="font-display text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
          <ImageIcon size={18} className="text-primary-600" /> Property Images
        </h2>
        <p className="text-sm text-slate-500 mb-3">Add image URLs (Unsplash, Imgur, Cloudinary…)</p>
        <div className="flex gap-2 mb-4">
          <input type="url" className="input-field flex-1" placeholder="https://..."
            value={imgInput} onChange={e => setImgInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), addImage())} />
          <button type="button" onClick={addImage} className="btn-primary py-2 px-4 shrink-0">
            <Plus size={16} /> Add
          </button>
        </div>
        {form.images.length > 0 && (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {form.images.map((img, i) => (
              <div key={i} className="relative group">
                <img src={img} alt="" className="w-full h-24 object-cover rounded-xl bg-slate-100"
                  onError={e => { e.target.style.background = '#f1f5f9'; }} />
                <button type="button" onClick={() => removeImage(i)}
                  className="absolute top-1 right-1 w-6 h-6 bg-red-500 text-white rounded-full items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity flex">
                  <X size={12} />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ── Amenities ── */}
      <div className="card p-6">
        <h2 className="font-display text-lg font-bold text-slate-900 mb-4">Amenities</h2>
        <div className="flex flex-wrap gap-2 mb-4">
          {AMENITIES_LIST.map(a => (
            <button key={a} type="button" onClick={() => toggleAmenity(a)}
              className={`px-3 py-1.5 rounded-full text-sm border transition-all capitalize ${
                form.amenities.includes(a)
                  ? 'bg-primary-600 text-white border-primary-600'
                  : 'bg-white text-slate-600 border-slate-200 hover:border-primary-400'
              }`}>
              {a}
            </button>
          ))}
        </div>
        <div className="flex gap-2">
          <input type="text" className="input-field flex-1 text-sm"
            placeholder="Add custom amenity..."
            value={amenityInput} onChange={e => setAmenityInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), addCustomAmenity())} />
          <button type="button" onClick={addCustomAmenity} className="btn-secondary text-sm py-2">
            <Plus size={15} /> Add
          </button>
        </div>
      </div>

      {/* ── Submit ── */}
      <button type="submit" disabled={loading}
        className="btn-primary w-full justify-center py-3.5 text-base disabled:opacity-60">
        {loading ? <><LoadingSpinner size="sm" color="white" inline /> Submitting…</> : submitLabel}
      </button>
    </form>
  );
}