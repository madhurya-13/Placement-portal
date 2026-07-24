// src/api/officer.ts
import axiosClient from "./axiosClient";
import type { PendingRecruiter, PlacementStats, Job } from "../types";

export const getPendingRecruiters = () =>
  axiosClient.get<PendingRecruiter[]>("/api/v1/officer/recruiters/pending");

export const approveRecruiter = (id: number) =>
  axiosClient.post<PendingRecruiter>(`/api/v1/officer/recruiters/${id}/approve`);

export const rejectRecruiter = (id: number) =>
  axiosClient.post(`/api/v1/officer/recruiters/${id}/reject`);

export const getPendingJobs = () => axiosClient.get<Job[]>("/api/v1/officer/jobs/pending");

export const updateJobApproval = (jobId: number, approval_status: "approved" | "rejected") =>
  axiosClient.put<Job>(`/api/v1/officer/jobs/${jobId}/approval`, { approval_status });

export const getStats = () => axiosClient.get<PlacementStats>("/api/v1/officer/stats");