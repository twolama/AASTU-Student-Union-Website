import { apiClient } from "../client";
import { ANNOUNCEMENT_ENDPOINTS, ANNOUNCEMENT_CATEGORY_ENDPOINTS } from "../endpoints";
import { 
  AnnouncementListResponseSchema, 
  AnnouncementSchema, 
  type Announcement, 
  type AnnouncementListResponse,
  type AnnouncementCategory
} from "@/schemas/announcement.schema";

type AnnouncementMutationPayload = FormData | Record<string, unknown>;
type CategoryQueryOptions = {
  hasAnnouncements?: boolean;
  publishedOnly?: boolean;
};

const ANNOUNCEMENT_LIST_CACHE_TTL_MS = 5 * 60 * 1000;
const ANNOUNCEMENT_DETAIL_CACHE_TTL_MS = 5 * 60 * 1000;

type CacheEntry<T> = {
  payload: T;
  expiresAt: number;
};

const announcementListCache = new Map<string, CacheEntry<AnnouncementListResponse>>();
const announcementDetailCache = new Map<string, CacheEntry<Announcement>>();
const inFlightAnnouncementListRequests = new Map<string, Promise<AnnouncementListResponse>>();
const inFlightAnnouncementDetailRequests = new Map<string, Promise<Announcement>>();

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

function clearAnnouncementCaches() {
  announcementListCache.clear();
  announcementDetailCache.clear();
  inFlightAnnouncementListRequests.clear();
  inFlightAnnouncementDetailRequests.clear();
}

export const announcementService = {
  // Announcements
  getAnnouncements: async (page = 1, limit = 20, category?: string, status?: string, search?: string) => {
    const cacheKey = JSON.stringify({ page, limit, category: category || "", status: status || "", search: search || "" });
    const cached = getCachedPayload(announcementListCache, cacheKey);
    if (cached) {
      return cached;
    }

    const inFlight = inFlightAnnouncementListRequests.get(cacheKey);
    if (inFlight) {
      return inFlight;
    }

    const params: Record<string, string | number> = { page, limit };
    if (category && category !== "all") params["category__slug"] = category;
    if (status && status !== "all") params["status"] = status;
    if (search) params["search"] = search;

    const request = apiClient
      .get<AnnouncementListResponse>(ANNOUNCEMENT_ENDPOINTS.LIST, { params })
      .then((response) => {
        const parsed = AnnouncementListResponseSchema.parse(response.data);
        setCachedPayload(announcementListCache, cacheKey, parsed, ANNOUNCEMENT_LIST_CACHE_TTL_MS);
        return parsed;
      })
      .finally(() => {
        inFlightAnnouncementListRequests.delete(cacheKey);
      });

    inFlightAnnouncementListRequests.set(cacheKey, request);
    return request;
  },

  getAnnouncement: async (id: string) => {
    const cacheKey = id;
    const cached = getCachedPayload(announcementDetailCache, cacheKey);
    if (cached) {
      return cached;
    }

    const inFlight = inFlightAnnouncementDetailRequests.get(cacheKey);
    if (inFlight) {
      return inFlight;
    }

    const request = apiClient
      .get<{ success: boolean; data: Announcement }>(ANNOUNCEMENT_ENDPOINTS.DETAIL(id))
      .then((response) => {
        const parsed = AnnouncementSchema.parse(response.data.data);
        setCachedPayload(announcementDetailCache, cacheKey, parsed, ANNOUNCEMENT_DETAIL_CACHE_TTL_MS);
        return parsed;
      })
      .finally(() => {
        inFlightAnnouncementDetailRequests.delete(cacheKey);
      });

    inFlightAnnouncementDetailRequests.set(cacheKey, request);
    return request;
  },

  createAnnouncement: async (data: AnnouncementMutationPayload) => {
    const response = await apiClient.post<{ success: boolean; data: Announcement }>(ANNOUNCEMENT_ENDPOINTS.CREATE, data);
    const parsed = AnnouncementSchema.parse(response.data.data);
    clearAnnouncementCaches();
    return parsed;
  },

  updateAnnouncement: async (id: string, data: AnnouncementMutationPayload) => {
    const response = await apiClient.patch<{ success: boolean; data: Announcement }>(ANNOUNCEMENT_ENDPOINTS.PATCH(id), data);
    const parsed = AnnouncementSchema.parse(response.data.data);
    clearAnnouncementCaches();
    return parsed;
  },

  deleteAnnouncement: async (id: string) => {
    const response = await apiClient.delete<{ success: boolean }>(ANNOUNCEMENT_ENDPOINTS.DELETE(id));
    clearAnnouncementCaches();
    return response.data;
  },

  // Categories
  getCategories: async (options?: CategoryQueryOptions) => {
    const params: Record<string, string> = {};
    if (options?.hasAnnouncements) params.has_announcements = "true";
    if (options?.publishedOnly) params.published_only = "true";

    const response = await apiClient.get<{ success: boolean; data: AnnouncementCategory[] }>(ANNOUNCEMENT_CATEGORY_ENDPOINTS.LIST, {
      params,
    });
    return response.data;
  },
};
