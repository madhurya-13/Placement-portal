// src/api/applications.ts
import axiosClient from "./axiosClient";
import type { Application } from "../types";

export const applyToJob = (jobId: number) =>
  axiosClient.post<Application>("/api/v1/applications/", { job_id: jobId });

export const getMyApplications = () =>
  axiosClient.get<Application[]>("/api/v1/applications/me");