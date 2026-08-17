import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { setAuthToken } from '../utils/auth';
import { api } from '../services/api';
import {
  FiUser, FiMail, FiLock, FiCheckCircle,
  FiBriefcase, FiUsers, FiTrendingUp, FiArrowLeft
} from 'react-icons/fi';
import logo from '../assets/logos/sh-logo.jpg';
import ThemeToggle from '../components/ThemeToggle';

const roles = [
  {
    value: 'member',
    label: 'Team Member',
    desc: 'Join existing startups and contribute your skills to live projects.',
    icon: FiUsers,
    color: 'from-secondary-600 to-secondary-800',
  },
  {
    value: 'founder',
    label: 'Founder',
    desc: 'Create and lead your own startup — recruit talent, manage tasks.',
    icon: FiBriefcase,
    color: 'from-primary-500 to-primary-700',
  },
  {
    value: 'mentor',
    label: 'Mentor',
    desc: 'Guide early-stage startups with your expertise and industry experience.',
    icon: FiTrendingUp,
    color: 'from-secondary-800 to-secondary-950',
  },
];

/* Password strength */
const getStrength = (pw) => {
  if (!pw) return { level: 0, label: '', color: '' };
  if (pw.length < 4) return { level: 1, label: 'Too short', color: 'bg-danger-500' };
  if (pw.length < 6) return { level: 2, label: 'Weak',      color: 'bg-warning-500' };
  if (pw.length < 9) return { level: 3, label: 'Good',      color: 'bg-success-400' };
  return               { level: 4, label: 'Strong',    color: 'bg-success-600' };
};

const RegisterPage = ({ setUser, showToast }) => {
  const [form, setForm] = useState({ name: '', email: '', password: '', role: 'member' });
  const [showPassword, setShowPassword] = useState(false);
  const [error,        setError]        = useState('');
  const [isLoading,    setIsLoading]    = useState(false);
  const navigate = useNavigate();

  const strength = getStrength(form.password);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    try {
      const data = await api.post('/auth/register', form);
      setAuthToken(data.token, true);
      setUser(data.user);
      showToast('Account created — welcome!', 'success');
      navigate('/dashboard');
    } catch (err) {
      setError(err.message || 'Registration failed');
      showToast(err.message || 'Registration failed', 'error');
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-secondary-50 dark:bg-secondary-950 p-4 transition-colors duration-300 font-sans">
      {/* Back to Home — fixed top-left */}
      <div className="fixed top-4 left-4 z-50">
        <Link
          to="/"
          className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold border transition-all duration-200
            dark:border-secondary-700/60 dark:text-secondary-400 dark:hover:border-primary-500/40 dark:hover:text-primary-400
            light:border-secondary-200 light:text-secondary-500 light:hover:border-primary-300 light:hover:text-primary-600
            bg-white dark:bg-secondary-900 shadow-md hover:shadow"
        >
          <FiArrowLeft size={14} /> Back to Home
        </Link>
      </div>

      {/* Theme toggle — fixed top-right */}
      <div className="fixed top-4 right-4 z-50">
        <ThemeToggle />
      </div>

      {/* Main Card Container */}
      <div className="w-full max-w-[950px] max-h-[95vh] flex flex-col md:flex-row bg-white dark:bg-secondary-900 rounded-3xl shadow-2xl overflow-hidden relative border border-secondary-200 dark:border-secondary-800 animate-scale-in">
        
        {/* Left Section (Crimson with subtle glow/bubbles) */}
        <div className="hidden md:flex relative w-[40%] bg-primary-600 p-10 flex-col justify-center overflow-hidden">
          {/* Decorative Bubbles (Red Shades) */}
          <div className="absolute top-[-10%] right-[-10%] w-64 h-64 bg-primary-500 rounded-full opacity-60 blur-xl animate-pulse-glow"></div>
          <div className="absolute bottom-[-15%] left-[-15%] w-72 h-72 bg-primary-700 rounded-full opacity-70 blur-2xl animate-float delay-100"></div>
          
          <div className="relative z-10 text-white mt-[-20px] animate-fade-in-up delay-150">
            <div className="bg-white/90 p-3 rounded-2xl inline-block mb-8 shadow-lg backdrop-blur-md">
              <img src={logo} alt="StartupHub" className="h-10 w-auto" />
            </div>
            <h2 className="text-3xl font-black tracking-wider mb-2 uppercase">Join Us</h2>
            <h3 className="text-lg font-bold mb-6 tracking-wide uppercase opacity-90 border-b border-white/20 pb-4 inline-block">StartupHub Builders</h3>
            <p className="text-primary-100 text-xs leading-relaxed font-medium opacity-90">
              Whether you're a builder, founder, or advisor — StartupHub gives you everything you need to move fast and grow together.
            </p>

            <div className="grid grid-cols-2 gap-4 mt-8">
              {[
                { value: '10K+', label: 'Users' },
                { value: '500+', label: 'Startups' },
                { value: '200+', label: 'Mentors' },
                { value: 'Free', label: 'Forever' },
              ].map(({ value, label }) => (
                <div key={label} className="bg-white/10 rounded-2xl p-3 backdrop-blur-md border border-white/10 hover:bg-white/20 transition-colors">
                  <p className="text-lg font-bold text-white leading-tight">{value}</p>
                  <p className="text-[10px] text-primary-200 uppercase tracking-wider font-semibold">{label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Section (Form) */}
        <div className="w-full md:w-[60%] p-8 lg:px-12 lg:py-10 flex flex-col justify-start bg-white dark:bg-secondary-900 text-secondary-900 dark:text-white transition-colors duration-300 overflow-y-auto custom-scrollbar">
          <div className="w-full max-w-sm mx-auto animate-fade-in-up delay-200">
            {/* Mobile branding */}
            <div className="md:hidden flex items-center gap-3 mb-8 bg-secondary-50 dark:bg-secondary-800 p-3 rounded-2xl w-fit">
              <img src={logo} alt="StartupHub" className="h-8 w-auto rounded" />
              <span className="text-xl font-black text-primary-600">StartupHub</span>
            </div>

            <h1 className="text-[26px] font-bold mb-1">Create your account</h1>
            <p className="text-secondary-400 dark:text-secondary-500 text-[11px] font-semibold mb-6 uppercase tracking-wider">
              Join as a founder, member, or mentor
            </p>

            {/* Error banner */}
            {error && (
              <div className="mb-6 p-3 rounded-xl bg-danger-50 dark:bg-danger-900/20 border border-danger-200 dark:border-danger-800/30 text-danger-600 dark:text-danger-400 text-xs font-medium flex items-center animate-shake">
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4" noValidate>
              {/* Name */}
              <div className="relative flex items-center group">
                <div className="absolute left-4 flex items-center pointer-events-none transition-colors group-focus-within:text-primary-600 text-secondary-400">
                  <FiUser size={16} />
                </div>
                <input
                  id="name"
                  type="text"
                  placeholder="Full Name"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="w-full pl-11 pr-4 py-3 bg-secondary-50/50 dark:bg-secondary-800 border border-secondary-200 dark:border-secondary-700 rounded-xl text-sm font-medium text-secondary-900 dark:text-white placeholder-secondary-400 focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all shadow-sm"
                  required
                />
              </div>

              {/* Email */}
              <div className="relative flex items-center group">
                <div className="absolute left-4 flex items-center pointer-events-none transition-colors group-focus-within:text-primary-600 text-secondary-400">
                  <FiMail size={16} />
                </div>
                <input
                  id="email"
                  type="email"
                  placeholder="Email Address"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  autoComplete="off"
                  className="w-full pl-11 pr-4 py-3 bg-secondary-50/50 dark:bg-secondary-800 border border-secondary-200 dark:border-secondary-700 rounded-xl text-sm font-medium text-secondary-900 dark:text-white placeholder-secondary-400 focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all shadow-sm"
                  required
                />
              </div>

              {/* Password */}
              <div>
                <div className="relative flex items-center group">
                  <div className="absolute left-4 flex items-center pointer-events-none transition-colors group-focus-within:text-primary-600 text-secondary-400">
                    <FiLock size={16} />
                  </div>
                  <input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Password (Min. 6 characters)"
                    value={form.password}
                    onChange={(e) => setForm({ ...form, password: e.target.value })}
                    autoComplete="new-password"
                    className="w-full pl-11 pr-16 py-3 bg-secondary-50/50 dark:bg-secondary-800 border border-secondary-200 dark:border-secondary-700 rounded-xl text-sm font-medium text-secondary-900 dark:text-white placeholder-secondary-400 focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all shadow-sm"
                    required
                    minLength={6}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 text-[10px] font-bold text-primary-600 hover:text-primary-700 dark:text-primary-500 dark:hover:text-primary-400 uppercase tracking-wider bg-transparent transition-colors"
                  >
                    {showPassword ? 'Hide' : 'Show'}
                  </button>
                </div>
                
                {/* Strength bar */}
                {form.password && (
                  <div className="mt-2 animate-fade-in">
                    <div className="flex gap-1 mb-1">
                      {[1, 2, 3, 4].map((lvl) => (
                        <div
                          key={lvl}
                          className={`h-1 flex-1 rounded-full transition-all duration-300 ${
                            lvl <= strength.level ? strength.color : 'bg-secondary-200 dark:bg-secondary-700'
                          }`}
                        />
                      ))}
                    </div>
                    <p className="text-[10px] text-secondary-500 dark:text-secondary-400 font-bold uppercase tracking-wider">{strength.label}</p>
                  </div>
                )}
              </div>

              {/* Role selection */}
              <div>
                <label className="block text-[11px] font-bold text-secondary-500 dark:text-secondary-400 mb-2 mt-4 uppercase tracking-wider">I want to join as</label>
                <div className="grid gap-3">
                  {roles.map(({ value, label, desc, icon: Icon, color }) => {
                    const active = form.role === value;
                    return (
                      <button
                        key={value}
                        type="button"
                        onClick={() => setForm({ ...form, role: value })}
                        className={`
                          flex items-start gap-3 p-3.5 rounded-2xl border text-left transition-all duration-200 group relative overflow-hidden
                          ${active
                            ? 'bg-primary-50/50 dark:bg-primary-900/10 border-primary-500 shadow-sm'
                            : 'bg-white dark:bg-secondary-800/50 border-secondary-200 dark:border-secondary-700 hover:border-primary-300 dark:hover:border-primary-800'
                          }
                        `}
                      >
                        {active && <div className="absolute inset-0 bg-primary-500/5 dark:bg-primary-500/10 animate-fade-in" />}
                        <div className={`w-9 h-9 rounded-xl bg-gradient-to-br ${color} flex items-center justify-center flex-shrink-0 shadow-sm relative z-10 transition-transform group-hover:scale-110`}>
                          <Icon size={16} className="text-white" />
                        </div>
                        <div className="min-w-0 flex-1 relative z-10">
                          <p className={`text-[13px] font-bold ${active ? 'text-primary-700 dark:text-primary-400' : 'text-secondary-900 dark:text-white'}`}>
                            {label}
                          </p>
                          <p className="text-[11px] text-secondary-500 dark:text-secondary-400 leading-relaxed mt-0.5 pr-2">{desc}</p>
                        </div>
                        {active && (
                          <div className="flex items-center justify-center h-9 relative z-10 animate-scale-in">
                            <FiCheckCircle size={18} className="text-primary-600 dark:text-primary-500 flex-shrink-0" />
                          </div>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3.5 mt-6 btn-gradient text-white rounded-xl text-sm font-bold shadow-md shadow-primary-500/20 transition-all active:scale-[0.98] hover:shadow-glow disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center overflow-hidden relative group"
              >
                <div className="absolute inset-0 bg-white/20 w-[150%] h-[150%] -translate-x-full rotate-45 group-hover:animate-[shimmer_1.5s_infinite]"></div>
                {isLoading ? (
                  <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  'Create Account'
                )}
              </button>
            </form>

            {/* Divider */}
            <div className="flex items-center my-6">
              <div className="flex-1 h-px bg-secondary-200 dark:bg-secondary-800" />
              <span className="px-3 text-[10px] font-bold text-secondary-400 dark:text-secondary-500 uppercase tracking-widest">or</span>
              <div className="flex-1 h-px bg-secondary-200 dark:bg-secondary-800" />
            </div>

            {/* Sign In Link */}
            <Link to="/login" className="w-full py-3 bg-white dark:bg-secondary-800 border border-secondary-300 dark:border-secondary-700 rounded-xl text-sm font-semibold text-secondary-700 dark:text-secondary-300 hover:bg-secondary-50 dark:hover:bg-secondary-700 transition-all flex justify-center items-center h-[46px] text-center hover:shadow-sm">
              Sign In Instead
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
