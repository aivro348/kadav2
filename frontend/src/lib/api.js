const apiUrl = import.meta.env.VITE_API_URL || '';

const getHeaders = () => {
  const headers = {
    'Content-Type': 'application/json',
  };
  
  const token = sessionStorage.getItem('rws_token');
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  
  return headers;
};

const handleResponse = async (response) => {
  if (response.status === 401) {
    // Unauthorized: Clear token and redirect to login
    sessionStorage.removeItem('rws_token');
    sessionStorage.removeItem('rws_username');
    sessionStorage.removeItem('rws_role');
    window.location.href = '/login';
    throw new Error('Session expired. Please log in again.');
  }
  
  const data = await response.json().catch(() => ({}));
  
  if (!response.ok) {
    throw new Error(data.error || 'An API error occurred.');
  }
  
  return data;
};

export const api = {
  get: async (endpoint) => {
    const response = await fetch(`${apiUrl}/php-backend/api${endpoint}`, {
      method: 'GET',
      headers: getHeaders(),
    });
    return handleResponse(response);
  },
  
  post: async (endpoint, body) => {
    const response = await fetch(`${apiUrl}/php-backend/api${endpoint}`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(body),
    });
    return handleResponse(response);
  },
  
  delete: async (endpoint) => {
    const response = await fetch(`${apiUrl}/php-backend/api${endpoint}`, {
      method: 'DELETE',
      headers: getHeaders(),
    });
    return handleResponse(response);
  }
};
