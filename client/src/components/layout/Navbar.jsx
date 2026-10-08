import { useState, useRef, useEffect } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import {
  Building2, Home, Heart, MessageSquare, LayoutDashboard,
  ListPlus, LogOut, User, ChevronDown, Menu, X, Settings, Mail
} from 'lucide-react'
import toast from 'react-hot-toast'

export default function Navbar() {
  const { user, logout, isAdmin, isOwner } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [menuOpen, setMenuOpen] = useState(false)
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const dropdownRef = useRef(null)

  const handleLogout = () => {
    logout()
    toast.success('Logged out successfully')
    navigate('/')
    setDropdownOpen(false)
    setMenuOpen(false)
  }

  const isActive = (path) => location.pathname.startsWith(path)

  // Close dropdown on outside click
  useEffect(() => {
    const handler = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false)
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  // Close mobile menu on route change
  useEffect(() => { setMenuOpen(false) }, [location.pathname])

  const navLink = (path, label) => (
    <Link
      to={path}
      className={`text-sm font-medium transition-colors px-1 py-0.5 rounded ${
        isActive(path)
          ? 'text-primary-600'
          : 'text-slate-600 hover:text-slate-900'
      }`}
    >
      {label}
    </Link>
  )

  const roleBadgeColor = {
    admin: 'bg-purple-100 text-purple-700',
    owner: 'bg-amber-100 text-amber-700',
    buyer: 'bg-blue-100 text-blue-700',
  }

  return (
    <nav className="bg-white border-b border-gray-100 sticky top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">

          {/* ── Logo ── */}
          <Link to="/" className="flex items-center gap-2.5 shrink-0">
            <div className="w-9 h-9 bg-primary-500 rounded-xl flex items-center justify-center shadow-sm">
              <Building2 size={18} className="text-white" />
            </div>
            <span className="font-display font-bold text-lg text-slate-900">
              Estate<span className="text-primary-500">Vista</span>
            </span>
          </Link>

          {/* ── Desktop nav links ── */}
          <div className="hidden md:flex items-center gap-6">
            {navLink('/properties', 'Properties')}
            {user && !isAdmin && navLink('/favorites', 'Favorites')}
            {(isOwner || isAdmin) && navLink('/owner/listings', 'My Listings')}
            {isAdmin && navLink('/admin/dashboard', 'Admin')}
          </div>

          {/* ── Right side ── */}
          <div className="flex items-center gap-3">
            {user ? (
              <>
                {/* List property CTA for owners */}
                {(isOwner || isAdmin) && (
                  <Link
                    to="/owner/add-property"
                    className="hidden sm:inline-flex btn-primary text-sm py-2 px-4"
                  >
                    <ListPlus size={15} /> List Property
                  </Link>
                )}

                {/* User dropdown */}
                <div className="relative" ref={dropdownRef}>
                  <button
                    onClick={() => setDropdownOpen(!dropdownOpen)}
                    className="flex items-center gap-2 bg-slate-50 hover:bg-slate-100 px-3 py-2 rounded-xl transition-colors border border-slate-200"
                    aria-expanded={dropdownOpen}
                    aria-haspopup="true"
                  >
                    <div className="w-7 h-7 bg-gradient-to-br from-primary-500 to-primary-700 rounded-full flex items-center justify-center shrink-0">
                      <span className="text-white text-xs font-bold">{user.name[0].toUpperCase()}</span>
                    </div>
                    <span className="text-sm font-medium text-slate-700 hidden sm:block max-w-[100px] truncate">
                      {user.name.split(' ')[0]}
                    </span>
                    <ChevronDown
                      size={14}
                      className={`text-slate-400 transition-transform duration-200 ${dropdownOpen ? 'rotate-180' : ''}`}
                    />
                  </button>

                  {dropdownOpen && (
                    <div className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-xl border border-slate-100 py-2 z-50 animate-slide-down">
                      {/* User info */}
                      <div className="px-4 py-3 border-b border-slate-50">
                        <p className="text-sm font-semibold text-slate-900 truncate">{user.name}</p>
                        <p className="text-xs text-slate-400 truncate mt-0.5">{user.email}</p>
                        <span className={`text-xs font-semibold px-2 py-0.5 rounded-full mt-2 inline-block capitalize ${roleBadgeColor[user.role]}`}>
                          {user.role}
                        </span>
                      </div>

                      {/* Links */}
                      <div className="py-1">
                        <DropItem to="/profile" icon={<User size={15} />} label="My Profile" close={() => setDropdownOpen(false)} />
                        {!isAdmin && (
                          <DropItem to="/favorites" icon={<Heart size={15} />} label="Saved Properties" close={() => setDropdownOpen(false)} />
                        )}
                        {!isAdmin && !isOwner && (
                          <DropItem to="/inquiries" icon={<MessageSquare size={15} />} label="My Inquiries" close={() => setDropdownOpen(false)} />
                        )}
                        {(isOwner || isAdmin) && (
                          <>
                            <DropItem to="/owner/listings" icon={<Home size={15} />} label="My Listings" close={() => setDropdownOpen(false)} />
                            <DropItem to="/owner/inquiries" icon={<Mail size={15} />} label="Received Inquiries" close={() => setDropdownOpen(false)} />
                          </>
                        )}
                        {isAdmin && (
                          <DropItem to="/admin/dashboard" icon={<LayoutDashboard size={15} />} label="Admin Panel" close={() => setDropdownOpen(false)} />
                        )}
                      </div>

                      <div className="border-t border-slate-50 pt-1">
                        <button
                          onClick={handleLogout}
                          className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors"
                        >
                          <LogOut size={15} /> Sign Out
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <div className="hidden md:flex items-center gap-2">
                <Link to="/login" className="btn-secondary text-sm py-2 px-4">Log In</Link>
                <Link to="/register" className="btn-primary text-sm py-2 px-4">Sign Up</Link>
              </div>
            )}

            {/* Mobile hamburger */}
            <button
              className="md:hidden p-2 rounded-xl hover:bg-slate-100 transition-colors"
              onClick={() => setMenuOpen(!menuOpen)}
              aria-label="Toggle menu"
            >
              {menuOpen ? <X size={20} className="text-slate-700" /> : <Menu size={20} className="text-slate-700" />}
            </button>
          </div>
        </div>

        {/* ── Mobile menu ── */}
        {menuOpen && (
          <div className="md:hidden border-t border-slate-100 py-3 space-y-1 animate-slide-down">
            <MobileLink to="/properties" label="Properties" active={isActive('/properties')} />
            {user && !isAdmin && <MobileLink to="/favorites" label="Favorites" active={isActive('/favorites')} />}
            {(isOwner || isAdmin) && <MobileLink to="/owner/listings" label="My Listings" active={isActive('/owner')} />}
            {(isOwner || isAdmin) && <MobileLink to="/owner/add-property" label="+ List Property" active={false} highlight />}
            {(isOwner || isAdmin) && <MobileLink to="/owner/inquiries" label="Received Inquiries" active={isActive('/owner/inquiries')} />}
            {isAdmin && <MobileLink to="/admin/dashboard" label="Admin Panel" active={isActive('/admin')} />}
            {!user && (
              <div className="flex gap-2 pt-2 px-1">
                <Link to="/login" className="btn-secondary text-sm py-2 flex-1 justify-center">Log In</Link>
                <Link to="/register" className="btn-primary text-sm py-2 flex-1 justify-center">Sign Up</Link>
              </div>
            )}
            {user && (
              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 rounded-xl transition-colors"
              >
                <LogOut size={15} /> Sign Out
              </button>
            )}
          </div>
        )}
      </div>
    </nav>
  )
}

function DropItem({ to, icon, label, close }) {
  return (
    <Link
      to={to}
      onClick={close}
      className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50 transition-colors"
    >
      <span className="text-slate-400">{icon}</span>
      {label}
    </Link>
  )
}

function MobileLink({ to, label, active, highlight }) {
  return (
    <Link
      to={to}
      className={`block px-4 py-2.5 text-sm rounded-xl transition-colors font-medium ${
        highlight
          ? 'bg-primary-500 text-white'
          : active
          ? 'bg-primary-50 text-primary-700'
          : 'text-slate-700 hover:bg-slate-50'
      }`}
    >
      {label}
    </Link>
  )
}
