"use client";

import { useEffect, useMemo, useState } from "react";
import {
  bookingStats,
  bookingTabs,
  bookingVenueCards,
  bookingVenueFilters,
} from "@/data/dummy";
import { BookingStatsSection } from "@/components/dashboard/bookings/BookingStatsSection";
import { BookingsTabs } from "@/components/dashboard/bookings/BookingsTabs";
import { BrowseVenuesSection } from "@/components/dashboard/bookings/BrowseVenuesSection";
import { MyBookingsSection } from "@/components/dashboard/bookings/MyBookingsSection";
import { ApprovalQueueSection } from "@/components/dashboard/bookings/ApprovalQueueSection";
import { BookingApprovalModal } from "@/components/dashboard/bookings/BookingApprovalModal";
import { BookingRejectionModal } from "@/components/dashboard/bookings/BookingRejectionModal";
import { useBookings, useApproveBooking, useCancelBooking, useDeleteBooking } from "@/hooks/useBookings";
import { useVenues, useVenueCategories } from "@/hooks/useVenues";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { toast } from "sonner";
import { ConfirmationDialog } from "@/components/ui/ConfirmationDialog";
import type { VenueCategory } from "@/schemas/venue-category.schema";
import type {
  BookingRequestDateRange,
  BookingRequestItem,
  BookingTabId,
  MyBookingItem,
  BookingVenueCard,
} from "@/types/dashboard";

const BROWSE_PAGE_SIZE = 6;
const MY_BOOKINGS_PAGE_SIZE = 5;
const REFERENCE_DATE = new Date();

function matchesDateRange(dateIso: string, range: BookingRequestDateRange) {
  if (range === "all") {
    return true;
  }

  const target = new Date(dateIso);
  const now = new Date();

  if (range === "this-month") {
    return (
      target.getUTCMonth() === now.getUTCMonth() &&
      target.getUTCFullYear() === now.getUTCFullYear()
    );
  }

  const dayDiff = Math.floor((target.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));

  if (range === "next-7-days") {
    return dayDiff >= 0 && dayDiff <= 7;
  }

  return dayDiff >= 0 && dayDiff <= 14;
}

export function BookingsContent() {
  const [activeTab, setActiveTab] = useState<BookingTabId>("browse-venues");

  const [activeVenueFilter, setActiveVenueFilter] = useState("all");
  const [browsePage, setBrowsePage] = useState(1);

  const [myBookingsPage, setMyBookingsPage] = useState(1);
  
  const { 
    data: venuesData, 
    isLoading: isVenuesLoading, 
    isError: isVenuesError, 
    error: venuesError 
  } = useVenues(browsePage, BROWSE_PAGE_SIZE, activeVenueFilter, "active");

  const { data: categoriesData } = useVenueCategories();

  const { data: bookingsData, isLoading: isBookingsLoading, isError, error } = useBookings(1, 100);
  const approveMutation = useApproveBooking();
  const cancelMutation = useCancelBooking();
  const deleteMutation = useDeleteBooking();

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedVenueType, setSelectedVenueType] = useState("all");
  const [selectedDateRange, setSelectedDateRange] = useState<BookingRequestDateRange>("all");

  const [approveTarget, setApproveTarget] = useState<BookingRequestItem | null>(null);
  const [rejectTarget, setRejectTarget] = useState<BookingRequestItem | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<{ id: string; title: string } | null>(null);
  const [approvalNote, setApprovalNote] = useState("");
  const [rejectionReason, setRejectionReason] = useState("");
  const isAnyModalOpen = Boolean(approveTarget || rejectTarget || deleteConfirm);

  const myBookings = useMemo(() => {
    if (!bookingsData || !bookingsData.data) {
      console.log("BookingsContent: No bookingsData or data is missing", bookingsData);
      return [];
    }
    console.log("BookingsContent: Mapping", bookingsData.data.length, "bookings to myBookings");
    return bookingsData.data.map(b => {
      console.log("Mapping booking item:", b.id, b.status);
      return {
        id: b.id,
        venueName: b.venue_name || "Unknown Venue",
        eventTitle: b.event_title || "Venue Booking",
        dateLabel: b.date_label || "No Date",
        timeLabel: b.time_label || "No Time",
        status: (String(b.status || "pending").toLowerCase() as any),
      };
    }) as MyBookingItem[];
  }, [bookingsData]);

  const requests = useMemo(() => {
    if (!bookingsData || !bookingsData.data) return [];
    
    // Including all requests (not just pending) to ensure visibility
    const allItems = bookingsData.data;
    console.log("BookingsContent: Found", allItems.length, "total requests to display in the queue");
    
    return allItems.map(b => ({
      id: b.id,
      requesterName: b.requester_name || "Unknown Requester",
      clubName: b.club_name || "No Club",
      venueName: b.venue_name || "No Venue",
      capacityLabel: "Standard Capacity",
      dateLabel: b.date_label || "TBD",
      timeRange: b.time_label || "TBD",
      purpose: b.event_title || "Venue Booking Request",
      venueType: "Venue",
      requestedDateIso: b.requested_date_iso || new Date().toISOString(),
      status: b.status, // Passing status through
    })) as any[]; // Using any to bypass the strict BookingRequestItem type if needed
  }, [bookingsData]);

  useEffect(() => {
    if (!isAnyModalOpen) {
      return;
    }

    const previousOverflow = document.body.style.overflow;
    const previousPaddingRight = document.body.style.paddingRight;
    const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;

    document.body.style.overflow = "hidden";

    if (scrollbarWidth > 0) {
      document.body.style.paddingRight = `${scrollbarWidth}px`;
    }

    return () => {
      document.body.style.overflow = previousOverflow;
      document.body.style.paddingRight = previousPaddingRight;
    };
  }, [isAnyModalOpen]);

  const realVenues = useMemo(() => {
    if (!venuesData || !venuesData.data) return [];
    return venuesData.data.map(v => ({
      id: v.id || "unknown",
      name: v.name,
      description: v.shortDescription,
      imageUrl: v.imageUrl || v.heroImage || v.thumbnail || "https://images.unsplash.com/photo-1497366216548-37526070297c?w=900&auto=format&fit=crop",
      capacity: v.maxCapacity,
      category: v.category?.slug || "general",
      status: v.status === "active" ? "available" : "blocked",
    })) as BookingVenueCard[];
  }, [venuesData]);

  const browseTotalPages = venuesData?.meta.totalPages || 1;
  const browseClampedPage = Math.min(browsePage, browseTotalPages);

  const myBookingsTotalPages = Math.max(1, Math.ceil(myBookings.length / MY_BOOKINGS_PAGE_SIZE));
  const myBookingsClampedPage = Math.min(myBookingsPage, myBookingsTotalPages);
  const myBookingsPaginatedItems = myBookings.slice(
    (myBookingsClampedPage - 1) * MY_BOOKINGS_PAGE_SIZE,
    myBookingsClampedPage * MY_BOOKINGS_PAGE_SIZE
  );

  const venueCategories = useMemo(() => {
    const baseFilters = [{ id: "all", label: "All Venues" }];
    if (!categoriesData) return baseFilters;
    
    return [
      ...baseFilters,
      ...categoriesData.map((cat: VenueCategory) => ({
        id: cat.slug,
        label: cat.name
      }))
    ];
  }, [categoriesData]);

  const { pendingCount, approvedCount, cancelledCount, totalCount } = useMemo(() => {
    if (!bookingsData || !bookingsData.data) return { pendingCount: 0, approvedCount: 0, cancelledCount: 0, totalCount: 0 };
    const items = bookingsData.data;
    return {
      pendingCount: items.filter(b => b.status === "pending").length,
      approvedCount: items.filter(b => b.status === "approved").length,
      cancelledCount: items.filter(b => b.status === "cancelled").length,
      totalCount: items.length,
    };
  }, [bookingsData]);

  const dynamicTabs = useMemo(() => {
    return bookingTabs.map(tab => {
      if (tab.id === "approval-queue") {
        return { ...tab, badge: pendingCount > 0 ? pendingCount : undefined };
      }
      return tab;
    });
  }, [pendingCount]);

  const dynamicStats = useMemo(() => {
    return bookingStats.map(stat => {
      if (stat.id === "total") return { ...stat, value: totalCount.toString() };
      if (stat.id === "pending") return { ...stat, value: pendingCount.toString() };
      if (stat.id === "approved") return { ...stat, value: approvedCount.toString() };
      if (stat.id === "cancelled") return { ...stat, value: cancelledCount.toString() };
      return stat;
    });
  }, [pendingCount, approvedCount, cancelledCount, totalCount]);

  const filteredApprovalRequests = useMemo(() => {
    return requests.filter((request) => {
      const normalizedTerm = searchTerm.trim().toLowerCase();

      const matchesSearch =
        normalizedTerm.length === 0
          ? true
          : request.requesterName.toLowerCase().includes(normalizedTerm) ||
            request.clubName.toLowerCase().includes(normalizedTerm) ||
            request.purpose.toLowerCase().includes(normalizedTerm);

      const matchesVenueType = selectedVenueType === "all" ? true : request.venueType === selectedVenueType;
      const matchesRange = matchesDateRange(request.requestedDateIso, selectedDateRange);

      return matchesSearch && matchesVenueType && matchesRange;
    });
  }, [requests, searchTerm, selectedVenueType, selectedDateRange]);


  const handleApproveConfirm = async () => {
    if (!approveTarget) {
      return;
    }

    try {
      await approveMutation.mutateAsync({ id: approveTarget.id, note: approvalNote });
      setApproveTarget(null);
      setApprovalNote("");
      toast.success("Booking request approved successfully");
    } catch (error: any) {
      console.error("Failed to approve booking:", error);
      const errorMessage = error?.response?.data?.details?.error || error?.response?.data?.message || "Failed to approve booking";
      toast.error(errorMessage);
    }
  };

  const handleRejectConfirm = async () => {
    if (!rejectTarget) {
      return;
    }

    try {
      await cancelMutation.mutateAsync({ id: rejectTarget.id, reason: rejectionReason });
      setRejectTarget(null);
      setRejectionReason("");
      toast.success("Booking request rejected");
    } catch (error: any) {
      console.error("Failed to reject booking:", error);
      const errorMessage = error?.response?.data?.details?.error || error?.response?.data?.message || "Failed to reject booking";
      toast.error(errorMessage);
    }
  };

  const handleDeleteBooking = async () => {
    if (!deleteConfirm) return;
    try {
      await deleteMutation.mutateAsync(deleteConfirm.id);
      setDeleteConfirm(null);
      toast.success("Booking deleted successfully");
    } catch (error: any) {
      toast.error("Failed to delete booking");
    }
  };

  return (
    <div className="space-y-4 sm:space-y-5">
      <BookingsTabs
        items={dynamicTabs}
        value={activeTab}
        onValueChange={(value) => {
          setActiveTab(value);
          if (value === "browse-venues") {
            setBrowsePage(1);
          }
          if (value === "my-bookings") {
            setMyBookingsPage(1);
          }
        }}
      />

      {activeTab === "browse-venues" ? (
        <>
          {isVenuesLoading ? (
            <div className="flex h-64 flex-col items-center justify-center gap-3 rounded-[12px] border border-gray-200 bg-white shadow-sm">
              <Loader2 className="h-8 w-8 animate-spin text-[#c49a22]" />
              <p className="text-sm text-gray-500">Discovering available venues...</p>
            </div>
          ) : isVenuesError ? (
            <div className="flex h-64 flex-col items-center justify-center gap-3 rounded-[12px] border border-rose-200 bg-rose-50 p-6 text-center shadow-sm">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-rose-100 text-rose-600">
                <span className="font-bold">!</span>
              </div>
              <p className="font-semibold text-rose-800">Failed to load venues</p>
              <p className="text-xs text-rose-600 max-w-xs mx-auto">
                {venuesError instanceof Error ? venuesError.message : "An error occurred while fetching available venues."}
              </p>
              <Button 
                onClick={() => window.location.reload()} 
                variant="outline" 
                className="mt-2 h-8 border-rose-200 text-rose-700 hover:bg-rose-100"
              >
                Retry
              </Button>
            </div>
          ) : (
            <BrowseVenuesSection
              filters={venueCategories}
              activeFilter={activeVenueFilter}
              onFilterChange={(value) => {
                setActiveVenueFilter(value);
                setBrowsePage(1);
              }}
              items={realVenues}
              currentPage={browseClampedPage}
              totalPages={browseTotalPages}
              totalCount={venuesData?.meta.total || 0}
              pageSize={BROWSE_PAGE_SIZE}
              onPageChange={setBrowsePage}
            />
          )}
        </>
      ) : (
        <>
          {isBookingsLoading ? (
            <div className="flex h-64 flex-col items-center justify-center gap-3 rounded-[12px] border border-gray-200 bg-white shadow-sm">
              <Loader2 className="h-8 w-8 animate-spin text-[#c49a22]" />
              <p className="text-sm text-gray-500">Loading bookings...</p>
            </div>
          ) : isError ? (
            <div className="flex h-64 flex-col items-center justify-center gap-3 rounded-[12px] border border-rose-200 bg-rose-50 p-6 text-center shadow-sm">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-rose-100 text-rose-600">
                <span className="font-bold">!</span>
              </div>
              <p className="font-semibold text-rose-800">Failed to load bookings</p>
              <p className="text-xs text-rose-600 max-w-xs mx-auto">
                {error instanceof Error ? error.message : "An error occurred while fetching the booking list."}
              </p>
              <Button 
                onClick={() => window.location.reload()} 
                variant="outline" 
                className="mt-2 h-8 border-rose-200 text-rose-700 hover:bg-rose-100"
              >
                Retry Loading
              </Button>
            </div>
          ) : (
            <>
              {activeTab === "my-bookings" ? (
                <>
                  <BookingStatsSection items={dynamicStats} />
                  <MyBookingsSection
                    items={myBookingsPaginatedItems}
                    currentPage={myBookingsClampedPage}
                    totalPages={myBookingsTotalPages}
                    totalCount={myBookings.length}
                    pageSize={MY_BOOKINGS_PAGE_SIZE}
                    onPageChange={setMyBookingsPage}
                    onDelete={(bookingId) => {
                      const booking = myBookings.find(b => b.id === bookingId);
                      if (booking) {
                        setDeleteConfirm({ id: booking.id, title: booking.eventTitle });
                      }
                    }}
                  />
                </>
              ) : null}

              {activeTab === "approval-queue" ? (
                <ApprovalQueueSection
                  items={filteredApprovalRequests}
                  searchTerm={searchTerm}
                  selectedVenueType={selectedVenueType}
                  selectedDateRange={selectedDateRange}
                  onSearchTermChange={setSearchTerm}
                  onSelectedVenueTypeChange={setSelectedVenueType}
                  onSelectedDateRangeChange={setSelectedDateRange}
                  onApprove={(item) => {
                    setApproveTarget(item);
                    setApprovalNote("");
                  }}
                  onReject={(item) => {
                    setRejectTarget(item);
                    setRejectionReason("");
                  }}
                />
              ) : null}
            </>
          )}
        </>
      )}

      {approveTarget ? (
        <BookingApprovalModal
          request={approveTarget}
          note={approvalNote}
          onNoteChange={setApprovalNote}
          onClose={() => {
            setApproveTarget(null);
            setApprovalNote("");
          }}
          onConfirm={handleApproveConfirm}
          isLoading={approveMutation.isPending}
        />
      ) : null}

      {rejectTarget ? (
        <BookingRejectionModal
          request={rejectTarget}
          reason={rejectionReason}
          onReasonChange={setRejectionReason}
          onClose={() => {
            setRejectTarget(null);
            setRejectionReason("");
          }}
          onConfirm={handleRejectConfirm}
          isLoading={cancelMutation.isPending}
        />
      ) : null}

      <ConfirmationDialog
        open={deleteConfirm !== null}
        title="Delete Booking Request"
        message={`Are you sure you want to delete the booking for "${deleteConfirm?.title}"? This action cannot be undone.`}
        confirmLabel="Delete Booking"
        onConfirm={handleDeleteBooking}
        onCancel={() => setDeleteConfirm(null)}
        isLoading={deleteMutation.isPending}
      />
    </div>
  );
}
