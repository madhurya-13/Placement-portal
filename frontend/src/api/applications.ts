// src/api/applications.ts
import axiosClient from "./axiosClient";
import type { Application, Applicant, ApplicationStatus } from "../types";

export const applyToJob = (jobId: number) =>
  axiosClient.post<Application>("/api/v1/applications/", { job_id: jobId });

export const getMyApplications = () =>
  axiosClient.get<Application[]>("/api/v1/applications/me");

export const getApplicantsForJob = (jobId: number) =>
  axiosClient.get<Applicant[]>(`/api/v1/applications/job/${jobId}`);

export const updateApplicationStatus = (applicationId: number, statusValue: ApplicationStatus) =>
  axiosClient.put<Applicant>(`/api/v1/applications/${applicationId}/status`, { status: statusValue });