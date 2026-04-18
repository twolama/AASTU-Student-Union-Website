import { apiClient } from "@/api/client";
import { AUTH_ENDPOINTS, USER_ENDPOINTS } from "@/api/endpoints";
import { LoginRequestSchema, LoginResponseSchema, type LoginRequest, type LoginResponse } from "@/schemas/auth.schema";
import { CurrentUserResponseSchema, type CurrentUser } from "@/schemas/user.schema";

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

export async function logout(): Promise<{ success: boolean; message: string }> {
  const response = await apiClient.post(AUTH_ENDPOINTS.LOGOUT);

  return {
    success: Boolean(response.data?.success),
    message: typeof response.data?.message === "string" ? response.data.message : "Signed out",
  };
}
