"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { login } from "@/api/services/auth.service";
import { writeCachedCurrentUser } from "@/lib/auth-cache";
import type { CurrentUser } from "@/schemas/user.schema";
import type { LoginRequest, LoginResponse } from "@/schemas/auth.schema";

export function useAuthLogin() {
  const queryClient = useQueryClient();

  return useMutation<LoginResponse, Error, LoginRequest>({
    mutationKey: ["auth", "login"],
    mutationFn: (payload) => login(payload),
    onSuccess: (response) => {
      const currentUser: CurrentUser = {
        id: response.data.user.id,
        name: response.data.user.name,
        studentId: response.data.user.studentId,
        email: response.data.user.email,
        avatar: response.data.user.avatar || null,
        phoneNumber: null,
        dormBlock: null,
        dormRoom: null,
        department: null,
        departmentDetails: null,
        college: null,
        collegeDetails: null,
        roles: response.data.user.roles ?? (response.data.user.role ? [response.data.user.role] : []),
        role: response.data.user.role,
        rolesDetails: response.data.user.role
          ? [{ name: response.data.user.role, slug: response.data.user.role }]
          : [],
        roleDetails: response.data.user.role
          ? { name: response.data.user.role, slug: response.data.user.role }
          : null,
        permissions: response.data.user.permissions ?? [],
        djangoPermissions: response.data.user.djangoPermissions ?? [],
        initials: response.data.user.name
          .split(" ")
          .filter(Boolean)
          .slice(0, 2)
          .map((part) => part[0]?.toUpperCase() ?? "")
          .join(""),
        bio: null,
      };

      writeCachedCurrentUser(currentUser);
      queryClient.setQueryData(["auth", "current-user"], currentUser);
      queryClient.invalidateQueries({ queryKey: ["auth", "current-user"] });
    },
    retry: false,
  });
}
