// src/types/index.ts

export interface StudentProfile {
  id: number;
  user_id: number;
  full_name: string;
  branch: string;
  batch_year: number;
  cgpa: number;
  phone: string | null;
  resume_url: string | null;
}

export interface Company {
  id: number;
  name: string;
  description?: string | null;
  website?: string | null;
  logo_url: string | null;
}

export interface Job {
  id: number;
  title: string;
  description: string;
  ctc: number | null;
  eligibility_criteria: string | null;
  deadline: string;
  created_at: string;
  company: Company;
  posted_by?: number | null;
}

export type ApplicationStatus = "applied" | "shortlisted" | "rejected" | "selected";

export interface Application {
  id: number;
  job_id: number;
  status: ApplicationStatus;
  applied_at: string;
  job: Job;
}

export interface JobCreateInput {
  company_id: number;
  title: string;
  description: string;
  ctc?: number;
  eligibility_criteria?: string;
  deadline: string;
}

export interface JobUpdateInput {
  title?: string;
  description?: string;
  ctc?: number;
  eligibility_criteria?: string;
  deadline?: string;
}

export interface ApplicantStudent {
  id: number;
  full_name: string;
  branch: string;
  batch_year: number;
  cgpa: number;
  resume_url: string | null;
}

export interface Applicant {
  id: number;
  status: ApplicationStatus;
  applied_at: string;
  student: ApplicantStudent;
}

export interface PendingRecruiter {
  id: number;
  email: string;
  is_approved: boolean;
  created_at: string;
}

export interface PlacementStats {
  total_students: number;
  total_recruiters: number;
  total_companies: number;
  total_jobs: number;
  pending_recruiters: number;
  pending_jobs: number;
  total_applications: number;
  applications_by_status: Record<string, number>;
  top_companies_by_applications: { company: string; applications: number }[];
  placement_rate_percent: number;
}