// src/api/auth.ts
import axiosClient from "./axiosClient";

export const login = (email: string, password: string) =>
  axiosClient.post("/api/v1/auth/login", { email, password });

export const register = (email: string, password: string, role: string) =>
  axiosClient.post("/api/v1/auth/register", { email, password, role });

export const getMe = () => axiosClient.get("/api/v1/auth/me");