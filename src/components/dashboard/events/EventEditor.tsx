"use client";

import { useMemo, useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { toast } from "sonner";
import {
  Bold,
  Italic,
  List,
  ListOrdered,
  Type,
  Layout,
  Plus,
  Trash2,
  Save,
  X,
  PlusCircle,
  Calendar,
  Clock,
  MapPin,
  Users,
  Image as ImageIcon,
  ChevronRight,
  Info,
  CheckCircle2,
  AlertCircle,
  Link as LinkIcon,
  Clock3,
  Settings2,
  UserPlus2,
  Loader2,
} from "lucide-react";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { RichTextEditor } from "@/components/ui/RichTextEditor";
import { DropdownSelect } from "@/components/ui/DropdownSelect";
import { FileUpload } from "@/components/ui/FileUpload";
import { Switch } from "@/components/ui/Switch";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";
import { useCreateEvent, useUpdateEvent } from "@/hooks/useEvents";
import { useBookings } from "@/hooks/useBookings";
import { useClubs } from "@/hooks/useClubs";
import { venueService } from "@/api/services/venue.service";
import { bookingService } from "@/api/services/booking.service";

// --- Editable Volunteers & User-Friendly Logistics UI ---

// Define the editable fields for logistics (customize as needed)
const defaultLogisticsFields = [
  { key: "venue", label: "Venue Name", type: "text" },
  { key: "equipment", label: "Equipment Needed", type: "text" },
  { key: "team", label: "Team Required", type: "number" },
  { key: "notes", label: "Notes", type: "text" },
];

// Helper to format date for datetime-local input
function formatDateTimeLocal(value: string) {
  if (!value) return "";
  const d = new Date(value);
  if (isNaN(d.getTime())) return "";
  const pad = (n: number) => n.toString().padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

function formatDisplayDate(isoString: string) {
  if (!isoString) return "Not set";
  try {
    const d = new Date(isoString);
    if (isNaN(d.getTime())) return isoString;
    return d.toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  } catch {
    return isoString;
  }
}
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
  const searchParams = useSearchParams();
  const bookingId = searchParams.get("bookingId");

  // --- Volunteers Edit State ---
  const [editVolunteerId, setEditVolunteerId] = useState<string | null>(null);
  const [venues, setVenues] = useState<Array<{ id: string; name: string }>>([]);
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
  const { data: approvedBookings, isLoading: isBookingsLoading } = useBookings(1, 100, "approved", values.organizing_club);
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
    [values.end_date_time, values.short_description, values.start_date_time, values.title, values.status]
  );

  const completionPercent = Math.round(
    (completionItems.filter((item) => item.done).length / completionItems.length) * 100
  );


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
  useEffect(() => {
    const effectiveBookingId = values.booking_id;
    if (effectiveBookingId && !values.logistics.venue) {
      handleBookingSelect(effectiveBookingId, mode === "create");
    }
  }, [values.booking_id, mode]);

  // Fetch venues list on mount
  useEffect(() => {
    let mounted = true;
    venueService.getVenues(1, 100)
      .then((res) => {
        if (!mounted) return;
        const items = Array.isArray(res?.data)
          ? res.data.map((v) => ({ id: String(v.id), name: String(v.name) }))
          : [];
        setVenues(items);
      })
      .catch((err) => {
        console.error("Failed to fetch venues:", err);
      });
    return () => {
      mounted = false;
    };
  }, []);

  async function handleBookingSelect(bookingId: string, overwriteContent = true) {
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
          // Only overwrite content if explicitly requested (usually on creation or manual selection)
          title: overwriteContent ? (booking.event_title || prev.title) : prev.title,
          description: overwriteContent ? (booking.purpose || prev.description) : prev.description,
          short_description: overwriteContent ? (booking.purpose ? (booking.purpose.length > 100 ? booking.purpose.substring(0, 97) + "..." : booking.purpose) : prev.short_description) : prev.short_description,
          physical_location_details: booking.venue_name || prev.physical_location_details,
          max_capacity: booking.expected_attendance || venueData?.maxCapacity || prev.max_capacity,
          start_date_time: booking.start_date || prev.start_date_time,
          end_date_time: booking.end_date || prev.end_date_time,
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
  }

  async function handleVenueSelect(venueId: string) {
    if (!venueId) return;
    try {
      const data = await venueService.getVenue(venueId);
      if (data) {
        // Import amenities and basic location details into logistics
        updateField("physical_location_details", data.location || values.physical_location_details);
        if (typeof data.maxCapacity === "number") {
          updateField("max_capacity", Number(data.maxCapacity));
        }
        const prevLogistics = Array.isArray(values.logistics) ? (values.logistics[0] || {}) : (values.logistics || {});
        updateField("logistics", { ...prevLogistics, amenities: data.amenities || [], selected_amenities: [], venue: data.name, venue_id: data.id });
      }
    } catch {
      // ignore
    }
  }

  function buildPayload() {
    // Always send attendance with required keys
    const attendance = {
      current: values.attendance?.current ?? 0,
      capacity: values.attendance?.capacity ?? values.max_capacity ?? 0,
      waitlist: values.attendance?.waitlist ?? 0,
      vips: values.attendance?.vips ?? 0,
    };

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
      logistics: Array.isArray(values.logistics) ? values.logistics : [values.logistics],
      attendance,
      volunteers: values.volunteers,
      booking: values.booking_id,
      organizing_club: values.organizing_club,
    };

    if (!bannerFile) {
      return payload;
    }

    // Always use FormData for file upload
    const formData = new FormData();
    Object.entries(payload).forEach(([key, value]) => {
      if (value === undefined || value === null) return;
      if (typeof value === "object") {
        formData.append(key, JSON.stringify(value));
      } else {
        formData.append(key, String(value));
      }
    });
    if (bannerFile) {
      formData.append("cover_image", bannerFile);
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
      const err = error as any;
      let details: Record<string, string[]> | undefined;
      let message = "Unable to save event. Please try again.";

      if (err?.payload) {
        details = err.payload.details;
        message = err.payload.message || message;
      } else if (err?.response?.data) {
        details = err.response.data.details;
        message = err.response.data.message || message;
      } else if (err?.details) {
        details = err.details;
        message = err.message || message;
      } else if (typeof err?.message === "string") {
        try {
          const parsed = JSON.parse(err.message);
          details = parsed.details;
          message = parsed.message || message;
        } catch {
          message = err.message;
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
                ...(clubsData?.data || []).map(c => ({ value: c.id, label: c.name }))
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

          <DropdownSelect
            label="Event Status"
            value={values.status}
            options={[
              { value: "upcoming", label: "Upcoming" },
              { value: "live-now", label: "Live Now" },
              { value: "archived", label: "Archived" },
            ]}
            onValueChange={(value) => updateField("status", value)}
            className="[&>div>button]:h-10 [&>div>button]:rounded-[8px]"
          />

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
                ...(approvedBookings?.data || []).map(b => ({
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

                <div className="space-y-1">
                  <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Schedule</p>
                  <p className="text-sm font-semibold text-[#1f2a44]">
                    {formatDisplayDate(values.start_date_time)}
                  </p>
                  <p className="text-xs text-gray-500">to {formatDisplayDate(values.end_date_time)}</p>
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
            <div className="rounded-[12px] border-2 border-dashed border-gray-200 p-10 text-center bg-gray-50/50">
               <div className="mx-auto w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center text-gray-400 mb-4">
                 <LinkIcon size={24} />
               </div>
               <p className="text-base font-semibold text-gray-600">No Booking Linked</p>
               <p className="text-sm text-gray-400 mt-1 mb-6">Select an approved venue booking above to automatically load the schedule and location details.</p>
               {fieldErrors.start_date_time && <p className="text-xs text-red-500 mb-1">{fieldErrors.start_date_time.join(" ")}</p>}
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
