/**
 * Safely format and encode uploaded image URLs (profile photos, startup logos, banners).
 * Handles relative paths, spaces in filenames, base64 data strings, and decoupled API URLs.
 */
export const getImageUrl = (path, fallbackName = '') => {
  if (!path || path === 'null' || path === 'undefined') {
    if (fallbackName) {
      return `https://ui-avatars.com/api/?name=${encodeURIComponent(fallbackName)}&background=dc2626&color=fff&bold=true&rounded=true`;
    }
    return '';
  }

  // Return untouched if base64 data-URL, blob URL, or full HTTP/HTTPS URL
  if (
    path.startsWith('data:') ||
    path.startsWith('blob:') ||
    path.startsWith('http://') ||
    path.startsWith('https://')
  ) {
    return path;
  }

  // Ensure leading slash
  const cleanPath = path.startsWith('/') ? path : `/${path}`;

  // Safely encode URI components (converts spaces to %20 so browsers load images cleanly)
  const encodedPath = encodeURI(cleanPath);

  // If backend API URL is configured (e.g. VITE_API_URL for separate frontend/backend deployments), prepend origin
  const apiUrl = import.meta.env.VITE_API_URL;
  if (apiUrl) {
    const backendOrigin = apiUrl.replace(/\/api\/?$/, '');
    return `${backendOrigin}${encodedPath}`;
  }

  return encodedPath;
};

/**
 * Image fallback error handler to prevent broken image icons.
 */
export const handleImageError = (e, fallbackName = 'User') => {
  e.target.onerror = null; // Prevent infinite loop
  e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(fallbackName)}&background=dc2626&color=fff&bold=true&rounded=true`;
};
