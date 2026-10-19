// src/api/notifications.ts
import axiosClient from "./axiosClient";

export const getNotifications = () => axiosClient.get("/api/v1/notifications");
