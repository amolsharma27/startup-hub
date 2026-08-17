import { Link, useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { FiMenu, FiX, FiArrowRight, FiZap } from 'react-icons/fi';
import ThemeToggle from './ThemeToggle';
import logo from '../assets/logos/sh-logo.jpg';

const navLinks = [
  { to: '/features',     label: 'Features' },
  { to: '/how-it-works', label: 'How It Works' },
  { to: '/testimonials', label: 'Testimonials' },
  { to: '/contact',      label: 'Contact' },
];

const PublicNavbar = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled,   setScrolled]   = useState(false);
  const location = useLocation();

  /* Shadow / border on scroll */
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  /* Close mobile menu on route change */
  useEffect(() => { setMobileOpen(false); }, [location.pathname]);

  const isActive = (to) => location.pathname === to;

  return (
    <header
      className={`
        fixed top-0 inset-x-0 z-50
        transition-all duration-300
        ${scrolled
          ? 'dark:bg-secondary-950/90 light:bg-white/90 backdrop-blur-xl shadow-card border-b dark:border-secondary-800/60 light:border-secondary-200'
          : 'dark:bg-transparent light:bg-transparent backdrop-blur-sm'
        }
      `}
    >
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 md:h-18">

          {/* ── Logo ── */}
          <Link to="/" className="flex items-center gap-2 group flex-shrink-0">
            <img
              src={logo}
              alt="StartupHub"
              className="h-9 w-auto object-contain group-hover:scale-105 transition-transform duration-200"
            />
            <span className="text-lg sm:text-xl font-extrabold tracking-tight text-primary-600">
              StartupHub
            </span>
          </Link>

          {/* ── Desktop nav links ── */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className={`
                  relative px-4 py-2 rounded-xl text-sm font-medium
                  transition-all duration-200
                  ${isActive(link.to)
                    ? 'dark:text-primary-400 light:text-primary-600 dark:bg-primary-500/10 light:bg-primary-50'
                    : 'dark:text-secondary-400 light:text-secondary-600 hover:dark:text-white hover:light:text-secondary-900 hover:dark:bg-secondary-800 hover:light:bg-secondary-100'
                  }
                `}
              >
                {link.label}
                {isActive(link.to) && (
                  <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-4 h-0.5 rounded-full bg-primary-500" />
                )}
              </Link>
            ))}
          </div>

          {/* ── Desktop right controls ── */}
          <div className="hidden md:flex items-center gap-3">
            <ThemeToggle />
            <div className="h-5 w-px dark:bg-secondary-700 light:bg-secondary-300" />
            <Link
              to="/login"
              className="px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-200
                dark:text-secondary-300 dark:hover:text-white dark:hover:bg-secondary-800
                light:text-secondary-600 light:hover:text-secondary-900 light:hover:bg-secondary-100"
            >
              Sign In
            </Link>
            <Link
              to="/register"
              className="btn-primary text-sm !py-2 !px-5 group"
            >
              Get Started
              <FiArrowRight size={14} className="transition-transform duration-200 group-hover:translate-x-0.5" />
            </Link>
          </div>

          {/* ── Mobile controls ── */}
          <div className="flex items-center gap-2 md:hidden">
            <ThemeToggle />
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-label="Toggle menu"
              aria-expanded={mobileOpen}
              className="w-9 h-9 rounded-xl flex items-center justify-center transition-all duration-200
                dark:text-secondary-300 dark:hover:bg-secondary-800 dark:hover:text-white
                light:text-secondary-600 light:hover:bg-secondary-100 light:hover:text-secondary-900"
            >
              {mobileOpen ? <FiX size={20} /> : <FiMenu size={20} />}
            </button>
          </div>
        </div>
      </nav>

      {/* ── Mobile menu ── */}
      {mobileOpen && (
        <div
          className="md:hidden border-t animate-slide-in-down
            dark:bg-secondary-950/95 light:bg-white/95
            dark:border-secondary-800/60 light:border-secondary-200
            backdrop-blur-xl"
        >
          <div className="max-w-7xl mx-auto px-4 py-4 space-y-1">
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className={`
                  flex items-center px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-200
                  ${isActive(link.to)
                    ? 'dark:text-primary-400 light:text-primary-600 dark:bg-primary-500/10 light:bg-primary-50'
                    : 'dark:text-secondary-300 light:text-secondary-700 hover:dark:bg-secondary-800 hover:light:bg-secondary-100'
                  }
                `}
              >
                {link.label}
              </Link>
            ))}

            <div className="pt-3 mt-3 border-t dark:border-secondary-800/60 light:border-secondary-200 flex gap-3">
              <Link to="/login"    className="flex-1 text-center btn-outline text-sm !py-2.5">Sign In</Link>
              <Link to="/register" className="flex-1 text-center btn-primary text-sm !py-2.5">Get Started</Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default PublicNavbar;
