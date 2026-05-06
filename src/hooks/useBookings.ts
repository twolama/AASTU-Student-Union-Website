import { useQuery, useMutation, useQueryClient, keepPreviousData } from "@tanstack/react-query";
import { bookingService } from "@/api/services/booking.service";

export const useBookings = (page = 1, limit = 20, options?: { status?: string; clubId?: string; search?: string; category?: string; initialData?: any }) => {
  return useQuery({
    queryKey: ["bookings", { page, limit, status: options?.status, clubId: options?.clubId, search: options?.search, category: options?.category }],
    queryFn: () => bookingService.getBookings(page, limit, options?.status, options?.clubId, options?.search),
    placeholderData: keepPreviousData,
    initialData: options?.initialData,
    staleTime: 5 * 60 * 1000,
    gcTime: 30 * 60 * 1000,
  });
};

export const useBooking = (id: string) => {
  return useQuery({
    queryKey: ["booking", id],
    queryFn: () => bookingService.getBooking(id),
    enabled: !!id,
    staleTime: 5 * 60 * 1000,
  });
};

export const useApproveBooking = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, note }: { id: string; note?: string }) => bookingService.approveBooking(id, note),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ["bookings"] });
      queryClient.invalidateQueries({ queryKey: ["booking", id] });
    },
  });
};

export const useCancelBooking = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, reason }: { id: string; reason?: string }) => bookingService.cancelBooking(id, reason),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ["bookings"] });
      queryClient.invalidateQueries({ queryKey: ["booking", id] });
    },
  });
};

export const useCreateBooking = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: Record<string, unknown>) => bookingService.createBooking(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["bookings"] });
    },
  });
};

export const useUpdateBooking = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Record<string, unknown> }) =>
      bookingService.updateBooking(id, data),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["bookings"] });
      queryClient.invalidateQueries({ queryKey: ["booking", data.id] });
    },
  });
};

export const useDeleteBooking = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => bookingService.deleteBooking(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["bookings"] });
    },
  });
};

export const useBookingAvailability = (venueId: string, startDate: string, endDate: string, excludeId?: string) => {
  return useQuery({
    queryKey: ["booking-availability", { venueId, startDate, endDate, excludeId }],
    queryFn: () => bookingService.getAvailability(venueId, startDate, endDate, excludeId),
    enabled: !!venueId && !!startDate && !!endDate && (new Date(endDate) >= new Date(startDate)),
    staleTime: 5 * 60 * 1000,
  });
};
