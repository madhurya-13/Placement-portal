// src/api/jobs.ts
import axiosClient from "./axiosClient";
import type { Job } from "../types";

export const listJobs = () => axiosClient.get<Job[]>("/api/v1/jobs/");
export const getJob = (id: number) => axiosClient.get<Job>(`/api/v1/jobs/${id}`);