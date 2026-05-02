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

export interface CreateUserInput {
  name: string;
  student_id: string;
  department: string;
  roles: string[];
  email: string;
  phone_number?: string;
  username?: string;
  bio?: string;
  dorm_block?: string;
  dorm_room?: string;
  avatar?: File;
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

  createUser: async (data: CreateUserInput) => {
    const hasAvatar = data.avatar instanceof File;

    if (hasAvatar) {
      const formData = new FormData();
      formData.append("name", data.name);
      formData.append("student_id", data.student_id);
      formData.append("department", data.department);
      data.roles.forEach((roleId) => formData.append("roles", roleId));
      formData.append("email", data.email);

      if (data.phone_number) formData.append("phone_number", data.phone_number);
      if (data.username) formData.append("username", data.username);
      if (data.bio) formData.append("bio", data.bio);
      if (data.dorm_block) formData.append("dorm_block", data.dorm_block);
      if (data.dorm_room) formData.append("dorm_room", data.dorm_room);
      if (data.avatar) formData.append("avatar", data.avatar);

      const response = await apiClient.post<{ success: boolean; data: CurrentUser }>(USER_ENDPOINTS.CREATE, formData);
      return response.data;
    }

    const payload = {
      name: data.name,
      student_id: data.student_id,
      department: data.department,
      roles: data.roles,
      email: data.email,
      ...(data.phone_number ? { phone_number: data.phone_number } : {}),
      ...(data.username ? { username: data.username } : {}),
      ...(data.bio ? { bio: data.bio } : {}),
      ...(data.dorm_block ? { dorm_block: data.dorm_block } : {}),
      ...(data.dorm_room ? { dorm_room: data.dorm_room } : {}),
    };

    const response = await apiClient.post<{ success: boolean; data: CurrentUser }>(USER_ENDPOINTS.CREATE, payload);
    return response.data;
  },

  updateUser: async (id: string, data: Partial<CurrentUser> | FormData) => {
    // If updating avatar or sending files, caller may pass a FormData
    if (data instanceof FormData) {
      const response = await apiClient.patch<{ success: boolean; data: CurrentUser }>(USER_ENDPOINTS.PATCH(id), data, {
        headers: {
          // Let axios set multipart/form-data boundary automatically
          "Content-Type": undefined,
        },
      });
      return response.data;
    }

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
