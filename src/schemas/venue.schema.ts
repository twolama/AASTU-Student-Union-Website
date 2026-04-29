import { z } from "zod";
import { VenueCategorySchema } from "./venue-category.schema";

export const VenueImageSchema = z.object({
  id: z.string().uuid(),
  venue: z.string().uuid(),
  image: z.string(),
  altText: z.string().optional().default(""),
});

export type VenueImage = z.infer<typeof VenueImageSchema>;

export const VenueSchema = z.object({
  id: z.string().uuid().optional(),
  name: z.string().min(2, "Name is too short"),
  category: VenueCategorySchema.nullable().optional(),
  status: z.enum(["active", "maintenance", "inactive"]).default("active"),
  maxCapacity: z.number().int().nonnegative().default(0),
  capacityLabel: z.string().optional().default(""),
  campusBlock: z.string().optional().default(""),
  floorLevel: z.string().optional().default(""),
  location: z.string().optional().default(""),
  nearbyLandmarks: z.string().optional().default(""),
  shortDescription: z.string().min(10, "Short description is too short"),
  fullDescription: z.string().optional().default(""),
  isPubliclyAvailable: z.boolean().default(true),
  heroImage: z.string().nullable().optional(),
  thumbnail: z.string().nullable().optional(),
  imageUrl: z.string().nullable().optional(),
  amenities: z.array(z.string()).default([]),
  managerName: z.string().optional().default(""),
  managerPhone: z.string().optional().default(""),
  managerEmail: z.string().optional().or(z.literal("")).nullable(),
  contact: z.object({
    name: z.string().optional(),
    role: z.string().optional(),
    phone: z.string().optional(),
    email: z.string().optional(),
  }).optional().default({}),
  googleMapsUrl: z.string().optional().or(z.literal("")),
  mapCoordinates: z.object({
    lat: z.number().optional(),
    lng: z.number().optional(),
  }).optional().default({}),
  gallery: z.array(VenueImageSchema).optional().default([]),
  createdAt: z.string().optional(),
  updatedAt: z.string().optional(),
});

export const VenueFormSchema = z.object({
  name: z.string().min(3, "Venue name must be at least 3 characters"),
  category: z.string().min(1, "Category is required"),
  status: z.enum(["active", "maintenance", "inactive"]),
  maxCapacity: z.string().min(1, "Capacity is required"),
  shortDescription: z.string().min(10, "Short description must be at least 10 characters"),
  managerName: z.string().min(3, "Manager name must be at least 3 characters"),
  phoneNumber: z.string().min(9, "Phone number is too short"),
  officialEmail: z.string().email("Invalid email address"),
  mapCoordinates: z.string().refine(val => {
    if (val.startsWith("http")) {
      return val.length <= 500;
    }
    if (!val.includes(",")) return false;
    const [lat, lng] = val.split(",").map(s => parseFloat(s.trim()));
    return !isNaN(lat) && !isNaN(lng);
  }, "Invalid format. Provide 'lat, lng' or a Google Maps URL (max 500 chars)"),
});

export type Venue = z.infer<typeof VenueSchema>;

export const VenueListResponseSchema = z.object({
  success: z.boolean(),
  data: z.array(VenueSchema),
  meta: z.object({
    page: z.number(),
    limit: z.number(),
    total: z.number(),
    totalPages: z.number(),
  }),
});

export type VenueListResponse = z.infer<typeof VenueListResponseSchema>;

export const VenueGalleryListResponseSchema = z.object({
  success: z.boolean(),
  data: z.array(VenueImageSchema),
  meta: z.object({
    page: z.number(),
    limit: z.number(),
    total: z.number(),
    totalPages: z.number(),
  }),
});

export type VenueGalleryListResponse = z.infer<typeof VenueGalleryListResponseSchema>;
