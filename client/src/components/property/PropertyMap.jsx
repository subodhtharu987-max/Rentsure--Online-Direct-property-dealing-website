import { useLoadScript, GoogleMap, MarkerF, InfoWindowF } from '@react-google-maps/api';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { MapPin } from 'lucide-react';

const MAP_STYLES = [
  { featureType: 'poi', elementType: 'labels', stylers: [{ visibility: 'off' }] },
  { featureType: 'transit', elementType: 'labels', stylers: [{ visibility: 'off' }] },
];

const DEFAULT_CENTER = { lat: 19.076, lng: 72.877 }; // Mumbai

export default function PropertyMap({ properties = [], center, zoom = 11 }) {
  const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: apiKey || '',
  });

  const [selected, setSelected] = useState(null);

  const mapCenter = center || DEFAULT_CENTER;

  if (!apiKey) {
    return (
      <div className="w-full h-full min-h-[400px] bg-gradient-to-br from-slate-100 to-slate-200 rounded-2xl flex flex-col items-center justify-center text-slate-500 gap-3">
        <MapPin size={40} className="text-slate-300" />
        <div className="text-center">
          <p className="font-semibold">Google Maps Not Configured</p>
          <p className="text-sm text-slate-400">Add VITE_GOOGLE_MAPS_API_KEY to .env</p>
        </div>
      </div>
    );
  }

  if (loadError) return (
    <div className="w-full h-full min-h-[400px] bg-red-50 rounded-2xl flex items-center justify-center text-red-500">
      Failed to load map
    </div>
  );

  if (!isLoaded) return (
    <div className="w-full h-full min-h-[400px] bg-slate-100 rounded-2xl flex items-center justify-center">
      <div className="w-8 h-8 border-2 border-primary-500 border-t-transparent rounded-full animate-spin" />
    </div>
  );

  const validProperties = properties.filter(
    p => p.location?.coordinates?.lat && p.location?.coordinates?.lng
  );

  return (
    <div className="map-container w-full h-full min-h-[400px]">
      <GoogleMap
        zoom={zoom}
        center={mapCenter}
        mapContainerStyle={{ width: '100%', height: '100%', minHeight: '400px' }}
        options={{ styles: MAP_STYLES, streetViewControl: false, mapTypeControl: false }}
      >
        {validProperties.map(prop => (
          <MarkerF
            key={prop._id}
            position={{ lat: prop.location.coordinates.lat, lng: prop.location.coordinates.lng }}
            onClick={() => setSelected(prop)}
            icon={{
              path: 'M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z',
              fillColor: '#0284c7',
              fillOpacity: 1,
              strokeColor: '#ffffff',
              strokeWeight: 2,
              scale: 1.5,
            }}
          />
        ))}

        {selected && (
          <InfoWindowF
            position={{ lat: selected.location.coordinates.lat, lng: selected.location.coordinates.lng }}
            onCloseClick={() => setSelected(null)}
          >
            <div className="p-2 max-w-[200px]">
              {selected.images?.[0] && (
                <img src={selected.images[0]} alt={selected.title} className="w-full h-24 object-cover rounded-lg mb-2" />
              )}
              <p className="font-semibold text-slate-900 text-sm line-clamp-1">{selected.title}</p>
              <p className="text-xs text-slate-500 mb-1">{selected.location.city}</p>
              <p className="text-primary-700 font-bold text-sm">₹{selected.price?.toLocaleString('en-IN')}</p>
              <Link
                to={`/properties/${selected._id}`}
                className="block mt-2 text-xs text-center text-white bg-primary-600 hover:bg-primary-700 px-3 py-1.5 rounded-lg transition-colors"
              >
                View Details
              </Link>
            </div>
          </InfoWindowF>
        )}
      </GoogleMap>
    </div>
  );
}
