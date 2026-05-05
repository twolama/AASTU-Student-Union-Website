import { useQuery, useMutation, useQueryClient, keepPreviousData } from "@tanstack/react-query";
import { announcementService } from "@/api/services/announcement.service";

export function useAnnouncements(page = 1, limit = 20, options?: { category?: string; status?: string; initialData?: any }) {
  return useQuery({
    queryKey: ["announcements", page, limit, options?.category, options?.status],
    queryFn: () => announcementService.getAnnouncements(page, limit, options?.category, options?.status),
    placeholderData: keepPreviousData,
    initialData: options?.initialData,
    staleTime: 10 * 60 * 1000,
    gcTime: 30 * 60 * 1000,
  });
}

export function useAnnouncement(id: string) {
  return useQuery({
    queryKey: ["announcement", id],
    queryFn: () => announcementService.getAnnouncement(id),
    enabled: !!id,
  });
}

export function useDeleteAnnouncement() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => announcementService.deleteAnnouncement(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["announcements"] });
    },
  });
}

export function useCreateAnnouncement() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: any) => announcementService.createAnnouncement(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["announcements"] });
    },
  });
}

export function useUpdateAnnouncement() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) => announcementService.updateAnnouncement(id, data),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["announcements"] });
      queryClient.invalidateQueries({ queryKey: ["announcement", data.id] });
    },
  });
}
