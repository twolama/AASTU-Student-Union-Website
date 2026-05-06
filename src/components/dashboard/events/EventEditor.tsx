"use client";

import { useMemo, useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useSearchParams } from "next/navigation";
import { toast } from "sonner";
import { Plus, Trash2, PlusCircle, ChevronRight, Info, CheckCircle2, Clock3, Settings2, UserPlus2, Loader2 } from "lucide-react";
import { Input } from "@/components/ui/Input";
import { RichTextEditor } from "@/components/ui/RichTextEditor";
import { DropdownSelect } from "@/components/ui/DropdownSelect";
import { FileUpload } from "@/components/ui/FileUpload";
import { Switch } from "@/components/ui/Switch";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";
import { getEventStatusLabel, resolveEventStatus } from "@/lib/events/status";
import { eventDateTimeToUtc, formatEventDateTime, utcToEventDateTime } from "@/lib/events/datetime";
import { useCreateEvent, useUpdateEvent } from "@/hooks/useEvents";
import { useBookings } from "@/hooks/useBookings";
import { useClubs } from "@/hooks/useClubs";
import { venueService } from "@/api/services/venue.service";
import { bookingService } from "@/api/services/booking.service";
import type { Club } from "@/schemas/club.schema";
import type { BookingListItem } from "@/schemas/booking.schema";

// --- Editable Volunteers & User-Friendly Logistics UI ---

// (Some helper fields were removed because they were unused.)

function formatDisplayDate(isoString: string) {
  return formatEventDateTime(isoString);
}

// Safe typed shape for unknown errors returned from API calls
type UnknownError = {
  payload?: { details?: Record<string, string[]>; message?: string };
  response?: { data?: { details?: Record<string, string[]>; message?: string } };
  details?: Record<string, string[]>;
  message?: string;
};
type EditorMode = "create" | "edit";


// Backend-aligned volunteer type
interface VolunteerEntry {
  id?: string;
  full_name: string;
  student_id: string;
  phone: string;
  email: string;
  role: string;
  is_active: boolean;
}

interface VolunteerDraft {
  full_name: string;
  student_id: string;
  phone: string;
  email: string;
  role: string;
  is_active: boolean;
}

// Backend-aligned event fields
type LogisticsType = Record<string, unknown>;
type AttendanceType = Record<string, unknown>;

export interface EventEditorValues {
  title: string;
  short_description: string;
  status: string;
  is_mega_event: boolean;
  is_archived: boolean;
  max_capacity: number;
  physical_location_details: string;
  cover_image: string;
  start_date_time: string;
  end_date_time: string;
  registration_link: string;
  description: string;
  logistics: LogisticsType;
  attendance: AttendanceType;
  volunteers: VolunteerEntry[];
  booking_id?: string;
  organizing_club: string;
}

interface EventEditorProps {
  mode: EditorMode;
  eventId?: string;
  initialValues: EventEditorValues;
}



export function EventEditor({ mode, eventId, initialValues }: EventEditorProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const bookingId = searchParams.get("bookingId");

  // --- Volunteers Edit State ---
  const [editVolunteerId, setEditVolunteerId] = useState<string | null>(null);
  // venues list removed (unused)
  const [isPreFilling, setIsPreFilling] = useState(false);
  const [values, setValues] = useState<EventEditorValues>({
    ...initialValues,
    // Ensure all fields are defined and not undefined
    title: initialValues.title || "",
    short_description: initialValues.short_description || "",
    status: initialValues.status || "upcoming",
    is_mega_event: initialValues.is_mega_event ?? false,
    is_archived: initialValues.is_archived ?? false,
    max_capacity: initialValues.max_capacity ?? 0,
    physical_location_details: initialValues.physical_location_details || "",
    cover_image: initialValues.cover_image || "",
    start_date_time: initialValues.start_date_time || "",
    end_date_time: initialValues.end_date_time || "",
    registration_link: initialValues.registration_link || "",
    description: initialValues.description || "",
    logistics: Array.isArray(initialValues.logistics) ? (initialValues.logistics[0] || {}) : (initialValues.logistics || {}),
    attendance: initialValues.attendance || {},
    volunteers: initialValues.volunteers || [],
    booking_id: bookingId || initialValues.booking_id || undefined,
    organizing_club: initialValues.organizing_club || "",
  });
  const [bannerFile, setBannerFile] = useState<File | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string[]>>({});
  const [volunteerDraft, setVolunteerDraft] = useState<VolunteerDraft>({
    full_name: "",
    student_id: "",
    phone: "",
    email: "",
    role: "",
    is_active: true,
  });
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  const createEventMutation = useCreateEvent();
  const updateEventMutation = useUpdateEvent();
  const { data: clubsData } = useClubs(1, 100);
  const { data: approvedBookings, isLoading: isBookingsLoading } = useBookings(1, 100, { status: "approved", clubId: values.organizing_club });
  const isSubmitting = createEventMutation.status === "pending" || updateEventMutation.status === "pending";

  const isCreate = mode === "create";
  const title = isCreate ? "Create New Event" : "Edit Event";
  const subtitle = isCreate
    ? "Organize and schedule your next campus activity. Fill in the required details below."
    : "Update event details, logistics, and volunteer assignments.";
  const controlClassName = "rounded-[8px] h-10";

  const completionItems = useMemo(
    () => [
      { label: "Basic", done: (values.title || "").trim().length >= 6 && (values.short_description || "").trim().length >= 20 },
      { label: "Logistics", done: Boolean(values.booking_id) },
      { label: "Settings", done: (values.status || "").trim().length > 0 },
    ],
    [values.short_description, values.title, values.status, values.booking_id]
  );

  const completionPercent = Math.round(
    (completionItems.filter((item) => item.done).length / completionItems.length) * 100
  );
  const previewStatus = resolveEventStatus(values);


  function updateField<K extends keyof EventEditorValues>(key: K, value: EventEditorValues[K]) {
    setValues((current) => ({ ...current, [key]: value }));
  }

  function updateVolunteerDraft<K extends keyof VolunteerDraft>(key: K, value: VolunteerDraft[K]) {
    setVolunteerDraft((current) => ({ ...current, [key]: value }));
  }


  function addVolunteer() {
    const hasRequired = (volunteerDraft.full_name || "").trim().length > 0 && (volunteerDraft.student_id || "").trim().length > 0;
    if (!hasRequired) return;
    if (editVolunteerId) {
      // Update existing
      updateField(
        "volunteers",
        values.volunteers.map((v) =>
          v.id === editVolunteerId
            ? { ...volunteerDraft, id: editVolunteerId }
            : v
        )
      );
      setEditVolunteerId(null);
    } else {
      // Add new
      const nextEntry: VolunteerEntry = {
        ...volunteerDraft,
        id: `${Date.now()}`,
        full_name: (volunteerDraft.full_name || "").trim(),
        student_id: (volunteerDraft.student_id || "").trim(),
        phone: (volunteerDraft.phone || "").trim(),
        email: (volunteerDraft.email || "").trim(),
        role: (volunteerDraft.role || "").trim(),
        is_active: true,
      };
      updateField("volunteers", [...values.volunteers, nextEntry]);
    }
    setVolunteerDraft({ full_name: "", student_id: "", phone: "", email: "", role: "", is_active: true });
  }

  function editVolunteer(id?: string) {
    if (!id) return;
    const v = values.volunteers.find((item) => item.id === id);
    if (v) {
      setVolunteerDraft({
        full_name: v.full_name,
        student_id: v.student_id,
        phone: v.phone,
        email: v.email,
        role: v.role,
        is_active: v.is_active,
      });
      setEditVolunteerId(id);
    }
  }

  function removeVolunteer(id?: string) {
    updateField(
      "volunteers",
      values.volunteers.filter((item) => item.id !== id)
    );
    if (editVolunteerId === id) {
      setEditVolunteerId(null);
      setVolunteerDraft({ full_name: "", student_id: "", phone: "", email: "", role: "", is_active: true });
    }
  }

  // Pre-fill from booking if booking_id is present (either from URL or initialValues)
  const handleBookingSelect = useCallback(async (bookingId: string, overwriteContent = true) => {
    if (!bookingId) {
      updateField("booking_id", undefined);
      return;
    }

    setIsPreFilling(true);
    try {
      const booking = await bookingService.getBooking(bookingId);
      
      // Also fetch venue details to get amenities and capacity
      let venueData = null;
      try {
        venueData = await venueService.getVenue(booking.venue);
      } catch (vErr) {
        console.warn("Failed to fetch venue details for booking:", vErr);
      }

      setValues((prev) => {
        const prevLogistics = Array.isArray(prev.logistics) ? (prev.logistics[0] || {}) : (prev.logistics || {});
        
        return {
          ...prev,
          booking_id: booking.id,
          // Keep the event title user-authored; booking data should not replace it.
          title: prev.title,
          description: overwriteContent ? (booking.purpose || prev.description) : prev.description,
          short_description: overwriteContent ? (booking.purpose ? (booking.purpose.length > 100 ? booking.purpose.substring(0, 97) + "..." : booking.purpose) : prev.short_description) : prev.short_description,
          physical_location_details: booking.venue_name || prev.physical_location_details,
          max_capacity: booking.expected_attendance || venueData?.maxCapacity || prev.max_capacity,
          start_date_time: overwriteContent ? (booking.start_date || prev.start_date_time) : prev.start_date_time,
          end_date_time: overwriteContent ? (booking.end_date || prev.end_date_time) : prev.end_date_time,
          logistics: {
            ...prevLogistics,
            venue: booking.venue_name,
            venue_id: booking.venue,
            booking_id: booking.id,
            equipment: booking.equipment_requested.join(", "),
            amenities: venueData?.amenities || [],
            // Don't reset selected amenities if we are just syncing in edit mode
            selected_amenities: prevLogistics?.selected_amenities || [],
          },
          attendance: {
            ...prev.attendance,
            capacity: booking.expected_attendance || venueData?.maxCapacity || prev.max_capacity,
          }
        };
      });
      if (overwriteContent) {
        toast.success("Details imported from booking!");
      }
    } catch (err) {
      console.error("Failed to load booking details:", err);
      toast.error("Could not load booking details");
    } finally {
      setIsPreFilling(false);
    }
  }, []);

  useEffect(() => {
    const effectiveBookingId = values.booking_id;
    if (effectiveBookingId && !values.logistics.venue) {
      handleBookingSelect(effectiveBookingId, mode === "create");
    }
  }, [values.booking_id, mode, handleBookingSelect, values.logistics?.venue]);

  // Fetch venues list on mount
  // Venue list fetch removed — `venues` not used in this component

  // handleVenueSelect removed (unused)

  function buildPayload() {
    const payload: Record<string, unknown> = {
      title: values.title,
      short_description: values.short_description,
      status: values.status,
      is_mega_event: values.is_mega_event,
      is_archived: values.is_archived,
      max_capacity: Number(values.max_capacity) || 0,
      physical_location_details: values.physical_location_details,
      start_date_time: values.start_date_time,
      end_date_time: values.end_date_time,
      registration_link: values.registration_link,
      description: values.description,
      booking: values.booking_id,
      organizing_club: values.organizing_club,
    };

    // The backend can now derive logistics and attendance from the linked booking.
    // Keep them out of the request unless you want to override the defaults later.

    // If no file to upload, send JSON payload
    if (!bannerFile) {
      return payload;
    }

    // Build FormData for multipart upload. Ensure nested objects are JSON strings.
    const formData = new FormData();
    Object.entries(payload).forEach(([key, value]) => {
      if (value === undefined || value === null) return;
      // Files/Blobs should not be stringified here (we don't expect any besides cover_image)
      if (value instanceof Blob || value instanceof File) {
        formData.append(key, value as Blob);
        return;
      }

      // Always stringify arrays/objects so backend JSONField can parse them reliably
      if (typeof value === "object") {
        try {
          formData.append(key, JSON.stringify(value));
        } catch {
          // Fallback: send a safe minimal representation
          formData.append(key, JSON.stringify(String(value)));
        }
      } else {
        formData.append(key, String(value));
      }
    });

    // Append the cover image last
    if (bannerFile) {
      formData.append("cover_image", bannerFile);
    }

    // Debug: reveal FormData entries in dev to help reproduce JSON validation issues
    try {
      // Only log in non-production environments
      if (process.env.NODE_ENV !== "production") {
        console.debug("EventEditor: FormData entries:");
        for (const entry of Array.from(formData.entries())) {
          // Avoid logging binary blobs fully
          const val = entry[1] instanceof File ? `(File) ${entry[1].name}` : entry[1];
          console.debug(entry[0], val);
        }
      }
    } catch {
      // ignore logging errors
    }

    return formData;
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatusMessage(null);
    setFieldErrors({});

    if (!values.organizing_club) {
      setFieldErrors({ organizing_club: ["Please select an organizing club."] });
      toast.error("Organizing club is required.");
      return;
    }

    if (!values.booking_id) {
      setFieldErrors({ booking: ["Please select an approved venue booking to proceed."] });
      toast.error("An approved booking is required to organize an event.");
      return;
    }

    const payload = buildPayload();
    console.log("EventEditor: Submitting payload:", payload);
    setStatusMessage("");

    try {
      if (mode === "create") {
        const result = await createEventMutation.mutateAsync(payload);
        console.log("EventEditor: Create success:", result);
        toast.success("Event created successfully!");
        router.push("/events");
        router.refresh();
      } else if (eventId) {
        const result = await updateEventMutation.mutateAsync({ id: eventId, data: payload });
        console.log("EventEditor: Update success:", result);
        toast.success("Event updated successfully!");
      } else {
        console.error("EventEditor: update called without eventId");
        setStatusMessage("Error: Missing event ID for update.");
      }
    } catch (error) {
      console.error("EventEditor: Submit error caught:", error);
      const err = error as UnknownError;
      let details: Record<string, string[]> | undefined;
      let message = "Unable to save event. Please try again.";

      if (err?.payload) {
        details = err.payload.details;
        message = err.payload.message || message;
      } else if (err?.response?.data) {
        details = (err.response.data as { details?: Record<string, string[]>; message?: string })?.details;
        message = (err.response.data as { message?: string })?.message || message;
      } else if (err?.details) {
        details = err.details;
        message = err.message || message;
      } else if (typeof err?.message === "string") {
        try {
          const parsed = JSON.parse(err.message);
          details = parsed.details;
          message = parsed.message || message;
        } catch {
          message = err.message || message;
        }
      }

      if (details && typeof details === "object") {
        const normalized: Record<string, string[]> = {};
        for (const [k, v] of Object.entries(details)) {
          normalized[k] = v;
          const snake = k.replace(/([A-Z])/g, "_$1").toLowerCase();
          normalized[snake] = v;
          const camel = snake.replace(/_([a-z])/g, (_, c) => c.toUpperCase());
          normalized[camel] = v;
        }
        setFieldErrors(normalized);
        setStatusMessage("Please fix the highlighted fields.");
      } else {
        setStatusMessage(message);
      }
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5 sm:space-y-6">
      <nav aria-label="Breadcrumb" className="flex flex-wrap items-center gap-1.5 text-sm text-gray-400">
        <Link href="/dashboard" className="font-medium text-[#c49a22] hover:underline">
          Dashboard
        </Link>
        <ChevronRight size={14} />
        <Link href="/events" className="text-gray-500 hover:text-gray-700">
          Events
        </Link>
        <ChevronRight size={14} />
        <span className="text-gray-500">{title}</span>
      </nav>

      <header className="space-y-1">
        <h1 className="text-[28px] font-bold tracking-tight text-[#1f2a44] sm:text-[34px]">{title}</h1>
        <p className="text-sm text-gray-500">{subtitle}</p>
      </header>

      {isPreFilling && (
        <div className="flex items-center justify-center gap-3 rounded-[10px] border border-[#c49a22]/20 bg-[#fdf8ec] p-6 text-[#c49a22]">
          <Loader2 className="h-5 w-5 animate-spin" />
          <p className="text-sm font-semibold">Syncing with your approved booking details...</p>
        </div>
      )}

      <section className="rounded-[10px] border border-gray-200 bg-white p-4 shadow-sm">
        <div className="flex items-center justify-between gap-2">
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-gray-500">Progress</p>
          <p className="text-xs font-semibold text-[#c49a22]">{completionPercent}%</p>
        </div>
        <div className="mt-2 h-2 overflow-hidden rounded-full bg-gray-100">
          <div
            className="h-full rounded-full bg-linear-to-r from-[#c49a22] to-[#d3ac44] transition-all"
            style={{ width: `${completionPercent}%` }}
          />
        </div>
      </section>

      <section className="rounded-[10px] border border-gray-200 bg-white p-4 shadow-sm sm:p-5">
        <div className="flex flex-wrap items-center gap-2">
          <span className="inline-flex h-7 w-7 items-center justify-center rounded-md bg-[#fdf8ec] text-[#c49a22]">
            <Info size={14} />
          </span>
          <h2 className="text-xl font-bold text-[#1f2a44] sm:text-2xl">Basic Information</h2>
        </div>

        <div className="mt-4 space-y-4">
          <div>
            <label htmlFor="title" className="mb-1.5 block text-xs font-semibold text-gray-700">
              Event Title
            </label>
            <Input
              id="title"
              value={values.title}
              onChange={(event) => updateField("title", event.target.value)}
              placeholder="e.g. Annual Tech Expo 2024"
              className={controlClassName}
            />
            {fieldErrors.title && (
              <p className="mt-1 text-xs text-red-500">{fieldErrors.title.join(" ")}</p>
            )}
          </div>

          <div>
            <label className="mb-1.5 block text-xs font-semibold text-gray-700">Organizing Club</label>
            <DropdownSelect
              label=""
              value={values.organizing_club}
              options={[
                { value: "", label: "Select the organizing club" },
                ...(clubsData?.data || []).map((c: Club) => ({ value: c.id, label: c.name }))
              ]}
              onValueChange={(value) => {
                updateField("organizing_club", value);
                // Reset booking if club changes as it might not belong to the new club
                if (values.booking_id) {
                  updateField("booking_id", undefined);
                }
              }}
              className="[&>div>button]:h-10 [&>div>button]:rounded-[8px]"
            />
            {fieldErrors.organizing_club && (
              <p className="mt-1 text-xs text-red-500">{fieldErrors.organizing_club.join(" ")}</p>
            )}
          </div>

          <div className="rounded-[10px] border border-gray-200 bg-gray-50 px-4 py-3">
            <div className="space-y-3">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="text-xs font-semibold text-gray-700">Effective Display Status</p>
                  <p className="mt-0.5 text-[10px] text-gray-500">How the status currently appears to students based on schedule and overrides.</p>
                </div>
                <span className="inline-flex items-center rounded-full bg-[#fdf8ec] px-3 py-1 text-xs font-semibold text-[#c49a22]">
                  {getEventStatusLabel(previewStatus)}
                </span>
              </div>
              
              <div className="pt-2 border-t border-gray-200">
                <label className="mb-1.5 block text-xs font-semibold text-gray-700">Manual Status Override</label>
                <DropdownSelect
                  label=""
                  value={values.status}
                  options={[
                    { value: "upcoming", label: "Automatic (Follow Schedule)" },
                    { value: "live-now", label: "Force Live Now" },
                  ]}
                  onValueChange={(value) => updateField("status", value)}
                  className="[&>div>button]:h-9 [&>div>button]:rounded-[6px] bg-white"
                />
              </div>
            </div>
          </div>

          <RichTextEditor
            label="Short Description"
            value={values.short_description}
            onChange={(val) => updateField("short_description", val)}
            placeholder="Provide a short description of the event..."
            minHeight="80px"
            error={fieldErrors.short_description}
          />

          <RichTextEditor
            label="About The Event"
            value={values.description}
            onChange={(val) => updateField("description", val)}
            placeholder="Provide a detailed description of the event..."
            minHeight="150px"
            error={fieldErrors.description}
          />

          <div>
            <p className="mb-1.5 text-xs font-semibold text-gray-700">Event Banner</p>
            <FileUpload
              label=""
              helperText="Upload a file or drag and drop"
              file={bannerFile}
              previewUrl={values.cover_image || undefined}
              fileName={bannerFile?.name}
              onChange={(file) => {
                setBannerFile(file);
                if (file) {
                  updateField("cover_image", ""); // clear string url if uploading new file
                }
              }}
              onClear={() => {
                setBannerFile(null);
                updateField("cover_image", "");
              }}
              className="[&>label]:min-h-[120px] [&>label]:rounded-[10px]"
            />
            {(fieldErrors.cover_image || fieldErrors.coverImage) && (
              <p className="mt-1 text-xs text-red-500">{(fieldErrors.cover_image || fieldErrors.coverImage).join(" ")}</p>
            )}
            <p className="mt-1 text-[11px] text-gray-400">Recommended size: 1200×630px for optimal social sharing.</p>
          </div>

          <div>
            <label htmlFor="registrationLink" className="mb-1.5 block text-xs font-semibold text-gray-700">
              Event Registration Link
            </label>
            <Input
              id="registrationLink"
              value={values.registration_link}
              onChange={(event) => updateField("registration_link", event.target.value)}
              placeholder="e.g. https://aastu.edu.et/waitlist"
              className={controlClassName}
            />
            {fieldErrors.registration_link && (
              <p className="mt-1 text-xs text-red-500">{fieldErrors.registration_link.join(" ")}</p>
            )}
          </div>
        </div>
      </section>

      <section className="rounded-[10px] border border-gray-200 bg-white p-4 shadow-sm sm:p-5">
        <div className="flex flex-wrap items-center gap-2">
          <span className="inline-flex h-7 w-7 items-center justify-center rounded-md bg-[#fdf8ec] text-[#c49a22]">
            <Clock3 size={14} />
          </span>
          <h2 className="text-xl font-bold text-[#1f2a44] sm:text-2xl">Logistics &amp; Schedule</h2>
        </div>

        <div className="mt-4 space-y-4">
          <div className="md:col-span-2">
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-xs font-semibold text-[#c49a22]">
                Select Approved Booking <span className="text-red-500">*</span>
                <span className="ml-2 text-[10px] font-normal opacity-70">(Required)</span>
              </label>
              <Link 
                href={`/bookings/new${values.organizing_club ? `?clubId=${values.organizing_club}` : ''}`}
                className="text-[10px] font-bold text-[#c49a22] hover:underline flex items-center gap-1"
              >
                <Plus size={10} />
                Create New Booking
              </Link>
            </div>
            <DropdownSelect
              label=""
              value={values.booking_id || ""}
              options={[
                { value: "", label: "Choose an approved venue booking..." },
                ...(approvedBookings?.data || []).map((b: BookingListItem) => ({
                  value: b.id,
                  label: `${b.event_title || 'Untitled Request'} — ${b.venue_name} (${b.date_label})`
                }))
              ]}
              onValueChange={(value) => handleBookingSelect(value)}
              className="[&>div>button]:h-11 [&>div>button]:rounded-[10px] border-[#c49a22]/30 shadow-sm"
              disabled={isBookingsLoading || isPreFilling}
            />
            {isBookingsLoading && <p className="mt-1.5 text-[10px] text-gray-400 flex items-center gap-1"><Loader2 size={10} className="animate-spin" /> Fetching your approved bookings...</p>}
            {fieldErrors.booking && <p className="mt-1 text-xs text-red-500">{fieldErrors.booking.join(" ")}</p>}
          </div>

          {values.booking_id ? (
            <div className="grid gap-4 rounded-[12px] border border-[#c49a22]/20 bg-[#fdf8ec]/30 p-5">
              <div className="flex items-center justify-between border-b border-[#c49a22]/10 pb-3 mb-1">
                <h3 className="text-sm font-bold text-[#c49a22] flex items-center gap-2">
                  <CheckCircle2 size={16} />
                  Linked Booking Details
                </h3>
                <Button 
                  type="button" 
                  variant="ghost" 
                  size="sm" 
                  className="h-7 text-[10px] font-bold uppercase tracking-wider text-red-500 hover:bg-red-50 hover:text-red-600"
                  onClick={() => updateField("booking_id", undefined)}
                >
                  Unlink
                </Button>
              </div>
              
              <div className="grid gap-y-4 sm:grid-cols-2 sm:gap-x-8">
                <div className="space-y-1">
                  <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Venue & Location</p>
                  <p className="text-sm font-semibold text-[#1f2a44]">{typeof values.logistics.venue === 'string' ? values.logistics.venue : (values.logistics.venue ? String(values.logistics.venue) : 'No venue set')}</p>
                  <p className="text-xs text-gray-500">{values.physical_location_details || 'No specific location details'}</p>
                </div>

                <div className="space-y-2 sm:col-span-2">
                  <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Schedule (Editable)</p>
                  <div className="grid gap-2 sm:grid-cols-2">
                    <div>
                      <label className="text-[10px] font-semibold text-gray-600">Start Date & Time</label>
                      <Input
                        type="datetime-local"
                        value={utcToEventDateTime(values.start_date_time)}
                        onChange={(e) => updateField("start_date_time", e.target.value ? eventDateTimeToUtc(e.target.value) : "")}
                        className={controlClassName}
                      />
                    </div>
                    <div>
                      <label className="text-[10px] font-semibold text-gray-600">End Date & Time</label>
                      <Input
                        type="datetime-local"
                        value={utcToEventDateTime(values.end_date_time)}
                        onChange={(e) => updateField("end_date_time", e.target.value ? eventDateTimeToUtc(e.target.value) : "")}
                        className={controlClassName}
                      />
                    </div>
                  </div>
                  <div className="rounded-lg border border-gray-200 bg-white p-3 mt-1">
                    <div className="flex flex-col gap-2">
                      <div className="flex items-center gap-2">
                        <Clock3 size={12} className="text-[#c49a22]" />
                        <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">Localized Time Preview</span>
                      </div>
                      <div className="flex flex-wrap items-center gap-x-4 gap-y-1">
                        <div className="flex flex-col">
                          <span className="text-[10px] text-gray-400">Start</span>
                          <span className="text-xs font-semibold text-[#1f2a44]">{formatDisplayDate(values.start_date_time) || "Not set"}</span>
                        </div>
                        <ChevronRight size={14} className="text-gray-300 mt-2" />
                        <div className="flex flex-col">
                          <span className="text-[10px] text-gray-400">End</span>
                          <span className="text-xs font-semibold text-[#1f2a44]">{formatDisplayDate(values.end_date_time) || "Not set"}</span>
                        </div>
                      </div>
                      <p className="text-[10px] text-gray-400 mt-1 italic">
                        Note: Times are automatically converted to Africa/Addis_Ababa (+03:00) for all users.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="space-y-1">
                  <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Attendance Capacity</p>
                  <p className="text-sm font-semibold text-[#1f2a44]">{values.max_capacity} Participants</p>
                </div>

                <div className="space-y-1">
                  <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Equipment Requested</p>
                  <p className="text-sm font-semibold text-[#1f2a44]">{typeof values.logistics.equipment === 'string' ? values.logistics.equipment : (Array.isArray(values.logistics.equipment) ? values.logistics.equipment.join(", ") : 'None requested')}</p>
                </div>
              </div>

              {/* Required Amenities Selector */}
              {Array.isArray(values.logistics?.amenities) && values.logistics.amenities.length > 0 && (
                <div className="mt-2 border-t border-[#c49a22]/10 pt-4">
                  <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-2">Required Amenities</p>
                  <div className="flex flex-wrap gap-2">
                    {((values.logistics.amenities as unknown[]) || []).map((a, idx) => {
                      const key = String(a);
                      const selected = Array.isArray(values.logistics?.selected_amenities) && (values.logistics.selected_amenities as unknown[]).includes(a);
                      return (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => {
                            const prevLogistics = Array.isArray(values.logistics) ? (values.logistics[0] || {}) : (values.logistics || {});
                            const current = Array.isArray(prevLogistics?.selected_amenities) ? [...(prevLogistics.selected_amenities as unknown[])] : [];
                            const idxExist = current.findIndex((c) => String(c) === key);
                            const next = idxExist === -1 ? [...current, key] : current.filter(c => String(c) !== key);
                            updateField("logistics", { ...prevLogistics, selected_amenities: next });
                          }}
                          className={cn(
                            "inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-[11px] font-medium transition-all border",
                            selected 
                              ? "bg-[#c49a22] border-[#c49a22] text-white shadow-sm" 
                              : "bg-white border-gray-200 text-gray-600 hover:border-[#c49a22]/40"
                          )}
                        >
                          {selected && <CheckCircle2 size={10} />}
                          {key}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="rounded-[12px] border border-gray-200 bg-white p-5 space-y-4">
               <div>
                 <p className="text-sm font-semibold text-gray-700 mb-3">Manual Schedule (Optional)</p>
                 <p className="text-xs text-gray-500 mb-3">You can set event dates manually, or select a booking above to auto-fill</p>
                 <div className="grid gap-4 sm:grid-cols-2">
                   <div>
                     <label className="text-[10px] font-semibold text-gray-600 mb-1.5 block">Start Date & Time</label>
                     <Input
                       type="datetime-local"
                       value={utcToEventDateTime(values.start_date_time)}
                       onChange={(e) => updateField("start_date_time", e.target.value ? eventDateTimeToUtc(e.target.value) : "")}
                       className={controlClassName}
                     />
                   </div>
                   <div>
                     <label className="text-[10px] font-semibold text-gray-600 mb-1.5 block">End Date & Time</label>
                     <Input
                       type="datetime-local"
                       value={utcToEventDateTime(values.end_date_time)}
                       onChange={(e) => updateField("end_date_time", e.target.value ? eventDateTimeToUtc(e.target.value) : "")}
                       className={controlClassName}
                     />
                   </div>
                 </div>
                 <div className="rounded-lg border border-gray-200 bg-gray-50 p-3 mt-3">
                   <div className="flex flex-col gap-2">
                     <div className="flex items-center gap-2">
                       <Clock3 size={12} className="text-[#c49a22]" />
                       <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">Localized Time Preview</span>
                     </div>
                     <div className="flex flex-wrap items-center gap-x-4 gap-y-1">
                       <div className="flex flex-col">
                         <span className="text-[10px] text-gray-400">Start</span>
                         <span className="text-xs font-semibold text-[#1f2a44]">{formatDisplayDate(values.start_date_time) || "Not set"}</span>
                       </div>
                       <ChevronRight size={14} className="text-gray-300 mt-2" />
                       <div className="flex flex-col">
                         <span className="text-[10px] text-gray-400">End</span>
                         <span className="text-xs font-semibold text-[#1f2a44]">{formatDisplayDate(values.end_date_time) || "Not set"}</span>
                       </div>
                     </div>
                   </div>
                 </div>
               </div>
               {fieldErrors.start_date_time && <p className="text-xs text-red-500 mb-1">{fieldErrors.start_date_time.join(" ")}</p>}
               {fieldErrors.end_date_time && <p className="text-xs text-red-500 mb-1">{fieldErrors.end_date_time.join(" ")}</p>}
               {fieldErrors.max_capacity && <p className="text-xs text-red-500">{fieldErrors.max_capacity.join(" ")}</p>}
            </div>
          )}
        </div>
      </section>

      <section className="rounded-[10px] border border-gray-200 bg-white p-4 shadow-sm sm:p-5">
        <div className="flex items-center justify-between gap-2">
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex h-7 w-7 items-center justify-center rounded-md bg-[#fdf8ec] text-[#c49a22]">
              <UserPlus2 size={14} />
            </span>
            <h2 className="text-xl font-bold text-[#1f2a44] sm:text-2xl">Assign Volunteers</h2>
            <span className="text-sm text-gray-400">(Optional)</span>
          </div>

          {values.volunteers.length > 0 ? (
            <button
              type="button"
              onClick={() => updateField("volunteers", [])}
              className="inline-flex h-8 w-8 items-center justify-center rounded-md text-red-400 transition-colors hover:bg-red-50 hover:text-red-500"
              aria-label="Clear volunteers"
            >
              <Trash2 size={14} />
            </button>
          ) : null}
        </div>

        <div className="mt-4 grid gap-3 md:grid-cols-2">
          <div>
            <label htmlFor="volunteerFullName" className="mb-1.5 block text-xs font-semibold text-gray-700">
              Full Name
            </label>
            <Input
              id="volunteerFullName"
              value={volunteerDraft.full_name}
              onChange={(event) => updateVolunteerDraft("full_name", event.target.value)}
              placeholder="Abebe Bekele"
              className={controlClassName}
            />
          </div>

          <div>
            <label htmlFor="volunteerId" className="mb-1.5 block text-xs font-semibold text-gray-700">
              ID
            </label>
            <Input
              id="volunteerId"
              value={volunteerDraft.student_id}
              onChange={(event) => updateVolunteerDraft("student_id", event.target.value)}
              placeholder="ETS1234/15"
              className={controlClassName}
            />
          </div>

          <div>
            <label htmlFor="volunteerPhone" className="mb-1.5 block text-xs font-semibold text-gray-700">
              Phone Number
            </label>
            <Input
              id="volunteerPhone"
              value={volunteerDraft.phone}
              onChange={(event) => updateVolunteerDraft("phone", event.target.value)}
              placeholder="+251912344555"
              className={controlClassName}
            />
          </div>

          <div>
            <label htmlFor="volunteerEmail" className="mb-1.5 block text-xs font-semibold text-gray-700">
              Email
            </label>
            <Input
              id="volunteerEmail"
              type="email"
              value={volunteerDraft.email}
              onChange={(event) => updateVolunteerDraft("email", event.target.value)}
              placeholder="abebe.bekele@aastustudent.edu.et"
              className={controlClassName}
            />
          </div>

          <div className="md:col-span-2 lg:max-w-[460px]">
            <label htmlFor="volunteerRole" className="mb-1.5 block text-xs font-semibold text-gray-700">
              Role
            </label>
            <Input
              id="volunteerRole"
              value={volunteerDraft.role}
              onChange={(event) => updateVolunteerDraft("role", event.target.value)}
              placeholder="Enter the role of the volunteer"
              className={controlClassName}
            />
          </div>
        </div>


        {values.volunteers.length > 0 ? (
          <div className="mt-4 max-h-[400px] overflow-auto rounded-[8px] border border-gray-100">
            <table className="min-w-full text-sm border-collapse">
              <thead className="sticky top-0 z-10 bg-[#fafbff] shadow-[inset_0_-1px_0_rgba(0,0,0,0.1)]">
                <tr>
                  <th className="px-3 py-2 text-left font-semibold text-gray-700">Full Name</th>
                  <th className="px-3 py-2 text-left font-semibold text-gray-700">ID</th>
                  <th className="px-3 py-2 text-left font-semibold text-gray-700">Phone</th>
                  <th className="px-3 py-2 text-left font-semibold text-gray-700">Email</th>
                  <th className="px-3 py-2 text-left font-semibold text-gray-700">Role</th>
                  <th className="px-3 py-2 text-left font-semibold text-gray-700">Status</th>
                  <th className="px-3 py-2"></th>
                </tr>
              </thead>
              <tbody>
                {values.volunteers.map((item, index) => (
                  <tr key={item.id || index} className={index % 2 === 0 ? "bg-white" : "bg-[#fafbff]"}>
                    <td className="px-3 py-2 font-medium text-gray-700">{item.full_name}</td>
                    <td className="px-3 py-2">{item.student_id}</td>
                    <td className="px-3 py-2">{item.phone}</td>
                    <td className="px-3 py-2">{item.email}</td>
                    <td className="px-3 py-2">{item.role}</td>
                    <td className="px-3 py-2">{item.is_active ? <span className="text-green-600">Active</span> : <span className="text-gray-400">Inactive</span>}</td>
                    <td className="px-3 py-2 flex gap-1">
                      <button
                        type="button"
                        onClick={() => editVolunteer(item.id)}
                        className="inline-flex h-7 w-7 items-center justify-center rounded-md text-blue-400 transition-colors hover:bg-blue-50 hover:text-blue-500"
                        aria-label={`Edit ${item.full_name}`}
                      >
                        <span className="sr-only">Edit</span>
                        <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M15.232 5.232l3.536 3.536M9 11l6 6M3 17.25V21h3.75l11.06-11.06a1.5 1.5 0 0 0-2.12-2.12L3 17.25z" /></svg>
                      </button>
                      <button
                        type="button"
                        onClick={() => removeVolunteer(item.id)}
                        className="inline-flex h-7 w-7 items-center justify-center rounded-md text-red-400 transition-colors hover:bg-red-50 hover:text-red-500"
                        aria-label={`Remove ${item.full_name}`}
                      >
                        <Trash2 size={13} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : null}

        <div className="mt-4 flex justify-end gap-2">
          {editVolunteerId && (
            <Button type="button" variant="outline" className="h-10 rounded-[8px] px-4" onClick={() => {
              setEditVolunteerId(null);
              setVolunteerDraft({ full_name: "", student_id: "", phone: "", email: "", role: "", is_active: true });
            }}>
              Cancel Edit
            </Button>
          )}
          <Button type="button" variant="goldSolid" className="h-10 rounded-[8px] px-4" onClick={addVolunteer}>
            <PlusCircle size={14} />
            {editVolunteerId ? "Save Volunteer" : "Add Volunteer"}
          </Button>
        </div>
      </section>

      <section className="rounded-[10px] border border-gray-200 bg-white p-4 shadow-sm sm:p-5">
        <div className="flex flex-wrap items-center gap-2">
          <span className="inline-flex h-7 w-7 items-center justify-center rounded-md bg-[#fdf8ec] text-[#c49a22]">
            <Settings2 size={14} />
          </span>
          <h2 className="text-xl font-bold text-[#1f2a44] sm:text-2xl">Event Settings</h2>
        </div>

        <div className="mt-4 space-y-3">
          <div className="flex items-center justify-between rounded-[8px] bg-[#f8fafc] px-3 py-2.5">
            <div>
              <p className="font-semibold text-gray-700">Mega Event</p>
              <p className="text-xs text-gray-500">Highlight this event as a high-priority campus activity.</p>
            </div>
            <Switch checked={values.is_mega_event} onCheckedChange={(checked) => updateField("is_mega_event", checked)} />
          </div>

          <div className="flex items-center justify-between rounded-[8px] bg-[#f8fafc] px-3 py-2.5">
            <div>
              <p className="font-semibold text-gray-700">Archive Status</p>
              <p className="text-xs text-gray-500">Hide this event from public views initially.</p>
            </div>
            <Switch checked={values.is_archived} onCheckedChange={(checked) => updateField("is_archived", checked)} />
          </div>
        </div>
      </section>

      {statusMessage ? (
        <section className="rounded-[10px] border border-[#c49a22]/30 bg-[#fdf8ec] p-4 text-sm text-[#896814]">
          {statusMessage}
        </section>
      ) : null}

      <section className="border-t border-gray-200 pt-4">
        <div className="flex flex-wrap items-center justify-end gap-2">
          <Button type="button" variant="outline" className="h-10 rounded-[8px] px-4" onClick={() => window.history.back()}>
            Cancel Changes
          </Button>
          <Button type="button" variant="gold" className="h-10 rounded-[8px] px-4" disabled={isSubmitting}>
            Save as Draft
          </Button>
          <Button type="submit" variant="goldSolid" className="h-10 rounded-[8px] px-4" disabled={isSubmitting}>
            {isSubmitting ? "Saving..." : isCreate ? "Publish Event" : "Save Changes"}
          </Button>
        </div>
      </section>
    </form>
  );
}
