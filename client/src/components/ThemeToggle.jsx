import { FiSun, FiMoon } from 'react-icons/fi';
import { useTheme } from '../context/ThemeContext';

const ThemeToggle = ({ className = '' }) => {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === 'dark';

  return (
    <button
      onClick={toggleTheme}
      aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
      title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
      className={`
        relative w-9 h-9 rounded-xl
        flex items-center justify-center
        border transition-all duration-200
        focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2
        active:scale-90
        ${isDark
          ? 'bg-secondary-800 border-secondary-700/60 text-secondary-400 hover:text-primary-400 hover:border-primary-500/40 hover:bg-secondary-700'
          : 'bg-white border-secondary-200 text-secondary-500 hover:text-primary-600 hover:border-primary-300 hover:bg-primary-50'
        }
        ${className}
      `}
    >
      <span className="sr-only">{isDark ? 'Switch to light mode' : 'Switch to dark mode'}</span>

      {/* Sun icon — visible in light mode */}
      <FiSun
        size={16}
        className={`absolute transition-all duration-300 ${
          isDark ? 'opacity-0 rotate-90 scale-50' : 'opacity-100 rotate-0 scale-100'
        }`}
      />

      {/* Moon icon — visible in dark mode */}
      <FiMoon
        size={16}
        className={`absolute transition-all duration-300 ${
          isDark ? 'opacity-100 rotate-0 scale-100' : 'opacity-0 -rotate-90 scale-50'
        }`}
      />
    </button>
  );
};

export default ThemeToggle;
