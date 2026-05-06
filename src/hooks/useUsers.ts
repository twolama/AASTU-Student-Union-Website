import { useQuery, useMutation, useQueryClient, keepPreviousData } from "@tanstack/react-query";
import { userService, type CreateUserInput } from "@/api/services/user.service";
import { type CurrentUser } from "@/schemas/user.schema";

export function useUsers(page = 1, limit = 20, options?: { search?: string; role?: string; department?: string; initialData?: any }) {
  return useQuery({
    queryKey: ["users", page, limit, options?.search, options?.role, options?.department],
    queryFn: () => userService.getUsers(page, limit, options?.search, options?.role, options?.department),
    placeholderData: keepPreviousData,
    initialData: options?.initialData,
  });
}

export function useUser(id: string) {
  return useQuery({
    queryKey: ["user", id],
    queryFn: () => userService.getUser(id),
    enabled: !!id,
  });
}

export function useCreateUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateUserInput) => userService.createUser(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
  });
}

export function useUpdateUser() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<CurrentUser> | FormData }) => 
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
