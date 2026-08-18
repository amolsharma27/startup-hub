import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { setAuthToken } from '../utils/auth';
import { api } from '../services/api';
import { FiMail, FiLock, FiArrowLeft, FiShield, FiUser } from 'react-icons/fi';
import ThemeToggle from '../components/ThemeToggle';
import logo from '../assets/logos/sh-logo.jpg';

const LoginPage = ({ setUser, showToast }) => {
  const [form,         setForm]         = useState({ email: '', password: '' });
  const [rememberMe,   setRememberMe]   = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isAdminLogin, setIsAdminLogin] = useState(false);
  const [error,        setError]        = useState('');
  const [isLoading,    setIsLoading]    = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    try {
      const data = await api.post('/auth/login', form);
      
      // If user selected Admin Login tab, ensure account is actually an admin
      if (isAdminLogin && data.user?.role !== 'admin') {
        setIsLoading(false);
        setError('Access denied: Account does not have administrator privileges.');
        showToast('Access denied for Admin Portal', 'error');
        return;
      }

      setAuthToken(data.token, rememberMe);
      setUser(data.user);
      showToast(isAdminLogin ? 'Welcome Admin!' : 'Welcome back!', 'success');
      
      // Redirect admin to admin console, standard users to dashboard
      navigate(data.user?.role === 'admin' ? '/admin' : '/dashboard');
    } catch (err) {
      setError(err.message || 'Invalid email or password');
      showToast(err.message || 'Login failed', 'error');
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
      <div className="w-full max-w-[850px] min-h-[520px] flex flex-col md:flex-row bg-white dark:bg-secondary-900 rounded-3xl shadow-2xl overflow-hidden relative border border-secondary-200 dark:border-secondary-800 animate-scale-in">
        
        {/* Left Section (Crimson with subtle glow/bubbles) */}
        <div className="relative w-full md:w-[45%] bg-primary-600 p-10 flex flex-col justify-center overflow-hidden">
          {/* Decorative Bubbles (Red Shades) */}
          <div className="absolute top-[-10%] right-[-10%] w-64 h-64 bg-primary-500 rounded-full opacity-60 blur-xl animate-pulse-glow"></div>
          <div className="absolute bottom-[-15%] left-[-15%] w-72 h-72 bg-primary-700 rounded-full opacity-70 blur-2xl animate-float delay-100"></div>
          
          <div className="relative z-10 text-white mt-[-20px] animate-fade-in-up delay-150">
            <div className="bg-white/90 p-3 rounded-2xl inline-block mb-8 shadow-lg backdrop-blur-md">
              <img src={logo} alt="StartupHub" className="h-10 w-auto" />
            </div>
            <h2 className="text-3xl font-black tracking-wider mb-2 uppercase">
              {isAdminLogin ? 'Admin Portal' : 'Welcome Back'}
            </h2>
            <h3 className="text-lg font-bold mb-6 tracking-wide uppercase opacity-90 border-b border-white/20 pb-4 inline-block">
              StartupHub {isAdminLogin ? 'Console' : 'Builders'}
            </h3>
            <p className="text-primary-100 text-xs leading-relaxed max-w-[250px] font-medium opacity-90">
              {isAdminLogin
                ? 'Manage users, startups, applications, and system settings securely.'
                : 'Join thousands of founders, mentors, and builders collaborating to turn bold ideas into real companies.'}
            </p>
          </div>
        </div>

        {/* Right Section (Form) */}
        <div className="w-full md:w-[55%] p-8 lg:px-12 lg:py-10 flex flex-col justify-center bg-white dark:bg-secondary-900 text-secondary-900 dark:text-white transition-colors duration-300">
          <div className="w-full max-w-sm mx-auto animate-fade-in-up delay-200">
            
            {/* Mode Switcher Tabs (User vs Admin Login) */}
            <div className="flex p-1 bg-secondary-100 dark:bg-secondary-800 rounded-2xl mb-6 border border-secondary-200 dark:border-secondary-700">
              <button
                type="button"
                onClick={() => { setIsAdminLogin(false); setError(''); }}
                className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                  !isAdminLogin
                    ? 'bg-white dark:bg-secondary-900 text-primary-600 dark:text-primary-400 shadow-sm'
                    : 'text-secondary-500 hover:text-secondary-700 dark:hover:text-secondary-300'
                }`}
              >
                <FiUser size={13} /> User Login
              </button>
              <button
                type="button"
                onClick={() => { setIsAdminLogin(true); setError(''); }}
                className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                  isAdminLogin
                    ? 'bg-primary-600 text-white shadow-sm'
                    : 'text-secondary-500 hover:text-secondary-700 dark:hover:text-secondary-300'
                }`}
              >
                <FiShield size={13} /> Admin Login
              </button>
            </div>

            <h1 className="text-[24px] font-bold mb-1">
              {isAdminLogin ? 'Admin Sign In' : 'Sign in'}
            </h1>
            <p className="text-secondary-400 dark:text-secondary-500 text-[11px] font-semibold mb-6 uppercase tracking-wider">
              {isAdminLogin ? 'Enter your admin credentials manually' : 'Login to your StartupHub account'}
            </p>

            {error && (
              <div className="mb-5 p-3 rounded-xl bg-danger-50 dark:bg-danger-900/20 border border-danger-200 dark:border-danger-800/30 text-danger-600 dark:text-danger-400 text-xs font-medium flex items-center animate-shake">
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4" noValidate autoComplete="off">
              {/* Email */}
              <div className="relative flex items-center group">
                <div className="absolute left-4 flex items-center pointer-events-none transition-colors group-focus-within:text-primary-600 text-secondary-400">
                  <FiMail size={16} />
                </div>
                <input
                  id="email"
                  type="email"
                  placeholder={isAdminLogin ? "Admin Email Address" : "Email Address"}
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  autoComplete="email"
                  className="w-full pl-11 pr-4 py-3 bg-secondary-50/50 dark:bg-secondary-800 border border-secondary-200 dark:border-secondary-700 rounded-xl text-sm font-medium text-secondary-900 dark:text-white placeholder-secondary-400 focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all shadow-sm"
                  required
                />
              </div>

              {/* Password */}
              <div className="relative flex items-center group">
                <div className="absolute left-4 flex items-center pointer-events-none transition-colors group-focus-within:text-primary-600 text-secondary-400">
                  <FiLock size={16} />
                </div>
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder={isAdminLogin ? "Admin Password" : "Password"}
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  autoComplete="new-password"
                  className="w-full pl-11 pr-16 py-3 bg-secondary-50/50 dark:bg-secondary-800 border border-secondary-200 dark:border-secondary-700 rounded-xl text-sm font-medium text-secondary-900 dark:text-white placeholder-secondary-400 focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all shadow-sm"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 text-[10px] font-bold text-primary-600 hover:text-primary-700 dark:text-primary-500 dark:hover:text-primary-400 uppercase tracking-wider bg-transparent transition-colors"
                >
                  {showPassword ? 'Hide' : 'Show'}
                </button>
              </div>

              {/* Remember me & Forgot Password */}
              <div className="flex items-center justify-between pt-1">
                <label className="flex items-center gap-2 cursor-pointer group">
                  <div className="relative flex items-center justify-center w-[14px] h-[14px]">
                    <input
                      type="checkbox"
                      checked={rememberMe}
                      onChange={() => setRememberMe(!rememberMe)}
                      className="peer appearance-none w-3.5 h-3.5 border border-secondary-300 dark:border-secondary-600 rounded-[3px] checked:bg-primary-600 checked:border-primary-600 cursor-pointer transition-colors"
                    />
                    <svg
                      className="absolute w-2.5 h-2.5 text-white pointer-events-none opacity-0 peer-checked:opacity-100"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={3}
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <span className="text-[11px] text-secondary-500 dark:text-secondary-400 font-medium group-hover:text-secondary-700 dark:group-hover:text-secondary-300 transition-colors">
                    Remember me
                  </span>
                </label>
                <Link to="/forgot-password" className="text-[11px] font-semibold text-primary-600 hover:text-primary-700 dark:text-primary-500 transition-colors">
                  Forgot Password?
                </Link>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3.5 mt-4 btn-gradient text-white rounded-xl text-sm font-bold shadow-md shadow-primary-500/20 transition-all active:scale-[0.98] hover:shadow-glow disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center overflow-hidden relative group"
              >
                <div className="absolute inset-0 bg-white/20 w-[150%] h-[150%] -translate-x-full rotate-45 group-hover:animate-[shimmer_1.5s_infinite]"></div>
                {isLoading ? (
                  <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  isAdminLogin ? 'Sign in as Admin' : 'Sign in'
                )}
              </button>
            </form>

            {/* Sign Up Link */}
            {!isAdminLogin && (
              <p className="text-center text-[11px] text-secondary-500 dark:text-secondary-400 mt-6 font-medium">
                Don't have an account?{' '}
                <Link to="/register" className="text-primary-600 dark:text-primary-500 font-bold hover:underline transition-colors">
                  Sign Up
                </Link>
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
