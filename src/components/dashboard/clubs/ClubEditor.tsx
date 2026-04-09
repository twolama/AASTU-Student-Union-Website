"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import {
  ChevronRight,
  CircleHelp,
  Globe,
  Info,
  ShieldCheck,
  Users,
} from "lucide-react";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { DropdownSelect } from "@/components/ui/DropdownSelect";
import { FileUpload } from "@/components/ui/FileUpload";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";
import type { ClubStatus } from "@/types/dashboard";

type EditorMode = "create" | "edit";

export interface ClubEditorValues {
  clubName: string;
  description: string;
  category: string;
  bannerUrl: string;
  bannerFileName?: string;
  logoUrl: string;
  logoFileName?: string;
  presidentFullName: string;
  presidentDepartment: string;
  presidentId: string;
  presidentEmail: string;
  presidentPhone: string;
  presidentDormBlock: string;
  presidentDormRoom: string;
  advisorName: string;
  advisorDepartment: string;
  advisorPhone: string;
  advisorEmail: string;
  telegramUrl: string;
  linkedinUrl: string;
  githubUrl: string;
  youtubeUrl: string;
  websiteUrl: string;
  externalMembershipUrl: string;
  status: ClubStatus;
}

interface ClubEditorProps {
  mode: EditorMode;
  initialValues: ClubEditorValues;
  clubId?: string;
}

const categoryOptions = [
  { value: "technology", label: "Technology" },
  { value: "arts-culture", label: "Arts & Culture" },
  { value: "sports", label: "Sports" },
  { value: "social-service", label: "Social Service" },
  { value: "academic", label: "Academic" },
  { value: "entrepreneurship", label: "Entrepreneurship" },
];

const departmentOptions = [
  "Software Engineering",
  "Electrical Engineering",
  "Mechanical Engineering",
  "Architecture",
  "Civil Engineering",
  "Accounting & Finance",
  "Biotechnology",
  "Information Systems",
];

const departmentDropdownOptions = departmentOptions.map((item) => ({ value: item, label: item }));

const statusOptions: Array<{ value: ClubStatus; label: string }> = [
  { value: "pending", label: "Pending Review" },
  { value: "active", label: "Active" },
  { value: "rejected", label: "Rejected" },
];

export function ClubEditor({ mode, initialValues, clubId }: ClubEditorProps) {
  const [values, setValues] = useState<ClubEditorValues>(initialValues);
  const [bannerFile, setBannerFile] = useState<File | null>(null);
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  const isCreate = mode === "create";
  const pageTitle = isCreate ? "Add New Club" : "Edit Club";
  const pageSubtitle = isCreate
    ? "Populate the official registry for the AASTU Student Union."
    : "Update club information and keep records aligned with current leadership.";

  const completionChecklist = useMemo(
    () => [
      { label: "Basic info", done: values.clubName.trim().length >= 4 && values.description.trim().length >= 20 },
      { label: "Leadership", done: values.presidentFullName.trim().length >= 4 && values.advisorName.trim().length >= 4 },
      {
        label: "Online",
        done: [values.websiteUrl, values.telegramUrl, values.linkedinUrl].some((entry) => entry.trim().length > 0),
      },
      { label: "Status", done: Boolean(values.status) },
    ],
    [
      values.advisorName,
      values.clubName,
      values.description,
      values.linkedinUrl,
      values.presidentFullName,
      values.status,
      values.telegramUrl,
      values.websiteUrl,
    ]
  );

  const completionCount = completionChecklist.filter((item) => item.done).length;
  const completionPercent = Math.round((completionCount / completionChecklist.length) * 100);
  const controlClassName = "rounded-[8px]";

  function updateField<K extends keyof ClubEditorValues>(key: K, value: ClubEditorValues[K]) {
    setValues((current) => ({ ...current, [key]: value }));
  }

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setStatusMessage(
      isCreate
        ? "Club registration form is ready for submission."
        : `Club ${clubId ?? "record"} updates have been saved locally.`
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5 sm:space-y-6">
      <nav aria-label="Breadcrumb" className="flex flex-wrap items-center gap-1.5 text-sm text-gray-400">
        <Link href="/dashboard" className="font-medium text-[#c49a22] hover:underline">
          Dashboard
        </Link>
        <ChevronRight size={14} />
        <Link href="/clubs" className="text-gray-500 hover:text-gray-700">
          Clubs
        </Link>
        <ChevronRight size={14} />
        <span className="text-gray-500">{pageTitle}</span>
      </nav>

      <header className="space-y-2">
        <h1 className="text-[26px] font-bold tracking-tight text-[#1f2a44] sm:text-[34px]">{pageTitle}</h1>
        <p className="text-sm text-gray-500">{pageSubtitle}</p>
      </header>

      <section className="rounded-[10px] border border-gray-200 bg-white p-4 shadow-sm sm:p-5">
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-gray-500">Form Completion</p>
            <p className="mt-1 text-xs text-gray-400">Step {completionCount}/4</p>
          </div>
          <p className="text-xs font-semibold text-[#c49a22]">{completionPercent}% complete</p>
        </div>

        <div className="mt-3 h-2 overflow-hidden rounded-full bg-gray-100">
          <div
            className="h-full rounded-full bg-gradient-to-r from-[#c49a22] to-[#d3ac44] transition-all"
            style={{ width: `${completionPercent}%` }}
          />
        </div>

        <div className="mt-4 flex items-center px-1 sm:hidden">
          {completionChecklist.map((item, index) => (
            <div key={item.label} className="flex flex-1 items-center">
              <span
                className={cn(
                  "inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-[11px] font-semibold",
                  item.done ? "bg-[#c49a22] text-white" : "bg-[#f1f3f8] text-gray-500"
                )}
              >
                {index + 1}
              </span>
              {index < completionChecklist.length - 1 ? (
                <span
                  className={cn(
                    "mx-1.5 h-[2px] flex-1 rounded-full",
                    completionChecklist[index + 1]?.done ? "bg-[#d3ac44]" : "bg-gray-200"
                  )}
                />
              ) : null}
            </div>
          ))}
        </div>

        <div className="mt-4 hidden gap-2 text-[11px] font-semibold uppercase tracking-[0.14em] text-gray-400 sm:grid sm:grid-cols-4">
          {completionChecklist.map((item, index) => (
            <div key={item.label} className="flex items-center gap-2">
              <span
                className={cn(
                  "inline-flex h-5 w-5 items-center justify-center rounded-full text-[10px]",
                  item.done ? "bg-[#c49a22] text-white" : "bg-[#f1f3f8] text-gray-400"
                )}
              >
                {index + 1}
              </span>
              {item.label}
            </div>
          ))}
        </div>
      </section>

      <section className="rounded-[10px] border border-gray-200 bg-white p-4 shadow-sm sm:p-6">
        <div className="flex flex-wrap items-center gap-2">
          <span className="inline-flex h-7 w-7 items-center justify-center rounded-md bg-[#fdf8ec] text-[#c49a22]">
            <Info size={14} />
          </span>
          <h2 className="text-xl font-bold text-[#1f2a44] sm:text-2xl">1. Basic Information</h2>
        </div>

        <div className="mt-4 grid gap-4 sm:mt-5 sm:gap-5">
          <div>
            <label htmlFor="clubName" className="mb-1.5 block text-xs font-semibold text-gray-700">
              Club Name
            </label>
            <Input
              id="clubName"
              value={values.clubName}
              onChange={(event) => updateField("clubName", event.target.value)}
              placeholder="e.g. AASTU GDG"
              className={controlClassName}
            />
          </div>

          <div>
            <label htmlFor="clubDescription" className="mb-1.5 block text-xs font-semibold text-gray-700">
              Description
            </label>
            <Textarea
              id="clubDescription"
              value={values.description}
              onChange={(event) => updateField("description", event.target.value)}
              placeholder="Briefly describe the club's mission and activities..."
              className={cn("min-h-[120px]", controlClassName)}
            />
          </div>

          <div>
            <p className="mb-1.5 text-xs font-semibold text-gray-700">Club Banner</p>
            <FileUpload
              label=""
              helperText="Click to upload club banner or drag and drop"
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
              className="[&>label]:min-h-[150px] [&>label]:rounded-[10px]"
            />
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <DropdownSelect
                label="Category"
                value={values.category}
                options={[{ value: "", label: "Select Category" }, ...categoryOptions]}
                onValueChange={(value) => updateField("category", value)}
                className="[&>div>button]:rounded-[8px]"
              />
            </div>

            <div>
              <p className="mb-1.5 text-xs font-semibold text-gray-700">Club Logo</p>
              <FileUpload
                label=""
                helperText="Click to upload club logo or drag and drop"
                previewUrl={values.logoUrl || undefined}
                fileName={logoFile?.name || values.logoFileName}
                onChange={(file) => {
                  setLogoFile(file);
                }}
                onClear={() => {
                  setLogoFile(null);
                  updateField("logoUrl", "");
                  updateField("logoFileName", undefined);
                }}
                className="[&>label]:min-h-[100px] [&>label]:rounded-[10px]"
              />
            </div>
          </div>
        </div>
      </section>

      <section className="rounded-[10px] border border-gray-200 bg-white p-4 shadow-sm sm:p-6">
        <div className="flex flex-wrap items-center gap-2">
          <span className="inline-flex h-7 w-7 items-center justify-center rounded-md bg-[#fdf8ec] text-[#c49a22]">
            <Users size={14} />
          </span>
          <h2 className="text-xl font-bold text-[#1f2a44] sm:text-2xl">2. Leadership &amp; Supervision</h2>
        </div>

        <div className="mt-4 space-y-5 sm:mt-5 sm:space-y-6">
          <div>
            <h3 className="border-b border-gray-200 pb-2 text-base font-semibold text-[#1f2a44] sm:text-lg">Club President Info</h3>
            <div className="mt-3 grid gap-3 md:grid-cols-2">
              <div>
                <label htmlFor="presidentFullName" className="mb-1.5 block text-xs font-semibold text-gray-700">
                  Full Name
                </label>
                <Input
                  id="presidentFullName"
                  value={values.presidentFullName}
                  onChange={(event) => updateField("presidentFullName", event.target.value)}
                  placeholder="Dr. / Mr. / Ms."
                  className={controlClassName}
                />
              </div>
              <div>
                <DropdownSelect
                  label="Department"
                  value={values.presidentDepartment}
                  options={[{ value: "", label: "Select Department" }, ...departmentDropdownOptions]}
                  onValueChange={(value) => updateField("presidentDepartment", value)}
                  className="[&>div>button]:rounded-[8px]"
                />
              </div>

              <div>
                <label htmlFor="presidentId" className="mb-1.5 block text-xs font-semibold text-gray-700">
                  ID
                </label>
                <Input
                  id="presidentId"
                  value={values.presidentId}
                  onChange={(event) => updateField("presidentId", event.target.value)}
                  placeholder="ETS1234/15"
                  className={controlClassName}
                />
              </div>
              <div>
                <label htmlFor="presidentEmail" className="mb-1.5 block text-xs font-semibold text-gray-700">
                  Email Address
                </label>
                <Input
                  id="presidentEmail"
                  type="email"
                  value={values.presidentEmail}
                  onChange={(event) => updateField("presidentEmail", event.target.value)}
                  placeholder="name@aastustudent.edu.et"
                  className={controlClassName}
                />
              </div>

              <div>
                <label htmlFor="presidentPhone" className="mb-1.5 block text-xs font-semibold text-gray-700">
                  Phone Number
                </label>
                <Input
                  id="presidentPhone"
                  value={values.presidentPhone}
                  onChange={(event) => updateField("presidentPhone", event.target.value)}
                  placeholder="+2519XXXXXXXX"
                  className={controlClassName}
                />
              </div>
              <div>
                <label htmlFor="presidentDormBlock" className="mb-1.5 block text-xs font-semibold text-gray-700">
                  Dorm Block Number
                </label>
                <Input
                  id="presidentDormBlock"
                  value={values.presidentDormBlock}
                  onChange={(event) => updateField("presidentDormBlock", event.target.value)}
                  placeholder="B10"
                  className={controlClassName}
                />
              </div>

              <div>
                <label htmlFor="presidentDormRoom" className="mb-1.5 block text-xs font-semibold text-gray-700">
                  Dorm Room Number
                </label>
                <Input
                  id="presidentDormRoom"
                  value={values.presidentDormRoom}
                  onChange={(event) => updateField("presidentDormRoom", event.target.value)}
                  placeholder="221"
                  className={controlClassName}
                />
              </div>
            </div>
          </div>

          <div>
            <h3 className="border-b border-gray-200 pb-2 text-base font-semibold text-[#1f2a44] sm:text-lg">Club Advisor Info</h3>
            <div className="mt-3 grid gap-3 md:grid-cols-2">
              <div>
                <label htmlFor="advisorName" className="mb-1.5 block text-xs font-semibold text-gray-700">
                  Advisor Name
                </label>
                <Input
                  id="advisorName"
                  value={values.advisorName}
                  onChange={(event) => updateField("advisorName", event.target.value)}
                  placeholder="Dr. / Mr. / Ms."
                  className={controlClassName}
                />
              </div>
              <div>
                <DropdownSelect
                  label="Advisor Department"
                  value={values.advisorDepartment}
                  options={[{ value: "", label: "Select Department" }, ...departmentDropdownOptions]}
                  onValueChange={(value) => updateField("advisorDepartment", value)}
                  className="[&>div>button]:rounded-[8px]"
                />
              </div>

              <div>
                <label htmlFor="advisorPhone" className="mb-1.5 block text-xs font-semibold text-gray-700">
                  Phone Number
                </label>
                <Input
                  id="advisorPhone"
                  value={values.advisorPhone}
                  onChange={(event) => updateField("advisorPhone", event.target.value)}
                  placeholder="+2519XXXXXXXX"
                  className={controlClassName}
                />
              </div>
              <div>
                <label htmlFor="advisorEmail" className="mb-1.5 block text-xs font-semibold text-gray-700">
                  Email Address
                </label>
                <Input
                  id="advisorEmail"
                  type="email"
                  value={values.advisorEmail}
                  onChange={(event) => updateField("advisorEmail", event.target.value)}
                  placeholder="advisor@aastu.edu.et"
                  className={controlClassName}
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="rounded-[10px] border border-gray-200 bg-white p-4 shadow-sm sm:p-6">
        <div className="flex flex-wrap items-center gap-2">
          <span className="inline-flex h-7 w-7 items-center justify-center rounded-md bg-[#fdf8ec] text-[#c49a22]">
            <Globe size={14} />
          </span>
          <h2 className="text-xl font-bold text-[#1f2a44] sm:text-2xl">3. Online Presence</h2>
        </div>

        <div className="mt-4 grid gap-3 sm:mt-5 md:grid-cols-2">
          <div>
            <label htmlFor="telegramUrl" className="mb-1.5 block text-xs font-semibold text-gray-700">
              Telegram Link
            </label>
            <Input
              id="telegramUrl"
              value={values.telegramUrl}
              onChange={(event) => updateField("telegramUrl", event.target.value)}
              placeholder="t.me/"
              className={controlClassName}
            />
          </div>
          <div>
            <label htmlFor="linkedinUrl" className="mb-1.5 block text-xs font-semibold text-gray-700">
              LinkedIn URL
            </label>
            <Input
              id="linkedinUrl"
              value={values.linkedinUrl}
              onChange={(event) => updateField("linkedinUrl", event.target.value)}
              placeholder="https://linkedin.com/company/..."
              className={controlClassName}
            />
          </div>

          <div>
            <label htmlFor="githubUrl" className="mb-1.5 block text-xs font-semibold text-gray-700">
              GitHub
            </label>
            <Input
              id="githubUrl"
              value={values.githubUrl}
              onChange={(event) => updateField("githubUrl", event.target.value)}
              placeholder="https://github.com/club"
              className={controlClassName}
            />
          </div>
          <div>
            <label htmlFor="youtubeUrl" className="mb-1.5 block text-xs font-semibold text-gray-700">
              YouTube
            </label>
            <Input
              id="youtubeUrl"
              value={values.youtubeUrl}
              onChange={(event) => updateField("youtubeUrl", event.target.value)}
              placeholder="https://www.youtube.com/@club"
              className={controlClassName}
            />
          </div>

          <div className="md:col-span-2">
            <label htmlFor="websiteUrl" className="mb-1.5 block text-xs font-semibold text-gray-700">
              Official Website
            </label>
            <Input
              id="websiteUrl"
              value={values.websiteUrl}
              onChange={(event) => updateField("websiteUrl", event.target.value)}
              placeholder="https://gdg.club.aastu.edu.et"
              className={controlClassName}
            />
          </div>

          <div className="md:col-span-2">
            <label htmlFor="externalMembershipUrl" className="mb-1.5 block text-xs font-semibold text-gray-700">
              External Membership URL (Optional)
            </label>
            <Input
              id="externalMembershipUrl"
              value={values.externalMembershipUrl}
              onChange={(event) => updateField("externalMembershipUrl", event.target.value)}
              placeholder="https://external-foundation.org/join"
              className={controlClassName}
            />
          </div>
        </div>
      </section>

      <section className="rounded-[10px] border border-gray-200 bg-white p-4 shadow-sm sm:p-6">
        <div className="flex flex-wrap items-center gap-2">
          <span className="inline-flex h-7 w-7 items-center justify-center rounded-md bg-[#fdf8ec] text-[#c49a22]">
            <ShieldCheck size={14} />
          </span>
          <h2 className="text-xl font-bold text-[#1f2a44] sm:text-2xl">4. Status Management</h2>
          <span className="inline-flex h-5 items-center rounded-full bg-[#1f2a44] px-2 text-[10px] font-semibold uppercase tracking-[0.08em] text-white">
            Admin Only
          </span>
        </div>

        <div className="mt-5 grid gap-3 md:grid-cols-[340px_1fr] md:items-center">
          <div>
            <DropdownSelect
              label="Current Club Status"
              value={values.status}
              options={statusOptions}
              onValueChange={(value) => updateField("status", value as ClubStatus)}
              className="[&>div>button]:rounded-[8px]"
            />
            <p className="mt-2 text-xs text-gray-400">
              Changing this status will notify the club president via email and dashboard alerts.
            </p>
          </div>

        </div>
      </section>

      {statusMessage ? (
        <section className="rounded-[10px] border border-[#c49a22]/30 bg-[#fdf8ec] p-4 text-sm text-[#896814]">
          {statusMessage}
        </section>
      ) : null}

      <section className="rounded-[10px] border border-gray-200 bg-white p-4 shadow-sm sm:p-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <Button
            type="button"
            variant="outline"
            className="w-full sm:w-auto sm:min-w-[160px]"
            onClick={() => window.history.back()}
          >
            Cancel Changes
          </Button>

          <div className="flex w-full items-center gap-2 sm:w-auto">
            <Button type="button" variant="gold" className="flex-1 sm:min-w-[120px] sm:flex-none">
              Save Draft
            </Button>
            <Button type="submit" variant="goldSolid" className="flex-1 sm:min-w-[150px] sm:flex-none">
              {isCreate ? "Register Club" : "Save Changes"}
            </Button>
          </div>
        </div>
      </section>

      <section className="rounded-[10px] border border-[#d7e4ff] bg-[#eef4ff] p-4 text-sm text-[#33508e]">
        <div className="flex items-start gap-2">
          <CircleHelp size={16} className="mt-0.5 shrink-0" />
          <p>
            Need help with registration? Ensure advisor information is verified against HR records and that the president is an active student with no pending disciplinary actions.
          </p>
        </div>
      </section>
    </form>
  );
}
