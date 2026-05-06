import { z } from "zod";
import { apiClient } from "../client";
import { EVENT_ENDPOINTS, VOLUNTEER_ENDPOINTS } from "../endpoints";
import {
  EventListResponseSchema,
  EventDetailSchema,
  EventVolunteerSchema,
  normalizeKeys,
  type EventDetail,
  type EventListResponse,
  type EventVolunteer,
} from "@/schemas/event.schema";

const EVENT_LIST_CACHE_TTL_MS = 5 * 60 * 1000;
const EVENT_DETAIL_CACHE_TTL_MS = 5 * 60 * 1000;

type CacheEntry<T> = {
  payload: T;
  expiresAt: number;
};

const eventListCache = new Map<string, CacheEntry<EventListResponse>>();
const eventDetailCache = new Map<string, CacheEntry<EventDetail>>();
const inFlightEventListRequests = new Map<string, Promise<EventListResponse>>();
const inFlightEventDetailRequests = new Map<string, Promise<EventDetail>>();

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

function clearEventCaches() {
  eventListCache.clear();
  eventDetailCache.clear();
  inFlightEventListRequests.clear();
  inFlightEventDetailRequests.clear();
}

export const eventService = {
  sanitizeCreatePayload: (data: FormData | Record<string, unknown>) => {
    const allowedKeys = new Set([
      "title",
      "short_description",
      "status",
      "is_mega_event",
      "is_archived",
      "max_capacity",
      "physical_location_details",
      "start_date_time",
      "end_date_time",
      "registration_link",
      "description",
      "booking",
      "organizing_club",
      "cover_image",
    ]);

    if (data instanceof FormData) {
      const sanitized = new FormData();
      for (const [key, value] of data.entries()) {
        if (!allowedKeys.has(key)) {
          continue;
        }
        sanitized.append(key, value as string | Blob);
      }
      return sanitized;
    }

    const sanitized: Record<string, unknown> = {};
    for (const [key, value] of Object.entries(data)) {
      if (!allowedKeys.has(key)) {
        continue;
      }
      sanitized[key] = value;
    }
    return sanitized;
  },

  getEvents: async (page = 1, limit = 20, status?: string, clubId?: string, search?: string, venue?: string, category?: string) => {
    const cacheKey = JSON.stringify({ page, limit, status: status || "", clubId: clubId || "", search: search || "", venue: venue || "", category: category || "" });
    const cached = getCachedPayload(eventListCache, cacheKey);
    if (cached) {
      return cached;
    }

    const inFlight = inFlightEventListRequests.get(cacheKey);
    if (inFlight) {
      return inFlight;
    }

    const params: Record<string, string | number> = { page, limit };

    if (status && status !== "all") {
      params.status = status;
    }

    if (clubId && clubId !== "all") {
      params.club = clubId;
    }

    if (search) {
      params.search = search;
    }

    if (venue && venue !== "all") {
      params.venue = venue;
    }

    if (category && category !== "all") {
      params.category = category;
    }

    const request = apiClient
      .get<EventListResponse>(EVENT_ENDPOINTS.LIST, { params })
      .then((response) => {
        const normalized = {
          ...response.data,
          data: Array.isArray(response.data.data) ? response.data.data.map(normalizeKeys) : response.data.data,
        };
        const parsed = EventListResponseSchema.parse(normalized);
        setCachedPayload(eventListCache, cacheKey, parsed, EVENT_LIST_CACHE_TTL_MS);
        return parsed;
      })
      .finally(() => {
        inFlightEventListRequests.delete(cacheKey);
      });

    inFlightEventListRequests.set(cacheKey, request);
    return request;
  },

  getEvent: async (id: string) => {
    const cacheKey = id;
    const cached = getCachedPayload(eventDetailCache, cacheKey);
    if (cached) {
      return cached;
    }

    const inFlight = inFlightEventDetailRequests.get(cacheKey);
    if (inFlight) {
      return inFlight;
    }

    const request = apiClient
      .get<{ success: boolean; data: EventDetail }>(EVENT_ENDPOINTS.DETAIL(id))
      .then((response) => {
        const normalized = {
          ...response.data,
          data: normalizeKeys(response.data.data),
        };
        const parsed = EventDetailSchema.parse(normalized.data);
        setCachedPayload(eventDetailCache, cacheKey, parsed, EVENT_DETAIL_CACHE_TTL_MS);
        return parsed;
      })
      .finally(() => {
        inFlightEventDetailRequests.delete(cacheKey);
      });

    inFlightEventDetailRequests.set(cacheKey, request);
    return request;
  },

  createEvent: async (data: FormData | Record<string, unknown>) => {
    const sanitizedData = eventService.sanitizeCreatePayload(data);
    const response = await apiClient.post<{ success: boolean; data: EventDetail }>(EVENT_ENDPOINTS.CREATE, sanitizedData);
    try {
      if (!EventDetailSchema) {
        throw new Error("EventDetailSchema is undefined");
      }
      const normalizedData = normalizeKeys(response.data.data);
      const parsed = EventDetailSchema.parse(normalizedData);

      clearEventCaches();

      return parsed;
    } catch (err) {
      throw err;
    }
  },

  updateEvent: async (id: string, data: FormData | Record<string, unknown>) => {

    const response = await apiClient.patch<{ success: boolean; data: EventDetail }>(EVENT_ENDPOINTS.PATCH(id), data);

    try {
      if (!EventDetailSchema) {
        throw new Error("EventDetailSchema is undefined");
      }
      const normalizedData = normalizeKeys(response.data.data);
      const parsed = EventDetailSchema.parse(normalizedData);

      clearEventCaches();

      return parsed;
    } catch (err) {
      throw err;
    }
  },

  archiveEvent: async (id: string) => {
    const response = await apiClient.patch<{ success: boolean; data: EventDetail }>(EVENT_ENDPOINTS.PATCH(id), {
      status: "archived",
      is_archived: true,
    });

    const normalizedData = normalizeKeys(response.data.data);
    const parsed = EventDetailSchema.parse(normalizedData);
    clearEventCaches();
    return parsed;
  },

  deleteEvent: async (id: string) => {
    const response = await apiClient.delete<{ success: boolean }>(EVENT_ENDPOINTS.DELETE(id));
    clearEventCaches();
    return response.data;
  },

  volunteerForEvent: async (eventId: string, data: Record<string, unknown>) => {
    const response = await apiClient.post<{ success: boolean; data: EventVolunteer }>(EVENT_ENDPOINTS.VOLUNTEER(eventId), data);
    return EventVolunteerSchema.parse(normalizeKeys(response.data.data));
  },

  getVolunteers: async (page = 1, limit = 20, eventId?: string) => {
    const params: Record<string, string | number> = { page, limit };

    if (eventId) {
      params.event = eventId;
    }

    const response = await apiClient.get<any>(VOLUNTEER_ENDPOINTS.LIST, { params });
    const normalizedData = Array.isArray(response.data.data) ? response.data.data.map(normalizeKeys) : response.data.data;
    const validated = z
      .object({
        success: z.boolean(),
        data: z.array(EventVolunteerSchema),
        meta: z.object({
          page: z.number(),
          limit: z.number(),
          total: z.number(),
          totalPages: z.number(),
        }),
      })
      .parse({ ...response.data, data: normalizedData });

    return validated;
  },
};
