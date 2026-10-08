import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { favoriteAPI } from '../../services/api'
import { Heart, MapPin, Bed, Bath, Maximize2 } from 'lucide-react'
import toast from 'react-hot-toast'

const PLACEHOLDER = 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800&auto=format&fit=crop'

function formatPrice(price, category) {
  let p;
  if (price >= 10000000)      p = `₹${(price / 10000000).toFixed(1)}Cr`;
  else if (price >= 100000)   p = `₹${(price / 100000).toFixed(1)}L`;
  else                        p = `₹${price?.toLocaleString('en-IN')}`;
  return category === 'rent' ? `${p}/mo` : p;
}

export default function PropertyCard({ property, onFavoriteToggle, isFavorited = false }) {
  const { user } = useAuth()
  const [favorited, setFavorited] = useState(isFavorited)
  const [favLoading, setFavLoading] = useState(false)

  const img = property.images?.[0] || PLACEHOLDER

  const handleFavorite = async (e) => {
    e.preventDefault()
    e.stopPropagation()
    if (!user) { toast.error('Log in to save favorites'); return; }
    setFavLoading(true)
    try {
      const { data } = await favoriteAPI.toggle(property._id)
      setFavorited(data.favorited)
      toast.success(data.favorited ? 'Saved to favorites' : 'Removed from favorites')
      if (onFavoriteToggle) onFavoriteToggle(property._id, data.favorited)
    } catch {
      toast.error('Failed to update favorites')
    } finally {
      setFavLoading(false)
    }
  }

  return (
    <Link to={`/properties/${property._id}`} className="card group block hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300">
      {/* Image */}
      <div className="relative overflow-hidden aspect-video bg-slate-100">
        <img
          src={img}
          alt={property.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          onError={e => { e.target.src = PLACEHOLDER }}
          loading="lazy"
        />
        {/* Category + featured badges */}
        <div className="absolute top-3 left-3 flex gap-1.5">
          <span className={property.category === 'rent' ? 'badge badge-info' : 'badge badge-success'}>
            {property.category === 'rent' ? 'For Rent' : 'For Sale'}
          </span>
          {property.isFeatured && (
            <span className="badge bg-primary-500 text-white">Featured</span>
          )}
        </div>
        {/* Favorite button */}
        <button
          onClick={handleFavorite}
          disabled={favLoading}
          aria-label={favorited ? 'Remove from favorites' : 'Save to favorites'}
          className={`absolute top-3 right-3 w-8 h-8 rounded-full flex items-center justify-center shadow-md transition-all ${
            favorited
              ? 'bg-red-500 text-white hover:bg-red-600'
              : 'bg-white/90 text-slate-400 hover:text-red-500 hover:bg-white'
          }`}
        >
          <Heart size={15} fill={favorited ? 'currentColor' : 'none'} />
        </button>
      </div>

      {/* Content */}
      <div className="p-4">
        <div className="flex items-start justify-between gap-2 mb-1.5">
          <h3 className="font-semibold text-slate-900 text-sm leading-snug line-clamp-1 group-hover:text-primary-600 transition-colors flex-1">
            {property.title}
          </h3>
          <p className="font-display font-bold text-primary-600 text-sm whitespace-nowrap">
            {formatPrice(property.price, property.category)}
          </p>
        </div>

        <div className="flex items-center gap-1 text-slate-500 text-xs mb-3">
          <MapPin size={11} className="text-primary-400 shrink-0" />
          <span className="truncate">{property.location?.city}{property.location?.state ? `, ${property.location.state}` : ''}</span>
        </div>

        <div className="flex items-center gap-3 text-xs text-slate-500 pt-3 border-t border-slate-100">
          {property.bedrooms > 0 && (
            <span className="flex items-center gap-1">
              <Bed size={12} className="text-slate-400" /> {property.bedrooms} Bed
            </span>
          )}
          {property.bathrooms > 0 && (
            <span className="flex items-center gap-1">
              <Bath size={12} className="text-slate-400" /> {property.bathrooms} Bath
            </span>
          )}
          {property.area && (
            <span className="flex items-center gap-1">
              <Maximize2 size={12} className="text-slate-400" /> {property.area} {property.areaUnit}
            </span>
          )}
          <span className="ml-auto capitalize text-slate-400">{property.type}</span>
        </div>
      </div>
    </Link>
  )
}
