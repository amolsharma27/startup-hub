import { useEffect, useState } from 'react';
import { FiCheckCircle, FiXCircle, FiAlertTriangle, FiInfo, FiX } from 'react-icons/fi';

const DURATION = 4000;

const configs = {
  success: {
    icon: FiCheckCircle,
    bar:  'bg-success-500',
    lightBg: 'bg-white',
    darkBg: 'bg-secondary-900',
    lightBorder: 'border-success-200',
    darkBorder: 'border-success-500/30',
    lightText: 'text-secondary-900',
    darkText: 'text-white',
    iconClass: 'text-success-400',
    label: 'Success',
  },
  error: {
    icon: FiXCircle,
    bar:  'bg-danger-500',
    lightBg: 'bg-white',
    darkBg: 'bg-secondary-900',
    lightBorder: 'border-danger-200',
    darkBorder: 'border-danger-500/30',
    lightText: 'text-secondary-900',
    darkText: 'text-white',
    iconClass: 'text-danger-400',
    label: 'Error',
  },
  warning: {
    icon: FiAlertTriangle,
    bar:  'bg-warning-500',
    lightBg: 'bg-white',
    darkBg: 'bg-secondary-900',
    lightBorder: 'border-warning-200',
    darkBorder: 'border-warning-500/30',
    lightText: 'text-secondary-900',
    darkText: 'text-white',
    iconClass: 'text-warning-400',
    label: 'Warning',
  },
  info: {
    icon: FiInfo,
    bar:  'bg-primary-500',
    lightBg: 'bg-white',
    darkBg: 'bg-secondary-900',
    lightBorder: 'border-primary-200',
    darkBorder: 'border-primary-500/30',
    lightText: 'text-secondary-900',
    darkText: 'text-white',
    iconClass: 'text-primary-400',
    label: 'Info',
  },
};

const Toast = ({ message, type = 'success', onClose }) => {
  const [exiting, setExiting] = useState(false);

  const cfg = configs[type] || configs.success;
  const Icon = cfg.icon;

  /* Auto-dismiss */
  useEffect(() => {
    const timer = setTimeout(() => handleClose(), DURATION);
    return () => clearTimeout(timer);
  }, []);

  const handleClose = () => {
    setExiting(true);
    setTimeout(onClose, 300);
  };

  return (
    <div
      role="alert"
      aria-live="assertive"
      className={`
        fixed top-5 right-5 z-[9999]
        flex items-start gap-3
        w-full max-w-sm
        rounded-2xl border shadow-card-lg
        overflow-hidden
        transition-all duration-300
        ${exiting ? 'opacity-0 translate-x-4' : 'opacity-100 translate-x-0 animate-slide-in'}
        ${cfg.lightBg} dark:${cfg.darkBg}
        ${cfg.lightBorder} dark:${cfg.darkBorder}
        ${cfg.lightText} dark:${cfg.darkText}
      `}
      style={{ backdropFilter: 'blur(12px)' }}
    >
      {/* Left accent bar */}
      <div className={`w-1 self-stretch flex-shrink-0 ${cfg.bar} rounded-l-2xl`} />

      {/* Body */}
      <div className="flex items-start gap-3 py-4 pr-4 flex-1 min-w-0">
        {/* Icon */}
        <div className={`mt-0.5 flex-shrink-0 ${cfg.iconClass}`}>
          <Icon size={18} />
        </div>

        {/* Text */}
        <div className="flex-1 min-w-0">
          <p className="text-xs font-semibold uppercase tracking-wider opacity-60 mb-0.5">{cfg.label}</p>
          <p className="text-sm font-medium leading-snug break-words">{message}</p>
        </div>

        {/* Close */}
        <button
          onClick={handleClose}
          className="flex-shrink-0 mt-0.5 p-1 rounded-lg opacity-50 hover:opacity-100 transition-opacity focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500"
          aria-label="Dismiss"
        >
          <FiX size={14} />
        </button>
      </div>

      {/* Progress bar */}
      <div className="absolute bottom-0 left-1 right-0 h-0.5 bg-black/10 dark:bg-white/10 rounded-full overflow-hidden">
        <div
          className={`h-full ${cfg.bar} opacity-60 rounded-full`}
          style={{ animation: `progress ${DURATION}ms linear forwards` }}
        />
      </div>
    </div>
  );
};

export default Toast;
