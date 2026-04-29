import { z } from "zod";

export const normalizeBookingKeys = (value: any): any => {
  if (!value || typeof value !== "object") {
    return value;
  }

  if (Array.isArray(value)) {
    return value.map(normalizeBookingKeys);
  }

  const normalized: any = {
    ...value,
    id_label: value.idLabel ?? value.id_label,
    requester_name: value.requesterName ?? value.requester_name,
    club_name: value.clubName ?? value.club_name,
    venue_name: value.venueName ?? value.venue_name,
    venue_type: value.venueType ?? value.venue_type,
    event_title: value.eventTitle ?? value.event_title,
    start_date: value.startDate ?? value.start_date,
    end_date: value.endDate ?? value.end_date,
    selected_slots: value.selectedSlots ?? value.selected_slots,
    requested_date_iso: value.requestedDateIso ?? value.requested_date_iso,
    time_range: value.timeRange ?? value.time_range,
    date_label: value.dateLabel ?? value.date_label,
    time_label: value.timeLabel ?? value.time_label,
    expected_attendance: value.expectedAttendance ?? value.expected_attendance,
    equipment_requested: value.equipmentRequested ?? value.equipment_requested,
    special_requests: value.specialRequests ?? value.special_requests,
    guidelines_acknowledged: value.guidelinesAcknowledged ?? value.guidelines_acknowledged,
    acknowledged_at: value.acknowledgedAt ?? value.acknowledged_at,
    capacity_label: value.capacityLabel ?? value.capacity_label,
    created_at: value.createdAt ?? value.created_at,
    updated_at: value.updatedAt ?? value.updated_at,
    club_details: value.clubDetails ?? value.club_details,
  };

  if (normalized.requester && typeof normalized.requester === "object") {
    normalized.requester = normalizeBookingKeys(normalized.requester);
  }

  if (normalized.club_details && typeof normalized.club_details === "object") {
    normalized.club_details = normalizeBookingKeys(normalized.club_details);
  }

  return normalized;
};

export const BookingStatusSchema = z.enum(["pending", "approved", "cancelled"]);

export const BookingRequesterSchema = z.object({
  id: z.string().uuid(),
  name: z.string(),
  avatar: z.string().url().nullable().optional(),
  initials: z.string().optional(),
}).passthrough();

export const BookingClubDetailsSchema = z.object({
  id: z.string().uuid(),
  name: z.string(),
  category: z.string().uuid().nullable().optional(),
  categoryName: z.string().nullable().optional(),
  logoLabel: z.string().nullable().optional(),
}).passthrough();

export const BookingListItemSchema = z.object({
  id: z.string().uuid(),
  id_label: z.string(),
  requester_name: z.string(),
  club_name: z.string(),
  venue_name: z.string(),
  event_title: z.string().nullable().optional(),
  status: BookingStatusSchema,
  start_date: z.string().nullable().optional(),
  end_date: z.string().nullable().optional(),
  selected_slots: z.array(z.string()).default([]),
  requested_date_iso: z.string(),
  time_range: z.string(),
  date_label: z.string(),
  time_label: z.string(),
}).passthrough();

export const BookingDetailSchema = z.object({
  id: z.string().uuid(),
  id_label: z.string(),
  requester: BookingRequesterSchema,
  club: z.string().uuid(),
  club_details: BookingClubDetailsSchema.optional(),
  venue: z.string().uuid(),
  venue_name: z.string(),
  venue_type: z.string().nullable().optional(),
  title: z.string().nullable().optional(),
  event_title: z.string().nullable().optional(),
  status: BookingStatusSchema,
  purpose: z.string().nullable().optional(),
  expected_attendance: z.number().default(0),
  equipment_requested: z.array(z.string()).default([]),
  special_requests: z.string().nullable().optional(),
  guidelines_acknowledged: z.boolean().default(false),
  acknowledged_at: z.string().nullable().optional(),
  start_date: z.string().nullable().optional(),
  end_date: z.string().nullable().optional(),
  selected_slots: z.array(z.string()).default([]),
  requested_date_iso: z.string(),
  time_range: z.string(),
  capacity_label: z.string().nullable().optional(),
  date_label: z.string(),
  time_label: z.string(),
  event: z.string().uuid().nullable().optional(),
  created_at: z.string(),
  updated_at: z.string(),
}).passthrough();

export const BookingListResponseSchema = z.object({
  success: z.boolean(),
  data: z.array(BookingListItemSchema),
  meta: z.object({
    page: z.number(),
    limit: z.number(),
    total: z.number(),
    totalPages: z.number(),
  }),
});

export const BookingDetailResponseSchema = z.object({
  success: z.boolean(),
  data: BookingDetailSchema,
});

export type BookingStatus = z.infer<typeof BookingStatusSchema>;
export type BookingListItem = z.infer<typeof BookingListItemSchema>;
export type BookingDetail = z.infer<typeof BookingDetailSchema>;
export type BookingListResponse = z.infer<typeof BookingListResponseSchema>;
export type BookingDetailResponse = z.infer<typeof BookingDetailResponseSchema>;
