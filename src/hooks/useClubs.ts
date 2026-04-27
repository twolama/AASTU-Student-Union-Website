import { useQuery, useMutation, useQueryClient, keepPreviousData } from "@tanstack/react-query";
import { clubService } from "@/api/services/club.service";

export function useClubs(page = 1, limit = 20, category?: string, status?: string) {
  return useQuery({
    queryKey: ["clubs", page, limit, category, status],
    queryFn: () => clubService.getClubs(page, limit, category, status),
    placeholderData: keepPreviousData,
  });
}

export function useClub(id: string) {
  return useQuery({
    queryKey: ["club", id],
    queryFn: () => clubService.getClub(id),
    enabled: !!id,
  });
}

export function useDeleteClub() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => clubService.deleteClub(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["clubs"] });
    },
  });
}

export function useCreateClub() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: any) => clubService.createClub(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["clubs"] });
    },
  });
}

export function useUpdateClub() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) => clubService.updateClub(id, data),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["clubs"] });
      queryClient.invalidateQueries({ queryKey: ["club", data.id] });
    },
  });
}

export function useClubUpcomingEvents(id: string) {
  return useQuery({
    queryKey: ["club", id, "upcoming-events"],
    queryFn: () => clubService.getClubUpcomingEvents(id),
    enabled: !!id,
  });
}
