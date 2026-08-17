import { Link, useNavigate } from 'react-router-dom';
import { FiHome, FiArrowLeft, FiSearch } from 'react-icons/fi';

const NotFoundPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center p-6 dark:bg-[#0a0a0a] light:bg-[#FAFAFA] relative overflow-hidden transition-colors duration-300">

      <div className="relative text-center max-w-lg animate-fade-in-up">

        {/* Icon */}
        <div className="relative inline-block mb-8">
          <div className="w-28 h-28 rounded-3xl bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center mx-auto shadow-glow">
            <FiSearch size={48} className="text-white" />
          </div>
          {/* Ping ring */}
          <div className="absolute inset-0 w-28 h-28 rounded-3xl border-2 border-primary-500/30 animate-ping-slow" />
        </div>

        {/* 404 */}
        <h1 className="text-8xl font-extrabold gradient-text mb-2 leading-none">404</h1>
        <h2 className="text-2xl font-bold text-heading mb-3">Page Not Found</h2>
        <p className="text-muted mb-10 leading-relaxed max-w-sm mx-auto">
          The page you're looking for doesn't exist or may have been moved to a different URL.
        </p>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link to="/" className="btn-primary !py-3 !px-7">
            <FiHome size={16} /> Go Home
          </Link>
          <button
            onClick={() => navigate(-1)}
            className="btn-outline !py-3 !px-7"
          >
            <FiArrowLeft size={16} /> Go Back
          </button>
        </div>

        {/* Helpful links */}
        <div className="mt-10 pt-8 border-t dark:border-secondary-800/60 light:border-secondary-200">
          <p className="text-xs text-muted mb-4">Or try one of these pages:</p>
          <div className="flex flex-wrap justify-center gap-2">
            {[
              { to: '/dashboard',  label: 'Dashboard'  },
              { to: '/startups',   label: 'Startups'   },
              { to: '/features',   label: 'Features'   },
              { to: '/contact',    label: 'Contact'    },
            ].map(({ to, label }) => (
              <Link
                key={to}
                to={to}
                className="px-3.5 py-1.5 rounded-xl text-xs font-medium border transition-all duration-150
                  dark:border-secondary-700/60 dark:text-secondary-400 dark:hover:border-primary-500/40 dark:hover:text-primary-400
                  light:border-secondary-200 light:text-secondary-600 light:hover:border-primary-300 light:hover:text-primary-600"
              >
                {label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotFoundPage;
