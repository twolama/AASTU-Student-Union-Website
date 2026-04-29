"use client";

import Image from "next/image";
import Link from "next/link";
import { 
  Calendar, 
  ChevronRight, 
  Clock, 
  MapPin, 
  Users, 
  Info, 
  CheckCircle2, 
  XCircle, 
  AlertCircle,
  FileText,
  Hammer,
  MessageSquare,
  Building2,
  ArrowLeft,
  PlusCircle
} from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { DashboardFooter } from "@/components/layout/DashboardFooter";
import { cn } from "@/lib/utils";
import type { BookingDetail } from "@/schemas/booking.schema";
import { useApproveBooking, useCancelBooking } from "@/hooks/useBookings";
import { toast } from "sonner";

interface BookingRequestDetailViewProps {
  booking: BookingDetail;
}

export function BookingRequestDetailView({ booking }: BookingRequestDetailViewProps) {
  const approveMutation = useApproveBooking();
  const cancelMutation = useCancelBooking();

  const handleApprove = async () => {
    try {
      await approveMutation.mutateAsync({ id: booking.id });
      toast.success("Booking request approved successfully");
    } catch (error: any) {
      const errorMessage = error?.response?.data?.details?.error || error?.response?.data?.message || "Failed to approve booking request";
      toast.error(errorMessage);
    }
  };

  const handleCancel = async () => {
    try {
      await cancelMutation.mutateAsync({ id: booking.id });
      toast.success("Booking request cancelled");
    } catch (error: any) {
      const errorMessage = error?.response?.data?.details?.error || error?.response?.data?.message || "Failed to cancel booking request";
      toast.error(errorMessage);
    }
  };

  const statusConfig = {
    pending: {
      color: "text-amber-700 bg-amber-100 border-amber-200",
      icon: AlertCircle,
      label: "Pending Review",
    },
    approved: {
      color: "text-emerald-700 bg-emerald-100 border-emerald-200",
      icon: CheckCircle2,
      label: "Approved",
    },
    cancelled: {
      color: "text-rose-700 bg-rose-100 border-rose-200",
      icon: XCircle,
      label: "Cancelled",
    },
  };

  const currentStatus = statusConfig[booking.status] || statusConfig.pending;
  const StatusIcon = currentStatus.icon;

  return (
    <div className="space-y-6">
      {/* Breadcrumbs */}
      <nav aria-label="Breadcrumb" className="flex flex-wrap items-center gap-1.5 text-sm text-gray-400">
        <Link href="/dashboard" className="font-medium text-[#c49a22] hover:underline">
          Dashboard
        </Link>
        <ChevronRight size={14} />
        <Link href="/bookings" className="text-gray-500 hover:text-gray-700">
          Bookings
        </Link>
        <ChevronRight size={14} />
        <span className="text-gray-500">{booking.id_label}</span>
      </nav>

      {/* Header Section */}
      <section className="rounded-[12px] border border-gray-200 bg-white p-5 shadow-sm sm:p-6">
        <div className="flex flex-col gap-5 md:flex-row md:items-start md:justify-between">
          <div className="flex gap-4">
            <div className="relative flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-[#f7d9b2] text-2xl font-bold text-[#80511f]">
              {booking.requester.initials || "ST"}
              {booking.requester.avatar && (
                <Image 
                  src={booking.requester.avatar} 
                  alt={booking.requester.name} 
                  fill 
                  className="rounded-2xl object-cover" 
                />
              )}
            </div>
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-bold text-[#1f2a44]">{booking.event_title || "Venue Booking Request"}</h1>
                <Badge className={cn("px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider", currentStatus.color)}>
                  <StatusIcon size={12} className="mr-1 inline" />
                  {currentStatus.label}
                </Badge>
              </div>
              <p className="text-sm text-gray-500">
                Requested by <span className="font-semibold text-[#b48a1b]">{booking.requester.name}</span> for <span className="font-semibold text-[#1f2a44]">{booking.club_details?.name || "Student Group"}</span>
              </p>
              <div className="flex flex-wrap gap-y-1 gap-x-4 pt-1">
                <div className="flex items-center gap-1.5 text-xs text-[#6d7a95]">
                  <Calendar size={14} className="text-[#b48a1b]" />
                  {booking.date_label}
                </div>
                <div className="flex items-center gap-1.5 text-xs text-[#6d7a95]">
                  <Clock size={14} className="text-[#b48a1b]" />
                  {booking.time_label}
                </div>
                <div className="flex items-center gap-1.5 text-xs text-[#6d7a95]">
                  <MapPin size={14} className="text-[#b48a1b]" />
                  {booking.venue_name}
                </div>
              </div>
            </div>
          </div>

          <div className="flex shrink-0 flex-wrap gap-2 pt-1">
            {booking.status === "pending" && (
              <>
                <Link href={`/bookings/${booking.id}/edit`}>
                  <Button 
                    variant="outline"
                    className="h-10 rounded-[10px] border-[#c49a22]/30 text-[#c49a22] hover:bg-[#c49a22]/5"
                  >
                    Edit Request
                  </Button>
                </Link>
                <Button 
                  onClick={handleApprove}
                  disabled={approveMutation.isPending}
                  className="h-10 rounded-[10px] bg-[#c49a22] px-5 font-bold text-white hover:bg-[#b18a1f]"
                >
                  {approveMutation.isPending ? "Approving..." : "Approve Request"}
                </Button>
                <Button 
                  onClick={handleCancel}
                  disabled={cancelMutation.isPending}
                  variant="outline" 
                  className="h-10 rounded-[10px] border-rose-200 text-rose-600 hover:bg-rose-50 hover:text-rose-700"
                >
                  Reject Request
                </Button>
              </>
            )}
            {booking.status === "approved" && (
              <div className="flex gap-2">
                {!booking.event ? (
                  <Link href={`/events/new?bookingId=${booking.id}`}>
                    <Button 
                      className="h-10 rounded-[10px] bg-[#1f2a44] px-5 font-bold text-white hover:bg-[#161f33]"
                    >
                      <PlusCircle size={16} className="mr-2" />
                      Create Event
                    </Button>
                  </Link>
                ) : (
                  <Link href={`/events/${booking.event}`}>
                    <Button 
                      variant="outline"
                      className="h-10 rounded-[10px] border-emerald-200 text-emerald-700 bg-emerald-50 hover:bg-emerald-100"
                    >
                      View Linked Event
                    </Button>
                  </Link>
                )}
                <Button 
                  onClick={handleCancel}
                  disabled={cancelMutation.isPending}
                  variant="outline" 
                  className="h-10 rounded-[10px] border-rose-200 text-rose-600 hover:bg-rose-50 hover:text-rose-700"
                >
                  Cancel Booking
                </Button>
              </div>
            )}
          </div>
        </div>
      </section>

      <div className="grid gap-6 lg:grid-cols-[1fr_350px]">
        <div className="space-y-6">
          {/* Booking Details Content */}
          <article className="rounded-[12px] border border-gray-200 bg-white p-5 shadow-sm sm:p-6">
            <h2 className="mb-4 flex items-center gap-2 text-lg font-bold text-[#1f2a44]">
              <FileText size={20} className="text-[#b48a1b]" />
              Request Information
            </h2>
            
            <div className="space-y-5">
              <div>
                <h3 className="text-xs font-bold uppercase tracking-widest text-[#8a95a8]">Purpose of Booking</h3>
                <p className="mt-2 text-sm leading-7 text-[#4a5568]">
                  {booking.purpose || "No purpose provided for this request."}
                </p>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="rounded-xl border border-gray-100 bg-[#fbfcff] p-4">
                  <h3 className="text-[10px] font-bold uppercase tracking-widest text-[#8a95a8]">Expected Attendance</h3>
                  <div className="mt-2 flex items-center gap-2 font-bold text-[#1f2a44]">
                    <Users size={16} className="text-[#b48a1b]" />
                    {booking.expected_attendance} Students
                  </div>
                </div>
                <div className="rounded-xl border border-gray-100 bg-[#fbfcff] p-4">
                  <h3 className="text-[10px] font-bold uppercase tracking-widest text-[#8a95a8]">Venue Type</h3>
                  <div className="mt-2 flex items-center gap-2 font-bold text-[#1f2a44]">
                    <Building2 size={16} className="text-[#b48a1b]" />
                    {booking.venue_type || "Standard Venue"}
                  </div>
                </div>
              </div>

              {booking.equipment_requested.length > 0 && (
                <div>
                  <h3 className="text-xs font-bold uppercase tracking-widest text-[#8a95a8]">Requested Equipment</h3>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {booking.equipment_requested.map((item, idx) => (
                      <span key={idx} className="inline-flex items-center gap-1.5 rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-xs font-medium text-[#4a5568]">
                        <Hammer size={12} className="text-[#b48a1b]" />
                        {item}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {booking.special_requests && (
                <div>
                  <h3 className="text-xs font-bold uppercase tracking-widest text-[#8a95a8]">Special Requests</h3>
                  <div className="mt-2 flex gap-3 rounded-xl border border-amber-100 bg-amber-50/30 p-4 text-sm text-[#8c6c14]">
                    <MessageSquare size={18} className="shrink-0 pt-0.5" />
                    <p>{booking.special_requests}</p>
                  </div>
                </div>
              )}
            </div>
          </article>

          {/* Guidelines and Acknowledgement */}
          <article className="rounded-[12px] border border-gray-200 bg-white p-5 shadow-sm sm:p-6">
            <h2 className="mb-4 flex items-center gap-2 text-lg font-bold text-[#1f2a44]">
              <Info size={20} className="text-[#b48a1b]" />
              Compliance
            </h2>
            <div className="flex items-start gap-3 rounded-xl border border-emerald-100 bg-emerald-50/20 p-4">
              <CheckCircle2 size={20} className="shrink-0 text-emerald-500 pt-0.5" />
              <div>
                <p className="text-sm font-bold text-emerald-800">Guidelines Acknowledged</p>
                <p className="mt-1 text-xs text-emerald-600">
                  The requester has agreed to the campus venue usage guidelines and safety protocols.
                  {booking.acknowledged_at && ` (Acknowledged on ${new Date(booking.acknowledged_at).toLocaleDateString()})`}
                </p>
              </div>
            </div>
          </article>
        </div>

        <aside className="space-y-6">
          {/* Venue & Time Summary Card */}
          <div className="overflow-hidden rounded-[12px] border border-gray-200 bg-white shadow-sm">
            <div className="relative h-40 w-full bg-gray-100">
              <Image 
                src="https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&auto=format&fit=crop" 
                alt={booking.venue_name} 
                fill 
                className="object-cover" 
              />
              <div className="absolute inset-0 bg-linear-to-t from-black/60 to-transparent" />
              <div className="absolute bottom-4 left-4 text-white">
                <p className="text-[10px] font-bold uppercase tracking-widest opacity-80">Selected Venue</p>
                <p className="text-lg font-bold">{booking.venue_name}</p>
              </div>
            </div>
            <div className="p-5 space-y-4">
              <div className="space-y-3 border-b border-gray-100 pb-4">
                <div className="flex justify-between text-sm">
                  <span className="text-[#8a95a8]">Request ID</span>
                  <span className="font-bold text-[#1f2a44]">{booking.id_label}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-[#8a95a8]">Request Date</span>
                  <span className="font-bold text-[#1f2a44]">{booking.date_label}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-[#8a95a8]">Time Slot</span>
                  <span className="font-bold text-[#1f2a44]">{booking.time_label}</span>
                </div>
              </div>
              
              <div className="space-y-3">
                <h4 className="text-[10px] font-bold uppercase tracking-widest text-[#8a95a8]">Selected Slots</h4>
                <div className="flex flex-wrap gap-2">
                  {booking.selected_slots.length > 0 ? (
                    booking.selected_slots.map((slot, idx) => (
                      <span key={idx} className="rounded-md bg-[#fbfcff] border border-gray-100 px-2 py-1 text-xs font-semibold text-[#44506b]">
                        {slot}
                      </span>
                    ))
                  ) : (
                    <span className="text-xs text-gray-400 italic">No specific slots selected</span>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Club Info */}
          <div className="rounded-[12px] border border-gray-200 bg-white p-5 shadow-sm">
            <h3 className="mb-3 text-[10px] font-bold uppercase tracking-widest text-[#8a95a8]">Organizing Club</h3>
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 shrink-0 rounded-lg bg-gray-100 p-1 flex items-center justify-center">
                <Building2 size={24} className="text-[#b48a1b]" />
              </div>
              <div className="min-w-0">
                <p className="truncate font-bold text-[#1f2a44]">{booking.club_details?.name || "Student Club"}</p>
                <p className="truncate text-xs text-[#b48a1b]">{booking.club_details?.categoryName || "Official Organization"}</p>
              </div>
            </div>
            <Link 
              href={`/clubs/${booking.club}`}
              className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-lg border border-gray-200 py-2 text-xs font-bold text-[#1f2a44] transition-colors hover:bg-gray-50"
            >
              View Club Profile
            </Link>
          </div>
        </aside>
      </div>

      <DashboardFooter />
    </div>
  );
}
