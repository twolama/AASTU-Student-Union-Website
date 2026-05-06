"use client";

import { useMemo, useState, useRef, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Bold,
  Check,
  ChevronRight,
  CircleHelp,
  Globe,
  Info,
  Italic,
  Link as LinkIcon,
  List,
  Loader2,
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
import { useClubCategories } from "@/hooks/useClubCategories";
import { useCreateClub, useUpdateClub } from "@/hooks/useClubs";
import { useUsers } from "@/hooks/useUsers";
import { useDepartments } from "@/hooks/useDepartments";
import { toast } from "sonner";
import type { CurrentUser } from "@/schemas/user.schema";

type EditorMode = "create" | "edit";

export interface ClubEditorValues {
  clubName: string;
  description: string;
  category: string;
  department: string;
  locationLabel: string;
  logoLabel: string;
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
  advisorStudentId: string;
  advisorDormBlock: string;
  advisorDormRoom: string;
  telegramUrl: string;
  linkedinUrl: string;
  githubUrl: string;
  youtubeUrl: string;
  websiteUrl: string;
  externalMembershipUrl: string;
  status: ClubStatus;
  president: string; // ID
  advisor: string; // ID
}

interface ClubEditorProps {
  mode: EditorMode;
  initialValues: ClubEditorValues;
  clubId?: string;
}

const statusOptions: Array<{ value: ClubStatus; label: string }> = [
  { value: "pending", label: "Pending Review" },
  { value: "active", label: "Active" },
  { value: "rejected", label: "Rejected" },
];

export function ClubEditor({ mode, initialValues, clubId }: ClubEditorProps) {
  const router = useRouter();
  const [values, setValues] = useState<ClubEditorValues>(initialValues);
  const [bannerFile, setBannerFile] = useState<File | null>(null);
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [stagedBanner, setStagedBanner] = useState<File | null>(null);
  const [stagedLogo, setStagedLogo] = useState<File | null>(null);
  const [isBannerApproved, setIsBannerApproved] = useState(false);
  const [isLogoApproved, setIsLogoApproved] = useState(false);
  const descriptionRef = useRef<HTMLDivElement>(null);
  const isInternalUpdate = useRef(false);

  const [presidentSearch, setPresidentSearch] = useState("");
  const [advisorSearch, setAdvisorSearch] = useState("");

  const { data: categoriesData } = useClubCategories();
  const { data: presidentUsers } = useUsers(1, 10, { search: presidentSearch });
  const { data: advisorUsers } = useUsers(1, 10, { search: advisorSearch });
  const { data: departmentsData } = useDepartments();

  const createMutation = useCreateClub();
  const updateMutation = useUpdateClub();

  const isCreate = mode === "create";
  const isSubmitting = createMutation.isPending || updateMutation.isPending;

  // Initialize editor content once
  useEffect(() => {
    if (descriptionRef.current && initialValues.description) {
      descriptionRef.current.innerHTML = initialValues.description;
    }
  }, []);

  const categoryOptions = useMemo(() => {
    if (!categoriesData) return [];
    return categoriesData.map(cat => ({ value: cat.id, label: cat.name }));
  }, [categoriesData]);

  const departmentOptions = useMemo(() => {
    if (!departmentsData) return [];
    return departmentsData.map(dept => ({ value: dept.id, label: dept.name }));
  }, [departmentsData]);

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
    setValues((current) => ({ ...current, [key]: value ?? "" }));
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const formData = new FormData();
    formData.append("name", values.clubName);
    formData.append("description", values.description);
    if (values.category) formData.append("category", values.category);
    if (values.department) formData.append("department", values.department);
    formData.append("location_label", values.locationLabel);
    formData.append("logo_label", values.logoLabel);
    formData.append("status", values.status);

    if (bannerFile) formData.append("cover_image", bannerFile);
    if (logoFile) formData.append("logo", logoFile);

    // Links as JSON string
    formData.append("links", JSON.stringify({
      telegram: values.telegramUrl,
      linkedin: values.linkedinUrl,
      github: values.githubUrl,
      youtube: values.youtubeUrl,
      website: values.websiteUrl,
      membership: values.externalMembershipUrl
    }));

    // Add IDs
    if (values.president) formData.append("president", values.president);
    if (values.advisor) formData.append("advisor", values.advisor);

    // Add extra metadata for the backend to handle if needed
    formData.append("president_name", values.presidentFullName);
    formData.append("president_email", values.presidentEmail);
    formData.append("advisor_name", values.advisorName);

    try {
      if (isCreate) {
        await createMutation.mutateAsync(formData);
        toast.success("Club registered successfully");
      } else if (clubId) {
        await updateMutation.mutateAsync({ id: clubId, data: formData });
        toast.success("Club updated successfully");
      }
      router.push("/clubs");
    } catch (error: any) {
      let errorMessage = "Failed to save club";

      // Extract details from various potential error structures
      const details = error.payload?.details || error.details || error.response?.data?.details;

      if (details) {
        const firstField = Object.keys(details)[0];
        const fieldErrors = details[firstField];
        const fieldMessage = Array.isArray(fieldErrors) ? fieldErrors[0] : fieldErrors;

        const displayField = firstField.charAt(0).toUpperCase() + firstField.slice(1).replace("_", " ");
        errorMessage = `${displayField}: ${fieldMessage}`;
      } else if (error.name === "ZodError" && error.errors?.[0]) {
        const firstError = error.errors[0];
        errorMessage = `${firstError.path.join(".")}: ${firstError.message}`;
      } else {
        errorMessage = error.message || errorMessage;
      }

      toast.error(errorMessage);
    }
  }

  const formatDescription = (type: "bold" | "italic" | "list" | "link") => {
    const el = descriptionRef.current;
    if (!el) return;
    el.focus();
    switch (type) {
      case "bold":
        document.execCommand("bold");
        break;
      case "italic":
        document.execCommand("italic");
        break;
      case "list":
        document.execCommand("insertUnorderedList");
        break;
      case "link": {
        const url = prompt("Enter URL:", "https://");
        if (url) {
          document.execCommand("createLink", false, url);
        }
        break;
      }
    }
    // Sync the state after formatting
    updateField("description", el.innerHTML);
  };

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
        <span className="text-gray-500">{isCreate ? "Add New Club" : "Edit Club"}</span>
      </nav>

      <header className="space-y-2">
        <h1 className="text-[26px] font-bold tracking-tight text-[#1f2a44] sm:text-[34px]">{isCreate ? "Add New Club" : "Edit Club"}</h1>
        <p className="text-sm text-gray-500">
          {isCreate
            ? "Populate the official registry for the AASTU Student Union."
            : "Update club information and keep records aligned with current leadership."}
        </p>
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
            className="h-full rounded-full bg-linear-to-r from-[#c49a22] to-[#d3ac44] transition-all"
            style={{ width: `${completionPercent}%` }}
          />
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
              required
            />
          </div>

          <div>
            <label htmlFor="clubDescription" className="mb-1.5 block text-xs font-semibold text-gray-700">
              Description
            </label>
            <div className="overflow-hidden rounded-[10px] border border-gray-200 bg-white shadow-sm transition-colors focus-within:border-[#c49a22]">
              <div className="flex items-center gap-1 border-b border-gray-100 bg-[#fbfcfd] px-2 py-1.5">
                <button
                  type="button"
                  onClick={() => formatDescription("bold")}
                  className="inline-flex h-7 w-7 items-center justify-center rounded-md text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600"
                  title="Bold"
                >
                  <Bold size={14} />
                </button>
                <button
                  type="button"
                  onClick={() => formatDescription("italic")}
                  className="inline-flex h-7 w-7 items-center justify-center rounded-md text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600"
                  title="Italic"
                >
                  <Italic size={14} />
                </button>
                <button
                  type="button"
                  onClick={() => formatDescription("list")}
                  className="inline-flex h-7 w-7 items-center justify-center rounded-md text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600"
                  title="Bullet List"
                >
                  <List size={14} />
                </button>
                <button
                  type="button"
                  onClick={() => formatDescription("link")}
                  className="inline-flex h-7 w-7 items-center justify-center rounded-md text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600"
                  title="Insert Link"
                >
                  <LinkIcon size={14} />
                </button>
              </div>
              <div
                id="clubDescription"
                ref={descriptionRef}
                contentEditable
                onInput={(e) => updateField("description", (e.target as HTMLDivElement).innerHTML)}
                className="prose prose-sm max-w-none min-h-[160px] w-full rounded-none border-0 bg-transparent px-3 py-2 text-sm text-slate-700 shadow-none outline-none focus:ring-0"
              />
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label htmlFor="locationLabel" className="mb-1.5 block text-xs font-semibold text-gray-700">
                Club Location / Office
              </label>
              <Input
                id="locationLabel"
                value={values.locationLabel}
                onChange={(event) => updateField("locationLabel", event.target.value)}
                placeholder="e.g. Block 51, Room 102"
                className={controlClassName}
                required
              />
            </div>
            <div>
              <label htmlFor="logoLabel" className="mb-1.5 block text-xs font-semibold text-gray-700">
                Logo Short Label (Initials)
              </label>
              <Input
                id="logoLabel"
                value={values.logoLabel}
                onChange={(event) => updateField("logoLabel", event.target.value)}
                placeholder="e.g. GDG"
                className={controlClassName}
                required
              />
            </div>
          </div>

          <div>
            <p className="mb-1.5 text-xs font-semibold text-gray-700">Club Banner</p>
            <FileUpload
              label=""
              helperText="Click to upload club banner or drag and drop"
              file={stagedBanner}
              previewUrl={values.bannerUrl || undefined}
              fileName={stagedBanner?.name || values.bannerFileName}
              onChange={(file) => {
                setStagedBanner(file);
                setIsBannerApproved(false);
              }}
              onClear={() => {
                setStagedBanner(null);
                setBannerFile(null);
                setIsBannerApproved(false);
                updateField("bannerUrl", "");
                updateField("bannerFileName", undefined);
              }}
              className="[&>label]:min-h-[150px] [&>label]:rounded-[10px]"
            />
            {stagedBanner && !isBannerApproved && (
              <div className="mt-2 flex items-center justify-between rounded-lg border border-[#c49a22]/20 bg-[#fdfaf0] p-3">
                <p className="text-xs font-medium text-[#8c6c14]">Confirm this banner image for the club?</p>
                <Button
                  type="button"
                  size="sm"
                  variant="goldSolid"
                  onClick={() => {
                    setBannerFile(stagedBanner);
                    setIsBannerApproved(true);
                    toast.success("Banner approved");
                  }}
                  className="h-8 px-4 text-[11px]"
                >
                  Approve Banner
                </Button>
              </div>
            )}
            {isBannerApproved && bannerFile && (
              <p className="mt-1.5 flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-[#10b981]">
                <Check size={12} /> Banner Approved
              </p>
            )}
          </div>

          <div className="grid gap-4 md:grid-cols-3">
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
              <DropdownSelect
                label="Department"
                value={values.department}
                options={[{ value: "", label: "General (No Department)" }, ...departmentOptions]}
                onValueChange={(value) => updateField("department", value)}
                className="[&>div>button]:rounded-[8px]"
              />
            </div>

            <div>
              <p className="mb-1.5 text-xs font-semibold text-gray-700">Club Logo</p>
              <FileUpload
                label=""
                helperText="Click to upload club logo or drag and drop"
                file={stagedLogo}
                previewUrl={values.logoUrl || undefined}
                fileName={stagedLogo?.name || values.logoFileName}
                onChange={(file) => {
                  setStagedLogo(file);
                  setIsLogoApproved(false);
                }}
                onClear={() => {
                  setStagedLogo(null);
                  setLogoFile(null);
                  setIsLogoApproved(false);
                  updateField("logoUrl", "");
                  updateField("logoFileName", undefined);
                }}
                className="[&>label]:min-h-[100px] [&>label]:rounded-[10px]"
              />
              {stagedLogo && !isLogoApproved && (
                <div className="mt-2 flex items-center justify-between rounded-lg border border-[#c49a22]/20 bg-[#fdfaf0] p-3">
                  <p className="text-xs font-medium text-[#8c6c14]">Approve this logo?</p>
                  <Button
                    type="button"
                    size="sm"
                    variant="goldSolid"
                    onClick={() => {
                      setLogoFile(stagedLogo);
                      setIsLogoApproved(true);
                      toast.success("Logo approved");
                    }}
                    className="h-8 px-4 text-[11px]"
                  >
                    Approve Logo
                  </Button>
                </div>
              )}
              {isLogoApproved && logoFile && (
                <p className="mt-1.5 flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-[#10b981]">
                  <Check size={12} /> Logo Approved
                </p>
              )}
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
            <div className="mt-3 grid gap-4">
              <div className="relative">
                <label className="mb-1.5 block text-xs font-semibold text-gray-700">Select User as President</label>
                <Input
                  value={presidentSearch}
                  onChange={(e) => setPresidentSearch(e.target.value)}
                  placeholder="Search by name, email or student ID..."
                  className={controlClassName}
                />
                {presidentSearch && presidentUsers?.data && presidentUsers.data.length > 0 && (
                  <div className="absolute z-10 mt-1 max-h-48 w-full overflow-auto rounded-lg border border-gray-200 bg-white shadow-lg">
                    {presidentUsers.data.map((user: CurrentUser) => (
                      <button
                        key={user.id}
                        type="button"
                        className="flex w-full flex-col px-4 py-2 text-left hover:bg-gray-50"
                        onClick={() => {
                          updateField("president", user.id);
                          updateField("presidentFullName", user.name);
                          updateField("presidentId", (user as any).studentId || "");
                          updateField("presidentEmail", user.email || "");
                          updateField("presidentDepartment", user.departmentDetails?.name || (user as any).department || "");
                          updateField("presidentPhone", (user as any).phoneNumber || "");
                          updateField("presidentDormBlock", (user as any).dormBlock || "");
                          updateField("presidentDormRoom", (user as any).dormRoom || "");
                          setPresidentSearch("");
                        }}
                      >
                        <span className="text-sm font-medium text-gray-900">{user.name}</span>
                        <span className="text-xs text-gray-500">{user.email} {user.studentId ? `· ${user.studentId}` : ""}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {values.presidentFullName && (
                <div className="rounded-lg bg-gray-50 p-4">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#f3ead0] text-sm font-semibold text-[#8c6c14]">
                      {values.presidentFullName.charAt(0)}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="text-sm font-bold text-gray-900">{values.presidentFullName}</p>
                        {values.presidentId && (
                          <span className="text-[10px] font-bold text-gray-400">#{values.presidentId}</span>
                        )}
                      </div>
                      <p className="text-xs text-gray-500">{values.presidentEmail} · {values.presidentPhone || "No phone"}</p>
                      <div className="mt-1 flex flex-wrap gap-x-3 gap-y-1">
                        <p className="text-[10px] font-semibold uppercase tracking-wider text-[#c49a22]">{values.presidentDepartment || "No Department"}</p>
                        {values.presidentDormBlock && (
                          <p className="text-[10px] font-medium text-gray-400">Block {values.presidentDormBlock}, Room {values.presidentDormRoom}</p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div>
            <h3 className="border-b border-gray-200 pb-2 text-base font-semibold text-[#1f2a44] sm:text-lg">Club Advisor Info</h3>
            <div className="mt-3 grid gap-4">
              <div className="relative">
                <label className="mb-1.5 block text-xs font-semibold text-gray-700">Select User as Advisor</label>
                <Input
                  value={advisorSearch}
                  onChange={(e) => setAdvisorSearch(e.target.value)}
                  placeholder="Search by name, email..."
                  className={controlClassName}
                />
                {advisorSearch && advisorUsers?.data && advisorUsers.data.length > 0 && (
                  <div className="absolute z-10 mt-1 max-h-48 w-full overflow-auto rounded-lg border border-gray-200 bg-white shadow-lg">
                    {advisorUsers.data.map((user: CurrentUser) => (
                      <button
                        key={user.id}
                        type="button"
                        className="flex w-full flex-col px-4 py-2 text-left hover:bg-gray-50"
                        onClick={() => {
                          updateField("advisor", user.id);
                          updateField("advisorName", user.name);
                          updateField("advisorEmail", user.email || "");
                          updateField("advisorDepartment", user.departmentDetails?.name || "");
                          updateField("advisorPhone", (user as any).phoneNumber || "");
                          updateField("advisorStudentId", (user as any).studentId || "");
                          updateField("advisorDormBlock", (user as any).dormBlock || "");
                          updateField("advisorDormRoom", (user as any).dormRoom || "");
                          setAdvisorSearch("");
                        }}
                      >
                        <span className="text-sm font-medium text-gray-900">{user.name}</span>
                        <span className="text-xs text-gray-500">{user.email}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {values.advisorName && (
                <div className="rounded-lg bg-gray-50 p-4">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#eef4ff] text-sm font-semibold text-[#33508e]">
                      {values.advisorName.charAt(0)}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="text-sm font-bold text-gray-900">{values.advisorName}</p>
                        {values.advisorStudentId && (
                          <span className="text-[10px] font-bold text-gray-400">#{values.advisorStudentId}</span>
                        )}
                      </div>
                      <p className="text-xs text-gray-500">{values.advisorEmail} · {values.advisorPhone || "No phone"}</p>
                      <div className="mt-1 flex flex-wrap gap-x-3 gap-y-1">
                        <p className="text-[10px] font-semibold uppercase tracking-wider text-[#33508e]">{values.advisorDepartment || "No Department"}</p>
                        {values.advisorDormBlock && (
                          <p className="text-[10px] font-medium text-gray-400">Block {values.advisorDormBlock}, Room {values.advisorDormRoom}</p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              )}
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
          <div className="md:col-span-2">
            <label htmlFor="websiteUrl" className="mb-1.5 block text-xs font-semibold text-gray-700">
              Official Website
            </label>
            <Input
              id="websiteUrl"
              value={values.websiteUrl}
              onChange={(event) => updateField("websiteUrl", event.target.value)}
              placeholder="https://club.aastu.edu.et"
              className={controlClassName}
            />
          </div>

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
              GitHub URL
            </label>
            <Input
              id="githubUrl"
              value={values.githubUrl}
              onChange={(event) => updateField("githubUrl", event.target.value)}
              placeholder="https://github.com/..."
              className={controlClassName}
            />
          </div>
          <div>
            <label htmlFor="youtubeUrl" className="mb-1.5 block text-xs font-semibold text-gray-700">
              YouTube Channel
            </label>
            <Input
              id="youtubeUrl"
              value={values.youtubeUrl}
              onChange={(event) => updateField("youtubeUrl", event.target.value)}
              placeholder="https://youtube.com/@..."
              className={controlClassName}
            />
          </div>
          <div className="md:col-span-2">
            <label htmlFor="externalMembershipUrl" className="mb-1.5 block text-xs font-semibold text-gray-700">
              External Membership Link (Registration Form)
            </label>
            <Input
              id="externalMembershipUrl"
              value={values.externalMembershipUrl}
              onChange={(event) => updateField("externalMembershipUrl", event.target.value)}
              placeholder="Google Form or Custom Portal link"
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
          </div>
        </div>
      </section>

      <section className="rounded-[10px] border border-gray-200 bg-white p-4 shadow-sm sm:p-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <Button
            type="button"
            variant="outline"
            className="w-full sm:w-auto sm:min-w-[160px]"
            onClick={() => router.back()}
            disabled={isSubmitting}
          >
            Cancel
          </Button>

          <div className="flex w-full items-center gap-2 sm:w-auto">
            <Button
              type="submit"
              variant="goldSolid"
              className="flex-1 sm:min-w-[150px] sm:flex-none"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                isCreate ? "Register Club" : "Save Changes"
              )}
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
