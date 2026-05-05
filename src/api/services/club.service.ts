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

const CLUB_LIST_CACHE_TTL_MS = 5 * 60 * 1000;
const CLUB_DETAIL_CACHE_TTL_MS = 5 * 60 * 1000;

type CacheEntry<T> = {
  payload: T;
  expiresAt: number;
};

const clubListCache = new Map<string, CacheEntry<ClubListResponse>>();
const clubDetailCache = new Map<string, CacheEntry<Club>>();
const inFlightClubListRequests = new Map<string, Promise<ClubListResponse>>();
const inFlightClubDetailRequests = new Map<string, Promise<Club>>();

function getCachedPayload<T>(cache: Map<string, CacheEntry<T>>, key: string) {
  const cached = cache.get(key);
  if (!cached) {
    return null;
  }

  if (cached.expiresAt <= Date.now()) {
    cache.delete(key);
    return null;
  }

  return cached.payload;
}

function setCachedPayload<T>(cache: Map<string, CacheEntry<T>>, key: string, payload: T, ttlMs: number) {
  cache.set(key, {
    payload,
    expiresAt: Date.now() + ttlMs,
  });
}

function clearClubCaches() {
  clubListCache.clear();
  clubDetailCache.clear();
  inFlightClubListRequests.clear();
  inFlightClubDetailRequests.clear();
}

export const clubService = {
  // Clubs
  getClubs: async (page = 1, limit = 20, category?: string, status?: string) => {
    const cacheKey = JSON.stringify({ page, limit, category: category || "", status: status || "" });
    const cached = getCachedPayload(clubListCache, cacheKey);
    if (cached) {
      return cached;
    }

    const inFlight = inFlightClubListRequests.get(cacheKey);
    if (inFlight) {
      return inFlight;
    }

    const params: Record<string, string | number> = { page, limit };
    if (category && category !== "all") params["category__slug"] = category;
    if (status) params["status"] = status;

    const request = apiClient
      .get<ClubListResponse>(CLUB_ENDPOINTS.LIST, { params })
      .then((response) => {
        const parsed = ClubListResponseSchema.parse(response.data);
        setCachedPayload(clubListCache, cacheKey, parsed, CLUB_LIST_CACHE_TTL_MS);
        return parsed;
      })
      .finally(() => {
        inFlightClubListRequests.delete(cacheKey);
      });

    inFlightClubListRequests.set(cacheKey, request);
    return request;
  },

  getClub: async (id: string) => {
    const cacheKey = id;
    const cached = getCachedPayload(clubDetailCache, cacheKey);
    if (cached) {
      return cached;
    }

    const inFlight = inFlightClubDetailRequests.get(cacheKey);
    if (inFlight) {
      return inFlight;
    }

    const request = apiClient
      .get<{ success: boolean; data: Club }>(CLUB_ENDPOINTS.DETAIL(id))
      .then((response) => {
        const parsed = ClubSchema.parse(response.data.data);
        setCachedPayload(clubDetailCache, cacheKey, parsed, CLUB_DETAIL_CACHE_TTL_MS);
        return parsed;
      })
      .finally(() => {
        inFlightClubDetailRequests.delete(cacheKey);
      });

    inFlightClubDetailRequests.set(cacheKey, request);
    return request;
  },

  createClub: async (data: ClubMutationPayload) => {
    const response = await apiClient.post<{ success: boolean; data: Club }>(CLUB_ENDPOINTS.CREATE, data);
    const parsed = ClubSchema.parse(response.data.data);
    clearClubCaches();
    return parsed;
  },

  updateClub: async (id: string, data: ClubMutationPayload) => {
    const response = await apiClient.patch<{ success: boolean; data: Club }>(CLUB_ENDPOINTS.PATCH(id), data);
    const parsed = ClubSchema.parse(response.data.data);
    clearClubCaches();
    return parsed;
  },

  deleteClub: async (id: string) => {
    const response = await apiClient.delete<{ success: boolean }>(CLUB_ENDPOINTS.DELETE(id));
    clearClubCaches();
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
