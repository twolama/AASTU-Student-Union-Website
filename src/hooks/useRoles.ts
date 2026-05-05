import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { userService, type Role } from "@/api/services/user.service";

export function useRoles() {
  return useQuery({
    queryKey: ["roles"],
    queryFn: () => userService.getRoles(),
    staleTime: 1000 * 60 * 30,
  });
}

export function useRole(id: string) {
  return useQuery({
    queryKey: ["role", id],
    queryFn: () => userService.getRole(id),
    enabled: !!id,
  });
}

export function useCreateRole() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (data: Partial<Role>) => userService.createRole(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["roles"] });
    },
  });
}

export function useUpdateRole() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Role> }) => 
      userService.updateRole(id, data),
    onSuccess: (response, variables) => {
      queryClient.invalidateQueries({ queryKey: ["roles"] });
      queryClient.invalidateQueries({ queryKey: ["role", variables.id] });
    },
  });
}

export function useDeleteRole() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (id: string) => userService.deleteRole(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["roles"] });
    },
  });
}
