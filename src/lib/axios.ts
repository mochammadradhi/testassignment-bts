import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_URL || "";

export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.log(error.response?.status);
    if (error.response?.status === 401 || error.response?.status === 403) {
      const token = localStorage.getItem("token");

      localStorage.removeItem("token");
      localStorage.removeItem("authState");
      // First check if token exists and is expired
      if (token && isTokenExpired(token)) {
        localStorage.removeItem("token");
        localStorage.removeItem("authState");

        window.location.href = "/login";
      }
    }
    return Promise.reject(error);
  }
);

export default api;
