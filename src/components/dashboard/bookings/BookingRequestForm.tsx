"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { z } from "zod";
import { useCreateBooking, useUpdateBooking } from "@/hooks/useBookings";
import {
  ArrowLeft,
  ArrowRight,
  CalendarClock,
  Check,
  ChevronRight,
  ClipboardCheck,
  ClipboardList,
  Info,
  MapPin,
  Users2,
  Loader2,
} from "lucide-react";
import { useVenues, useVenue } from "@/hooks/useVenues";
import { useClubs, useClubUpcomingEvents } from "@/hooks/useClubs";
import { Button } from "@/components/ui/Button";
import { DropdownSelect } from "@/components/ui/DropdownSelect";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { DashboardFooter } from "@/components/layout/DashboardFooter";
import { cn } from "@/lib/utils";
import type { BookingVenueCard } from "@/types/dashboard";
import type { Club } from "@/schemas/club.schema";
import type { Venue } from "@/schemas/venue.schema";

type StepId = 1 | 2 | 3;

interface EquipmentOption {
  id: string;
  label: string;
}

export interface BookingRequestFormInitialData {
  clubAssociation?: string;
  eventTitle?: string;
  expectedAttendance?: string;
  startDate?: string;
  endDate?: string;
  selectedSlots?: string[];
  purpose?: string;
  selectedVenueId?: string;
  equipment?: string[];
  specialRequests?: string;
  guidelinesChecked?: boolean;
}

interface BookingRequestFormProps {
  mode?: "create" | "edit";
  bookingId?: string;
  initialData?: BookingRequestFormInitialData;
}

const Step1Schema = z.object({
  clubAssociation: z.string().min(1, "Please select a student organization"),
  selectedVenueId: z.string().min(1, "Please select a venue"),
  eventTitle: z.string().min(5, "Event title must be at least 5 characters"),
  expectedAttendance: z.string().refine(val => !isNaN(parseInt(val)) && parseInt(val) > 0, {
    message: "Attendance must be a positive number",
  }),
  startDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Invalid start date format (YYYY-MM-DD)"),
  endDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Invalid end date format (YYYY-MM-DD)"),
  selectedSlots: z.array(z.string()).min(1, "Please select at least one time slot"),
  purpose: z.string().min(10, "Please provide a more detailed purpose (at least 10 chars)"),
});

const Step2Schema = z.object({
  equipment: z.array(z.string()).optional(),
  specialRequests: z.string().optional(),
});

const Step3Schema = z.object({
  guidelinesChecked: z.boolean().refine((val) => val === true, {
    message: "You must acknowledge the guidelines before submitting",
  }),
});

const stepLabels: { id: StepId; label: string }[] = [
  { id: 1, label: "Event Details" },
  { id: 2, label: "Requirements" },
  { id: 3, label: "Review" },
];


const timeSlots = [
  { label: "08:00", available: false },
  { label: "09:00", available: true },
  { label: "10:00", available: true },
  { label: "11:00", available: true },
  { label: "12:00", available: true },
  { label: "13:00", available: true },
  { label: "14:00", available: false },
  { label: "15:00", available: true },
  { label: "16:00", available: true },
  { label: "17:00", available: true },
  { label: "18:00", available: true },
  { label: "19:00", available: true },
];


function StepIndicator({ currentStep }: { currentStep: StepId }) {
  return (
    <>
      <ol className="grid grid-cols-3 gap-2 sm:hidden">
        {stepLabels.map((step) => {
          const isActive = currentStep === step.id;
          const isCompleted = currentStep > step.id;

          return (
            <li key={step.id} className="flex items-center justify-center">
              <span
                className={cn(
                  "inline-flex h-7 w-7 items-center justify-center rounded-full text-xs font-semibold",
                  isCompleted && "bg-emerald-600 text-white",
                  isActive && "bg-[#b48a1b] text-white",
                  !isActive && !isCompleted && "border border-gray-300 bg-white text-[#90a0bb]"
                )}
              >
                {step.id}
              </span>
            </li>
          );
        })}
      </ol>

      <ol className="hidden gap-2 sm:grid sm:grid-cols-3">
        {stepLabels.map((step, index) => {
          const isActive = currentStep === step.id;
          const isCompleted = currentStep > step.id;

          return (
            <li key={step.id} className="flex items-center gap-2">
              <span
                className={cn(
                  "inline-flex h-7 w-7 items-center justify-center rounded-full text-xs font-semibold",
                  isCompleted && "bg-emerald-600 text-white",
                  isActive && "bg-[#b48a1b] text-white",
                  !isActive && !isCompleted && "border border-gray-300 bg-white text-[#90a0bb]"
                )}
              >
                {isCompleted ? <Check size={14} /> : step.id}
              </span>
              <p className={cn("text-sm font-semibold", isActive || isCompleted ? "text-[#b48a1b]" : "text-[#9aa8bf]")}>{step.label}</p>
              {index < stepLabels.length - 1 ? <span className="h-px flex-1 bg-gray-200" /> : null}
            </li>
          );
        })}
      </ol>
    </>
  );
}

export function BookingRequestForm({
  mode = "create",
  bookingId,
  initialData,
}: BookingRequestFormProps) {
  const searchParams = useSearchParams();
  const venueIdFromUrl = searchParams.get("venueId");

  const [clubAssociation, setClubAssociation] = useState(initialData?.clubAssociation ?? "");
  const [selectedVenueId, setSelectedVenueId] = useState(initialData?.selectedVenueId ?? "");
  
  const { data: venuesData, isLoading: isVenuesLoading } = useVenues(1, 100, undefined, "active");
  const { data: fullVenueData, isLoading: isFullVenueLoading } = useVenue(selectedVenueId);
  const { data: clubsData, isLoading: isClubsLoading } = useClubs(1, 100, undefined, "active");
  const { data: upcomingEventsData, isLoading: isUpcomingEventsLoading } = useClubUpcomingEvents(clubAssociation);

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
      amenities: v.amenities || [],
    })) as BookingVenueCard[];
  }, [venuesData]);

  const clubOptions = useMemo(() => {
    const base = [{ value: "", label: "Select your student organization" }];
    if (!clubsData || !clubsData.data) return base;
    return [
      ...base,
      ...clubsData.data.map((c: Club) => ({
        value: c.id,
        label: c.name
      }))
    ];
  }, [clubsData]);

  const router = useRouter();
  const createMutation = useCreateBooking();
  const updateMutation = useUpdateBooking();

  const isEditMode = mode === "edit";
  const pageTitle = isEditMode ? "Edit Booking Request" : "New Booking Request";
  const [currentStep, setCurrentStep] = useState<StepId>(1);

  const [eventTitle, setEventTitle] = useState(initialData?.eventTitle ?? "");
  const [expectedAttendance, setExpectedAttendance] = useState(initialData?.expectedAttendance ?? "500");
  const [startDate, setStartDate] = useState(initialData?.startDate ?? "");
  const [endDate, setEndDate] = useState(initialData?.endDate ?? "");
  const [selectedSlots, setSelectedSlots] = useState<string[]>(initialData?.selectedSlots ?? []);
  const [purpose, setPurpose] = useState(initialData?.purpose ?? "");

  const [equipment, setEquipment] = useState<string[]>(initialData?.equipment ?? []);
  const [specialRequests, setSpecialRequests] = useState(initialData?.specialRequests ?? "");

  const [guidelinesChecked, setGuidelinesChecked] = useState(initialData?.guidelinesChecked ?? false);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string[]>>({});

  const [isInitialized, setIsInitialized] = useState(false);

  function FieldError({ name }: { name: string }) {
    const errors = fieldErrors[name];
    if (!errors || errors.length === 0) return null;
    return (
      <div className="mt-1 flex items-start gap-1 text-[11px] font-medium text-rose-600 animate-in fade-in slide-in-from-top-1">
        <Info size={12} className="mt-0.5 shrink-0" />
        <ul className="list-inside list-none">
          {errors.map((err, i) => (
            <li key={i}>{err}</li>
          ))}
        </ul>
      </div>
    );
  }

  // Sync selectedVenueId with URL or initial data only once
  useEffect(() => {
    if (realVenues.length > 0 && !isInitialized) {
      if (venueIdFromUrl && realVenues.some(v => v.id === venueIdFromUrl)) {
        setSelectedVenueId(venueIdFromUrl);
      } else if (initialData?.selectedVenueId && realVenues.some(v => v.id === initialData.selectedVenueId)) {
        setSelectedVenueId(initialData.selectedVenueId);
      } else {
        // Fallback to first available venue if URL/initial ID is missing or invalid
        setSelectedVenueId(realVenues[0].id);
      }
      setIsInitialized(true);
    }
  }, [realVenues, venueIdFromUrl, initialData, isInitialized]);

  // Reset equipment when venue changes to avoid stale requirements from previous venue
  useEffect(() => {
    if (isInitialized) {
      setEquipment([]);
    }
  }, [selectedVenueId, isInitialized]);

  const venueOptions = useMemo(() => {
    return realVenues.map((venue) => ({ 
      value: venue.id, 
      label: venue.name 
    }));
  }, [realVenues]);

  const selectedVenue = useMemo(
    () => realVenues.find((venue) => venue.id === selectedVenueId) || null,
    [realVenues, selectedVenueId]
  );

  const dynamicEquipmentOptions = useMemo(() => {
    // Prefer data from useVenue as it has full details
    const venueAmenities = fullVenueData?.amenities || selectedVenue?.amenities || [];
    
    // If the venue has specific amenities listed, use them as options
    if (venueAmenities.length > 0) {
      return venueAmenities.map((amenity: string) => ({
        id: amenity.toLowerCase().replace(/\s+/g, "-"),
        label: amenity
      }));
    }
    
    // No specific amenities listed for this venue
    return [];
  }, [selectedVenue, fullVenueData]);

  const selectedEquipmentLabels = useMemo(
    () => dynamicEquipmentOptions.filter((option: EquipmentOption) => equipment.includes(option.id)).map((option: EquipmentOption) => option.label),
    [equipment, dynamicEquipmentOptions]
  );

  const durationHours = Math.max(0, selectedSlots.length);

  function toggleSlot(slotLabel: string) {
    setSelectedSlots((current) =>
      current.includes(slotLabel)
        ? current.filter((slot) => slot !== slotLabel)
        : [...current, slotLabel]
    );
  }

  function toggleEquipment(optionId: string) {
    setEquipment((current) =>
      current.includes(optionId)
          ? current.filter((item) => item !== optionId)
        : [...current, optionId]
    );
  }

  // Clear field errors when user changes inputs
  useEffect(() => {
    setFieldErrors({});
    setErrorMessage(null);
  }, [
    clubAssociation,
    selectedVenueId,
    eventTitle,
    expectedAttendance,
    startDate,
    endDate,
    selectedSlots,
    purpose,
    equipment,
    specialRequests,
    guidelinesChecked,
  ]);

  function goNext() {
    setErrorMessage(null);
    setFieldErrors({});

    try {
      if (currentStep === 1) {
        Step1Schema.parse({
          clubAssociation,
          selectedVenueId,
          eventTitle,
          expectedAttendance,
          startDate,
          endDate,
          selectedSlots,
          purpose,
        });
      } else if (currentStep === 2) {
        Step2Schema.parse({
          equipment,
          specialRequests,
        });
      }
      
      setCurrentStep((current) => (current < 3 ? ((current + 1) as StepId) : current));
      window.scrollTo(0, 0);
    } catch (error) {
      if (error instanceof z.ZodError) {
        const errors: Record<string, string[]> = {};
        error.issues.forEach((issue) => {
          const path = issue.path[0] as string;
          if (!errors[path]) errors[path] = [];
          errors[path].push(issue.message);
        });
        setFieldErrors(errors);
        setErrorMessage("Please fix the validation errors before proceeding.");
      }
    }
  }

  function goBack() {
    setCurrentStep((current) => (current > 1 ? ((current - 1) as StepId) : current));
  }

  async function handleSubmit() {
    setErrorMessage(null);
    setFieldErrors({});
    
    try {
      // Final validation
      Step1Schema.parse({ clubAssociation, selectedVenueId, eventTitle, expectedAttendance, startDate, endDate, selectedSlots, purpose });
      Step2Schema.parse({ equipment, specialRequests });
      Step3Schema.parse({ guidelinesChecked });

      const payload = {
        club: clubAssociation,
        venue: selectedVenueId,
        title: eventTitle, // Backend might expect 'title'
        event_title: eventTitle,
        expected_attendance: parseInt(expectedAttendance),
        start_date: startDate,
        end_date: endDate,
        selected_slots: selectedSlots,
        purpose: purpose,
        equipment_requested: equipment,
        special_requests: specialRequests,
        guidelines_acknowledged: guidelinesChecked,
      };

      if (isEditMode && bookingId) {
        await updateMutation.mutateAsync({ id: bookingId, data: payload });
        setStatusMessage("Booking request updated successfully.");
      } else {
        await createMutation.mutateAsync(payload);
        setStatusMessage("Booking request submitted successfully.");
      }
      
      setTimeout(() => {
        router.push("/bookings");
      }, 2000);
    } catch (error: any) {
      if (error instanceof z.ZodError) {
        const errors: Record<string, string[]> = {};
        error.issues.forEach((issue) => {
          const path = issue.path[0] as string;
          if (!errors[path]) errors[path] = [];
          errors[path].push(issue.message);
        });
        setFieldErrors(errors);
        setErrorMessage("Please fix the validation errors below.");
        return;
      }

      let errorData = error?.response?.data;
      
      // Handle cases where the message is a stringified JSON (common in proxy responses)
      if (typeof errorData?.message === "string" && errorData.message.includes("VALIDATION_ERROR")) {
        try {
          const parsedMessage = JSON.parse(errorData.message);
          errorData = { ...errorData, ...parsedMessage };
        } catch (e) {
          // Not valid JSON, ignore
        }
      }

      if (errorData?.code === "VALIDATION_ERROR" && errorData.details) {
        // Map backend keys to frontend state keys if they differ
        const mappedErrors: Record<string, string[]> = {};
        Object.entries(errorData.details).forEach(([key, value]) => {
          let fieldName = key;
          if (key === "club") fieldName = "clubAssociation";
          if (key === "venue") fieldName = "selectedVenueId";
          if (key === "title" || key === "event_title") fieldName = "eventTitle";
          if (key === "start_date") fieldName = "startDate";
          if (key === "end_date") fieldName = "endDate";
          if (key === "expected_attendance") fieldName = "expectedAttendance";
          if (key === "selected_slots") fieldName = "selectedSlots";
          if (key === "guidelines_acknowledged") fieldName = "guidelinesChecked";
          
          mappedErrors[fieldName] = value as string[];
        });
        setFieldErrors(mappedErrors);
        setErrorMessage("Please correct the errors below.");
      } else {
        setErrorMessage(errorData?.message || error.message || "Failed to submit booking request.");
      }
    }
  }

  return (
    <div className="space-y-5">
      <nav aria-label="Breadcrumb" className="flex flex-wrap items-center gap-1.5 text-sm text-gray-400">
        <Link href="/dashboard" className="font-medium text-[#c49a22] hover:underline">
          Dashboard
        </Link>
        <ChevronRight size={14} />
        <Link href="/bookings" className="text-gray-500 hover:text-gray-700">
          Bookings
        </Link>
        <ChevronRight size={14} />
        <span className="text-gray-500">{pageTitle}</span>
      </nav>

      <header className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight text-[#1f2a44] sm:text-[34px]">{pageTitle}</h1>
        <StepIndicator currentStep={currentStep} />
      </header>

      {currentStep === 1 ? (
        <section className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_250px]">
          <article className="rounded-[12px] border border-gray-200 bg-white p-4 shadow-sm sm:p-5">
            <h2 className="inline-flex items-center gap-2 text-2xl font-bold text-[#1f2a44]">
              <ClipboardList size={18} className="text-[#b48a1b]" />
              About the Event
            </h2>

            <div className="mt-4 space-y-4">
              <div className="relative">
                <DropdownSelect
                  label="Club / Association Selection"
                  value={clubAssociation}
                  options={clubOptions}
                  onValueChange={setClubAssociation}
                  className="[&>div>button]:h-10 [&>div>button]:rounded-[10px]"
                  disabled={isClubsLoading}
                />
                {isClubsLoading && (
                  <div className="absolute right-10 top-[34px]">
                    <Loader2 className="h-4 w-4 animate-spin text-[#c49a22]" />
                  </div>
                )}
                <FieldError name="clubAssociation" />
              </div>

              <div className="relative">
                <DropdownSelect
                  label="Venue Selection"
                  value={selectedVenueId}
                  options={venueOptions}
                  onValueChange={setSelectedVenueId}
                  className="[&>div>button]:h-10 [&>div>button]:rounded-[10px]"
                  disabled={isVenuesLoading}
                />
                {isVenuesLoading && (
                  <div className="absolute right-10 top-[34px]">
                    <Loader2 className="h-4 w-4 animate-spin text-[#c49a22]" />
                  </div>
                )}
                <FieldError name="selectedVenueId" />
              </div>

              <div>
                <label htmlFor="booking-event-title" className="mb-1.5 block text-xs font-semibold text-gray-700">
                  Event Title
                </label>
                
                {upcomingEventsData && upcomingEventsData.length > 0 && (
                  <div className="mb-2 space-y-1.5">
                    <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-[#8a95a8]">Quick Select Upcoming Event</p>
                    <div className="flex flex-wrap gap-2">
                      {upcomingEventsData.slice(0, 3).map((event: any) => (
                        <button
                          key={event.id}
                          type="button"
                          onClick={() => setEventTitle(event.title)}
                          className={cn(
                            "rounded-full border px-3 py-1 text-[11px] font-medium transition-all",
                            eventTitle === event.title
                              ? "border-[#b48a1b] bg-[#fdf8ec] text-[#6f5510]"
                              : "border-gray-200 bg-white text-[#5f6f8d] hover:border-gray-300"
                          )}
                        >
                          {event.title}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                <Input
                  id="booking-event-title"
                  value={eventTitle}
                  onChange={(event) => setEventTitle(event.target.value)}
                  placeholder="e.g. Annual Tech Symposium 2024"
                  className="h-10 rounded-[10px]"
                />
                <FieldError name="eventTitle" />
              </div>

              <div>
                <label htmlFor="booking-attendance" className="mb-1.5 block text-xs font-semibold text-gray-700">
                  Expected Attendance
                </label>
                <Input
                  id="booking-attendance"
                  type="number"
                  min={1}
                  value={expectedAttendance}
                  onChange={(event) => setExpectedAttendance(event.target.value)}
                  placeholder="Number of attendees"
                  className="h-10 rounded-[10px]"
                />
                <FieldError name="expectedAttendance" />
              </div>

              <div className="rounded-[10px] border border-gray-200 bg-[#fbfcff] p-3 sm:p-4">
                <div className="grid gap-3 sm:grid-cols-2">
                  <div>
                    <label htmlFor="booking-start-date" className="mb-1.5 block text-[10px] font-semibold uppercase tracking-[0.12em] text-[#8a95a8]">
                      Start Date
                    </label>
                    <Input
                      id="booking-start-date"
                      type="date"
                      value={startDate}
                      onChange={(event) => setStartDate(event.target.value)}
                      className="h-10 rounded-[8px]"
                    />
                    <FieldError name="startDate" />
                  </div>

                  <div>
                    <label htmlFor="booking-end-date" className="mb-1.5 block text-[10px] font-semibold uppercase tracking-[0.12em] text-[#8a95a8]">
                      End Date
                    </label>
                    <Input
                      id="booking-end-date"
                      type="date"
                      value={endDate}
                      onChange={(event) => setEndDate(event.target.value)}
                      className="h-10 rounded-[8px]"
                    />
                    <FieldError name="endDate" />
                  </div>
                </div>

                <div className="mt-3">
                  <div className="mb-2 flex items-center justify-between gap-2">
                    <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-[#8a95a8]">Select Time Slots (Hourly)</p>
                    <button type="button" className="text-xs font-semibold text-[#b48a1b] hover:underline">
                      Show Daily Schedule
                    </button>
                  </div>

                  <div className="grid grid-cols-3 gap-2 sm:grid-cols-6">
                    {timeSlots.map((slot) => {
                      const isSelected = selectedSlots.includes(slot.label);
                      return (
                        <button
                          key={slot.label}
                          type="button"
                          disabled={!slot.available}
                          onClick={() => toggleSlot(slot.label)}
                          className={cn(
                            "inline-flex h-9 items-center justify-center rounded-[8px] border text-xs font-semibold transition-colors",
                            !slot.available && "cursor-not-allowed border-gray-200 bg-gray-100 text-gray-400",
                            slot.available && !isSelected && "border-gray-200 bg-white text-[#4f5f7c] hover:border-[#b48a1b]/35",
                            slot.available && isSelected && "border-[#b48a1b] bg-[#b48a1b] text-white"
                          )}
                        >
                          {slot.label}
                        </button>
                      );
                    })}
                  </div>
                  <FieldError name="selectedSlots" />

                  <div className="mt-2 flex flex-wrap items-center gap-3 border-t border-gray-200 pt-2 text-[10px] font-semibold uppercase tracking-[0.08em] text-[#90a0bb]">
                    <span className="inline-flex items-center gap-1"><span className="h-2 w-2 rounded-full bg-white ring-1 ring-gray-300" />Available</span>
                    <span className="inline-flex items-center gap-1"><span className="h-2 w-2 rounded-full bg-[#b48a1b]" />Selected</span>
                    <span className="inline-flex items-center gap-1"><span className="h-2 w-2 rounded-full bg-gray-300" />Reserved</span>
                  </div>
                </div>
              </div>

              <div>
                <label htmlFor="booking-purpose" className="mb-1.5 block text-xs font-semibold text-gray-700">
                  Purpose of Booking
                </label>
                <Textarea
                  id="booking-purpose"
                  value={purpose}
                  onChange={(event) => setPurpose(event.target.value)}
                  placeholder="Briefly describe the activities and goals of the event..."
                  className="min-h-[104px] rounded-[10px]"
                />
                <FieldError name="purpose" />
              </div>
            </div>

            <div className="mt-5 flex flex-col-reverse gap-2 border-t border-gray-100 pt-4 sm:flex-row sm:items-center sm:justify-between">
              <Link href="/bookings">
                <Button type="button" variant="outline" className="h-10 w-full sm:w-auto">
                  Cancel Request
                </Button>
              </Link>
              <Button 
                type="button" 
                variant="goldSolid" 
                className="h-10 w-full sm:w-auto" 
                onClick={goNext}
                disabled={!selectedVenueId || isVenuesLoading}
              >
                Next Step
                <ArrowRight size={14} />
              </Button>
            </div>
          </article>

          <aside className="space-y-4">
            <article className="overflow-hidden rounded-[12px] border border-gray-200 bg-white shadow-sm">
              <div className="relative h-24 bg-gray-100">
                <Image
                  src={selectedVenue?.imageUrl ?? "https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&auto=format&fit=crop"}
                  alt="Selected venue"
                  fill
                  className="object-cover"
                />
                <span className="absolute left-2 top-2 rounded-full bg-[#b48a1b] px-2 py-0.5 text-[9px] font-semibold uppercase tracking-widest text-white">
                  Selected Venue
                </span>
              </div>

              <div className="space-y-2 p-3">
                <h3 className="text-2xl font-bold text-[#1f2a44]">{selectedVenue?.name}</h3>
                <div className="space-y-1 text-xs text-[#5f6f8d]">
                  <p className="inline-flex items-center gap-1.5"><Users2 size={12} className="text-[#b48a1b]" />Capacity: {selectedVenue?.capacity.toLocaleString()} Seats</p>
                  <p className="inline-flex items-center gap-1.5"><MapPin size={12} className="text-[#b48a1b]" />AASTU Campus · {selectedVenue?.category.replace("-", " ")}</p>
                </div>
              </div>
            </article>

            <article className="rounded-[12px] border border-[#203163] bg-[#1f2a44] p-4 text-white shadow-sm">
              <h3 className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[#d6b662]">Booking Guidelines</h3>
              <ul className="mt-3 space-y-2 text-xs text-white/80">
                <li className="inline-flex gap-2"><Info size={12} className="mt-0.5 shrink-0 text-[#d6b662]" />Submit request at least 7 working days prior.</li>
                <li className="inline-flex gap-2"><Info size={12} className="mt-0.5 shrink-0 text-[#d6b662]" />48-hour cancellation notice required.</li>
                <li className="inline-flex gap-2"><Info size={12} className="mt-0.5 shrink-0 text-[#d6b662]" />Clubs are responsible for cleanliness & damages.</li>
              </ul>
            </article>
          </aside>
        </section>
      ) : null}

      {currentStep === 2 ? (
        <section className="space-y-4">
          <article className="rounded-[12px] border border-gray-200 bg-white p-4 shadow-sm sm:p-5">
            <h2 className="inline-flex items-center gap-2 text-2xl font-bold text-[#1f2a44]">
              <CalendarClock size={18} className="text-[#b48a1b]" />
              Equipment & Support Requirements
            </h2>

            <div className="mt-4 grid gap-2 md:grid-cols-3">
              {isFullVenueLoading ? (
                <div className="col-span-full flex items-center justify-center py-8">
                  <Loader2 className="h-6 w-6 animate-spin text-[#c49a22]" />
                  <span className="ml-2 text-sm text-gray-500">Loading venue requirements...</span>
                </div>
              ) : dynamicEquipmentOptions.length > 0 ? (
                dynamicEquipmentOptions.map((option: EquipmentOption) => {
                  const isSelected = equipment.includes(option.id);
                  return (
                    <button
                      key={option.id}
                      type="button"
                      onClick={() => toggleEquipment(option.id)}
                      className={cn(
                        "inline-flex items-center gap-2 rounded-[10px] border px-3 py-3 text-left text-sm font-semibold transition-colors",
                        isSelected
                          ? "border-[#b48a1b]/35 bg-[#fdf8ec] text-[#6f5510]"
                          : "border-gray-200 bg-[#fbfcff] text-[#4f5f7c] hover:border-[#b48a1b]/25"
                      )}
                    >
                      <span
                        className={cn(
                          "inline-flex h-4 w-4 items-center justify-center rounded border",
                          isSelected ? "border-[#b48a1b] bg-[#b48a1b] text-white" : "border-gray-300 bg-white"
                        )}
                      >
                        {isSelected ? <Check size={12} /> : null}
                      </span>
                      {option.label}
                    </button>
                  );
                })
              ) : (
                <div className="col-span-full flex items-center gap-3 rounded-[10px] bg-gray-50 p-4 text-sm text-gray-500 border border-gray-100">
                  <Info size={18} className="text-gray-400 shrink-0" />
                  <p>No specific equipment or support requirements are listed for this venue.</p>
                </div>
              )}
            </div>
          </article>

          <article className="rounded-[12px] border border-gray-200 bg-white p-4 shadow-sm sm:p-5">
            <h2 className="inline-flex items-center gap-2 text-2xl font-bold text-[#1f2a44]">
              <ClipboardCheck size={18} className="text-[#b48a1b]" />
              Special Requests
            </h2>
            <p className="mt-2 text-sm text-[#6d7a95]">Additional details or technical notes.</p>
            <Textarea
              value={specialRequests}
              onChange={(event) => setSpecialRequests(event.target.value)}
              placeholder="Please describe any specific technical requirements or logistics needs not covered above..."
              className="mt-3 min-h-[110px] rounded-[10px]"
            />
            <FieldError name="specialRequests" />
          </article>

          <div className="flex flex-col-reverse gap-2 pt-1 sm:flex-row sm:items-center sm:justify-between">
            <Button type="button" variant="outline" className="h-10 w-full sm:w-auto" onClick={goBack}>
              <ArrowLeft size={14} />
              Back
            </Button>
            <Button type="button" variant="goldSolid" className="h-10 w-full sm:w-auto" onClick={goNext}>
              Next Step
              <ArrowRight size={14} />
            </Button>
          </div>
        </section>
      ) : null}

      {currentStep === 3 ? (
        <section className="space-y-4">
          <article className="overflow-hidden rounded-[12px] border border-gray-200 bg-white shadow-sm">
            <div className="grid gap-0 lg:grid-cols-[340px_minmax(0,1fr)]">
              <div className="relative h-48 bg-gray-100 lg:h-full">
                <Image
                  src={selectedVenue?.imageUrl ?? "https://images.unsplash.com/photo-1522778119026-d647f0596c20?w=1100&auto=format&fit=crop"}
                  alt="Venue preview"
                  fill
                  className="object-cover"
                />
                <div className="absolute bottom-3 left-3 rounded-md bg-black/40 px-2 py-1 text-white">
                  <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-[#f3d792]">Primary Venue</p>
                  <p className="text-2xl font-bold">{selectedVenue?.name}</p>
                </div>
              </div>

              <div className="grid gap-2 p-4 sm:grid-cols-2">
                <div>
                  <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-[#8a95a8]">Capacity</p>
                  <p className="text-sm font-semibold text-[#1f2a44]">{selectedVenue?.capacity.toLocaleString()} Seats Available</p>
                </div>
                <div>
                  <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-[#8a95a8]">Location</p>
                  <p className="text-sm font-semibold text-[#1f2a44]">AASTU Campus · {selectedVenue?.category.replace("-", " ")}</p>
                </div>
                <div className="sm:col-span-2">
                  <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-[#8a95a8]">Status</p>
                  <p className="text-sm font-semibold text-emerald-600">Available for Selection</p>
                </div>
              </div>
            </div>
          </article>

          <article className="rounded-[12px] border border-gray-200 bg-white p-4 shadow-sm sm:p-5">
            <div className="flex items-center justify-between gap-2">
              <h2 className="inline-flex items-center gap-2 text-xl font-bold text-[#1f2a44]">
                <ClipboardList size={17} className="text-[#b48a1b]" />
                Event Overview
              </h2>
              <button type="button" onClick={() => setCurrentStep(1)} className="text-xs font-semibold text-[#b48a1b] hover:underline">
                Edit
              </button>
            </div>

            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-[#8a95a8]">Event Title</p>
                <p className="text-xl font-semibold text-[#1f2a44]">{eventTitle || "Untitled booking event"}</p>
              </div>
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-[#8a95a8]">Organization</p>
                <p className="text-xl font-semibold text-[#1f2a44]">
                  {clubOptions.find((option) => option.value === clubAssociation)?.label || "Not selected"}
                </p>
              </div>
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-[#8a95a8]">Date</p>
                <p className="text-sm font-semibold text-[#1f2a44]">{startDate || "--"}</p>
              </div>
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-[#8a95a8]">Selected Time Slots</p>
                <p className="text-sm font-semibold text-[#1f2a44]">{selectedSlots.length > 0 ? selectedSlots.join(", ") : "None"}</p>
              </div>
            </div>
          </article>

          <article className="rounded-[12px] border border-gray-200 bg-white p-4 shadow-sm sm:p-5">
            <div className="flex items-center justify-between gap-2">
              <h2 className="inline-flex items-center gap-2 text-xl font-bold text-[#1f2a44]">
                <ClipboardCheck size={17} className="text-[#b48a1b]" />
                Requirements Summary
              </h2>
              <button type="button" onClick={() => setCurrentStep(2)} className="text-xs font-semibold text-[#b48a1b] hover:underline">
                Edit
              </button>
            </div>

            <div className="mt-3 flex flex-wrap gap-2">
              {selectedEquipmentLabels.length > 0 ? (
                selectedEquipmentLabels.map((label: string) => (
                  <span key={label} className="inline-flex items-center rounded-[8px] border border-[#ead9a3] bg-[#fbf4dc] px-2.5 py-1.5 text-xs font-medium text-[#7f6112]">
                    {label}
                  </span>
                ))
              ) : (
                <p className="text-sm text-[#7f8ba2]">No equipment selected.</p>
              )}
            </div>

            {specialRequests.trim().length > 0 ? (
              <p className="mt-3 text-sm text-[#60718f]">
                <span className="font-semibold text-[#1f2a44]">Additional Note:</span> {specialRequests}
              </p>
            ) : null}
          </article>

          <article className="rounded-[12px] border border-gray-200 bg-white p-4 shadow-sm">
            <div className="space-y-1 text-sm text-[#5f6f8d]">
              <p className="flex items-center justify-between gap-2"><span>Total Duration</span><span className="font-semibold text-[#1f2a44]">{durationHours.toFixed(1)} Hours</span></p>
              <p className="flex items-center justify-between gap-2"><span>Equipment Count</span><span className="font-semibold text-[#1f2a44]">{selectedEquipmentLabels.length} items</span></p>
            </div>
          </article>

          <article className="rounded-[12px] border border-[#ead9a3] bg-[#fffaf0] p-4 shadow-sm">
            <label className="flex items-start gap-3">
              <input
                type="checkbox"
                checked={guidelinesChecked}
                onChange={(event) => setGuidelinesChecked(event.target.checked)}
                className="mt-1 h-4 w-4 rounded border-gray-300 text-[#b48a1b] focus:ring-[#b48a1b]/30"
              />
              <span>
                <span className="block font-semibold text-[#1f2a44]">Booking Guidelines Acknowledgment</span>
                <span className="mt-1 block text-sm text-[#60718f]">
                  I confirm that the details provided are accurate and I agree to the venue usage policies, including responsibility for equipment care and scheduled departure.
                </span>
              </span>
            </label>
            <FieldError name="guidelinesChecked" />
          </article>

          <div className="flex flex-col-reverse gap-2 pt-1 sm:flex-row sm:items-center sm:justify-between">
            <Button type="button" variant="outline" className="h-10 w-full sm:w-auto" onClick={goBack}>
              <ArrowLeft size={14} />
              Back
            </Button>

            <div className="flex w-full flex-col gap-2 sm:w-auto sm:flex-row">
              <Button type="button" variant="outline" className="h-10 w-full sm:w-auto">
                Save Draft
              </Button>
              <Button type="button" variant="goldSolid" className="h-10 w-full sm:w-auto" onClick={handleSubmit} disabled={!guidelinesChecked}>
                {isEditMode ? "Update Booking" : "Submit"}
                <ArrowRight size={14} />
              </Button>
            </div>
          </div>
        </section>
      ) : null}

      {errorMessage ? (
        <div className="rounded-[10px] border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
          {errorMessage}
        </div>
      ) : null}

      {statusMessage ? (
        <div className="rounded-[10px] border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
          {statusMessage}
        </div>
      ) : null}

      <DashboardFooter />
    </div>
  );
}
