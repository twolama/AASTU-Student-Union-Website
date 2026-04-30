const API_V1_PREFIX = "/api/v1";

export const API_ENDPOINTS = {
  AUTHENTICATION: {
    LOGIN: `${API_V1_PREFIX}/auth/login/`,
    // Frontend-only proxy logout; backend does not expose this endpoint.
    LOGOUT: `${API_V1_PREFIX}/auth/logout/`,
    REFRESH: `${API_V1_PREFIX}/auth/refresh/`,
    VERIFY: `${API_V1_PREFIX}/auth/verify/`,
    FORGOT_PASSWORD: `${API_V1_PREFIX}/auth/forgot-password/`,
    RESEND_RESET_OTP: `${API_V1_PREFIX}/auth/resend-reset-otp/`,
    VERIFY_RESET_OTP: `${API_V1_PREFIX}/auth/verify-reset-otp/`,
    RESET_PASSWORD: `${API_V1_PREFIX}/auth/reset-password/`,
    CHANGE_PASSWORD: `${API_V1_PREFIX}/auth/change-password/`,
  },
  USERS: {
    LIST: `${API_V1_PREFIX}/users/`,
    CREATE: `${API_V1_PREFIX}/users/`,
    DETAIL: (id: string) => `${API_V1_PREFIX}/users/${id}/`,
    UPDATE: (id: string) => `${API_V1_PREFIX}/users/${id}/`,
    PATCH: (id: string) => `${API_V1_PREFIX}/users/${id}/`,
    DELETE: (id: string) => `${API_V1_PREFIX}/users/${id}/`,
    ME: `${API_V1_PREFIX}/users/me/`,
    ME_PATCH: `${API_V1_PREFIX}/users/me/`,
  },
  ROLES: {
    LIST: `${API_V1_PREFIX}/roles/`,
    CREATE: `${API_V1_PREFIX}/roles/`,
    DETAIL: (id: string) => `${API_V1_PREFIX}/roles/${id}/`,
    UPDATE: (id: string) => `${API_V1_PREFIX}/roles/${id}/`,
    PATCH: (id: string) => `${API_V1_PREFIX}/roles/${id}/`,
    DELETE: (id: string) => `${API_V1_PREFIX}/roles/${id}/`,
  },
  ANNOUNCEMENTS: {
    LIST: `${API_V1_PREFIX}/announcements/`,
    CREATE: `${API_V1_PREFIX}/announcements/`,
    DETAIL: (id: string) => `${API_V1_PREFIX}/announcements/${id}/`,
    UPDATE: (id: string) => `${API_V1_PREFIX}/announcements/${id}/`,
    PATCH: (id: string) => `${API_V1_PREFIX}/announcements/${id}/`,
    DELETE: (id: string) => `${API_V1_PREFIX}/announcements/${id}/`,
  },
  ANNOUNCEMENT_CATEGORIES: {
    LIST: `${API_V1_PREFIX}/announcement-categories/`,
    CREATE: `${API_V1_PREFIX}/announcement-categories/`,
    DETAIL: (id: string) => `${API_V1_PREFIX}/announcement-categories/${id}/`,
    UPDATE: (id: string) => `${API_V1_PREFIX}/announcement-categories/${id}/`,
    PATCH: (id: string) => `${API_V1_PREFIX}/announcement-categories/${id}/`,
    DELETE: (id: string) => `${API_V1_PREFIX}/announcement-categories/${id}/`,
  },
  CLUBS: {
    LIST: `${API_V1_PREFIX}/clubs/`,
    CREATE: `${API_V1_PREFIX}/clubs/`,
    DETAIL: (id: string) => `${API_V1_PREFIX}/clubs/${id}/`,
    UPDATE: (id: string) => `${API_V1_PREFIX}/clubs/${id}/`,
    PATCH: (id: string) => `${API_V1_PREFIX}/clubs/${id}/`,
    DELETE: (id: string) => `${API_V1_PREFIX}/clubs/${id}/`,
    UPCOMING_EVENTS: (id: string) => `${API_V1_PREFIX}/clubs/${id}/upcoming-events/`,
  },
  EVENTS: {
    LIST: `${API_V1_PREFIX}/events/`,
    CREATE: `${API_V1_PREFIX}/events/`,
    DETAIL: (id: string) => `${API_V1_PREFIX}/events/${id}/`,
    UPDATE: (id: string) => `${API_V1_PREFIX}/events/${id}/`,
    PATCH: (id: string) => `${API_V1_PREFIX}/events/${id}/`,
    DELETE: (id: string) => `${API_V1_PREFIX}/events/${id}/`,
    VOLUNTEER: (id: string) => `${API_V1_PREFIX}/events/${id}/volunteer/`,
  },
  VOLUNTEERS: {
    LIST: `${API_V1_PREFIX}/volunteers/`,
    DETAIL: (id: string) => `${API_V1_PREFIX}/volunteers/${id}/`,
    UPDATE: (id: string) => `${API_V1_PREFIX}/volunteers/${id}/`,
    PATCH: (id: string) => `${API_V1_PREFIX}/volunteers/${id}/`,
    DELETE: (id: string) => `${API_V1_PREFIX}/volunteers/${id}/`,
  },
  CLUB_CATEGORIES: {
    LIST: `${API_V1_PREFIX}/club-categories/`,
    CREATE: `${API_V1_PREFIX}/club-categories/`,
    DETAIL: (id: string) => `${API_V1_PREFIX}/club-categories/${id}/`,
    UPDATE: (id: string) => `${API_V1_PREFIX}/club-categories/${id}/`,
    PATCH: (id: string) => `${API_V1_PREFIX}/club-categories/${id}/`,
    DELETE: (id: string) => `${API_V1_PREFIX}/club-categories/${id}/`,
  },
  CORE: {
    ANALYTICS: {
      DASHBOARD: `${API_V1_PREFIX}/analytics/dashboard/`,
      EXPORT: `${API_V1_PREFIX}/analytics/reports/export/`,
    },
    COLLEGES: {
      LIST: `${API_V1_PREFIX}/colleges/`,
      CREATE: `${API_V1_PREFIX}/colleges/`,
      DETAIL: (id: string) => `${API_V1_PREFIX}/colleges/${id}/`,
      UPDATE: (id: string) => `${API_V1_PREFIX}/colleges/${id}/`,
      PATCH: (id: string) => `${API_V1_PREFIX}/colleges/${id}/`,
      DELETE: (id: string) => `${API_V1_PREFIX}/colleges/${id}/`,
    },
    DEPARTMENTS: {
      LIST: `${API_V1_PREFIX}/departments/`,
      CREATE: `${API_V1_PREFIX}/departments/`,
      DETAIL: (id: string) => `${API_V1_PREFIX}/departments/${id}/`,
      UPDATE: (id: string) => `${API_V1_PREFIX}/departments/${id}/`,
      PATCH: (id: string) => `${API_V1_PREFIX}/departments/${id}/`,
      DELETE: (id: string) => `${API_V1_PREFIX}/departments/${id}/`,
    },
  },
  VENUES: {
    LIST: `${API_V1_PREFIX}/venues/`,
    CREATE: `${API_V1_PREFIX}/venues/`,
    DETAIL: (id: string) => `${API_V1_PREFIX}/venues/${id}/`,
    UPDATE: (id: string) => `${API_V1_PREFIX}/venues/${id}/`,
    PATCH: (id: string) => `${API_V1_PREFIX}/venues/${id}/`,
    DELETE: (id: string) => `${API_V1_PREFIX}/venues/${id}/`,
  },
  VENUE_CATEGORIES: {
    LIST: `${API_V1_PREFIX}/venue-categories/`,
    CREATE: `${API_V1_PREFIX}/venue-categories/`,
    DETAIL: (id: string) => `${API_V1_PREFIX}/venue-categories/${id}/`,
    UPDATE: (id: string) => `${API_V1_PREFIX}/venue-categories/${id}/`,
    PATCH: (id: string) => `${API_V1_PREFIX}/venue-categories/${id}/`,
    DELETE: (id: string) => `${API_V1_PREFIX}/venue-categories/${id}/`,
  },
  VENUE_GALLERY: {
    LIST: `${API_V1_PREFIX}/venue-gallery/`,
    CREATE: `${API_V1_PREFIX}/venue-gallery/`,
    DETAIL: (id: string) => `${API_V1_PREFIX}/venue-gallery/${id}/`,
    UPDATE: (id: string) => `${API_V1_PREFIX}/venue-gallery/${id}/`,
    PATCH: (id: string) => `${API_V1_PREFIX}/venue-gallery/${id}/`,
    DELETE: (id: string) => `${API_V1_PREFIX}/venue-gallery/${id}/`,
  },
  BOOKINGS: {
    LIST: `${API_V1_PREFIX}/bookings/`,
    CREATE: `${API_V1_PREFIX}/bookings/`,
    DETAIL: (id: string) => `${API_V1_PREFIX}/bookings/${id}/`,
    UPDATE: (id: string) => `${API_V1_PREFIX}/bookings/${id}/`,
    PATCH: (id: string) => `${API_V1_PREFIX}/bookings/${id}/`,
    DELETE: (id: string) => `${API_V1_PREFIX}/bookings/${id}/`,
    APPROVE: (id: string) => `${API_V1_PREFIX}/bookings/${id}/approve/`,
    CANCEL: (id: string) => `${API_V1_PREFIX}/bookings/${id}/cancel/`,
    AVAILABILITY: `${API_V1_PREFIX}/bookings/availability/`,
  },
} as const;

export const AUTH_ENDPOINTS = API_ENDPOINTS.AUTHENTICATION;
export const USER_ENDPOINTS = API_ENDPOINTS.USERS;
export const ROLE_ENDPOINTS = API_ENDPOINTS.ROLES;
export const CORE_ENDPOINTS = API_ENDPOINTS.CORE;
export const ANNOUNCEMENT_ENDPOINTS = API_ENDPOINTS.ANNOUNCEMENTS;
export const ANNOUNCEMENT_CATEGORY_ENDPOINTS = API_ENDPOINTS.ANNOUNCEMENT_CATEGORIES;
export const CLUB_ENDPOINTS = API_ENDPOINTS.CLUBS;
export const CLUB_CATEGORY_ENDPOINTS = API_ENDPOINTS.CLUB_CATEGORIES;
export const EVENT_ENDPOINTS = API_ENDPOINTS.EVENTS;
export const VOLUNTEER_ENDPOINTS = API_ENDPOINTS.VOLUNTEERS;
export const VENUE_ENDPOINTS = API_ENDPOINTS.VENUES;
export const VENUE_CATEGORY_ENDPOINTS = API_ENDPOINTS.VENUE_CATEGORIES;
export const VENUE_GALLERY_ENDPOINTS = API_ENDPOINTS.VENUE_GALLERY;
export const BOOKING_ENDPOINTS = API_ENDPOINTS.BOOKINGS;
