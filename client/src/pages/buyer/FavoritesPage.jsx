import { useState, useEffect } from 'react';
import { Heart } from 'lucide-react';
import { favoriteAPI } from '../../services/api';
import PropertyCard from '../../components/property/PropertyCard';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { Link } from 'react-router-dom';

export default function FavoritesPage() {
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    try {
      const { data } = await favoriteAPI.getAll();
      setFavorites(data.favorites);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  // When a favorite is toggled off from the card, remove it from the list
  const handleToggle = (propertyId, isFavorited) => {
    if (!isFavorited) {
      setFavorites(prev => prev.filter(p => p._id !== propertyId));
    }
  };

  return (
    <div className="page-enter min-h-screen bg-slate-50">
      <div className="page-container py-8">
        <div className="mb-6">
          <h1 className="font-display text-2xl font-bold text-slate-900 flex items-center gap-2">
            <Heart size={22} className="text-red-500" fill="currentColor" /> Saved Properties
          </h1>
          <p className="text-slate-500 text-sm mt-1">
            {favorites.length} saved listing{favorites.length !== 1 ? 's' : ''}
          </p>
        </div>

        {loading ? (
          <div className="flex justify-center py-20">
            <LoadingSpinner size="lg" text="Loading your favorites…" />
          </div>
        ) : favorites.length === 0 ? (
          <div className="text-center py-24">
            <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-4">
              <Heart size={36} className="text-red-300" />
            </div>
            <h2 className="font-display text-xl font-bold text-slate-700 mb-2">No saved properties</h2>
            <p className="text-slate-400 text-sm mb-6">Start exploring and save properties you love</p>
            <Link to="/properties" className="btn-primary">Browse Properties</Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {favorites.map(p => (
              <PropertyCard
                key={p._id}
                property={p}
                isFavorited={true}
                onFavoriteToggle={handleToggle}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
