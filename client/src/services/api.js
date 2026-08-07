const BASE_URL = '/api';

const getToken = () =>
  localStorage.getItem('token') || sessionStorage.getItem('token');

/**
 * Safely parse the response body.
 * Handles empty bodies, non-JSON responses, and network-level errors.
 */
const handleResponse = async (response) => {
  // Read raw text first — never call .json() on an empty body
  let text = '';
  try {
    text = await response.text();
  } catch {
    throw new Error('Server returned no response. Please make sure the backend server is running.');
  }

  // Empty body — treat as server-down or misconfigured proxy
  if (!text || text.trim() === '') {
    if (!response.ok) {
      throw new Error(
        `Server error (${response.status}). Make sure the backend is running on port 5000.`
      );
    }
    return {};
  }

  // Try to parse as JSON
  let data;
  try {
    data = JSON.parse(text);
  } catch {
    // Server returned HTML (e.g. Vite 404 page) or plain text
    if (!response.ok) {
      throw new Error(
        `Server error (${response.status}). ` +
        (text.includes('<!DOCTYPE') || text.includes('<html')
          ? 'The backend server may not be running. Start it with: cd server && npm run dev'
          : text.slice(0, 120))
      );
    }
    throw new Error('Received unexpected response from server.');
  }

  if (!response.ok) {
    throw new Error(data.message || `Request failed (${response.status})`);
  }

  return data;
};

const buildHeaders = (extra = {}) => {
  const token = getToken();
  const headers = { 'Content-Type': 'application/json', ...extra };
  if (token) headers.Authorization = `Bearer ${token}`;
  return headers;
};

export const api = {
  get: async (endpoint) => {
    let response;
    try {
      response = await fetch(`${BASE_URL}${endpoint}`, {
        headers: buildHeaders(),
      });
    } catch {
      throw new Error(
        'Cannot reach the server. Make sure the backend is running on port 5000.'
      );
    }
    return handleResponse(response);
  },

  post: async (endpoint, body) => {
    let response;
    try {
      response = await fetch(`${BASE_URL}${endpoint}`, {
        method: 'POST',
        headers: buildHeaders(),
        body: JSON.stringify(body),
      });
    } catch {
      throw new Error(
        'Cannot reach the server. Make sure the backend is running on port 5000.'
      );
    }
    return handleResponse(response);
  },

  put: async (endpoint, body) => {
    let response;
    try {
      response = await fetch(`${BASE_URL}${endpoint}`, {
        method: 'PUT',
        headers: buildHeaders(),
        body: JSON.stringify(body),
      });
    } catch {
      throw new Error(
        'Cannot reach the server. Make sure the backend is running on port 5000.'
      );
    }
    return handleResponse(response);
  },

  delete: async (endpoint) => {
    let response;
    try {
      response = await fetch(`${BASE_URL}${endpoint}`, {
        method: 'DELETE',
        headers: buildHeaders(),
      });
    } catch {
      throw new Error(
        'Cannot reach the server. Make sure the backend is running on port 5000.'
      );
    }
    return handleResponse(response);
  },

  upload: async (endpoint, formData) => {
    const token = getToken();
    const headers = {};
    if (token) headers.Authorization = `Bearer ${token}`;
    let response;
    try {
      response = await fetch(`${BASE_URL}${endpoint}`, {
        method: 'POST',
        headers,
        body: formData,
      });
    } catch {
      throw new Error(
        'Cannot reach the server. Make sure the backend is running on port 5000.'
      );
    }
    return handleResponse(response);
  },
};
