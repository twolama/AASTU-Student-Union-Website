import { apiClient } from "@/api/client";
import { AUTH_ENDPOINTS, USER_ENDPOINTS } from "@/api/endpoints";
import { LoginRequestSchema, LoginResponseSchema, type LoginRequest, type LoginResponse } from "@/schemas/auth.schema";
import { CurrentUserResponseSchema, type CurrentUser, type ProfileUpdate } from "@/schemas/user.schema";

export async function login(payload: LoginRequest): Promise<LoginResponse> {
  const request = LoginRequestSchema.parse(payload);

  const response = await apiClient.post(AUTH_ENDPOINTS.LOGIN, request);
  return LoginResponseSchema.parse(response.data);
}

export async function getCurrentUser(): Promise<CurrentUser> {
  const response = await apiClient.get(USER_ENDPOINTS.ME);
  const parsed = CurrentUserResponseSchema.parse(response.data);
  return parsed.data;
}

export async function updateProfile(payload: ProfileUpdate): Promise<CurrentUser> {
  const formData = new FormData();

  Object.entries(payload).forEach(([key, value]) => {
    if (value === null) {
      // Sending empty string for a file field in multipart/form-data often clears it in DRF
      formData.append(key, "");
    } else if (value !== undefined) {
      if (key === "avatar" && typeof value === "string") {
        // If avatar is a URL string, we don't need to send it back
        return;
      }
      formData.append(key, value);
    }
  });

  const response = await apiClient.patch(USER_ENDPOINTS.ME_PATCH, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  const parsed = CurrentUserResponseSchema.parse(response.data);
  return parsed.data;
}

export async function changePassword(payload: any): Promise<{ success: boolean; message: string }> {
  const response = await apiClient.post(AUTH_ENDPOINTS.CHANGE_PASSWORD, payload);
  return response.data;
}

export async function logout(): Promise<{ success: boolean; message: string }> {
  const response = await apiClient.post(AUTH_ENDPOINTS.LOGOUT);

  return {
    success: Boolean(response.data?.success),
    message: typeof response.data?.message === "string" ? response.data.message : "Signed out",
  };
}
