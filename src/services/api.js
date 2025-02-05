import axios from "axios";

const api = axios.create({
  baseURL: "http://127.0.0.1:5001", 
  timeout: 5000,  // 5 seconds timeout
  headers: {
    "Content-Type": "application/json",
  },
});

export default api;