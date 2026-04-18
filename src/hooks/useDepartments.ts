"use client";

import { useQuery } from "@tanstack/react-query";
import { getDepartments } from "@/api/services/core.service";
import type { Department } from "@/schemas/core.schema";

export function useDepartments() {
  return useQuery<Department[]>({
    queryKey: ["core", "departments"],
    queryFn: getDepartments,
    staleTime: 1000 * 60 * 30, // 30 minutes
  });
}
