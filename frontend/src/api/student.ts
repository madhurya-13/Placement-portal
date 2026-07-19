// src/api/student.ts
import axiosClient from "./axiosClient";
import type { StudentProfile } from "../types";

export const getMyProfile = () => axiosClient.get<StudentProfile>("/api/v1/students/me");

export const createMyProfile = (data: Partial<StudentProfile>) =>
  axiosClient.post<StudentProfile>("/api/v1/students/me", data);

export const updateMyProfile = (data: Partial<StudentProfile>) =>
  axiosClient.put<StudentProfile>("/api/v1/students/me", data);

export const uploadResume = (file: File) => {
  const formData = new FormData();
  formData.append("file", file);
  return axiosClient.post<StudentProfile>("/api/v1/students/me/resume", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
};