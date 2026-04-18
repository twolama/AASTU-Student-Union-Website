import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { userService } from "@/api/services/user.service";
import { type CurrentUser } from "@/schemas/user.schema";

export function useUsers(page = 1, limit = 20, search?: string) {
  return useQuery({
    queryKey: ["users", page, limit, search],
    queryFn: () => userService.getUsers(page, limit, search),
  });
}

export function useUser(id: string) {
  return useQuery({
    queryKey: ["user", id],
    queryFn: () => userService.getUser(id),
    enabled: !!id,
  });
}

export function useUpdateUser() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<CurrentUser> }) => 
      userService.updateUser(id, data),
    onSuccess: (response, variables) => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      queryClient.invalidateQueries({ queryKey: ["user", variables.id] });
    },
  });
}

export function useDeleteUser() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (id: string) => userService.deleteUser(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
  });
}
