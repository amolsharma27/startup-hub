/**
 * Safely format and encode uploaded image URLs (profile photos, startup logos, banners).
 * Handles relative paths, spaces in filenames, base64 data strings, and decoupled API URLs.
 */
export const getImageUrl = (path) => {
  if (!path) return '';
  
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
