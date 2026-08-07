import { createContext, useContext, useEffect, useState } from 'react';

const ThemeContext = createContext();

/* Apply theme class to <html> immediately — called before first render */
const applyTheme = (theme) => {
  const root = document.documentElement;
  if (theme === 'light') {
    root.classList.remove('dark');
    root.classList.add('light');
  } else {
    root.classList.remove('light');
    root.classList.add('dark');
  }
};

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState(() => {
    const saved = localStorage.getItem('startupHub-theme');
    const initial = saved || 'light';
    // Apply immediately — avoids flash of wrong theme on mount
    applyTheme(initial);
    return initial;
  });

  useEffect(() => {
    localStorage.setItem('startupHub-theme', theme);
    applyTheme(theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) throw new Error('useTheme must be used within a ThemeProvider');
  return context;
};
