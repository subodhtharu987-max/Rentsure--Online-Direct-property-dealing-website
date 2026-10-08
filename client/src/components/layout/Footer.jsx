import { Link } from 'react-router-dom'
import { Building2, Mail, Phone, MapPin, Github } from 'lucide-react'

export default function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-400">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-14 pb-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">

          {/* Brand column */}
          <div className="sm:col-span-2 lg:col-span-1">
            <Link to="/" className="flex items-center gap-2.5 mb-4 group">
              <div className="w-9 h-9 bg-primary-500 rounded-xl flex items-center justify-center shadow-md group-hover:bg-primary-600 transition-colors">
                <Building2 size={17} className="text-white" />
              </div>
              <span className="font-display font-bold text-lg text-white">
                Estate<span className="text-primary-400">Vista</span>
              </span>
            </Link>
            <p className="text-sm leading-relaxed text-slate-500 max-w-xs">
              India's most trusted real estate platform. Find verified properties across 50+ cities — rent, buy, or list with ease.
            </p>
            <div className="flex items-center gap-3 mt-5">
              <a
                href="#"
                className="w-9 h-9 bg-slate-800 hover:bg-primary-500 rounded-xl flex items-center justify-center transition-colors"
                aria-label="GitHub"
              >
                <Github size={15} className="text-slate-400 hover:text-white" />
              </a>
            </div>
          </div>

          {/* Explore */}
          <div>
            <h4 className="text-white font-semibold text-sm mb-4 uppercase tracking-wider">Explore</h4>
            <ul className="space-y-2.5 text-sm">
              {[
                { to: '/properties?category=rent', label: 'Properties for Rent' },
                { to: '/properties?category=sale', label: 'Properties for Sale' },
                { to: '/properties?type=apartment', label: 'Apartments' },
                { to: '/properties?type=villa', label: 'Villas & Houses' },
                { to: '/properties?type=plot', label: 'Plots & Land' },
              ].map(({ to, label }) => (
                <li key={label}>
                  <Link to={to} className="hover:text-white hover:translate-x-1 transition-all inline-block">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Account */}
          <div>
            <h4 className="text-white font-semibold text-sm mb-4 uppercase tracking-wider">Account</h4>
            <ul className="space-y-2.5 text-sm">
              {[
                { to: '/register', label: 'Create Account' },
                { to: '/login',    label: 'Sign In' },
                { to: '/owner/add-property', label: 'List a Property' },
                { to: '/favorites', label: 'Saved Properties' },
                { to: '/profile',   label: 'My Profile' },
              ].map(({ to, label }) => (
                <li key={label}>
                  <Link to={to} className="hover:text-white hover:translate-x-1 transition-all inline-block">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-white font-semibold text-sm mb-4 uppercase tracking-wider">Contact</h4>
            <ul className="space-y-3 text-sm">
              <li>
                <a href="mailto:hello@estatevista.in" className="flex items-center gap-2.5 hover:text-white transition-colors">
                  <Mail size={14} className="text-primary-500 shrink-0" />
                  hello@estatevista.in
                </a>
              </li>
              <li>
                <a href="tel:+919876543210" className="flex items-center gap-2.5 hover:text-white transition-colors">
                  <Phone size={14} className="text-primary-500 shrink-0" />
                  +91 98765 43210
                </a>
              </li>
              <li className="flex items-start gap-2.5">
                <MapPin size={14} className="text-primary-500 shrink-0 mt-0.5" />
                <span>Bandra West, Mumbai<br />Maharashtra — 400050</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-slate-800 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-600">
          <p>© {new Date().getFullYear()} EstateVista. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <a href="#" className="hover:text-slate-400 transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-slate-400 transition-colors">Terms of Service</a>
            <span>Built with React, Node.js &amp; MongoDB</span>
          </div>
        </div>
      </div>
    </footer>
  )
}
