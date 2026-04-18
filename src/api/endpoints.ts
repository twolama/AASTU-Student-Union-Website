const API_V1_PREFIX = "/api/v1";

export const API_ENDPOINTS = {
  AUTHENTICATION: {
    LOGIN: `${API_V1_PREFIX}/auth/login/`,
    // Frontend-only proxy logout; backend does not expose this endpoint.
    LOGOUT: `${API_V1_PREFIX}/auth/logout/`,
    REFRESH: `${API_V1_PREFIX}/auth/refresh/`,
    VERIFY: `${API_V1_PREFIX}/auth/verify/`,
    FORGOT_PASSWORD: `${API_V1_PREFIX}/auth/forgot-password/`,
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
} as const;

export const AUTH_ENDPOINTS = API_ENDPOINTS.AUTHENTICATION;
export const USER_ENDPOINTS = API_ENDPOINTS.USERS;
export const ROLE_ENDPOINTS = API_ENDPOINTS.ROLES;
