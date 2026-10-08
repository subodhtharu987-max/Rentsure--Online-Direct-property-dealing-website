import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Edit2 } from 'lucide-react';
import PropertyForm from '../../components/property/PropertyForm';
import { propertyAPI } from '../../services/api';
import toast from 'react-hot-toast';
import LoadingSpinner from '../../components/common/LoadingSpinner';

export default function EditPropertyPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);

  useEffect(() => {
    propertyAPI.getById(id)
      .then(({ data }) => setProperty(data.property))
      .catch(() => { toast.error('Property not found'); navigate('/owner/listings'); })
      .finally(() => setFetching(false));
  }, [id, navigate]);

  const handleSubmit = async (data) => {
    setLoading(true);
    try {
      await propertyAPI.update(id, data);
      toast.success('Property updated!');
      navigate('/owner/listings');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Update failed');
    } finally {
      setLoading(false);
    }
  };

  if (fetching) return <div className="min-h-screen flex items-center justify-center"><LoadingSpinner size="lg" /></div>;

  return (
    <div className="page-enter min-h-screen bg-slate-50">
      <div className="page-container py-8">
        <div className="max-w-3xl mx-auto">
          <div className="mb-6">
            <h1 className="font-display text-2xl font-bold text-slate-900 flex items-center gap-2">
              <Edit2 size={22} className="text-primary-600" /> Edit Property
            </h1>
            <p className="text-slate-500 text-sm mt-1">Update your property listing details below.</p>
          </div>
          {property && (
            <PropertyForm initialData={property} onSubmit={handleSubmit} loading={loading} submitLabel="Save Changes" />
          )}
        </div>
      </div>
    </div>
  );
}
