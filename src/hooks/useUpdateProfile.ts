"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateProfile } from "@/api/services/auth.service";
import { writeCachedCurrentUser } from "@/lib/auth-cache";
import type { CurrentUser, ProfileUpdate } from "@/schemas/user.schema";

export function useUpdateProfile() {
  const queryClient = useQueryClient();

  return useMutation<CurrentUser, Error, ProfileUpdate>({
    mutationFn: (payload) => updateProfile(payload),
    onSuccess: (data) => {
      // Update the current user cache with the new data
      writeCachedCurrentUser(data);
      queryClient.setQueryData(["auth", "current-user"], data);
      // Also invalidate to be safe
      queryClient.invalidateQueries({ queryKey: ["auth", "current-user"] });
    },
  });
}
