export const getAuthToken = () => localStorage.getItem('token') || sessionStorage.getItem('token');

export const setAuthToken = (token, rememberMe = false) => {
  if (rememberMe) {
    localStorage.setItem('token', token);
    sessionStorage.removeItem('token');
  } else {
    sessionStorage.setItem('token', token);
    localStorage.removeItem('token');
  }
};

export const clearAuthToken = () => {
  localStorage.removeItem('token');
  sessionStorage.removeItem('token');
};
