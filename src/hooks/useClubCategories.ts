import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { clubService } from "@/api/services/club.service";

export function useClubCategories() {
  return useQuery({
    queryKey: ["club-categories"],
    queryFn: () => clubService.getCategories(),
    staleTime: 30 * 60 * 1000,
  });
}

export function useClubCategory(id: string) {
  return useQuery({
    queryKey: ["club-category", id],
    queryFn: () => clubService.getCategory(id),
    enabled: !!id,
  });
}

export function useCreateClubCategory() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: any) => clubService.createCategory(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["club-categories"] });
    },
  });
}

export function useUpdateClubCategory() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) => clubService.updateCategory(id, data),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["club-categories"] });
      queryClient.invalidateQueries({ queryKey: ["club-category", data.id] });
    },
  });
}

export function useDeleteClubCategory() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => clubService.deleteCategory(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["club-categories"] });
    },
  });
}
