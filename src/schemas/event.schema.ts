import { z } from "zod";

export const normalizeKeys = (value: any): any => {
  if (!value || typeof value !== "object") {
    return value;
  }

  if (Array.isArray(value)) {
    return value.map(normalizeKeys);
  }

  const normalized: any = {
    ...value,
    category_name: value.categoryName ?? value.category_name,
    logo_label: value.logoLabel ?? value.logo_label,
    full_name: value.fullName ?? value.full_name,
    student_id: value.studentId ?? value.student_id,
    created_at: value.createdAt ?? value.created_at,
    updated_at: value.updatedAt ?? value.updated_at,
    short_description: value.shortDescription ?? value.short_description,
    is_mega_event: value.isMegaEvent ?? value.is_mega_event,
    is_archived: value.isArchived ?? value.is_archived,
    max_capacity: value.maxCapacity ?? value.max_capacity,
    organizing_club: value.organizingClub ?? value.organizing_club,
    physical_location_details: value.physicalLocationDetails ?? value.physical_location_details,
    cover_image: value.coverImage ?? value.cover_image,
    start_date_time: value.startDateTime ?? value.start_date_time,
    end_date_time: value.endDateTime ?? value.end_date_time,
    date_day: value.dateDay ?? value.date_day,
    date_month: value.dateMonth ?? value.date_month,
    registration_link: value.registrationLink ?? value.registration_link,
    attendee_count: value.attendeeCount ?? value.attendee_count,
  };

  // Recursively normalize known object fields to ensure nested keys are handled
  if (normalized.organizing_club && typeof normalized.organizing_club === "object") {
    normalized.organizing_club = normalizeKeys(normalized.organizing_club);
  }
  
  if (normalized.volunteers && Array.isArray(normalized.volunteers)) {
    normalized.volunteers = normalized.volunteers.map(normalizeKeys);
  }

  return normalized;
};

export const ClubMinimalSchema = z
  .object({
    id: z.string(),
    name: z.string(),
    category: z.string().nullable().optional(),
    category_name: z.string().nullable().optional(),
    logo_label: z.string().nullable().optional(),
  })
  .passthrough();

export const EventVolunteerSchema = z
  .object({
    id: z.string(),
    full_name: z.string(),
    student_id: z.string().optional().nullable(),
    phone: z.string().optional().nullable(),
    email: z.string().email().optional().nullable(),
    role: z.string().optional().nullable(),
    created_at: z.string().optional(),
    updated_at: z.string().optional(),
  })
  .passthrough();

export const EventListItemSchema = z
  .object({
    id: z.string(),
    title: z.string(),
    short_description: z.string().nullable().optional(),
    status: z.string(),
    is_mega_event: z.boolean().default(false),
    is_archived: z.boolean().default(false),
    max_capacity: z.number().nullable().optional(),
    organizing_club: ClubMinimalSchema,
    venue: z.string().nullable().optional(),
    physical_location_details: z.string().nullable().optional(),
    cover_image: z.string().nullable().optional(),
    start_date_time: z.string().nullable().optional(),
    end_date_time: z.string().nullable().optional(),
    date_day: z.string().nullable().optional(),
    date_month: z.string().nullable().optional(),
    registration_link: z.string().nullable().optional(),
    attendee_count: z.number().nullable().optional(),
    created_at: z.string().nullable().optional(),
    updated_at: z.string().nullable().optional(),
  })
  .passthrough();

export const EventDetailSchema = z.object({
  id: z.string(),
  title: z.string(),
  short_description: z.string().nullable().optional(),
  description: z.string().nullable().optional(),
  status: z.string(),
  is_mega_event: z.boolean().default(false),
  is_archived: z.boolean().default(false),
  max_capacity: z.number().nullable().optional(),
  organizing_club: ClubMinimalSchema,
  venue: z.string().nullable().optional(),
  physical_location_details: z.string().nullable().optional(),
  cover_image: z.string().nullable().optional(),
  start_date_time: z.string().nullable().optional(),
  end_date_time: z.string().nullable().optional(),
  date_day: z.string().nullable().optional(),
  date_month: z.string().nullable().optional(),
  registration_link: z.string().nullable().optional(),
  attendee_count: z.number().nullable().optional(),
  created_at: z.string().nullable().optional(),
  updated_at: z.string().nullable().optional(),
  logistics: z.any().nullable().optional().default([]),
  attendance: z.any().nullable().optional().default({ current: 0, capacity: 0, waitlist: 0, vips: 0 }),
  volunteers: z.array(EventVolunteerSchema).nullable().optional().default([]),
  attendees: z.array(z.any()).nullable().optional().default([]),
}).passthrough();

export const EventListResponseSchema = z.object({
  success: z.boolean(),
  data: z.array(EventListItemSchema),
  meta: z.object({
    page: z.number(),
    limit: z.number(),
    total: z.number(),
    totalPages: z.number(),
  }),
});

export const EventDetailResponseSchema = z.object({
  success: z.boolean(),
  data: EventDetailSchema,
});

export type EventListItem = z.infer<typeof EventListItemSchema>;
export type EventDetail = z.infer<typeof EventDetailSchema>;
export type EventVolunteer = z.infer<typeof EventVolunteerSchema>;
export type EventListResponse = z.infer<typeof EventListResponseSchema>;
export type EventDetailResponse = z.infer<typeof EventDetailResponseSchema>;
