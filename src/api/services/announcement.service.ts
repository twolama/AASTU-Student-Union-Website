import { apiClient } from "../client";
import { ANNOUNCEMENT_ENDPOINTS, ANNOUNCEMENT_CATEGORY_ENDPOINTS } from "../endpoints";
import { 
  AnnouncementListResponseSchema, 
  AnnouncementSchema, 
  type Announcement, 
  type AnnouncementListResponse,
  type AnnouncementCategory
} from "@/schemas/announcement.schema";

export const announcementService = {
  // Announcements
  getAnnouncements: async (page = 1, limit = 20, category?: string) => {
    const params: Record<string, any> = { page, limit };
    if (category && category !== "all") params["category__slug"] = category;
    
    const response = await apiClient.get<AnnouncementListResponse>(ANNOUNCEMENT_ENDPOINTS.LIST, { params });
    return AnnouncementListResponseSchema.parse(response.data);
  },

  getAnnouncement: async (id: string) => {
    const response = await apiClient.get<{ success: boolean; data: Announcement }>(ANNOUNCEMENT_ENDPOINTS.DETAIL(id));
    return AnnouncementSchema.parse(response.data.data);
  },

  createAnnouncement: async (data: any) => {
    const response = await apiClient.post<{ success: boolean; data: Announcement }>(ANNOUNCEMENT_ENDPOINTS.CREATE, data);
    return AnnouncementSchema.parse(response.data.data);
  },

  updateAnnouncement: async (id: string, data: any) => {
    const response = await apiClient.patch<{ success: boolean; data: Announcement }>(ANNOUNCEMENT_ENDPOINTS.PATCH(id), data);
    return AnnouncementSchema.parse(response.data.data);
  },

  deleteAnnouncement: async (id: string) => {
    const response = await apiClient.delete<{ success: boolean }>(ANNOUNCEMENT_ENDPOINTS.DELETE(id));
    return response.data;
  },

  // Categories
  getCategories: async () => {
    const response = await apiClient.get<{ success: boolean; data: AnnouncementCategory[] }>(ANNOUNCEMENT_CATEGORY_ENDPOINTS.LIST);
    return response.data;
  },
};
