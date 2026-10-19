// src/api/jobs.ts
import axiosClient from "./axiosClient";
import type { Job, JobCreateInput, JobUpdateInput, RecruiterStats } from "../types";

export const listJobs = () => axiosClient.get<Job[]>("/api/v1/jobs/");
export const getJob = (id: number) => axiosClient.get<Job>(`/api/v1/jobs/${id}`);

export const getMyJobs = () => axiosClient.get<Job[]>("/api/v1/jobs/mine");
export const getRecruiterStats = () => axiosClient.get<RecruiterStats>("/api/v1/jobs/stats");
export const createJob = (data: JobCreateInput) => axiosClient.post<Job>("/api/v1/jobs/", data);
export const updateJob = (id: number, data: JobUpdateInput) =>
  axiosClient.put<Job>(`/api/v1/jobs/${id}`, data);
export const deleteJob = (id: number) => axiosClient.delete(`/api/v1/jobs/${id}`);