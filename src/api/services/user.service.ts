import { USER_ENDPOINTS, ROLE_ENDPOINTS } from "../endpoints";
import { apiClient } from "../client";
import { type CurrentUser } from "@/schemas/user.schema";

export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface UserListResponse {
  success: boolean;
  data: CurrentUser[];
  meta: PaginationMeta;
}

export interface Role {
  id: string;
  name: string;
  slug: string;
  description?: string;
  isStaffRole: boolean;
}

export interface RoleListResponse {
  success: boolean;
  data: Role[];
}

export const userService = {
  // Users
  getUsers: async (page = 1, limit = 20, search?: string, role?: string, department?: string) => {
    const params: Record<string, any> = { page, limit };
    if (search) params.search = search;
    if (role && role !== "all") params.role = role;
    if (department && department !== "all") params.department = department;
    
    const response = await apiClient.get<UserListResponse>(USER_ENDPOINTS.LIST, { params });
    return response.data;
  },

  getUser: async (id: string) => {
    const response = await apiClient.get<{ success: boolean; data: CurrentUser }>(USER_ENDPOINTS.DETAIL(id));
    return response.data;
  },

  createUser: async (data: any) => {
    const response = await apiClient.post<{ success: boolean; data: CurrentUser }>(USER_ENDPOINTS.CREATE, data);
    return response.data;
  },

  updateUser: async (id: string, data: Partial<CurrentUser>) => {
    const response = await apiClient.patch<{ success: boolean; data: CurrentUser }>(USER_ENDPOINTS.PATCH(id), data);
    return response.data;
  },

  deleteUser: async (id: string) => {
    const response = await apiClient.delete<{ success: boolean }>(USER_ENDPOINTS.DELETE(id));
    return response.data;
  },

  // Roles
  getRoles: async () => {
    const response = await apiClient.get<RoleListResponse>(ROLE_ENDPOINTS.LIST);
    return response.data;
  },

  getRole: async (id: string) => {
    const response = await apiClient.get<{ success: boolean; data: Role }>(ROLE_ENDPOINTS.DETAIL(id));
    return response.data;
  },

  createRole: async (data: Partial<Role>) => {
    const response = await apiClient.post<{ success: boolean; data: Role }>(ROLE_ENDPOINTS.CREATE, data);
    return response.data;
  },

  updateRole: async (id: string, data: Partial<Role>) => {
    const response = await apiClient.patch<{ success: boolean; data: Role }>(ROLE_ENDPOINTS.PATCH(id), data);
    return response.data;
  },

  deleteRole: async (id: string) => {
    const response = await apiClient.delete<{ success: boolean }>(ROLE_ENDPOINTS.DELETE(id));
    return response.data;
  },
};
