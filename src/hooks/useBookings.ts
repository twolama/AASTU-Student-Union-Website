import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { bookingService } from "@/api/services/booking.service";

export const useBookings = (page = 1, limit = 20, status?: string) => {
  return useQuery({
    queryKey: ["bookings", { page, limit, status }],
    queryFn: () => bookingService.getBookings(page, limit, status),
  });
};

export const useBooking = (id: string) => {
  return useQuery({
    queryKey: ["booking", id],
    queryFn: () => bookingService.getBooking(id),
    enabled: !!id,
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
