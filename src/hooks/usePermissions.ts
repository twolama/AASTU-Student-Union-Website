"use client";

import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { userService } from "@/api/services/user.service";

type PermissionResult = {
  permissions: string[];
  djangoPermissions: string[];
  isLoading: boolean;
  hasPermission: (permission: string) => boolean;
  hasAnyPermission: (permissions: string[]) => boolean;
  refetch: () => Promise<unknown>;
};

export function usePermissions(userId?: string): PermissionResult {
  const currentUserQuery = useCurrentUser();

  const targetUserId = userId ?? currentUserQuery.data?.id;

  const permissionsQuery = useQuery({
    queryKey: ["auth", "permissions", targetUserId],
    queryFn: () => userService.getUserPermissions(targetUserId as string),
    enabled: Boolean(userId && targetUserId),
    staleTime: 60_000,
  });

  const permissions = userId
    ? permissionsQuery.data?.data.permissions ?? []
    : currentUserQuery.data?.permissions ?? [];

  const djangoPermissions = userId
    ? permissionsQuery.data?.data.djangoPermissions ?? []
    : currentUserQuery.data?.djangoPermissions ?? [];

  const isLoading = userId
    ? permissionsQuery.isLoading
    : currentUserQuery.isLoading;

  const hasPermission = useMemo(() => {
    return (permission: string) => permissions.includes(permission);
  }, [permissions]);

  const hasAnyPermission = useMemo(() => {
    return (requiredPermissions: string[]) => requiredPermissions.some((permission) => permissions.includes(permission));
  }, [permissions]);

  return {
    permissions,
    djangoPermissions,
    isLoading,
    hasPermission,
    hasAnyPermission,
    refetch: async () => {
      if (userId) {
        return permissionsQuery.refetch();
      }
      return currentUserQuery.refetch();
    },
  };
}