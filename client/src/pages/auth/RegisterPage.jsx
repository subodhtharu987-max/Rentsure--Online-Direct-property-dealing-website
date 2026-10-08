import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Building2, Eye, EyeOff, UserPlus, Sparkles } from 'lucide-react';
import toast from 'react-hot-toast';

export default function RegisterPage() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', password: '', role: 'buyer', phone: '' });
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);

  const set = (k, v) => setForm(p => ({ ...p, [k]: v }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.password.length < 6) { toast.error('Password must be at least 6 characters'); return; }
    setLoading(true);
    try {
      const data = await register(form);
      toast.success(`Welcome to EstateVista, ${data.user.name.split(' ')[0]}!`);
      if (data.user.role === 'owner') navigate('/owner/add-property');
      else navigate('/');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* ── Left panel ── */}
      <div className="hidden lg:flex lg:w-[46%] hero-gradient flex-col justify-between p-12 relative overflow-hidden">
        {/* Decorative blobs */}
        <div className="absolute -top-32 -right-32 w-96 h-96 bg-primary-500/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* Logo */}
        <Link to="/" className="flex items-center gap-3 relative z-10">
          <div className="w-10 h-10 bg-primary-500 rounded-xl flex items-center justify-center shadow-lg">
            <Building2 size={20} className="text-white" />
          </div>
          <span className="font-display font-bold text-xl text-white tracking-tight">EstateVista</span>
        </Link>

        {/* Hero copy */}
        <div className="relative z-10">
          <div className="inline-flex items-center gap-2 glass px-3.5 py-1.5 rounded-full text-xs text-white/70 mb-6">
            <Sparkles size={12} className="text-amber-400" />
            Join 25,000+ happy users
          </div>
          <h2 className="font-display text-4xl font-bold text-white mb-4 leading-tight">
            Join India's<br />
            <span className="text-primary-300 italic">Top Real Estate Platform</span>
          </h2>
          <p className="text-white/60 text-base leading-relaxed max-w-sm">
            Whether you're looking to buy, rent, or list — EstateVista makes it simple and secure.
          </p>

          {/* Stats grid */}
          <div className="grid grid-cols-2 gap-3 mt-10">
            {[
              { val: '10,000+', label: 'Active Listings' },
              { val: '25,000+', label: 'Happy Users' },
              { val: '50+',     label: 'Cities Covered' },
              { val: '100%',    label: 'Verified Listings' },
            ].map(({ val, label }) => (
              <div key={label} className="glass rounded-2xl p-4 text-center">
                <p className="font-display text-xl font-bold text-white">{val}</p>
                <p className="text-white/50 text-xs mt-0.5">{label}</p>
              </div>
            ))}
          </div>
        </div>

        <p className="text-white/25 text-xs relative z-10">© {new Date().getFullYear()} EstateVista. All rights reserved.</p>
      </div>

      {/* ── Right panel ── */}
      <div className="flex-1 flex items-center justify-center p-6 bg-white overflow-y-auto">
        <div className="w-full max-w-md py-8">

          {/* Mobile logo */}
          <div className="lg:hidden flex justify-center mb-8">
            <Link to="/" className="flex items-center gap-2.5 font-display font-bold text-xl text-slate-900">
              <div className="w-9 h-9 bg-primary-500 rounded-xl flex items-center justify-center">
                <Building2 size={17} className="text-white" />
              </div>
              EstateVista
            </Link>
          </div>

          <h1 className="font-display text-2xl font-bold text-slate-900 mb-1">Create your account</h1>
          <p className="text-slate-500 text-sm mb-7">Get started in under a minute — it's free</p>

          {/* Role picker */}
          <div className="mb-6">
            <label className="label">I want to…</label>
            <div className="grid grid-cols-2 gap-3">
              {[
                { val: 'buyer', label: 'Find a Property', icon: '🏠', desc: 'Search & save listings' },
                { val: 'owner', label: 'List My Property', icon: '🏷️', desc: 'Post & manage listings' },
              ].map(({ val, label, icon, desc }) => (
                <button
                  key={val}
                  type="button"
                  onClick={() => set('role', val)}
                  className={`p-4 rounded-2xl border-2 text-left transition-all ${
                    form.role === val
                      ? 'border-primary-500 bg-primary-50 shadow-sm'
                      : 'border-slate-200 hover:border-slate-300 bg-white'
                  }`}
                >
                  <span className="text-2xl mb-2 block">{icon}</span>
                  <p className="text-sm font-semibold text-slate-800">{label}</p>
                  <p className="text-xs text-slate-400 mt-0.5">{desc}</p>
                </button>
              ))}
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="label">Full Name</label>
              <input
                type="text" required autoComplete="name"
                className="input-field" placeholder="Rahul Sharma"
                value={form.name} onChange={e => set('name', e.target.value)}
              />
            </div>
            <div>
              <label className="label">Email Address</label>
              <input
                type="email" required autoComplete="email"
                className="input-field" placeholder="rahul@example.com"
                value={form.email} onChange={e => set('email', e.target.value)}
              />
            </div>
            <div>
              <label className="label">
                Phone Number{' '}
                <span className="text-slate-400 font-normal">(optional)</span>
              </label>
              <input
                type="tel" autoComplete="tel"
                className="input-field" placeholder="+91 98765 43210"
                value={form.phone} onChange={e => set('phone', e.target.value)}
              />
            </div>
            <div>
              <label className="label">Password</label>
              <div className="relative">
                <input
                  type={show ? 'text' : 'password'} required minLength={6} autoComplete="new-password"
                  className="input-field pr-11" placeholder="Min. 6 characters"
                  value={form.password} onChange={e => set('password', e.target.value)}
                />
                <button
                  type="button" onClick={() => setShow(!show)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                  aria-label={show ? 'Hide password' : 'Show password'}
                >
                  {show ? <EyeOff size={17} /> : <Eye size={17} />}
                </button>
              </div>
            </div>

            <button
              type="submit" disabled={loading}
              className="btn-primary w-full justify-center py-3 mt-1"
            >
              {loading ? (
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <UserPlus size={16} />
              )}
              {loading ? 'Creating account…' : 'Create Account'}
            </button>

            <p className="text-xs text-slate-400 text-center leading-relaxed">
              By signing up, you agree to our{' '}
              <a href="#" className="text-primary-600 hover:underline">Terms of Service</a>{' '}
              and{' '}
              <a href="#" className="text-primary-600 hover:underline">Privacy Policy</a>
            </p>
          </form>

          <p className="text-center text-sm text-slate-500 mt-6">
            Already have an account?{' '}
            <Link to="/login" className="text-primary-600 font-semibold hover:underline">Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
