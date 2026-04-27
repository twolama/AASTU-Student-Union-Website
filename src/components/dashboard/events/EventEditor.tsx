"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import {
  Bold,
  ChevronRight,
  Clock3,
  Info,
  Italic,
  Link as LinkIcon,
  List,
  PlusCircle,
  Settings2,
  Trash2,
  UserPlus2,
} from "lucide-react";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { DropdownSelect } from "@/components/ui/DropdownSelect";
import { FileUpload } from "@/components/ui/FileUpload";
import { Switch } from "@/components/ui/Switch";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";

type EditorMode = "create" | "edit";

interface VolunteerEntry {
  id: string;
  fullName: string;
  studentId: string;
  phone: string;
  email: string;
  role: string;
}

interface VolunteerDraft {
  fullName: string;
  studentId: string;
  phone: string;
  email: string;
  role: string;
}

export interface EventEditorValues {
  title: string;
  shortDescription: string;
  aboutEvent: string;
  bannerUrl: string;
  bannerFileName?: string;
  registrationLink: string;
  startDateTime: string;
  endDateTime: string;
  venueSelection: string;
  clubAssociation: string;
  physicalLocationDetails: string;
  maxCapacity: string;
  megaEvent: boolean;
  archived: boolean;
  volunteers: VolunteerEntry[];
}

interface EventEditorProps {
  mode: EditorMode;
  eventId?: string;
  initialValues: EventEditorValues;
}

const venueOptions = [
  { value: "grand-library-hall", label: "Grand Library Hall" },
  { value: "outdoor-plaza", label: "Outdoor Plaza" },
  { value: "block-54-auditorium", label: "Block 54 Auditorium" },
  { value: "ict-center-seminar-room", label: "ICT Center Seminar Room" },
  { value: "innovation-hub", label: "Innovation Hub" },
  { value: "student-lounge", label: "Student Lounge" },
  { value: "main-quadrant", label: "Main Quadrant" },
  { value: "senate-hall", label: "Senate Hall" },
];

const clubOptions = [
  { value: "google-dsc-aastu", label: "Google DSC AASTU" },
  { value: "aastu-arts-club", label: "AASTU Arts Club" },
  { value: "robotics-society", label: "Robotics Society" },
  { value: "rotaract-aastu", label: "Rotaract AASTU" },
  { value: "ieee-women-chapter", label: "IEEE Women Chapter" },
  { value: "eco-action-team", label: "Eco Action Team" },
  { value: "debate-society", label: "Debate Society" },
];

export function EventEditor({ mode, eventId, initialValues }: EventEditorProps) {
  const [values, setValues] = useState<EventEditorValues>(initialValues);
  const [bannerFile, setBannerFile] = useState<File | null>(null);
  const [volunteerDraft, setVolunteerDraft] = useState<VolunteerDraft>({
    fullName: "",
    studentId: "",
    phone: "",
    email: "",
    role: "",
  });
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  const isCreate = mode === "create";
  const title = isCreate ? "Create New Event" : "Edit Event";
  const subtitle = isCreate
    ? "Organize and schedule your next campus activity. Fill in the required details below."
    : "Update event details, logistics, and volunteer assignments.";
  const controlClassName = "rounded-[8px] h-10";

  const completionItems = useMemo(
    () => [
      { label: "Basic", done: values.title.trim().length >= 6 && values.shortDescription.trim().length >= 20 },
      { label: "Logistics", done: Boolean(values.startDateTime && values.endDateTime && values.venueSelection) },
      { label: "Settings", done: true },
    ],
    [values.endDateTime, values.shortDescription, values.startDateTime, values.title, values.venueSelection]
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
    const hasRequired =
      volunteerDraft.fullName.trim().length > 0 && volunteerDraft.studentId.trim().length > 0;

    if (!hasRequired) {
      return;
    }

    const nextEntry: VolunteerEntry = {
      id: `${Date.now()}`,
      fullName: volunteerDraft.fullName.trim(),
      studentId: volunteerDraft.studentId.trim(),
      phone: volunteerDraft.phone.trim(),
      email: volunteerDraft.email.trim(),
      role: volunteerDraft.role.trim(),
    };

    updateField("volunteers", [...values.volunteers, nextEntry]);
    setVolunteerDraft({ fullName: "", studentId: "", phone: "", email: "", role: "" });
  }

  function removeVolunteer(id: string) {
    updateField(
      "volunteers",
      values.volunteers.filter((item) => item.id !== id)
    );
  }

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatusMessage(
      isCreate ? "Event draft is ready to publish." : `Event ${eventId ?? "record"} updates saved locally.`
    );
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
          </div>

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
                value={values.shortDescription}
                onChange={(event) => updateField("shortDescription", event.target.value)}
                placeholder="Provide a short description of the event..."
                className="min-h-[96px] rounded-none border-0 shadow-none focus:ring-0"
              />
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
                id="aboutEvent"
                value={values.aboutEvent}
                onChange={(event) => updateField("aboutEvent", event.target.value)}
                placeholder="Provide a detailed description of the event..."
                className="min-h-[150px] rounded-none border-0 shadow-none focus:ring-0"
              />
            </div>
          </div>

          <div>
            <p className="mb-1.5 text-xs font-semibold text-gray-700">Event Banner</p>
            <FileUpload
              label=""
              helperText="Upload a file or drag and drop"
              previewUrl={values.bannerUrl || undefined}
              fileName={bannerFile?.name || values.bannerFileName}
              onChange={(file) => {
                setBannerFile(file);
              }}
              onClear={() => {
                setBannerFile(null);
                updateField("bannerUrl", "");
                updateField("bannerFileName", undefined);
              }}
              className="[&>label]:min-h-[120px] [&>label]:rounded-[10px]"
            />
            <p className="mt-1 text-[11px] text-gray-400">Recommended size: 1200×630px for optimal social sharing.</p>
          </div>

          <div>
            <label htmlFor="registrationLink" className="mb-1.5 block text-xs font-semibold text-gray-700">
              Event Registration Link
            </label>
            <Input
              id="registrationLink"
              value={values.registrationLink}
              onChange={(event) => updateField("registrationLink", event.target.value)}
              placeholder="e.g. https://aastu.edu.et/waitlist"
              className={controlClassName}
            />
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
              value={values.startDateTime}
              onChange={(event) => updateField("startDateTime", event.target.value)}
              className={controlClassName}
            />
          </div>

          <div>
            <label htmlFor="endDate" className="mb-1.5 block text-xs font-semibold text-gray-700">
              End Date &amp; Time
            </label>
            <Input
              id="endDate"
              type="datetime-local"
              value={values.endDateTime}
              onChange={(event) => updateField("endDateTime", event.target.value)}
              className={controlClassName}
            />
          </div>

          <DropdownSelect
            label="Venue Selection"
            value={values.venueSelection}
            options={[{ value: "", label: "Select a campus venue" }, ...venueOptions]}
            onValueChange={(value) => updateField("venueSelection", value)}
            className="[&>div>button]:h-10 [&>div>button]:rounded-[8px]"
          />

          <DropdownSelect
            label="Club Association"
            value={values.clubAssociation}
            options={[{ value: "", label: "Select organizing club" }, ...clubOptions]}
            onValueChange={(value) => updateField("clubAssociation", value)}
            className="[&>div>button]:h-10 [&>div>button]:rounded-[8px]"
          />

          <div className="md:col-span-2">
            <label htmlFor="physicalLocation" className="mb-1.5 block text-xs font-semibold text-gray-700">
              Specific Physical Location Details
            </label>
            <Input
              id="physicalLocation"
              value={values.physicalLocationDetails}
              onChange={(event) => updateField("physicalLocationDetails", event.target.value)}
              placeholder="e.g. Block 45, Second floor, Room 204"
              className={controlClassName}
            />
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
                value={values.maxCapacity}
                onChange={(event) => updateField("maxCapacity", event.target.value)}
                placeholder="0"
                className={cn(controlClassName, "max-w-[160px]")}
              />
              <span className="text-xs text-gray-500">Participants (Optional)</span>
            </div>
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
              value={volunteerDraft.fullName}
              onChange={(event) => updateVolunteerDraft("fullName", event.target.value)}
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
              value={volunteerDraft.studentId}
              onChange={(event) => updateVolunteerDraft("studentId", event.target.value)}
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
          <div className="mt-4 overflow-hidden rounded-[8px] border border-gray-100">
            {values.volunteers.map((item, index) => (
              <div
                key={item.id}
                className={cn(
                  "flex flex-wrap items-center justify-between gap-2 px-3 py-2 text-sm",
                  index % 2 === 0 ? "bg-[#fafbff]" : "bg-white"
                )}
              >
                <p className="font-medium text-gray-700">{item.fullName}</p>
                <p className="text-xs text-gray-500">{item.role || "Volunteer"}</p>
                <button
                  type="button"
                  onClick={() => removeVolunteer(item.id)}
                  className="inline-flex h-7 w-7 items-center justify-center rounded-md text-red-400 transition-colors hover:bg-red-50 hover:text-red-500"
                  aria-label={`Remove ${item.fullName}`}
                >
                  <Trash2 size={13} />
                </button>
              </div>
            ))}
          </div>
        ) : null}

        <div className="mt-4 flex justify-end">
          <Button type="button" variant="goldSolid" className="h-10 rounded-[8px] px-4" onClick={addVolunteer}>
            <PlusCircle size={14} />
            Add Volunteer
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
            <Switch checked={values.megaEvent} onCheckedChange={(checked) => updateField("megaEvent", checked)} />
          </div>

          <div className="flex items-center justify-between rounded-[8px] bg-[#f8fafc] px-3 py-2.5">
            <div>
              <p className="font-semibold text-gray-700">Archive Status</p>
              <p className="text-xs text-gray-500">Hide this event from public views initially.</p>
            </div>
            <Switch checked={values.archived} onCheckedChange={(checked) => updateField("archived", checked)} />
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
          <Button type="button" variant="gold" className="h-10 rounded-[8px] px-4">
            Save as Draft
          </Button>
          <Button type="submit" variant="goldSolid" className="h-10 rounded-[8px] px-4">
            {isCreate ? "Publish Event" : "Save Changes"}
          </Button>
        </div>
      </section>
    </form>
  );
}
