import axios from "axios";

const api = axios.create({
  baseURL: "http://127.0.0.1:5001", 
  timeout: 5000,  // 5 seconds timeout
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