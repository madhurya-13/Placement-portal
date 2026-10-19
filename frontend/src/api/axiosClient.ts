// src/api/axiosClient.ts
// Centralized Axios instance — attaches the JWT automatically to every request.

import axios from "axios";

const axiosClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "http://localhost:8000",
});

// Attach the access token from localStorage to every outgoing request.
axiosClient.interceptors.request.use((config) => {
  const token = localStorage.getItem("access_token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Surface server failures as full-page error screens: HTTP 500 -> /500,
// HTTP 503 or an unreachable server -> /503. Login/register keep their
// inline messages instead (they render the API detail themselves), and we
// never redirect when already on an error page (prevents reload loops).
const ERROR_ROUTE = /^\/(?:401|403|404|500|503|451)$/;

axiosClient.interceptors.response.use(
  (response) => response,
  (error: unknown) => {
    // Cancelled requests are not server failures.
    if (axios.isCancel(error)) return Promise.reject(error);

    const status = axios.isAxiosError(error) ? error.response?.status : undefined;
    const url = axios.isAxiosError(error) ? (error.config?.url ?? "") : "";
    const serverUnreachable = axios.isAxiosError(error) && !error.response;
    const authScreenFlow = /\/auth\/(login|register)/.test(url);

    if (!authScreenFlow && !ERROR_ROUTE.test(window.location.pathname)) {
      if (status === 500 || status === 503) {
        window.location.assign(`/${status}`);
      } else if (serverUnreachable) {
        window.location.assign("/503");
      }
    }
    return Promise.reject(error);
  }
);

export default axiosClient;