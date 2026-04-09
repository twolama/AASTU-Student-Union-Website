"use client";

import { useEffect, useMemo, useState } from "react";
import {
  bookingRequests,
  bookingStats,
  bookingTabs,
  bookingVenueCards,
  bookingVenueFilters,
  myBookingItems,
} from "@/data/dummy";
import { BookingStatsSection } from "@/components/dashboard/bookings/BookingStatsSection";
import { BookingsTabs } from "@/components/dashboard/bookings/BookingsTabs";
import { BrowseVenuesSection } from "@/components/dashboard/bookings/BrowseVenuesSection";
import { MyBookingsSection } from "@/components/dashboard/bookings/MyBookingsSection";
import { ApprovalQueueSection } from "@/components/dashboard/bookings/ApprovalQueueSection";
import { BookingApprovalModal } from "@/components/dashboard/bookings/BookingApprovalModal";
import { BookingRejectionModal } from "@/components/dashboard/bookings/BookingRejectionModal";
import type {
  BookingRequestDateRange,
  BookingRequestItem,
  BookingTabId,
} from "@/types/dashboard";

const BROWSE_PAGE_SIZE = 6;
const MY_BOOKINGS_PAGE_SIZE = 5;
const REFERENCE_DATE = new Date("2023-10-23T00:00:00Z");

function matchesDateRange(dateIso: string, range: BookingRequestDateRange) {
  if (range === "all") {
    return true;
  }

  const target = new Date(`${dateIso}T00:00:00Z`);

  if (range === "this-month") {
    return (
      target.getUTCMonth() === REFERENCE_DATE.getUTCMonth() &&
      target.getUTCFullYear() === REFERENCE_DATE.getUTCFullYear()
    );
  }

  const dayDiff = Math.floor((target.getTime() - REFERENCE_DATE.getTime()) / (1000 * 60 * 60 * 24));

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

  const [requests, setRequests] = useState(bookingRequests);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedVenueType, setSelectedVenueType] = useState("all");
  const [selectedDateRange, setSelectedDateRange] = useState<BookingRequestDateRange>("next-7-days");

  const [approveTarget, setApproveTarget] = useState<BookingRequestItem | null>(null);
  const [rejectTarget, setRejectTarget] = useState<BookingRequestItem | null>(null);
  const [approvalNote, setApprovalNote] = useState("");
  const [rejectionReason, setRejectionReason] = useState("");
  const isAnyModalOpen = Boolean(approveTarget || rejectTarget);

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

  const filteredVenueCards = useMemo(() => {
    return bookingVenueCards.filter((item) =>
      activeVenueFilter === "all" ? true : item.category === activeVenueFilter
    );
  }, [activeVenueFilter]);

  const browseTotalPages = Math.max(1, Math.ceil(filteredVenueCards.length / BROWSE_PAGE_SIZE));
  const browseClampedPage = Math.min(browsePage, browseTotalPages);
  const browsePaginatedItems = filteredVenueCards.slice(
    (browseClampedPage - 1) * BROWSE_PAGE_SIZE,
    browseClampedPage * BROWSE_PAGE_SIZE
  );

  const myBookingsTotalPages = Math.max(1, Math.ceil(myBookingItems.length / MY_BOOKINGS_PAGE_SIZE));
  const myBookingsClampedPage = Math.min(myBookingsPage, myBookingsTotalPages);
  const myBookingsPaginatedItems = myBookingItems.slice(
    (myBookingsClampedPage - 1) * MY_BOOKINGS_PAGE_SIZE,
    myBookingsClampedPage * MY_BOOKINGS_PAGE_SIZE
  );

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

  const handleApproveConfirm = () => {
    if (!approveTarget) {
      return;
    }

    setRequests((previous) => previous.filter((item) => item.id !== approveTarget.id));
    setApproveTarget(null);
    setApprovalNote("");
  };

  const handleRejectConfirm = () => {
    if (!rejectTarget) {
      return;
    }

    setRequests((previous) => previous.filter((item) => item.id !== rejectTarget.id));
    setRejectTarget(null);
    setRejectionReason("");
  };

  return (
    <div className="space-y-4 sm:space-y-5">
      <BookingsTabs
        items={bookingTabs}
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
        <BrowseVenuesSection
          filters={bookingVenueFilters}
          activeFilter={activeVenueFilter}
          onFilterChange={(value) => {
            setActiveVenueFilter(value);
            setBrowsePage(1);
          }}
          items={browsePaginatedItems}
          currentPage={browseClampedPage}
          totalPages={browseTotalPages}
          totalCount={filteredVenueCards.length}
          pageSize={BROWSE_PAGE_SIZE}
          onPageChange={setBrowsePage}
        />
      ) : null}

      {activeTab === "my-bookings" ? (
        <>
          <BookingStatsSection items={bookingStats} />
          <MyBookingsSection
            items={myBookingsPaginatedItems}
            currentPage={myBookingsClampedPage}
            totalPages={myBookingsTotalPages}
            totalCount={myBookingItems.length}
            pageSize={MY_BOOKINGS_PAGE_SIZE}
            onPageChange={setMyBookingsPage}
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
        />
      ) : null}
    </div>
  );
}
