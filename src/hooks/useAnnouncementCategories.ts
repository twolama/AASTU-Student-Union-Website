import { useQuery } from "@tanstack/react-query";
import { announcementService } from "@/api/services/announcement.service";

export function useAnnouncementCategories() {
  return useQuery({
    queryKey: ["announcement-categories"],
    queryFn: () => announcementService.getCategories(),
    staleTime: 1000 * 60 * 60, // 1 hour
  });
}
