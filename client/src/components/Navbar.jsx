import { Link, useNavigate, useLocation } from 'react-router-dom';
import { clearAuthToken, getAuthToken } from '../utils/auth';
import { useState, useEffect, useRef } from 'react';
import ThemeToggle from './ThemeToggle';
import logo from '../assets/logos/sh-logo.jpg';
import {
  FiMenu, FiX, FiLogOut, FiBell, FiMessageSquare, FiUser,
  FiGrid, FiBriefcase, FiCheckSquare, FiUsers, FiUserCheck, FiShield,
  FiChevronDown, FiSettings
} from 'react-icons/fi';

const navLinks = [
  { path: '/dashboard',     label: 'Dashboard',     icon: FiGrid },
  { path: '/startups',      label: 'Startups',      icon: FiBriefcase },
  { path: '/profiles',      label: 'Profiles',      icon: FiUsers },
  { path: '/tasks',         label: 'Tasks',         icon: FiCheckSquare },
  { path: '/mentorship',    label: 'Mentorship',    icon: FiUserCheck },
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
    admin:   'from-purple-600 to-purple-800',
    founder: 'from-primary-600 to-primary-800',
    mentor:  'from-accent-600  to-accent-800',
    member:  'from-secondary-600 to-secondary-800',
  }[user?.role] || 'from-primary-600 to-primary-800';

  return (
    <nav
      className={`
        sticky top-0 z-50 transition-all duration-300
        dark:bg-secondary-950/95 light:bg-white/95
        backdrop-blur-xl
        border-b
        ${scrolled
          ? 'dark:border-secondary-800/80 light:border-secondary-200 shadow-card'
          : 'dark:border-secondary-800/50 light:border-secondary-200/60'
        }
      `}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">

          {/* ── Logo ── */}
          <Link to="/dashboard" className="flex items-center gap-2 group flex-shrink-0">
            <img
              src={logo}
              alt="StartupHub"
              className="h-9 w-auto object-contain group-hover:scale-105 transition-transform duration-200"
            />
            <span className="text-lg sm:text-xl font-extrabold tracking-tight text-primary-600 hidden sm:block">
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
                    relative flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-medium
                    transition-all duration-200
                    ${active
                      ? 'dark:text-primary-400 light:text-primary-600 dark:bg-primary-500/10 light:bg-primary-50 font-semibold'
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
                  relative flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-medium
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

          {/* ── Right side controls ── */}
          <div className="flex items-center gap-3">
            <ThemeToggle />

            {/* User dropdown trigger */}
            <div className="relative" ref={userDropRef}>
              <button
                onClick={() => setUserOpen(!userOpen)}
                className="flex items-center gap-2 p-1.5 rounded-xl transition-all duration-200
                  hover:dark:bg-secondary-800 hover:light:bg-secondary-100
                  focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500"
                aria-expanded={userOpen}
                aria-haspopup="true"
              >
                {/* Avatar */}
                <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${roleColor} flex items-center justify-center text-white text-xs font-bold shadow-sm overflow-hidden`}>
                  {user?.profilePhoto ? (
                    <img src={user.profilePhoto} alt={user.name} className="w-full h-full object-cover" />
                  ) : (
                    initials
                  )}
                </div>

                <div className="hidden sm:block text-left">
                  <p className="text-xs font-semibold text-heading leading-tight truncate max-w-[100px]">
                    {user?.name || 'User'}
                  </p>
                  <p className="text-[10px] text-muted capitalize leading-tight">
                    {user?.role || 'member'}
                  </p>
                </div>

                <FiChevronDown
                  size={13}
                  className={`text-muted transition-transform duration-200 hidden sm:block ${userOpen ? 'rotate-180' : ''}`}
                />
              </button>

              {/* User Dropdown Menu */}
              {userOpen && (
                <div
                  className="absolute right-0 mt-2 w-56 rounded-2xl shadow-card-lg border
                    dark:bg-secondary-900 dark:border-secondary-800 light:bg-white light:border-secondary-200
                    py-2 z-50 animate-scale-in"
                >
                  <div className="px-4 py-2.5 border-b dark:border-secondary-800 light:border-secondary-100">
                    <p className="text-xs font-bold text-heading truncate">{user?.name}</p>
                    <p className="text-[11px] text-muted truncate">{user?.email}</p>
                    <span className="badge badge-gray text-[9px] uppercase tracking-wider mt-1.5 inline-block">
                      {user?.role}
                    </span>
                  </div>

                  <div className="py-1">
                    <Link
                      to="/profile"
                      className="flex items-center gap-2.5 px-4 py-2 text-xs font-medium text-heading
                        hover:dark:bg-secondary-800 hover:light:bg-secondary-100 transition-colors"
                    >
                      <FiUser size={14} className="text-primary-600" />
                      My Profile
                    </Link>

                    <Link
                      to="/profiles"
                      className="flex items-center gap-2.5 px-4 py-2 text-xs font-medium text-heading
                        hover:dark:bg-secondary-800 hover:light:bg-secondary-100 transition-colors"
                    >
                      <FiUsers size={14} className="text-accent-500" />
                      Community Profiles
                    </Link>

                    {user?.role === 'admin' && (
                      <Link
                        to="/admin"
                        className="flex items-center gap-2.5 px-4 py-2 text-xs font-medium text-heading
                          hover:dark:bg-secondary-800 hover:light:bg-secondary-100 transition-colors"
                      >
                        <FiShield size={14} className="text-purple-400" />
                        Admin Console
                      </Link>
                    )}
                  </div>

                  <div className="pt-1 border-t dark:border-secondary-800 light:border-secondary-100">
                    <button
                      onClick={handleLogout}
                      className="flex items-center gap-2.5 w-full px-4 py-2 text-xs font-medium text-danger-500
                        hover:dark:bg-danger-500/10 hover:light:bg-danger-50 transition-colors"
                    >
                      <FiLogOut size={14} />
                      Sign Out
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Mobile menu button */}
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="p-2 rounded-xl md:hidden text-muted hover:text-heading hover:dark:bg-secondary-800 hover:light:bg-secondary-100 transition-colors"
              aria-label="Toggle mobile menu"
            >
              {menuOpen ? <FiX size={20} /> : <FiMenu size={20} />}
            </button>
          </div>
        </div>
      </div>

      {/* ── Mobile menu drawer ── */}
      {menuOpen && (
        <div className="md:hidden border-t dark:border-secondary-800 light:border-secondary-200 dark:bg-secondary-950/98 light:bg-white/98 backdrop-blur-xl px-4 py-4 space-y-1 animate-slide-in-down">
          {/* User header in mobile */}
          <div className="flex items-center gap-3 p-3 rounded-xl dark:bg-secondary-900 light:bg-secondary-50 mb-3 border dark:border-secondary-800 light:border-secondary-200">
            <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${roleColor} flex items-center justify-center text-white text-sm font-bold flex-shrink-0 overflow-hidden`}>
              {user?.profilePhoto ? <img src={user.profilePhoto} alt={user.name} className="w-full h-full object-cover" /> : initials}
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
                    ? 'dark:text-primary-400 light:text-primary-600 dark:bg-primary-500/10 light:bg-primary-50 font-semibold'
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
                text-danger-500 hover:dark:bg-danger-500/10 hover:light:bg-danger-50"
            >
              <FiLogOut size={16} />
              Sign Out
            </button>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
