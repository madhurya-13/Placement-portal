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