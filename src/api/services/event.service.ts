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

  getEvents: async (page = 1, limit = 20, status?: string, clubId?: string) => {
    const params: Record<string, string | number> = { page, limit };

    if (status && status !== "all") {
      params.status = status;
    }

    if (clubId && clubId !== "all") {
      params.club = clubId;
    }

    const response = await apiClient.get<EventListResponse>(EVENT_ENDPOINTS.LIST, { params });
    const normalized = {
      ...response.data,
      data: Array.isArray(response.data.data) ? response.data.data.map(normalizeKeys) : response.data.data
    };
    return EventListResponseSchema.parse(normalized);
  },

  getEvent: async (id: string) => {
    const response = await apiClient.get<{ success: boolean; data: EventDetail }>(EVENT_ENDPOINTS.DETAIL(id));
    const normalized = {
      ...response.data,
      data: normalizeKeys(response.data.data)
    };
    return EventDetailSchema.parse(normalized.data);
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
    return EventDetailSchema.parse(normalizedData);
  },

  deleteEvent: async (id: string) => {
    const response = await apiClient.delete<{ success: boolean }>(EVENT_ENDPOINTS.DELETE(id));
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
