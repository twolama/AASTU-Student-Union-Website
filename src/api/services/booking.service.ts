import { apiClient } from "../client";
import { BOOKING_ENDPOINTS } from "../endpoints";
import {
  BookingListResponseSchema,
  BookingDetailSchema,
  normalizeBookingKeys,
  type BookingDetail,
  type BookingListResponse,
} from "@/schemas/booking.schema";

export const bookingService = {
  getBookings: async (page = 1, limit = 20, status?: string, clubId?: string, search?: string) => {
    const params: Record<string, string | number> = { page, limit };

    if (status && status !== "all") {
      params.status = status;
    }

    if (clubId) {
      params.club = clubId;
    }

    if (search) {
      params.search = search;
    }

    const response = await apiClient.get<BookingListResponse>(BOOKING_ENDPOINTS.LIST, { params });
    const normalized = {
      ...response.data,
      data: Array.isArray(response.data.data) ? response.data.data.map(normalizeBookingKeys) : response.data.data
    };
    return BookingListResponseSchema.parse(normalized);
  },

  getBooking: async (id: string) => {
    const response = await apiClient.get<{ success: boolean; data: BookingDetail }>(BOOKING_ENDPOINTS.DETAIL(id));
    const normalizedData = normalizeBookingKeys(response.data.data);
    return BookingDetailSchema.parse(normalizedData);
  },

  createBooking: async (data: Record<string, unknown>) => {
    const response = await apiClient.post<{ success: boolean; data: BookingDetail }>(BOOKING_ENDPOINTS.CREATE, data);
    const normalizedData = normalizeBookingKeys(response.data.data);
    const result = BookingDetailSchema.safeParse(normalizedData);
    if (!result.success) {
      console.warn("Booking creation response validation failed:", result.error);
    }
    return normalizedData as BookingDetail;
  },

  updateBooking: async (id: string, data: Record<string, unknown>) => {
    const response = await apiClient.patch<{ success: boolean; data: BookingDetail }>(BOOKING_ENDPOINTS.PATCH(id), data);
    const normalizedData = normalizeBookingKeys(response.data.data);
    const result = BookingDetailSchema.safeParse(normalizedData);
    if (!result.success) {
      console.warn("Booking update response validation failed:", result.error);
    }
    return normalizedData as BookingDetail;
  },

  deleteBooking: async (id: string) => {
    await apiClient.delete(BOOKING_ENDPOINTS.DELETE(id));
  },

  approveBooking: async (id: string, note?: string) => {
    const payload = note ? { note } : {};
    try {
      const response = await apiClient.post<any>(BOOKING_ENDPOINTS.APPROVE(id), payload);
      const rawData = response.data?.data || response.data;
      const normalizedData = normalizeBookingKeys(rawData);
      const result = BookingDetailSchema.safeParse(normalizedData);
      if (!result.success) {
        console.warn("Booking approval response validation failed:", result.error);
      }
      return normalizedData as BookingDetail;
    } catch (err) {
      // Surface server payload in dev console to aid debugging permissions issues
      try {
        console.error("approveBooking error:", err);
      } catch {}
      throw err;
    }
  },

  cancelBooking: async (id: string, reason?: string) => {
    const payload = reason ? { reason } : {};
    const response = await apiClient.post<any>(BOOKING_ENDPOINTS.CANCEL(id), payload);
    const rawData = response.data?.data || response.data;
    const normalizedData = normalizeBookingKeys(rawData);
    
    const result = BookingDetailSchema.safeParse(normalizedData);
    if (!result.success) {
      console.warn("Booking cancellation response validation failed:", result.error);
    }
    return normalizedData as BookingDetail;
  },
  
  getAvailability: async (venueId: string, startDate: string, endDate: string, excludeId?: string) => {
    const params: Record<string, string> = { venue_id: venueId, start_date: startDate, end_date: endDate };
    if (excludeId) params.exclude_id = excludeId;
    
    const response = await apiClient.get<{ success: boolean; data: Array<{ label: string; available: boolean }> }>(
      BOOKING_ENDPOINTS.AVAILABILITY, 
      { params }
    );
    return response.data.data;
  },
};
