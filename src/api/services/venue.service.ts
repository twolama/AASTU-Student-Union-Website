import { apiClient } from "../client";
import { VENUE_ENDPOINTS, VENUE_CATEGORY_ENDPOINTS, VENUE_GALLERY_ENDPOINTS } from "../endpoints";
import { 
  VenueListResponseSchema, 
  VenueSchema, 
  type Venue, 
  type VenueListResponse,
  VenueGalleryListResponseSchema,
  type VenueImage
} from "@/schemas/venue.schema";
import { 
  VenueCategoryListResponseSchema, 
  type VenueCategory 
} from "@/schemas/venue-category.schema";

type VenueMutationPayload = FormData | Record<string, unknown>;

export const venueService = {
  // Venues
  getVenues: async (page = 1, limit = 20, category?: string, status?: string) => {
    const params: Record<string, string | number> = { page, limit };
    if (category && category !== "all") params["category__slug"] = category;
    if (status) params["status"] = status;
    
    const response = await apiClient.get<VenueListResponse>(VENUE_ENDPOINTS.LIST, { params });
    try {
      return VenueListResponseSchema.parse(response.data);
    } catch (error) {
      console.error("VenueList Zod Error:", error);
      throw error;
    }
  },

  getVenue: async (id: string) => {
    const response = await apiClient.get<{ success: boolean; data: Venue }>(VENUE_ENDPOINTS.DETAIL(id));
    try {
      return VenueSchema.parse(response.data.data);
    } catch (error) {
      console.error("VenueDetail Zod Error:", error);
      throw error;
    }
  },

  createVenue: async (data: VenueMutationPayload) => {
    const response = await apiClient.post<{ success: boolean; data: Venue }>(VENUE_ENDPOINTS.CREATE, data);
    return VenueSchema.parse(response.data.data);
  },

  updateVenue: async (id: string, data: VenueMutationPayload) => {
    const response = await apiClient.patch<{ success: boolean; data: Venue }>(VENUE_ENDPOINTS.PATCH(id), data);
    return VenueSchema.parse(response.data.data);
  },

  deleteVenue: async (id: string) => {
    const response = await apiClient.delete<{ success: boolean }>(VENUE_ENDPOINTS.DELETE(id));
    return response.data;
  },

  // Venue Gallery
  getVenueGallery: async (page = 1, limit = 20, venueId?: string) => {
    const params: Record<string, string | number> = { page, limit };
    if (venueId) params["venue"] = venueId;
    
    const response = await apiClient.get<any>(VENUE_GALLERY_ENDPOINTS.LIST, { params });
    return VenueGalleryListResponseSchema.parse(response.data);
  },

  uploadGalleryImage: async (data: FormData) => {
    const response = await apiClient.post<{ success: boolean; data: VenueImage }>(VENUE_GALLERY_ENDPOINTS.CREATE, data);
    return response.data.data;
  },

  deleteGalleryImage: async (id: string) => {
    const response = await apiClient.delete<{ success: boolean }>(VENUE_GALLERY_ENDPOINTS.DELETE(id));
    return response.data;
  },

  // Venue Categories
  getCategories: async () => {
    const response = await apiClient.get<{ success: boolean; data: VenueCategory[] }>(VENUE_CATEGORY_ENDPOINTS.LIST);
    const validated = VenueCategoryListResponseSchema.parse(response.data);
    return validated.data;
  },

  getCategory: async (id: string) => {
    const response = await apiClient.get<{ success: boolean; data: VenueCategory }>(VENUE_CATEGORY_ENDPOINTS.DETAIL(id));
    return response.data.data;
  },

  createCategory: async (data: Record<string, unknown>) => {
    const response = await apiClient.post<{ success: boolean; data: VenueCategory }>(VENUE_CATEGORY_ENDPOINTS.CREATE, data);
    return response.data.data;
  },

  updateCategory: async (id: string, data: Record<string, unknown>) => {
    const response = await apiClient.patch<{ success: boolean; data: VenueCategory }>(VENUE_CATEGORY_ENDPOINTS.PATCH(id), data);
    return response.data.data;
  },

  deleteCategory: async (id: string) => {
    const response = await apiClient.delete<{ success: boolean }>(VENUE_CATEGORY_ENDPOINTS.DELETE(id));
    return response.data;
  },
};
