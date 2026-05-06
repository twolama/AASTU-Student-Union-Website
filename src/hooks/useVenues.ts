import { useQuery, useMutation, useQueryClient, keepPreviousData } from "@tanstack/react-query";
import { venueService } from "@/api/services/venue.service";

export function useVenues(page = 1, limit = 20, options?: { category?: string; status?: string; initialData?: any }) {
  return useQuery({
    queryKey: ["venues", page, limit, options?.category, options?.status],
    queryFn: () => venueService.getVenues(page, limit, options?.category, options?.status),
    placeholderData: keepPreviousData,
    initialData: options?.initialData,
    staleTime: 10 * 60 * 1000,
    gcTime: 30 * 60 * 1000,
  });
}

export function useVenue(id: string) {
  return useQuery({
    queryKey: ["venue", id],
    queryFn: () => venueService.getVenue(id),
    enabled: !!id,
  });
}

export function useCreateVenue() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: any) => venueService.createVenue(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["venues"] });
    },
  });
}

export function useUpdateVenue() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) => venueService.updateVenue(id, data),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["venues"] });
      queryClient.invalidateQueries({ queryKey: ["venue", data.id] });
    },
  });
}

export function useDeleteVenue() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => venueService.deleteVenue(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["venues"] });
    },
  });
}

export function useVenueCategories() {
  return useQuery({
    queryKey: ["venue-categories"],
    queryFn: () => venueService.getCategories(),
    staleTime: 30 * 60 * 1000,
  });
}

export function useVenueGallery(page = 1, limit = 20, venueId?: string) {
  return useQuery({
    queryKey: ["venue-gallery", page, limit, venueId],
    queryFn: () => venueService.getVenueGallery(page, limit, venueId),
    placeholderData: keepPreviousData,
    staleTime: 5 * 60 * 1000,
  });
}

export function useUploadVenueGalleryImage() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: FormData) => venueService.uploadGalleryImage(data),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["venue-gallery"] });
      if (data.venue) {
        queryClient.invalidateQueries({ queryKey: ["venue", data.venue] });
      }
    },
  });
}

export function useDeleteVenueGalleryImage() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => venueService.deleteGalleryImage(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["venue-gallery"] });
      queryClient.invalidateQueries({ queryKey: ["venue"] });
    },
  });
}
