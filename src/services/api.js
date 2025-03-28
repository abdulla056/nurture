import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_SERVER_URL, 
  timeout: 20000,  // 5 seconds timeout
  headers: {
    "Content-Type": "application/json",
  },
});

// Add a request interceptor
api.interceptors.request.use(
  (config) => {
    const csrfToken = sessionStorage.getItem('csrfToken');  // Retrieve the token
    if (csrfToken && ['post', 'put', 'delete'].includes(config.method.toLowerCase())) {
      config.headers['X-CSRF-Token'] = csrfToken;  // Add the token to headers
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;