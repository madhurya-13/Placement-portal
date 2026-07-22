// src/api/company.ts
import axiosClient from "./axiosClient";
import type { Company } from "../types";

export const createCompany = (data: {
  name: string;
  description?: string;
  website?: string;
}) => axiosClient.post<Company>("/api/v1/companies/", data);

export const getMyCompanies = () => axiosClient.get<Company[]>("/api/v1/companies/mine");