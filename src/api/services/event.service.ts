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
    console.log("Service: createEvent payload:", data);
    const response = await apiClient.post<{ success: boolean; data: EventDetail }>(EVENT_ENDPOINTS.CREATE, data);
    console.log("Service: createEvent response status:", response.status);
    console.log("Service: createEvent response data:", response.data);
    try {
      if (!EventDetailSchema) {
        console.error("Service: EventDetailSchema is UNDEFINED!");
        throw new Error("EventDetailSchema is undefined");
      }
      const normalizedData = normalizeKeys(response.data.data);
      const parsed = EventDetailSchema.parse(normalizedData);
      console.log("Service: createEvent parsed successfully");
      return parsed;
    } catch (err) {
      console.error("Service: createEvent Zod parse failed:", err);
      throw err;
    }
  },

  updateEvent: async (id: string, data: FormData | Record<string, unknown>) => {
    console.log(`Service: updateEvent id: ${id} payload:`, data);
    const response = await apiClient.patch<{ success: boolean; data: EventDetail }>(EVENT_ENDPOINTS.PATCH(id), data);
    console.log("Service: updateEvent response status:", response.status);
    console.log("Service: updateEvent response data:", response.data);
    try {
      if (!EventDetailSchema) {
        console.error("Service: EventDetailSchema is UNDEFINED!");
        throw new Error("EventDetailSchema is undefined");
      }
      const normalizedData = normalizeKeys(response.data.data);
      const parsed = EventDetailSchema.parse(normalizedData);
      console.log("Service: updateEvent parsed successfully");
      return parsed;
    } catch (err) {
      console.error("Service: updateEvent Zod parse failed:", err);
      throw err;
    }
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
