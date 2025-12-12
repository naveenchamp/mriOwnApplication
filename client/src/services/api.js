import axios from "axios";

const baseURL = import.meta.env.VITE_API_URL || "https://mriownapplication-6.onrender.com/";

const api = axios.create({
  baseURL,
  timeout: 15000,
  withCredentials: true, // REQUIRED for cookie auth
});

api.interceptors.response.use(
  (res) => res,
  (err) => {
    console.error("API Error:", err.response?.data || err.message);
    return Promise.reject(err);
  }
);

export default api;
