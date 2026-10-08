import { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { LayoutGrid, Map, SlidersHorizontal } from 'lucide-react';
import PropertyCard from '../../components/property/PropertyCard';
import SearchFilters from '../../components/property/SearchFilters';
import PropertyMap from '../../components/property/PropertyMap';
import Pagination from '../../components/common/Pagination';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { propertyAPI } from '../../services/api';

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

export default function PropertiesPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [properties, setProperties]     = useState([]);
  const [loading, setLoading]           = useState(true);
  const [total, setTotal]               = useState(0);
  const [pages, setPages]               = useState(1);
  const [currentPage, setCurrentPage]   = useState(1);
  const [view, setView]                 = useState('grid');
  const [showFilters, setShowFilters]   = useState(true);

  const getFiltersFromParams = useCallback(() => {
    const f = {};
    ['search', 'category', 'type', 'city', 'minPrice', 'maxPrice', 'bedrooms', 'bathrooms', 'furnishing'].forEach(k => {
      const v = searchParams.get(k);
      if (v) f[k] = v;
    });
    return f;
  }, [searchParams]);

  const fetchProperties = useCallback(async (filters, page = 1) => {
    setLoading(true);
    try {
      const params = { ...filters, status: 'approved', page, limit: 12 };
      const { data } = await propertyAPI.getAll(params);
      setProperties(data.properties);
      setTotal(data.total);
      setPages(data.pages);
      setCurrentPage(page);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProperties(getFiltersFromParams(), 1);
  }, [searchParams, fetchProperties, getFiltersFromParams]);

  const handleFilter = (filters) => {
    setSearchParams(new URLSearchParams(filters));
  };

  const handlePage = (page) => {
    fetchProperties(getFiltersFromParams(), page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="page-enter min-h-screen bg-slate-50">
      <div className="page-container py-8">

        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="font-display text-2xl font-bold text-slate-900">Property Listings</h1>
            <p className="text-slate-500 text-sm mt-0.5">
              {loading ? 'Loading…' : `${total.toLocaleString()} propert${total === 1 ? 'y' : 'ies'} found`}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`btn-secondary text-sm py-2 ${showFilters ? 'bg-primary-50 border-primary-200 text-primary-700' : ''}`}
            >
              <SlidersHorizontal size={15} />
              Filters
            </button>
            <div className="flex rounded-xl border border-slate-200 bg-white overflow-hidden">
              <button
                onClick={() => setView('grid')}
                className={`px-3 py-2.5 transition-colors ${view === 'grid' ? 'bg-primary-600 text-white' : 'text-slate-500 hover:bg-slate-50'}`}
                aria-label="Grid view"
              >
                <LayoutGrid size={16} />
              </button>
              <button
                onClick={() => setView('map')}
                className={`px-3 py-2.5 transition-colors ${view === 'map' ? 'bg-primary-600 text-white' : 'text-slate-500 hover:bg-slate-50'}`}
                aria-label="Map view"
              >
                <Map size={16} />
              </button>
            </div>
          </div>
        </div>

        {/* Filters panel */}
        {showFilters && (
          <div className="mb-6 animate-slide-down">
            <SearchFilters onFilter={handleFilter} initialFilters={getFiltersFromParams()} />
          </div>
        )}

        {view === 'map' ? (
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
            <div className="lg:col-span-2 space-y-4 overflow-y-auto max-h-[80vh] pr-1">
              {loading ? (
                <div className="flex justify-center py-10"><LoadingSpinner text="Loading properties…" /></div>
              ) : properties.map(p => (
                <PropertyCard key={p._id} property={p} />
              ))}
            </div>
            <div className="lg:col-span-3 h-[80vh] sticky top-20 rounded-2xl overflow-hidden shadow-md">
              <PropertyMap properties={properties} />
            </div>
          </div>
        ) : (
          <>
            {loading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                {[...Array(8)].map((_, i) => <SkeletonCard key={i} />)}
              </div>
            ) : properties.length > 0 ? (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                  {properties.map(p => <PropertyCard key={p._id} property={p} />)}
                </div>
                <Pagination currentPage={currentPage} totalPages={pages} onPageChange={handlePage} />
              </>
            ) : (
              <div className="text-center py-24 text-slate-400">
                <SlidersHorizontal size={48} className="mx-auto mb-3 opacity-20" />
                <p className="font-display font-semibold text-lg text-slate-600">No properties match your filters</p>
                <p className="text-sm mt-1">Try adjusting or clearing your search criteria</p>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
