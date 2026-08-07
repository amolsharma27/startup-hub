import plugin from 'tailwindcss/plugin';

/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'monospace'],
      },
      colors: {
        // ─── Primary Brand: Crimson Red ───────────────────────────────────
        primary: {
          50:  '#fef2f2',
          100: '#fee2e2',
          200: '#fecaca',
          300: '#fca5a5',
          400: '#f87171',
          500: '#dc2626',
          600: '#c41e3a', // Main Crimson
          700: '#b91c1c',
          800: '#991b1b',
          900: '#7f1d1d',
          950: '#450a0a',
        },
        // ─── Secondary: Dark Charcoal / Grays ──────────────────────────────────────
        secondary: {
          50:  '#fafafa',
          100: '#f5f5f5',
          200: '#e5e5e5',
          300: '#d4d4d4',
          400: '#a3a3a3',
          500: '#737373',
          600: '#525252',
          700: '#404040',
          800: '#262626',
          900: '#171717', // Charcoal Dark
          950: '#0a0a0a', // True Dark
        },
        // ─── Accent: Teal / Mint (Keeping as contrasting accent) ───────────────────
        accent: {
          50:  '#fafafa',
          100: '#f5f5f5',
          200: '#e5e5e5',
          300: '#d4d4d4',
          400: '#a3a3a3',
          500: '#737373',
          600: '#525252',
          700: '#404040',
          800: '#262626',
          900: '#171717',
        },
        // ─── Semantic ────────────────────────────────────────────────────────
        success: { 50: '#f0fdf4', 100: '#dcfce7', 200: '#bbf7d0', 400: '#4ade80', 500: '#22c55e', 600: '#16a34a', 700: '#15803d' },
        warning: { 50: '#fffbeb', 100: '#fef3c7', 200: '#fde68a', 400: '#fbbf24', 500: '#f59e0b', 600: '#d97706', 700: '#b45309' },
        danger:  { 50: '#fff1f2', 100: '#ffe4e6', 200: '#fecdd3', 400: '#f87171', 500: '#ef4444', 600: '#dc2626', 700: '#b91c1c' },
        // ─── Legacy aliases kept to avoid breaking existing classes ──────────
        brand: {
          50: '#fef2f2',
          100: '#fee2e2',
          200: '#fecaca',
          300: '#fca5a5',
          400: '#f87171',
          500: '#dc2626',
          600: '#c41e3a',
          700: '#b91c1c',
          800: '#991b1b',
          900: '#7f1d1d',
        },
        clay: {
          50:  '#f0fdfa',
          100: '#ccfbf1',
          200: '#99f6e4',
          300: '#5eead4',
          400: '#2dd4bf',
          500: '#c41e3a',
          600: '#991b1b',
          700: '#0f766e',
          800: '#115e59',
          900: '#134e4a',
        },
        cream: '#fafafa',
      },
      borderRadius: {
        '4xl': '2rem',
        '5xl': '2.5rem',
      },
      boxShadow: {
        'glow-sm':  '0 0 12px rgba(196,30,58,0.15)',
        'glow':     '0 0 24px rgba(196,30,58,0.2)',
        'glow-lg':  '0 0 48px rgba(196,30,58,0.25)',
        'glow-accent': '0 0 24px rgba(196,30,58,0.2)',
        'card':     '0 1px 3px rgba(10,10,10,0.06), 0 4px 12px rgba(10,10,10,0.04)',
        'card-md':  '0 4px 16px rgba(10,10,10,0.08), 0 1px 4px rgba(10,10,10,0.04)',
        'card-lg':  '0 8px 32px rgba(10,10,10,0.10), 0 2px 8px rgba(10,10,10,0.06)',
      },
      backgroundImage: {
        'gradient-primary': 'linear-gradient(135deg, #dc2626, #991b1b)',
        'gradient-accent':  'linear-gradient(135deg, #c41e3a, #991b1b)',
        'gradient-brand':   'linear-gradient(135deg, #dc2626, #c41e3a)',
        'gradient-hero':    'linear-gradient(135deg, #dc2626 0%, #c41e3a 40%, #c41e3a 100%)',
        'mesh-dark':        'radial-gradient(ellipse at top left, rgba(196,30,58,0.08) 0%, transparent 60%), radial-gradient(ellipse at bottom right, rgba(196,30,58,0.06) 0%, transparent 60%)',
        'mesh-light':       'radial-gradient(ellipse at top left, rgba(196,30,58,0.04) 0%, transparent 60%), radial-gradient(ellipse at bottom right, rgba(196,30,58,0.04) 0%, transparent 60%)',
      },
      keyframes: {
        'slide-in-right': { from: { transform: 'translateX(100%)', opacity: '0' }, to: { transform: 'translateX(0)', opacity: '1' } },
        'slide-in-up':    { from: { transform: 'translateY(20px)', opacity: '0' }, to: { transform: 'translateY(0)', opacity: '1' } },
        'slide-in-down':  { from: { transform: 'translateY(-20px)', opacity: '0' }, to: { transform: 'translateY(0)', opacity: '1' } },
        'fade-in':        { from: { opacity: '0' }, to: { opacity: '1' } },
        'fade-in-up':     { from: { transform: 'translateY(30px)', opacity: '0' }, to: { transform: 'translateY(0)', opacity: '1' } },
        'scale-in':       { from: { transform: 'scale(0.92)', opacity: '0' }, to: { transform: 'scale(1)', opacity: '1' } },
        'float':          { '0%, 100%': { transform: 'translateY(0px)' }, '50%': { transform: 'translateY(-10px)' } },
        'pulse-glow':     { '0%, 100%': { boxShadow: '0 0 5px rgba(196,30,58,0.3)' }, '50%': { boxShadow: '0 0 25px rgba(196,30,58,0.5)' } },
        'shimmer':        { '0%': { backgroundPosition: '-200% 0' }, '100%': { backgroundPosition: '200% 0' } },
        'counter-up':     { from: { opacity: '0', transform: 'translateY(10px)' }, to: { opacity: '1', transform: 'translateY(0)' } },
        'gradient-shift': { '0%': { backgroundPosition: '0% 50%' }, '50%': { backgroundPosition: '100% 50%' }, '100%': { backgroundPosition: '0% 50%' } },
        'progress':       { from: { width: '100%' }, to: { width: '0%' } },
        'ping-slow':      { '75%, 100%': { transform: 'scale(1.6)', opacity: '0' } },
      },
      animation: {
        'slide-in-right': 'slide-in-right 0.3s cubic-bezier(0.16,1,0.3,1)',
        'slide-in-up':    'slide-in-up 0.4s cubic-bezier(0.16,1,0.3,1)',
        'slide-in-down':  'slide-in-down 0.3s cubic-bezier(0.16,1,0.3,1)',
        'fade-in':        'fade-in 0.4s ease-out forwards',
        'fade-in-up':     'fade-in-up 0.5s cubic-bezier(0.16,1,0.3,1) forwards',
        'scale-in':       'scale-in 0.35s cubic-bezier(0.16,1,0.3,1) forwards',
        'float':          'float 4s ease-in-out infinite',
        'pulse-glow':     'pulse-glow 2s ease-in-out infinite',
        'shimmer':        'shimmer 2s linear infinite',
        'counter-up':     'counter-up 0.5s ease-out forwards',
        'gradient-shift': 'gradient-shift 5s ease infinite',
        'progress':       'progress 4s linear forwards',
        'ping-slow':      'ping-slow 1.5s cubic-bezier(0,0,0.2,1) infinite',
        'slide-in':       'slide-in-right 0.3s cubic-bezier(0.16,1,0.3,1)',
      },
    },
  },
  plugins: [
    plugin(({ addVariant }) => {
      addVariant('light', '.light &');
    }),
  ],
};
