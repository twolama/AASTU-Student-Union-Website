import { useQuery, useMutation, useQueryClient, keepPreviousData } from "@tanstack/react-query";
import { eventService } from "@/api/services/event.service";

export function useEvents(page = 1, limit = 20, options?: { status?: string; clubId?: string; search?: string; venue?: string; category?: string; initialData?: any }) {
  return useQuery({
    queryKey: ["events", page, limit, options?.status, options?.clubId, options?.search, options?.venue, options?.category],
    queryFn: () => eventService.getEvents(page, limit, options?.status, options?.clubId, options?.search, options?.venue, options?.category),
    placeholderData: keepPreviousData,
    initialData: options?.initialData,
    staleTime: 10 * 60 * 1000,
    gcTime: 30 * 60 * 1000,
  });
}

export function useEvent(id: string) {
  return useQuery({
    queryKey: ["event", id],
    queryFn: () => eventService.getEvent(id),
    enabled: !!id,
    staleTime: 5 * 60 * 1000,
  });
}

export function useCreateEvent() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: FormData | Record<string, unknown>) => eventService.createEvent(data),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["events"] });
      queryClient.invalidateQueries({ queryKey: ["event", data.id] });
    },
  });
}

export function useUpdateEvent() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: FormData | Record<string, unknown> }) =>
      eventService.updateEvent(id, data),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["events"] });
      queryClient.invalidateQueries({ queryKey: ["event", data.id] });
    },
  });
}

export function useArchiveEvent() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => eventService.archiveEvent(id),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["events"] });
      queryClient.invalidateQueries({ queryKey: ["event", data.id] });
    },
  });
}

export function useDeleteEvent() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => eventService.deleteEvent(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["events"] });
    },
  });
}

export function useVolunteerForEvent() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ eventId, data }: { eventId: string; data: Record<string, unknown> }) =>
      eventService.volunteerForEvent(eventId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["event"] });
    },
  });
}
