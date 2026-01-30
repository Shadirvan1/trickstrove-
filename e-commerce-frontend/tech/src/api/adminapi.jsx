import axios from "axios";

const API_URL = "https://e-tricktrove.onrender.com/api/v1/admin/";

const adminapi = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});
adminapi.interceptors.request.use((config) => {
  const token = localStorage.getItem("access_token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default adminapi;
