"use client";

import type { ReactNode } from "react";
import { usePermissions } from "@/hooks/usePermissions";

interface PermissionGateProps {
  children: ReactNode;
  anyOf?: string[];
  allOf?: string[];
  fallback?: ReactNode;
}

export function PermissionGate({ children, anyOf, allOf, fallback = null }: PermissionGateProps) {
  const { hasPermission, hasAnyPermission, isLoading } = usePermissions();

  if (isLoading) {
    return null;
  }

  const canRender =
    (anyOf ? hasAnyPermission(anyOf) : true) &&
    (allOf ? allOf.every((permission) => hasPermission(permission)) : true);

  return canRender ? children : fallback;
}