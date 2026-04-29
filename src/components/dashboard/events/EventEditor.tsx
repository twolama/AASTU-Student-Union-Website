"use client";

import { useMemo, useState, useEffect } from "react";
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
import { DropdownSelect } from "@/components/ui/DropdownSelect";
import { FileUpload } from "@/components/ui/FileUpload";
import { Switch } from "@/components/ui/Switch";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";
import { useCreateEvent, useUpdateEvent } from "@/hooks/useEvents";
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
    logistics: initialValues.logistics || {},
    attendance: initialValues.attendance || {},
    volunteers: initialValues.volunteers || [],
    booking_id: bookingId || initialValues.booking_id || undefined,
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
      { label: "Logistics", done: Boolean(values.start_date_time && values.end_date_time) },
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

  // Pre-fill from booking if bookingId is present
  useEffect(() => {
    if (mode === "create" && bookingId) {
      setIsPreFilling(true);
      bookingService.getBooking(bookingId)
        .then((booking) => {
          setValues((prev) => ({
            ...prev,
            title: booking.event_title || prev.title,
            description: booking.purpose || prev.description,
            short_description: booking.purpose ? (booking.purpose.length > 100 ? booking.purpose.substring(0, 97) + "..." : booking.purpose) : prev.short_description,
            physical_location_details: booking.venue_name || prev.physical_location_details,
            max_capacity: booking.expected_attendance || prev.max_capacity,
            start_date_time: booking.start_date || prev.start_date_time,
            end_date_time: booking.end_date || prev.end_date_time,
            logistics: {
              ...prev.logistics,
              venue: booking.venue_name,
              venue_id: booking.venue,
              booking_id: booking.id,
              equipment: booking.equipment_requested.join(", "),
            }
          }));
          toast.success("Pre-filled details from your booking!");
        })
        .catch((err) => {
          console.error("Failed to pre-fill from booking:", err);
          toast.error("Could not load booking details");
        })
        .finally(() => {
          setIsPreFilling(false);
        });
    }
  }, [mode, bookingId]);

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
        updateField("logistics", { ...values.logistics, amenities: data.amenities || [], selected_amenities: [], venue: data.name, venue_id: data.id });
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
      formData.append("coverImage", bannerFile);
    }
    return formData;
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatusMessage(null);
    setFieldErrors({});

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

          <div>
            <label htmlFor="shortDescription" className="mb-1.5 block text-xs font-semibold text-gray-700">
              Short Description
            </label>
            <div className="rounded-[8px] border border-gray-200 bg-white shadow-sm">
              <div className="flex items-center gap-1 border-b border-gray-100 px-2 py-1.5">
                {[Bold, Italic, List, LinkIcon].map((Icon, index) => (
                  <button
                    key={`short-toolbar-${index}`}
                    type="button"
                    className="inline-flex h-7 w-7 items-center justify-center rounded-md text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600"
                    aria-label="Formatting action"
                  >
                    <Icon size={14} />
                  </button>
                ))}
              </div>
              <Textarea
                id="shortDescription"
                value={values.short_description}
                onChange={(event) => updateField("short_description", event.target.value)}
                placeholder="Provide a short description of the event..."
                className="min-h-[96px] rounded-none border-0 shadow-none focus:ring-0"
              />
              {fieldErrors.short_description && (
                <p className="mt-1 text-xs text-red-500">{fieldErrors.short_description.join(" ")}</p>
              )}
            </div>
          </div>

          <div>
            <label htmlFor="aboutEvent" className="mb-1.5 block text-xs font-semibold text-gray-700">
              About The Event
            </label>
            <div className="rounded-[8px] border border-gray-200 bg-white shadow-sm">
              <div className="flex items-center gap-1 border-b border-gray-100 px-2 py-1.5">
                {[Bold, Italic, List, LinkIcon].map((Icon, index) => (
                  <button
                    key={`about-toolbar-${index}`}
                    type="button"
                    className="inline-flex h-7 w-7 items-center justify-center rounded-md text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600"
                    aria-label="Formatting action"
                  >
                    <Icon size={14} />
                  </button>
                ))}
              </div>
              <Textarea
                id="description"
                value={values.description}
                onChange={(event) => updateField("description", event.target.value)}
                placeholder="Provide a detailed description of the event..."
                className="min-h-[150px] rounded-none border-0 shadow-none focus:ring-0"
              />
              {fieldErrors.description && (
                <p className="mt-1 text-xs text-red-500">{fieldErrors.description.join(" ")}</p>
              )}
            </div>
          </div>

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
            {fieldErrors.coverImage && (
              <p className="mt-1 text-xs text-red-500">{fieldErrors.coverImage.join(" ")}</p>
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

        <div className="mt-4 grid gap-3 md:grid-cols-2">
          <div>
            <label htmlFor="startDate" className="mb-1.5 block text-xs font-semibold text-gray-700">
              Start Date &amp; Time
            </label>
            <Input
              id="startDate"
              type="datetime-local"
              value={formatDateTimeLocal(values.start_date_time)}
              onChange={(event) => updateField("start_date_time", event.target.value)}
              className={controlClassName}
            />
            {fieldErrors.start_date_time && (
              <p className="mt-1 text-xs text-red-500">{fieldErrors.start_date_time.join(" ")}</p>
            )}
          </div>

          <div>
            <label htmlFor="endDate" className="mb-1.5 block text-xs font-semibold text-gray-700">
              End Date &amp; Time
            </label>
            <Input
              id="endDate"
              type="datetime-local"
              value={formatDateTimeLocal(values.end_date_time)}
              onChange={(event) => updateField("end_date_time", event.target.value)}
              className={controlClassName}
            />
            {fieldErrors.end_date_time && (
              <p className="mt-1 text-xs text-red-500">{fieldErrors.end_date_time.join(" ")}</p>
            )}
          </div>

          <div>
            <label className="mb-1.5 block text-xs font-semibold text-gray-700">Venue</label>
            <DropdownSelect
              label=""
              value={String(values.logistics?.venue_id ?? "")}
              options={[{ value: "", label: "Select a venue" }, ...venues.map((v) => ({ value: v.id, label: v.name }))]}
              onValueChange={(value) => handleVenueSelect(value)}
              className="[&>div>button]:h-10 [&>div>button]:rounded-[8px]"
            />
          </div>

          <div className="md:col-span-2">
            <label htmlFor="physicalLocation" className="mb-1.5 block text-xs font-semibold text-gray-700">
              Specific Physical Location Details
            </label>
            <Input
              id="physicalLocation"
              value={values.physical_location_details}
              onChange={(event) => updateField("physical_location_details", event.target.value)}
              placeholder="e.g. Block 45, Second floor, Room 204"
              className={controlClassName}
            />
            {fieldErrors.physical_location_details && (
              <p className="mt-1 text-xs text-red-500">{fieldErrors.physical_location_details.join(" ")}</p>
            )}
          </div>

          <div>
            <label htmlFor="maxCapacity" className="mb-1.5 block text-xs font-semibold text-gray-700">
              Max Capacity
            </label>
            <div className="flex items-center gap-2">
              <Input
                id="maxCapacity"
                type="number"
                min={0}
                value={values.max_capacity}
                onChange={(event) => updateField("max_capacity", Number(event.target.value))}
                placeholder="0"
                className={cn(controlClassName, "max-w-[160px]")}
              />
              {fieldErrors.max_capacity && (
                <p className="mt-1 text-xs text-red-500">{fieldErrors.max_capacity.join(" ")}</p>
              )}
              <span className="text-xs text-gray-500">Participants (Optional)</span>
            </div>
          </div>

          {/* Attendance fields */}
          <div className="md:col-span-2 grid grid-cols-2 gap-3 mt-2">
            <div>
              <label className="mb-1.5 block text-xs font-semibold text-gray-700">Current Attendance</label>
              <Input
                type="number"
                min={0}
                value={typeof values.attendance?.current === 'number' ? values.attendance.current : ''}
                onChange={e => updateField("attendance", { ...values.attendance, current: Number(e.target.value) })}
                className={controlClassName}
              />
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-semibold text-gray-700">Capacity</label>
              <Input
                type="number"
                min={0}
                value={typeof values.attendance?.capacity === 'number' ? values.attendance.capacity : (typeof values.max_capacity === 'number' ? values.max_capacity : '')}
                onChange={e => updateField("attendance", { ...values.attendance, capacity: Number(e.target.value) })}
                className={controlClassName}
              />
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-semibold text-gray-700">Waitlist</label>
              <Input
                type="number"
                min={0}
                value={typeof values.attendance?.waitlist === 'number' ? values.attendance.waitlist : ''}
                onChange={e => updateField("attendance", { ...values.attendance, waitlist: Number(e.target.value) })}
                className={controlClassName}
              />
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-semibold text-gray-700">VIPs</label>
              <Input
                type="number"
                min={0}
                value={typeof values.attendance?.vips === 'number' ? values.attendance.vips : ''}
                onChange={e => updateField("attendance", { ...values.attendance, vips: Number(e.target.value) })}
                className={controlClassName}
              />
            </div>
          </div>
          {fieldErrors.attendance && (
            <div className="md:col-span-2">
              <p className="mt-1 text-xs text-red-500">{fieldErrors.attendance.join(" ")}</p>
            </div>
          )}

          {/* Logistics field (user-friendly form + advanced JSON toggle) */}
          <div className="md:col-span-2 mt-2">
            <label className="mb-1.5 block text-xs font-semibold text-gray-700">Logistics</label>
            <div className="grid gap-3 md:grid-cols-2 bg-[#f8fafc] rounded p-3 mb-2">
              {defaultLogisticsFields.map((field) => (
                <div key={field.key}>
                  <label className="block text-xs font-semibold text-gray-700 mb-1.5">{field.label}</label>
                  <Input
                    type={field.type}
                    value={typeof values.logistics[field.key] === 'undefined' ? '' : String(values.logistics[field.key])}
                    disabled={!values.logistics?.venue_id}
                    onChange={e => {
                      let val = e.target.value;
                      // Remove leading zeros for numbers
                      if (field.type === 'number') {
                        val = val.replace(/^0+(\d)/, '$1');
                        if (val === '') val = '0';
                        if (/^\d+$/.test(val)) val = String(Number(val));
                      }
                      updateField("logistics", { ...values.logistics, [field.key]: field.type === 'number' ? Number(val) : val });
                    }}
                    placeholder={field.label}
                    className="rounded-[8px] h-10"
                  />
                </div>
              ))}
            </div>
            <p className="text-xs text-gray-500 mt-2">Select the required logistics and amenities below.</p>

            {/* Display imported amenities (if any) and allow selecting required amenities */}
            {Array.isArray(values.logistics?.amenities) && values.logistics.amenities.length > 0 && (
              <div className="mt-3">
                <p className="text-xs font-semibold text-gray-700 mb-2">Available amenities — select those required for this event</p>
                <div className="flex flex-wrap gap-2">
                  {((values.logistics.amenities as unknown[]) || []).map((a, idx) => {
                    const key = String(a);
                    const selected = Array.isArray(values.logistics?.selected_amenities) && (values.logistics.selected_amenities as unknown[]).includes(a);
                    return (
                      <label key={idx} className="inline-flex items-center gap-2 rounded-full bg-[#f1f5f9] px-3 py-1 text-xs text-gray-700 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={Boolean(selected)}
                          onChange={(e) => {
                            const current = Array.isArray(values.logistics?.selected_amenities) ? [...(values.logistics.selected_amenities as unknown[])] : [];
                            const idxExist = current.findIndex((c) => String(c) === key);
                            if (e.target.checked && idxExist === -1) current.push(key);
                            if (!e.target.checked && idxExist !== -1) current.splice(idxExist, 1);
                            updateField("logistics", { ...values.logistics, selected_amenities: current });
                          }}
                        />
                        <span>{key}</span>
                      </label>
                    );
                  })}
                </div>
              </div>
            )}
            {fieldErrors.logistics && (
              <p className="mt-2 text-xs text-red-500">{fieldErrors.logistics.join(" ")}</p>
            )}
          </div>
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
          <div className="mt-4 overflow-x-auto rounded-[8px] border border-gray-100">
            <table className="min-w-full text-sm">
              <thead className="bg-[#fafbff]">
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
                        <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M15.232 5.232l3.536 3.536M9 11l6 6M3 17.25V21h3.75l11.06-11.06a1.5 1.5 0 0 0-2.12-2.12L3 17.25z"/></svg>
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
