import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus } from 'lucide-react';
import PropertyForm from '../../components/property/PropertyForm';
import { propertyAPI } from '../../services/api';
import toast from 'react-hot-toast';

export default function AddPropertyPage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (data) => {
    setLoading(true);
    try {
      await propertyAPI.create(data);
      toast.success('Property listed! It will be visible after admin approval.');
      navigate('/owner/listings');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to create listing');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-enter min-h-screen bg-slate-50">
      <div className="page-container py-8">
        <div className="max-w-3xl mx-auto">
          <div className="mb-6">
            <h1 className="font-display text-2xl font-bold text-slate-900 flex items-center gap-2">
              <Plus size={22} className="text-primary-600" /> Add New Property
            </h1>
            <p className="text-slate-500 text-sm mt-1">Fill in the details below. Your listing will be reviewed before going live.</p>
          </div>
          <PropertyForm onSubmit={handleSubmit} loading={loading} submitLabel="Submit for Review" />
        </div>
      </div>
    </div>
  );
}
