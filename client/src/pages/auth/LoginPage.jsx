import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Building2, Eye, EyeOff, LogIn, Sparkles } from 'lucide-react';
import toast from 'react-hot-toast';

export default function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);

  const set = (k, v) => setForm(p => ({ ...p, [k]: v }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const data = await login(form.email, form.password);
      toast.success(`Welcome back, ${data.user.name.split(' ')[0]}!`);
      if (data.user.role === 'admin') navigate('/admin/dashboard');
      else if (data.user.role === 'owner') navigate('/owner/listings');
      else navigate('/');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  const fillDemo = (role) => {
    const demos = {
      buyer: { email: 'buyer@demo.com', password: 'password123' },
      owner: { email: 'owner@demo.com', password: 'password123' },
      admin: { email: 'admin@demo.com', password: 'password123' },
    };
    setForm(demos[role]);
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
            India's most trusted real estate platform
          </div>
          <h2 className="font-display text-4xl font-bold text-white mb-4 leading-tight">
            Your Dream Home<br />
            <span className="text-primary-300 italic">Is One Click Away</span>
          </h2>
          <p className="text-white/60 text-base leading-relaxed max-w-sm">
            Access thousands of verified properties across India. Rent, buy, or list your property — all in one place.
          </p>

          {/* Stats row */}
          <div className="grid grid-cols-3 gap-4 mt-10">
            {[
              { val: '10K+', label: 'Listings' },
              { val: '25K+', label: 'Happy Users' },
              { val: '50+', label: 'Cities' },
            ].map(({ val, label }) => (
              <div key={label} className="glass rounded-2xl p-4 text-center">
                <p className="font-display text-2xl font-bold text-white">{val}</p>
                <p className="text-white/50 text-xs mt-0.5">{label}</p>
              </div>
            ))}
          </div>
        </div>

        <p className="text-white/25 text-xs relative z-10">© {new Date().getFullYear()} EstateVista. All rights reserved.</p>
      </div>

      {/* ── Right panel ── */}
      <div className="flex-1 flex items-center justify-center p-6 bg-white">
        <div className="w-full max-w-md">

          {/* Mobile logo */}
          <div className="lg:hidden flex justify-center mb-8">
            <Link to="/" className="flex items-center gap-2.5 font-display font-bold text-xl text-slate-900">
              <div className="w-9 h-9 bg-primary-500 rounded-xl flex items-center justify-center">
                <Building2 size={17} className="text-white" />
              </div>
              EstateVista
            </Link>
          </div>

          <h1 className="font-display text-2xl font-bold text-slate-900 mb-1">Welcome back</h1>
          <p className="text-slate-500 text-sm mb-7">Sign in to your account to continue</p>

          {/* Demo accounts */}
          <div className="mb-6 p-4 bg-blue-50 rounded-2xl border border-blue-100">
            <p className="text-xs font-semibold text-blue-600 mb-2.5 flex items-center gap-1.5">
              <Sparkles size={11} /> Demo Accounts
            </p>
            <div className="flex gap-2">
              {['buyer', 'owner', 'admin'].map(role => (
                <button
                  key={role}
                  onClick={() => fillDemo(role)}
                  className="flex-1 text-xs py-2 bg-white hover:bg-blue-100 text-blue-700 rounded-xl capitalize transition-colors font-semibold border border-blue-200 shadow-sm"
                >
                  {role}
                </button>
              ))}
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="label">Email Address</label>
              <input
                type="email" required autoComplete="email"
                className="input-field"
                placeholder="you@example.com"
                value={form.email}
                onChange={e => set('email', e.target.value)}
              />
            </div>
            <div>
              <label className="label">Password</label>
              <div className="relative">
                <input
                  type={show ? 'text' : 'password'} required autoComplete="current-password"
                  className="input-field pr-11"
                  placeholder="••••••••"
                  value={form.password}
                  onChange={e => set('password', e.target.value)}
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
              className="btn-primary w-full justify-center py-3 text-sm mt-1"
            >
              {loading ? (
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <LogIn size={16} />
              )}
              {loading ? 'Signing in…' : 'Sign In'}
            </button>
          </form>

          <p className="text-center text-sm text-slate-500 mt-6">
            Don't have an account?{' '}
            <Link to="/register" className="text-primary-600 font-semibold hover:underline">
              Create one free
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
