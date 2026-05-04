import { useQuery } from "@tanstack/react-query";
import { announcementService } from "@/api/services/announcement.service";

type UseAnnouncementCategoriesOptions = {
  hasAnnouncements?: boolean;
  publishedOnly?: boolean;
};

export function useAnnouncementCategories(options?: UseAnnouncementCategoriesOptions) {
  const queryOptions = {
    hasAnnouncements: Boolean(options?.hasAnnouncements),
    publishedOnly: Boolean(options?.publishedOnly),
  };

  return useQuery({
    queryKey: ["announcement-categories", queryOptions],
    queryFn: () => announcementService.getCategories(queryOptions),
    staleTime: 1000 * 60 * 60, // 1 hour
  });
}
