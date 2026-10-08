import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  MapPin, Bed, Bath, Maximize, Heart, MessageSquare, Share2, ArrowLeft,
  Calendar, Home, CheckCircle2, Eye, Phone, Mail, Star
} from 'lucide-react';
import { propertyAPI, favoriteAPI, inquiryAPI } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import toast from 'react-hot-toast';

const PLACEHOLDER = 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&q=80';

function formatPrice(price) {
  if (price >= 10000000) return `₹${(price / 10000000).toFixed(2)} Cr`;
  if (price >= 100000)   return `₹${(price / 100000).toFixed(2)} L`;
  return `₹${price?.toLocaleString('en-IN')}`;
}

const STATUS_BADGE = {
  approved: 'badge badge-success',
  pending:  'badge badge-warning',
  rejected: 'badge badge-danger',
};

export default function PropertyDetailPage() {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [property, setProperty]       = useState(null);
  const [loading, setLoading]         = useState(true);
  const [selectedImg, setSelectedImg] = useState(0);
  const [favorited, setFavorited]     = useState(false);
  const [message, setMessage]         = useState('');
  const [sending, setSending]         = useState(false);
  const [inquirySent, setInquirySent] = useState(false);

  useEffect(() => {
    const load = async () => {
      try {
        const { data } = await propertyAPI.getById(id);
        setProperty(data.property);
        if (user) {
          const favRes = await favoriteAPI.check(id);
          setFavorited(favRes.data.favorited);
        }
      } catch {
        toast.error('Property not found');
        navigate('/properties');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [id, user, navigate]);

  const toggleFav = async () => {
    if (!user) { toast.error('Please log in'); return; }
    const { data } = await favoriteAPI.toggle(id);
    setFavorited(data.favorited);
    toast.success(data.favorited ? 'Saved to favorites!' : 'Removed from favorites');
  };

  const sendInquiry = async (e) => {
    e.preventDefault();
    if (!user)            { toast.error('Please log in to send an inquiry'); return; }
    if (!message.trim())  { toast.error('Please enter a message'); return; }
    setSending(true);
    try {
      await inquiryAPI.create({ propertyId: id, message });
      setInquirySent(true);
      setMessage('');
      toast.success('Inquiry sent successfully!');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to send inquiry');
    } finally {
      setSending(false);
    }
  };

  const share = () => {
    navigator.clipboard.writeText(window.location.href);
    toast.success('Link copied to clipboard!');
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center">
      <LoadingSpinner size="lg" text="Loading property…" />
    </div>
  );
  if (!property) return null;

  const images = property.images?.length ? property.images : [PLACEHOLDER];
  const isOwner = user?._id === property.ownerId?._id || user?.role === 'admin';

  return (
    <div className="page-enter min-h-screen bg-slate-50">
      <div className="page-container py-6">

        {/* Back button */}
        <button onClick={() => navigate(-1)} className="btn-ghost mb-6 -ml-1">
          <ArrowLeft size={17} /> Back to listings
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          {/* ── Left column ── */}
          <div className="lg:col-span-2 space-y-5">

            {/* Gallery */}
            <div className="card overflow-hidden">
              <div className="relative aspect-video bg-slate-100">
                <img
                  src={images[selectedImg]}
                  alt={property.title}
                  className="w-full h-full object-cover"
                  onError={e => { e.target.src = PLACEHOLDER; }}
                />
                {/* Badges overlay */}
                <div className="absolute top-4 left-4 flex items-center gap-2">
                  <span className={`badge ${property.category === 'rent' ? 'badge-info' : 'badge-success'}`}>
                    For {property.category === 'rent' ? 'Rent' : 'Sale'}
                  </span>
                  <span className={STATUS_BADGE[property.status] || 'badge badge-slate'}>
                    {property.status}
                  </span>
                </div>
                {/* Views */}
                <div className="absolute bottom-4 right-4 flex items-center gap-1.5 bg-black/50 text-white text-xs px-2.5 py-1.5 rounded-full">
                  <Eye size={12} /> {property.views ?? 0} views
                </div>
              </div>
              {/* Thumbnails */}
              {images.length > 1 && (
                <div className="flex gap-2 p-3 overflow-x-auto bg-slate-50">
                  {images.map((img, i) => (
                    <button
                      key={i}
                      onClick={() => setSelectedImg(i)}
                      className={`w-16 h-12 rounded-xl overflow-hidden shrink-0 border-2 transition-all ${
                        i === selectedImg ? 'border-primary-500 opacity-100' : 'border-transparent opacity-50 hover:opacity-80'
                      }`}
                    >
                      <img src={img} alt="" className="w-full h-full object-cover" onError={e => { e.target.src = PLACEHOLDER; }} />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Title + actions */}
            <div className="card p-6">
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                <div className="flex-1">
                  <p className="text-xs text-slate-400 uppercase tracking-wider font-semibold capitalize mb-1">{property.type}</p>
                  <h1 className="font-display text-2xl md:text-3xl font-bold text-slate-900 leading-tight">{property.title}</h1>
                  <div className="flex items-center gap-1.5 text-slate-500 text-sm mt-2">
                    <MapPin size={14} className="text-primary-500 shrink-0" />
                    {property.location?.address}, {property.location?.city}, {property.location?.state}
                  </div>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={toggleFav}
                    className={`w-10 h-10 rounded-xl border flex items-center justify-center transition-all ${
                      favorited
                        ? 'border-red-200 bg-red-50 text-red-500'
                        : 'border-slate-200 bg-white text-slate-400 hover:text-red-400 hover:border-red-200'
                    }`}
                    aria-label={favorited ? 'Remove from favorites' : 'Save to favorites'}
                  >
                    <Heart size={18} fill={favorited ? 'currentColor' : 'none'} />
                  </button>
                  <button
                    onClick={share}
                    className="w-10 h-10 rounded-xl border border-slate-200 bg-white text-slate-400 hover:text-slate-700 flex items-center justify-center transition-colors"
                    aria-label="Share"
                  >
                    <Share2 size={18} />
                  </button>
                  {isOwner && (
                    <Link to={`/owner/edit/${property._id}`} className="btn-secondary text-sm py-2">
                      Edit
                    </Link>
                  )}
                </div>
              </div>

              {/* Price */}
              <div className="flex items-end gap-2 mt-5 p-4 bg-primary-50 rounded-2xl">
                <p className="font-display text-3xl font-bold text-primary-700">{formatPrice(property.price)}</p>
                {property.priceType === 'per_month' && <span className="text-slate-500 text-sm mb-1">/month</span>}
              </div>

              {/* Quick stats */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-4">
                {[
                  { icon: <Bed size={16} />,      label: 'Bedrooms',  val: property.bedrooms  || 'N/A' },
                  { icon: <Bath size={16} />,     label: 'Bathrooms', val: property.bathrooms || 'N/A' },
                  { icon: <Maximize size={16} />, label: 'Area',      val: property.area ? `${property.area} ${property.areaUnit}` : 'N/A' },
                  { icon: <Home size={16} />,     label: 'Floor',     val: property.floor ? `${property.floor}/${property.totalFloors}` : 'N/A' },
                ].map(({ icon, label, val }) => (
                  <div key={label} className="bg-slate-50 rounded-2xl p-3 text-center">
                    <div className="flex items-center justify-center gap-1.5 text-primary-600 mb-1">{icon}</div>
                    <p className="font-semibold text-slate-800 text-sm">{val}</p>
                    <p className="text-xs text-slate-400">{label}</p>
                  </div>
                ))}
              </div>

              {/* Details grid */}
              <div className="grid grid-cols-2 gap-x-6 mt-4 text-sm">
                {[
                  { label: 'Furnishing',     val: property.furnishing },
                  { label: 'Property Type',  val: property.type },
                  { label: 'Category',       val: `For ${property.category}` },
                  { label: 'Year Built',     val: property.yearBuilt || 'N/A' },
                ].map(({ label, val }) => (
                  <div key={label} className="flex justify-between py-2.5 border-b border-slate-100">
                    <span className="text-slate-500">{label}</span>
                    <span className="font-medium text-slate-700 capitalize">{val}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Description */}
            <div className="card p-6">
              <h2 className="font-display text-xl font-bold text-slate-900 mb-3">Description</h2>
              <p className="text-slate-600 leading-relaxed whitespace-pre-line">{property.description}</p>
            </div>

            {/* Amenities */}
            {property.amenities?.length > 0 && (
              <div className="card p-6">
                <h2 className="font-display text-xl font-bold text-slate-900 mb-4">Amenities</h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                  {property.amenities.map(a => (
                    <div key={a} className="flex items-center gap-2 text-sm text-slate-700">
                      <CheckCircle2 size={15} className="text-emerald-500 shrink-0" />
                      <span className="capitalize">{a}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* ── Right column ── */}
          <div className="space-y-5">
            <div className="card p-5 sticky top-24">

              {/* Owner info */}
              <h3 className="font-semibold text-slate-800 mb-4 text-sm uppercase tracking-wide text-slate-400">Listed By</h3>
              <div className="flex items-center gap-3 mb-5">
                <div className="w-12 h-12 bg-gradient-to-br from-primary-500 to-primary-700 rounded-full flex items-center justify-center text-white text-lg font-bold shrink-0">
                  {property.ownerId?.name?.charAt(0)}
                </div>
                <div>
                  <p className="font-semibold text-slate-900">{property.ownerId?.name}</p>
                  <div className="flex items-center gap-1 mt-0.5">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} size={11} fill="#f59e0b" className="text-amber-400" />
                    ))}
                    <span className="text-xs text-slate-400 ml-1">Verified Owner</span>
                  </div>
                </div>
              </div>

              <div className="space-y-2.5 mb-5 pb-5 border-b border-slate-100">
                <a href={`mailto:${property.ownerId?.email}`}
                  className="flex items-center gap-2.5 text-sm text-slate-600 hover:text-primary-600 transition-colors">
                  <Mail size={15} className="text-primary-500 shrink-0" /> {property.ownerId?.email}
                </a>
                {property.ownerId?.phone && (
                  <a href={`tel:${property.ownerId.phone}`}
                    className="flex items-center gap-2.5 text-sm text-slate-600 hover:text-primary-600 transition-colors">
                    <Phone size={15} className="text-primary-500 shrink-0" /> {property.ownerId.phone}
                  </a>
                )}
                <div className="flex items-center gap-2.5 text-sm text-slate-400">
                  <Calendar size={15} className="shrink-0" />
                  Member since {new Date(property.ownerId?.createdAt || Date.now()).toLocaleDateString('en-IN', { month: 'long', year: 'numeric' })}
                </div>
              </div>

              {/* Inquiry form */}
              {!isOwner && (
                <>
                  <h3 className="font-semibold text-slate-800 mb-3 flex items-center gap-2 text-sm">
                    <MessageSquare size={15} className="text-primary-500" /> Send Inquiry
                  </h3>
                  {inquirySent ? (
                    <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-4 text-center">
                      <CheckCircle2 size={26} className="text-emerald-500 mx-auto mb-2" />
                      <p className="text-sm font-semibold text-emerald-700">Inquiry sent!</p>
                      <p className="text-xs text-emerald-500 mt-1">The owner will get back to you soon.</p>
                    </div>
                  ) : (
                    <form onSubmit={sendInquiry} className="space-y-3">
                      <textarea
                        rows={4}
                        value={message}
                        onChange={e => setMessage(e.target.value)}
                        placeholder={`Hi, I'm interested in this ${property.category === 'rent' ? 'rental' : 'property'}. Please share more details…`}
                        className="input-field resize-none text-sm"
                      />
                      {user ? (
                        <button type="submit" disabled={sending} className="btn-primary w-full justify-center">
                          {sending
                            ? <><LoadingSpinner size="sm" color="white" inline /> Sending…</>
                            : <><MessageSquare size={15} /> Send Message</>
                          }
                        </button>
                      ) : (
                        <div className="text-center">
                          <p className="text-xs text-slate-400 mb-2">Please log in to send an inquiry</p>
                          <Link to="/login" className="btn-primary w-full justify-center">Log In</Link>
                        </div>
                      )}
                    </form>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
