import { apiClient } from "@/api/client";
import { CORE_ENDPOINTS } from "@/api/endpoints";
import { DepartmentListResponseSchema, type Department } from "@/schemas/core.schema";

export async function getDepartments(): Promise<Department[]> {
  const response = await apiClient.get(CORE_ENDPOINTS.DEPARTMENTS.LIST);
  const parsed = DepartmentListResponseSchema.parse(response.data);
  return parsed.data;
}

export async function getColleges() {
  const response = await apiClient.get(CORE_ENDPOINTS.COLLEGES.LIST);
  return response.data;
}
