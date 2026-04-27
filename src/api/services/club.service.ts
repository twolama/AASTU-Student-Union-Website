import { apiClient } from "../client";
import { CLUB_ENDPOINTS, CLUB_CATEGORY_ENDPOINTS } from "../endpoints";
import { 
  ClubListResponseSchema, 
  ClubSchema, 
  type Club, 
  type ClubListResponse 
} from "@/schemas/club.schema";
import { 
  ClubCategoryListResponseSchema, 
  type ClubCategory 
} from "@/schemas/club-category.schema";

type ClubMutationPayload = FormData | Record<string, unknown>;

export const clubService = {
  // Clubs
  getClubs: async (page = 1, limit = 20, category?: string) => {
    const params: Record<string, string | number> = { page, limit };
    if (category && category !== "all") params["category__slug"] = category;
    
    const response = await apiClient.get<ClubListResponse>(CLUB_ENDPOINTS.LIST, { params });
    return ClubListResponseSchema.parse(response.data);
  },

  getClub: async (id: string) => {
    const response = await apiClient.get<{ success: boolean; data: Club }>(CLUB_ENDPOINTS.DETAIL(id));
    return ClubSchema.parse(response.data.data);
  },

  createClub: async (data: ClubMutationPayload) => {
    const response = await apiClient.post<{ success: boolean; data: Club }>(CLUB_ENDPOINTS.CREATE, data);
    return ClubSchema.parse(response.data.data);
  },

  updateClub: async (id: string, data: ClubMutationPayload) => {
    const response = await apiClient.patch<{ success: boolean; data: Club }>(CLUB_ENDPOINTS.PATCH(id), data);
    return ClubSchema.parse(response.data.data);
  },

  deleteClub: async (id: string) => {
    const response = await apiClient.delete<{ success: boolean }>(CLUB_ENDPOINTS.DELETE(id));
    return response.data;
  },

  getClubUpcomingEvents: async (id: string) => {
    const response = await apiClient.get<{ success: boolean; data: any[] }>(CLUB_ENDPOINTS.UPCOMING_EVENTS(id));
    return response.data.data;
  },

  // Club Categories
  getCategories: async () => {
    const response = await apiClient.get<{ success: boolean; data: ClubCategory[] }>(CLUB_CATEGORY_ENDPOINTS.LIST);
    const validated = ClubCategoryListResponseSchema.parse(response.data);
    return validated.data;
  },

  getCategory: async (id: string) => {
    const response = await apiClient.get<{ success: boolean; data: ClubCategory }>(CLUB_CATEGORY_ENDPOINTS.DETAIL(id));
    return response.data.data;
  },

  createCategory: async (data: Record<string, unknown>) => {
    const response = await apiClient.post<{ success: boolean; data: ClubCategory }>(CLUB_CATEGORY_ENDPOINTS.CREATE, data);
    return response.data.data;
  },

  updateCategory: async (id: string, data: Record<string, unknown>) => {
    const response = await apiClient.patch<{ success: boolean; data: ClubCategory }>(CLUB_CATEGORY_ENDPOINTS.PATCH(id), data);
    return response.data.data;
  },

  deleteCategory: async (id: string) => {
    const response = await apiClient.delete<{ success: boolean }>(CLUB_CATEGORY_ENDPOINTS.DELETE(id));
    return response.data;
  },
};
