import { Link, useNavigate, useLocation } from 'react-router-dom';
import { clearAuthToken, getAuthToken } from '../utils/auth';
import { useState, useEffect, useRef } from 'react';
import ThemeToggle from './ThemeToggle';
import {
  FiMenu, FiX, FiLogOut, FiBell, FiMessageSquare, FiUser,
  FiGrid, FiBriefcase, FiCheckSquare, FiUsers, FiShield,
  FiChevronDown, FiSettings
} from 'react-icons/fi';
import logo from '../assets/logos/sh-logo.jpg';

const navLinks = [
  { path: '/dashboard',     label: 'Dashboard',     icon: FiGrid },
  { path: '/startups',      label: 'Startups',      icon: FiBriefcase },
  { path: '/tasks',         label: 'Tasks',         icon: FiCheckSquare },
  { path: '/mentorship',    label: 'Mentorship',    icon: FiUsers },
  { path: '/chat',          label: 'Chat',          icon: FiMessageSquare },
  { path: '/notifications', label: 'Notifications', icon: FiBell },
];

const Navbar = () => {
  const navigate  = useNavigate();
  const location  = useLocation();
  const [user,        setUser]        = useState(null);
  const [menuOpen,    setMenuOpen]    = useState(false);
  const [userOpen,    setUserOpen]    = useState(false);
  const [scrolled,    setScrolled]    = useState(false);
  const userDropRef = useRef(null);

  /* Fetch current user */
  useEffect(() => {
    const token = getAuthToken();
    if (!token) return;
    fetch('/api/auth/me', { headers: { Authorization: `Bearer ${token}` } })
      .then((r) => r.json())
      .then((d) => { if (d.user) setUser(d.user); })
      .catch(() => {});
  }, []);

  /* Scroll shadow */
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  /* Close user dropdown on outside click */
  useEffect(() => {
    const handler = (e) => {
      if (userDropRef.current && !userDropRef.current.contains(e.target)) {
        setUserOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  /* Close mobile menu on navigation */
  useEffect(() => { setMenuOpen(false); setUserOpen(false); }, [location.pathname]);

  const handleLogout = () => {
    clearAuthToken();
    navigate('/login');
  };

  const isActive = (path) => location.pathname === path;

  const initials = user?.name
    ? user.name.split(' ').map((p) => p[0]).slice(0, 2).join('').toUpperCase()
    : 'U';

  const roleColor = {
    admin:   'from-purple-500 to-purple-700',
    founder: 'from-primary-500 to-primary-700',
    mentor:  'from-accent-500  to-accent-700',
    member:  'from-secondary-500 to-secondary-700',
  }[user?.role] || 'from-primary-500 to-primary-700';

  return (
    <nav
      className={`
        sticky top-0 z-50 transition-all duration-300
        dark:bg-secondary-950/90 light:bg-white/90
        backdrop-blur-xl
        border-b
        ${scrolled
          ? 'dark:border-secondary-800/70 light:border-secondary-200 shadow-card'
          : 'dark:border-secondary-800/40 light:border-secondary-200/60'
        }
      `}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">

          {/* ── Logo ── */}
          <Link to="/dashboard" className="flex items-center gap-2.5 group flex-shrink-0">
            <img
              src={logo}
              alt="StartupHub"
              className="h-8 w-auto rounded-lg transition-transform duration-300 group-hover:scale-105"
            />
            <span className="text-base font-bold gradient-text hidden sm:block tracking-tight">
              StartupHub
            </span>
          </Link>

          {/* ── Desktop nav links ── */}
          <div className="hidden md:flex items-center gap-0.5">
            {navLinks.map(({ path, label, icon: Icon }) => {
              const active = isActive(path);
              return (
                <Link
                  key={path}
                  to={path}
                  title={label}
                  className={`
                    relative flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-medium
                    transition-all duration-200
                    ${active
                      ? 'dark:text-primary-400 light:text-primary-600 dark:bg-primary-500/10 light:bg-primary-50'
                      : 'dark:text-secondary-400 light:text-secondary-600 hover:dark:text-white hover:light:text-secondary-900 hover:dark:bg-secondary-800/60 hover:light:bg-secondary-100'
                    }
                  `}
                >
                  <Icon size={15} />
                  <span className="hidden lg:inline">{label}</span>
                  {active && (
                    <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-4 h-0.5 rounded-full bg-primary-500" />
                  )}
                </Link>
              );
            })}

            {/* Admin link — only if user is admin */}
            {user?.role === 'admin' && (
              <Link
                to="/admin"
                className={`
                  relative flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-medium
                  transition-all duration-200
                  ${isActive('/admin')
                    ? 'dark:text-purple-400 light:text-purple-600 dark:bg-purple-500/10 light:bg-purple-50'
                    : 'dark:text-secondary-400 light:text-secondary-600 hover:dark:text-white hover:light:text-secondary-900 hover:dark:bg-secondary-800/60 hover:light:bg-secondary-100'
                  }
                `}
              >
                <FiShield size={15} />
                <span className="hidden lg:inline">Admin</span>
              </Link>
            )}
          </div>

          {/* ── Right side ── */}
          <div className="flex items-center gap-2">
            <ThemeToggle />

            {/* User dropdown — desktop */}
            <div className="hidden md:block relative" ref={userDropRef}>
              <button
                onClick={() => setUserOpen(!userOpen)}
                className="flex items-center gap-2.5 px-2.5 py-1.5 rounded-xl border transition-all duration-200
                  dark:border-secondary-700/50 dark:hover:border-secondary-600 dark:bg-secondary-800/40
                  light:border-secondary-200  light:hover:border-secondary-300 light:bg-white"
              >
                {/* Avatar */}
                <div className={`w-7 h-7 rounded-lg bg-gradient-to-br ${roleColor} flex items-center justify-center text-white text-xs font-bold flex-shrink-0`}>
                  {initials}
                </div>
                <div className="hidden lg:block text-left">
                  <p className="text-xs font-semibold text-heading leading-tight">{user?.name || 'User'}</p>
                  <p className="text-[10px] text-muted capitalize leading-tight">{user?.role || 'member'}</p>
                </div>
                <FiChevronDown
                  size={14}
                  className={`text-muted transition-transform duration-200 ${userOpen ? 'rotate-180' : ''}`}
                />
              </button>

              {/* Dropdown panel */}
              {userOpen && (
                <div className="absolute right-0 top-full mt-2 w-52 dropdown-menu animate-scale-in">
                  {/* User info header */}
                  <div className="px-4 py-3 border-b dark:border-secondary-800 light:border-secondary-100">
                    <p className="text-sm font-semibold text-heading truncate">{user?.name}</p>
                    <p className="text-xs text-muted truncate">{user?.email}</p>
                  </div>

                  <div className="py-1">
                    <Link to="/profile" className="dropdown-item">
                      <FiUser size={14} className="text-muted" />
                      My Profile
                    </Link>
                    <Link to="/notifications" className="dropdown-item">
                      <FiBell size={14} className="text-muted" />
                      Notifications
                    </Link>
                  </div>

                  <div className="border-t dark:border-secondary-800 light:border-secondary-100 py-1">
                    <button
                      onClick={handleLogout}
                      className="dropdown-item w-full text-danger-400 hover:!text-danger-300 hover:dark:!bg-danger-500/10 hover:light:!bg-danger-50"
                    >
                      <FiLogOut size={14} />
                      Sign Out
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Mobile hamburger */}
            <button
              className="md:hidden w-9 h-9 rounded-xl flex items-center justify-center transition-all duration-200
                dark:text-secondary-300 dark:hover:bg-secondary-800 dark:hover:text-white
                light:text-secondary-600 light:hover:bg-secondary-100 light:hover:text-secondary-900"
              onClick={() => setMenuOpen(!menuOpen)}
              aria-label="Toggle navigation"
              aria-expanded={menuOpen}
            >
              {menuOpen ? <FiX size={20} /> : <FiMenu size={20} />}
            </button>
          </div>
        </div>
      </div>

      {/* ── Mobile nav drawer ── */}
      {menuOpen && (
        <div
          className="md:hidden border-t animate-slide-in-down
            dark:bg-secondary-950/95 light:bg-white/95
            dark:border-secondary-800/60 light:border-secondary-200
            backdrop-blur-xl"
        >
          <div className="max-w-7xl mx-auto px-4 py-4">
            {/* User info */}
            <div className="flex items-center gap-3 px-3 py-3 rounded-xl mb-3
              dark:bg-secondary-800/40 light:bg-secondary-50 border dark:border-secondary-700/40 light:border-secondary-200">
              <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${roleColor} flex items-center justify-center text-white font-bold text-sm flex-shrink-0`}>
                {initials}
              </div>
              <div className="min-w-0">
                <p className="text-sm font-semibold text-heading truncate">{user?.name || 'User'}</p>
                <p className="text-xs text-muted capitalize truncate">{user?.role || 'member'} · {user?.email}</p>
              </div>
            </div>

            {/* Nav links */}
            <div className="space-y-0.5">
              {navLinks.map(({ path, label, icon: Icon }) => (
                <Link
                  key={path}
                  to={path}
                  className={`
                    flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all
                    ${isActive(path)
                      ? 'dark:text-primary-400 light:text-primary-600 dark:bg-primary-500/10 light:bg-primary-50'
                      : 'dark:text-secondary-400 light:text-secondary-600 hover:dark:bg-secondary-800 hover:light:bg-secondary-100'
                    }
                  `}
                >
                  <Icon size={16} />
                  {label}
                </Link>
              ))}

              {user?.role === 'admin' && (
                <Link
                  to="/admin"
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all
                    ${isActive('/admin')
                      ? 'dark:text-purple-400 light:text-purple-600 dark:bg-purple-500/10 light:bg-purple-50'
                      : 'dark:text-secondary-400 light:text-secondary-600 hover:dark:bg-secondary-800 hover:light:bg-secondary-100'
                    }
                  `}
                >
                  <FiShield size={16} />
                  Admin
                </Link>
              )}

              <Link
                to="/profile"
                className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all
                  dark:text-secondary-400 light:text-secondary-600 hover:dark:bg-secondary-800 hover:light:bg-secondary-100"
              >
                <FiUser size={16} />
                My Profile
              </Link>
            </div>

            {/* Logout */}
            <div className="mt-3 pt-3 border-t dark:border-secondary-800/60 light:border-secondary-200">
              <button
                onClick={handleLogout}
                className="flex items-center gap-3 w-full px-3 py-2.5 rounded-xl text-sm font-medium transition-all
                  text-danger-400 hover:dark:bg-danger-500/10 hover:light:bg-danger-50"
              >
                <FiLogOut size={16} />
                Sign Out
              </button>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
