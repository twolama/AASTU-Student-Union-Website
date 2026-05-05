import { apiClient } from "@/api/client";
import { AUTH_ENDPOINTS, USER_ENDPOINTS } from "@/api/endpoints";
import { writeCachedCurrentUser } from "@/lib/auth-cache";
import { LoginRequestSchema, LoginResponseSchema, type LoginRequest, type LoginResponse } from "@/schemas/auth.schema";
import { CurrentUserResponseSchema, type CurrentUser, type ProfileUpdate, type ChangePasswordRequest } from "@/schemas/user.schema";

export async function login(payload: LoginRequest): Promise<LoginResponse> {
  const request = LoginRequestSchema.parse(payload);

  const response = await apiClient.post(AUTH_ENDPOINTS.LOGIN, request);
  return LoginResponseSchema.parse(response.data);
}

export async function getCurrentUser(): Promise<CurrentUser> {
  const response = await apiClient.get(USER_ENDPOINTS.ME);
  const parsed = CurrentUserResponseSchema.parse(response.data);
  writeCachedCurrentUser(parsed.data);
  return parsed.data;
}

export async function updateProfile(payload: ProfileUpdate): Promise<CurrentUser> {
  const formData = new FormData();

  Object.entries(payload).forEach(([key, value]) => {
    // Skip undefined values
    if (value === undefined) return;

    if (value === null) {
      // In Django REST Framework, an empty string on a FileField/ImageField clears it
      formData.append(key, "");
    } else if (key === "avatar" && typeof value === "string") {
      // If avatar is a URL string (existing), we don't need to send it back
      return;
    } else {
      // For objects (like Files) or other primitives
      formData.append(key, value);
    }
  });

  const response = await apiClient.patch(USER_ENDPOINTS.ME_PATCH, formData, {
    headers: {
      // Do NOT set Content-Type here; axios will set it to multipart/form-data 
      // with the correct boundary if the data is a FormData object.
      "Content-Type": undefined,
    },
  });

  const parsed = CurrentUserResponseSchema.parse(response.data);
  writeCachedCurrentUser(parsed.data);
  return parsed.data;
}

export async function changePassword(payload: ChangePasswordRequest): Promise<{ success: boolean; message: string }> {
  const response = await apiClient.post(AUTH_ENDPOINTS.CHANGE_PASSWORD, payload);
  return response.data;
}

export async function forgotPassword(payload: { email: string; }): Promise<{ success: boolean; message: string }> {
  const response = await apiClient.post(AUTH_ENDPOINTS.FORGOT_PASSWORD, payload);
  return response.data;
}

export async function resendResetOtp(payload: { email: string; }): Promise<{ success: boolean; message: string }> {
  const response = await apiClient.post(AUTH_ENDPOINTS.RESEND_RESET_OTP, payload);
  return response.data;
}

export async function verifyResetOtp(payload: { email: string; otp: string; }): Promise<{ success: boolean; message: string }> {
  const response = await apiClient.post(AUTH_ENDPOINTS.VERIFY_RESET_OTP, payload);
  return response.data;
}

export async function resetPassword(payload: { email: string; otp: string; password: string; }): Promise<{ success: boolean; message: string }> {
  const response = await apiClient.post(AUTH_ENDPOINTS.RESET_PASSWORD, payload);
  return response.data;
}

export async function logout(): Promise<{ success: boolean; message: string }> {
  const response = await apiClient.post(AUTH_ENDPOINTS.LOGOUT);

  return {
    success: Boolean(response.data?.success),
    message: typeof response.data?.message === "string" ? response.data.message : "Signed out",
  };
}
