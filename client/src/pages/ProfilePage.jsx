import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { userAPI } from '../services/api';
import { User, Mail, Phone, Shield, Save, Camera } from 'lucide-react';
import toast from 'react-hot-toast';
import LoadingSpinner from '../components/common/LoadingSpinner';

const ROLE_BADGE = {
  admin: 'badge badge-danger',
  owner: 'badge badge-warning',
  buyer: 'badge badge-info',
};

export default function ProfilePage() {
  const { user, updateUser } = useAuth();
  const [form, setForm] = useState({
    name:   user?.name   || '',
    phone:  user?.phone  || '',
    avatar: user?.avatar || '',
  });
  const [loading, setLoading] = useState(false);

  const set = (k, v) => setForm(p => ({ ...p, [k]: v }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await userAPI.updateProfile(form);
      updateUser(data.user);
      toast.success('Profile updated!');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Update failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-enter min-h-screen bg-slate-50">
      <div className="page-container py-10">
        <div className="max-w-lg mx-auto">

          <h1 className="font-display text-2xl font-bold text-slate-900 mb-6 flex items-center gap-2.5">
            <div className="w-9 h-9 bg-primary-500 rounded-xl flex items-center justify-center shadow-sm">
              <User size={17} className="text-white" />
            </div>
            My Profile
          </h1>

          <div className="card p-6 space-y-6">

            {/* Avatar + name + role */}
            <div className="flex items-center gap-4">
              <div className="relative">
                <div className="w-16 h-16 bg-gradient-to-br from-primary-500 to-primary-700 rounded-full flex items-center justify-center text-white text-2xl font-bold shadow-md">
                  {user?.avatar
                    ? <img src={user.avatar} alt={user.name} className="w-full h-full rounded-full object-cover" onError={e => { e.target.style.display = 'none'; }} />
                    : user?.name?.charAt(0).toUpperCase()}
                </div>
                <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-white rounded-full border-2 border-slate-200 flex items-center justify-center shadow-sm">
                  <Camera size={11} className="text-slate-400" />
                </div>
              </div>
              <div>
                <p className="font-semibold text-slate-900 text-lg">{user?.name}</p>
                <span className={`capitalize mt-1 inline-block ${ROLE_BADGE[user?.role] || 'badge badge-slate'}`}>
                  {user?.role}
                </span>
              </div>
            </div>

            <div className="border-t border-slate-100" />

            {/* Read-only email */}
            <div>
              <label className="label">Email Address</label>
              <div className="input-field flex items-center gap-2.5 text-slate-400 bg-slate-50 cursor-not-allowed select-none">
                <Mail size={15} className="shrink-0" />
                <span className="text-slate-600 text-sm">{user?.email}</span>
              </div>
              <p className="text-xs text-slate-400 mt-1.5">Email address cannot be changed.</p>
            </div>

            {/* Editable fields */}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="label">Full Name</label>
                <input
                  type="text" className="input-field" placeholder="Your full name"
                  value={form.name} onChange={e => set('name', e.target.value)}
                />
              </div>
              <div>
                <label className="label">Phone Number</label>
                <div className="relative">
                  <Phone size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="tel" className="input-field pl-10" placeholder="+91 98765 43210"
                    value={form.phone} onChange={e => set('phone', e.target.value)}
                  />
                </div>
              </div>
              <div>
                <label className="label">
                  Avatar URL{' '}
                  <span className="text-slate-400 font-normal">(optional)</span>
                </label>
                <input
                  type="url" className="input-field" placeholder="https://…"
                  value={form.avatar} onChange={e => set('avatar', e.target.value)}
                />
                {form.avatar && (
                  <div className="mt-2 flex items-center gap-2">
                    <img
                      src={form.avatar} alt="Avatar preview"
                      className="w-8 h-8 rounded-full object-cover border border-slate-200"
                      onError={e => { e.target.style.display = 'none'; }}
                    />
                    <span className="text-xs text-slate-400">Preview</span>
                  </div>
                )}
              </div>

              <button
                type="submit" disabled={loading}
                className="btn-primary w-full justify-center py-3 disabled:opacity-60"
              >
                {loading
                  ? <><LoadingSpinner size="sm" color="white" inline /> Saving…</>
                  : <><Save size={16} /> Save Changes</>}
              </button>
            </form>

            {/* Role info */}
            <div className="border-t border-slate-100 pt-4 flex items-start gap-2.5 text-sm text-slate-500">
              <Shield size={15} className="mt-0.5 text-primary-500 shrink-0" />
              <span>
                Your role is <strong className="text-slate-700 capitalize">{user?.role}</strong>.
                To change roles, contact an administrator.
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
