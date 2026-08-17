import { Link, useNavigate } from 'react-router-dom';
import { clearAuthToken } from '../utils/auth';
import logo from '../assets/logos/sh-logo.jpg';
import {
  FiShield, FiUsers, FiBriefcase, FiMessageSquare,
  FiLogOut, FiGrid
} from 'react-icons/fi';

const AdminLayout = ({ children, user, activeTab, setActiveTab }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    clearAuthToken();
    navigate('/login');
  };

  const navItems = [
    { id: 'dashboard', label: 'Overview',  icon: FiGrid },
    { id: 'users',     label: 'Users',     icon: FiUsers },
    { id: 'startups',  label: 'Startups',  icon: FiBriefcase },
    { id: 'contacts',  label: 'Messages',  icon: FiMessageSquare },
  ];

  return (
    <div className="min-h-screen flex dark:bg-[#0a0a0a] light:bg-[#F4F6FA]">

      {/* ── Sidebar ── */}
      <aside className="w-56 flex-shrink-0 flex flex-col
        dark:bg-[#111111] light:bg-white
        border-r dark:border-secondary-800/60 light:border-secondary-200
        sticky top-0 h-screen z-40">

        {/* Brand */}
        <div className="px-5 py-5 border-b dark:border-secondary-800/60 light:border-secondary-200">
          <Link to="/" className="flex items-center gap-2 group">
            <img src={logo} alt="StartupHub" className="h-8 w-auto object-contain" />
            <div>
              <p className="text-sm font-extrabold tracking-tight text-primary-600 leading-tight">StartupHub</p>
              <p className="text-[9px] font-bold uppercase tracking-widest text-muted">Admin Console</p>
            </div>
          </Link>
        </div>

        {/* Admin badge */}
        <div className="mx-4 mt-4 mb-2 flex items-center gap-2 p-2.5 rounded-xl bg-primary-500/10 border border-primary-500/20">
          <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-primary-600 to-primary-800 flex items-center justify-center flex-shrink-0">
            <FiShield size={12} className="text-white" />
          </div>
          <div className="min-w-0">
            <p className="text-xs font-bold text-heading truncate">{user?.name || 'Admin'}</p>
            <p className="text-[10px] text-primary-500 font-semibold">Administrator</p>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 py-2 space-y-0.5">
          {navItems.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setActiveTab(id)}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 text-left
                ${activeTab === id
                  ? 'bg-primary-600 text-white shadow-sm'
                  : 'dark:text-secondary-400 light:text-secondary-600 hover:dark:bg-secondary-800 hover:light:bg-secondary-100 hover:dark:text-white hover:light:text-secondary-900'
                }`}
            >
              <Icon size={15} />
              {label}
            </button>
          ))}
        </nav>

        {/* Footer actions */}
        <div className="px-3 py-4 border-t dark:border-secondary-800/60 light:border-secondary-200 space-y-1">
          <Link
            to="/dashboard"
            className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold
              dark:text-secondary-400 light:text-secondary-600
              hover:dark:bg-secondary-800 hover:light:bg-secondary-100 transition-colors"
          >
            <FiGrid size={14} />
            Back to App
          </Link>
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold
              text-danger-500 hover:bg-danger-500/10 transition-colors"
          >
            <FiLogOut size={14} />
            Sign Out
          </button>
        </div>
      </aside>

      {/* ── Main Content ── */}
      <main className="flex-1 min-h-screen overflow-y-auto">
        {children}
      </main>
    </div>
  );
};

export default AdminLayout;
