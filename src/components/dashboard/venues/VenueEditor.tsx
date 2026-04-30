"use client";

import Image from "next/image";
import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import {
  Camera,
  Check,
  ChevronRight,
  ImagePlus,
  Info,
  Link as LinkIcon,
  MapPinned,
  Plus,
  Search,
  SquarePen,
  Trash2,
  X,
} from "lucide-react";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { RichTextEditor } from "@/components/ui/RichTextEditor";
import { DropdownSelect } from "@/components/ui/DropdownSelect";
import { FileUpload } from "@/components/ui/FileUpload";
import { Switch } from "@/components/ui/Switch";
import { Button } from "@/components/ui/Button";
import { useVenueCategories, useCreateVenue, useUpdateVenue, useUploadVenueGalleryImage, useDeleteVenueGalleryImage } from "@/hooks/useVenues";
import type { VenueStatus } from "@/types/dashboard";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { VenueFormSchema } from "@/schemas/venue.schema";
import { cn } from "@/lib/utils";
import { ConfirmationDialog } from "@/components/ui/ConfirmationDialog";

type EditorMode = "create" | "edit";

export interface VenueEditorValues {
  name: string;
  category: string;
  status: VenueStatus;
  maxCapacity: string;
  floorLevel: string;
  campusBlock: string;
  nearbyLandmarks: string;
  shortDescription: string;
  fullDescription: string;
  publicAvailability: boolean;
  mapCoordinates: string;
  heroImageUrl: string;
  heroImageName?: string;
  gallery: { id: string; url: string }[];
  thumbnailUrl: string;
  thumbnailName?: string;
  amenities: string[];
  managerName: string;
  phoneNumber: string;
  officialEmail: string;
}

interface VenueEditorProps {
  mode: EditorMode;
  venueId?: string;
  initialValues: VenueEditorValues;
}

function extractCoordinates(input: string): { lat: number; lng: number } {
  // Case 1: Simple coordinates "lat, lng"
  if (!input.startsWith("http") && input.includes(",")) {
    const parts = input.split(",").map(s => parseFloat(s.trim()));
    if (parts.length >= 2 && !isNaN(parts[0]) && !isNaN(parts[1])) {
      return { lat: parts[0], lng: parts[1] };
    }
  }

  // Case 2: Google Maps URL
  // Matches /@lat,lng or /dir/lat,lng or /search/lat,lng
  const regex = /@(-?\d+\.\d+),(-?\d+\.\d+)/;
  const match = input.match(regex);
  if (match) {
    return { lat: parseFloat(match[1]), lng: parseFloat(match[2]) };
  }

  // Case 3: URL with query parameters !2d<lng>!3d<lat>
  const latMatch = input.match(/!3d(-?\d+\.\d+)/);
  const lngMatch = input.match(/!2d(-?\d+\.\d+)/);
  if (latMatch && lngMatch) {
    return { lat: parseFloat(latMatch[1]), lng: parseFloat(lngMatch[2]) };
  }

  // Fallback
  return { lat: 9.0182, lng: 38.7525 };
}

export function VenueEditor({ mode, venueId, initialValues }: VenueEditorProps) {
  const [values, setValues] = useState<VenueEditorValues>(initialValues);
  const [heroImageFile, setHeroImageFile] = useState<File | null>(null);
  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null);
  const [newAmenity, setNewAmenity] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string[]>>({});
  const [pendingGalleryFile, setPendingGalleryFile] = useState<File | null>(null);
  const [isUploadingGallery, setIsUploadingGallery] = useState(false);
  const [deleteImageConfirm, setDeleteImageConfirm] = useState<string | null>(null);

  const router = useRouter();
  const { data: categoriesData } = useVenueCategories();
  const createVenue = useCreateVenue();
  const updateVenue = useUpdateVenue();
  const uploadGalleryImage = useUploadVenueGalleryImage();
  const deleteGalleryImage = useDeleteVenueGalleryImage();

  const categoryOptions = useMemo(() => {
    if (!categoriesData) return [];
    return categoriesData.map(cat => ({ value: cat.id, label: cat.name }));
  }, [categoriesData]);

  const title = mode === "create" ? "Create New Venue" : "Edit Venue";
  const subtitle =
    mode === "create"
      ? "Register a new physical space for student activities, clubs, and academic events."
      : "Update venue records, specifications, and gallery assets.";

  const venueStatusOptions: Array<{ value: VenueStatus; label: string }> = [
    { value: "active", label: "Active" },
    { value: "maintenance", label: "Maintenance" },
    { value: "inactive", label: "Inactive" },
  ];

  const completionPercent = useMemo(() => {
    const checks = [
      values.name.trim().length > 3,
      values.category.length > 0,
      values.status.length > 0,
      values.maxCapacity.trim().length > 0,
      values.shortDescription.trim().length > 16,
      values.managerName.trim().length > 3,
      values.officialEmail.includes("@"),
    ];

    return Math.round((checks.filter(Boolean).length / checks.length) * 100);
  }, [values]);


  function updateField<K extends keyof VenueEditorValues>(key: K, value: VenueEditorValues[K]) {
    setValues((current) => ({ ...current, [key]: value }));
  }


  function addAmenity() {
    const clean = newAmenity.trim();
    if (!clean) {
      return;
    }

    if (values.amenities.some((item) => item.toLowerCase() === clean.toLowerCase())) {
      setNewAmenity("");
      return;
    }

    updateField("amenities", [...values.amenities, clean]);
    setNewAmenity("");
  }

  function removeAmenity(item: string) {
    updateField(
      "amenities",
      values.amenities.filter((entry) => entry !== item)
    );
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSubmitting(true);
    setFieldErrors({});

    // 1. Frontend Validation using Zod
    const validation = VenueFormSchema.safeParse(values);
    if (!validation.success) {
      const fieldErrors = validation.error.flatten().fieldErrors;
      const errors: Record<string, string[]> = {};
      
      // Map Zod schema keys to our Record<string, string[]> format and UI field names
      Object.entries(fieldErrors).forEach(([key, messages]) => {
        if (!messages) return;
        
        // Direct mapping
        errors[key] = messages;
        
        // CamelCase to snake_case / UI mapping
        if (key === "phoneNumber") errors.manager_phone = messages;
        if (key === "officialEmail") errors.manager_email = messages;
        if (key === "managerName") errors.manager_name = messages;
        if (key === "mapCoordinates") errors.map_coordinates = messages;
        if (key === "maxCapacity") errors.max_capacity = messages;
        if (key === "category") errors.category_id = messages;
        if (key === "shortDescription") errors.short_description = messages;
      });

      setFieldErrors(errors);
      toast.error("Please fix the validation errors");
      setIsSubmitting(false);
      return;
    }

    try {
      const formData = new FormData();
      formData.append("name", values.name);
      formData.append("category_id", values.category);
      formData.append("max_capacity", values.maxCapacity);
      formData.append("floor_level", values.floorLevel);
      formData.append("campus_block", values.campusBlock);
      formData.append("nearby_landmarks", values.nearbyLandmarks);
      formData.append("short_description", values.shortDescription);
      formData.append("full_description", values.fullDescription);
      formData.append("status", values.status);
      formData.append("is_publicly_available", String(values.publicAvailability));
      formData.append("manager_name", values.managerName);
      formData.append("manager_phone", values.phoneNumber);
      formData.append("manager_email", values.officialEmail);
      
      // Parse coordinates or URL
      const coords = extractCoordinates(values.mapCoordinates);
      
      formData.append("map_coordinates", JSON.stringify(coords));
      formData.append("mapCoordinates", JSON.stringify(coords));
      
      if (values.mapCoordinates.startsWith("http")) {
        formData.append("google_maps_url", values.mapCoordinates);
      }

      // Contact object
      formData.append("contact", JSON.stringify({
        name: values.managerName,
        role: "Manager",
        phone: values.phoneNumber,
        email: values.officialEmail
      }));

      // Amenities
      formData.append("amenities", JSON.stringify(values.amenities));

      // Files
      if (heroImageFile) formData.append("hero_image", heroImageFile);
      if (thumbnailFile) formData.append("thumbnail", thumbnailFile);

      if (mode === "create") {
        await createVenue.mutateAsync(formData);
        toast.success("Venue created successfully");
        router.push("/venues");
      } else if (venueId) {
        await updateVenue.mutateAsync({ id: venueId, data: formData });
        toast.success("Venue updated successfully");
        router.push("/venues");
      }
    } catch (error: any) {
      console.error("[VenueEditor] Submission error:", error);
      
      let details: any = null;
      let message = error.message;

      // 1. Try to extract details from payload
      const payload = error.payload || error.response?.data;
      if (payload) {
        details = payload.details || payload.error?.details || (payload.code === "VALIDATION_ERROR" ? payload.details || payload : null);
      }

      // 2. Try to parse message if it looks like JSON
      if (!details && typeof message === "string" && message.includes("{")) {
        try {
          const startIdx = message.indexOf("{");
          const jsonStr = message.substring(startIdx);
          const parsed = JSON.parse(jsonStr);
          details = parsed.details || parsed.error?.details || (parsed.code === "VALIDATION_ERROR" ? parsed.details || parsed : parsed);
        } catch (e) {}
      }

      if (details) {
        console.log("[VenueEditor] Found validation details:", details);
        const mappedErrors: Record<string, string[]> = {};
        
        // Helper to safely add errors
        const addError = (key: string, val: any) => {
          if (!val) return;
          mappedErrors[key] = Array.isArray(val) ? val : [String(val)];
        };

        // Map everything we can find
        Object.keys(details).forEach(key => {
          // Direct mapping for common fields
          if (["name", "status", "amenities"].includes(key)) addError(key, details[key]);
          
          // CamelCase to snake_case mappings
          if (key === "maxCapacity" || key === "max_capacity") addError("max_capacity", details[key]);
          if (key === "categoryId" || key === "category_id" || key === "category") addError("category_id", details[key]);
          if (key === "floorLevel" || key === "floor_level") addError("floor_level", details[key]);
          if (key === "campusBlock" || key === "campus_block") addError("campus_block", details[key]);
          if (key === "nearbyLandmarks" || key === "nearby_landmarks") addError("nearby_landmarks", details[key]);
          if (key === "shortDescription" || key === "short_description") addError("short_description", details[key]);
          if (key === "fullDescription" || key === "full_description") addError("full_description", details[key]);
          
          // Contact mappings
          if (key === "managerName" || key === "manager_name") addError("manager_name", details[key]);
          if (key === "managerPhone" || key === "manager_phone" || key === "phoneNumber") addError("manager_phone", details[key]);
          if (key === "managerEmail" || key === "manager_email" || key === "officialEmail") addError("manager_email", details[key]);
          
          // Map coordinates
          if (key === "mapCoordinates" || key === "map_coordinates") {
            const val = details[key];
            if (Array.isArray(val)) {
              addError("map_coordinates", val);
            } else if (typeof val === "object" && val !== null) {
              const coords = val as any;
              if (coords.lat) addError("map_coordinates", [coords.lat]);
              else if (coords.lng) addError("map_coordinates", [coords.lng]);
            }
          }
          
          // Nested contact object mapping (as seen in user log)
          if (key === "contact") {
            const cErrs = Array.isArray(details[key]) ? details[key] : [String(details[key])];
            cErrs.forEach((err: string) => {
              const low = err.toLowerCase();
              if (low.includes("name")) addError("manager_name", [err]);
              else if (low.includes("phone")) addError("manager_phone", [err]);
              else if (low.includes("email")) addError("manager_email", [err]);
              else addError("manager_name", [err]); // Default
            });
          }

          // Venue ID association errors
          if (key === "venue_id" || key === "venueId") {
            toast.error("Venue association error: " + (Array.isArray(details[key]) ? details[key][0] : details[key]));
          }

          // Fallback: If not explicitly mapped above, add it directly
          if (!mappedErrors[key]) addError(key, details[key]);
        });

        // Debug unmapped errors
        const unmapped = Object.keys(mappedErrors).filter(k => 
          !["name", "category_id", "max_capacity", "floor_level", "campus_block", "nearby_landmarks", 
            "short_description", "full_description", "manager_name", "manager_phone", 
            "manager_email", "map_coordinates", "hero_image", "thumbnail", "location"].includes(k)
        );
        if (unmapped.length > 0) {
          unmapped.forEach(k => toast.error(`${k}: ${mappedErrors[k][0]}`));
        }

        console.log("[VenueEditor] Final mapped errors:", mappedErrors);
        setFieldErrors(mappedErrors);
        toast.error("Please correct the validation errors");
      } else {
        toast.error(message || "Failed to save venue");
      }
    } finally {
      setIsSubmitting(false);
    }
  }

  const getFieldError = (backendKey: string) => {
    return fieldErrors[backendKey]?.[0];
  };

  const renderError = (backendKey: string) => {
    const error = getFieldError(backendKey);
    if (!error) return null;
    return <p className="mt-1 text-xs font-medium text-red-500">{error}</p>;
  };

  const handleGalleryUpload = (file: File) => {
    if (!venueId && mode === "edit") return;
    setPendingGalleryFile(file);
  };

  const confirmGalleryUpload = async () => {
    if (!pendingGalleryFile) return;
    
    setIsUploadingGallery(true);
    const formData = new FormData();
    formData.append("image", pendingGalleryFile);
    if (venueId) formData.append("venue_id", venueId);
    
    try {
      const newImage = await uploadGalleryImage.mutateAsync(formData);
      toast.success("Gallery image uploaded");
      
      // Update local state to reflect new image instantly
      updateField("gallery", [...values.gallery, { id: newImage.id, url: newImage.image }]);
      
      setPendingGalleryFile(null);
    } catch (error: any) {
      toast.error(error.message || "Upload failed");
    } finally {
      setIsUploadingGallery(false);
    }
  };

  const cancelGalleryUpload = () => {
    setPendingGalleryFile(null);
  };

  const handleGalleryDelete = async () => {
    if (!deleteImageConfirm) return;
    
    try {
      await deleteGalleryImage.mutateAsync(deleteImageConfirm);
      toast.success("Image removed from gallery");
      
      // Update local state to reflect removal instantly
      updateField("gallery", values.gallery.filter(img => img.id !== deleteImageConfirm));
    } catch (error: any) {
      toast.error(error.message || "Delete failed");
    } finally {
      setDeleteImageConfirm(null);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <nav aria-label="Breadcrumb" className="flex flex-wrap items-center gap-1.5 text-sm text-gray-400">
        <Link href="/dashboard" className="font-medium text-[#c49a22] hover:underline">
          Dashboard
        </Link>
        <ChevronRight size={14} />
        <Link href="/venues" className="text-gray-500 hover:text-gray-700">
          Venues
        </Link>
        <ChevronRight size={14} />
        <span className="text-gray-500">{title}</span>
      </nav>

      <header className="space-y-1">
        <h1 className="text-[32px] font-bold tracking-tight text-[#1f2a44]">{title}</h1>
        <p className="text-sm text-gray-500">{subtitle}</p>
      </header>

      <section className="rounded-[10px] border border-gray-200 bg-white p-4 shadow-sm">
        <div className="flex items-center justify-between gap-2">
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-gray-500">Form Progress</p>
          <p className="text-xs font-semibold text-[#c49a22]">{completionPercent}%</p>
        </div>
        <div className="mt-2 h-2 overflow-hidden rounded-full bg-gray-100">
          <div className="h-full rounded-full bg-linear-to-r from-[#c49a22] to-[#d3ac44]" style={{ width: `${completionPercent}%` }} />
        </div>
      </section>

      <section className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_260px]">
        <div className="space-y-4">
          <article className="rounded-[10px] border border-gray-200 bg-white p-4 shadow-sm sm:p-5">
            <h2 className="inline-flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.14em] text-[#1f2a44]">
              <SquarePen size={14} className="text-[#c49a22]" />
              Venue Basic Details
            </h2>

            <div className="mt-4 grid gap-3 md:grid-cols-2">
              <div>
                <label htmlFor="venue-name" className="mb-1.5 block text-xs font-semibold text-gray-700">
                  Venue Name
                </label>
                <Input
                  id="venue-name"
                  value={values.name}
                  onChange={(event) => updateField("name", event.target.value)}
                  placeholder="e.g. Blue Hall, Main Auditorium"
                  className={`h-10 rounded-[8px] ${getFieldError("name") ? "border-red-500" : ""}`}
                />
                {renderError("name")}
              </div>

              <div className="space-y-1.5">
                <DropdownSelect
                  label="Venue Category"
                  value={values.category}
                  options={[{ value: "", label: "Select Category" }, ...categoryOptions]}
                  onValueChange={(value) => updateField("category", value)}
                  className={`[&>div>button]:h-10 [&>div>button]:rounded-[8px] ${getFieldError("category_id") ? "border-red-500" : ""}`}
                />
                {renderError("category_id")}
              </div>

              <div className="space-y-1.5">
                <DropdownSelect
                  label="Venue Status"
                  value={values.status}
                  options={venueStatusOptions}
                  onValueChange={(value) => updateField("status", value as VenueStatus)}
                  className={`[&>div>button]:h-10 [&>div>button]:rounded-[8px] ${getFieldError("status") ? "border-red-500" : ""}`}
                />
                {renderError("status")}
              </div>

              <div>
                <label htmlFor="venue-capacity" className="mb-1.5 block text-xs font-semibold text-gray-700">
                  Max Capacity
                </label>
                <Input
                  id="venue-capacity"
                  type="number"
                  min={0}
                  value={values.maxCapacity}
                  onChange={(event) => updateField("maxCapacity", event.target.value)}
                  placeholder="0"
                  className={`h-10 rounded-[8px] ${getFieldError("max_capacity") ? "border-red-500" : ""}`}
                />
                {renderError("max_capacity")}
              </div>

              <div>
                <label htmlFor="venue-floor" className="mb-1.5 block text-xs font-semibold text-gray-700">
                  Floor Level
                </label>
                <Input
                  id="venue-floor"
                  value={values.floorLevel}
                  onChange={(event) => updateField("floorLevel", event.target.value)}
                  placeholder="e.g. 2nd Floor"
                  className={`h-10 rounded-[8px] ${getFieldError("floor_level") ? "border-red-500" : ""}`}
                />
                {renderError("floor_level")}
              </div>

              <div>
                <label htmlFor="venue-block" className="mb-1.5 block text-xs font-semibold text-gray-700">
                  Campus Block
                </label>
                <Input
                  id="venue-block"
                  value={values.campusBlock}
                  onChange={(event) => updateField("campusBlock", event.target.value)}
                  placeholder="e.g. Block B"
                  className={`h-10 rounded-[8px] ${getFieldError("campus_block") ? "border-red-500" : ""}`}
                />
                {renderError("campus_block")}
              </div>

              <div>
                <label htmlFor="venue-landmark" className="mb-1.5 block text-xs font-semibold text-gray-700">
                  Nearby Landmarks
                </label>
                <Input
                  id="venue-landmark"
                  value={values.nearbyLandmarks}
                  onChange={(event) => updateField("nearbyLandmarks", event.target.value)}
                  placeholder="e.g. Near East Gate"
                  className={`h-10 rounded-[8px] ${getFieldError("nearby_landmarks") ? "border-red-500" : ""}`}
                />
                {renderError("nearby_landmarks")}
              </div>

              <div className="md:col-span-2">
                <RichTextEditor
                  label="Short Description"
                  value={values.shortDescription}
                  onChange={(val) => updateField("shortDescription", val)}
                  placeholder="A brief summary of the venue for card previews..."
                  minHeight="86px"
                  error={fieldErrors.short_description}
                />
              </div>

              <div className="md:col-span-2">
                <RichTextEditor
                  label="Full Description"
                  value={values.fullDescription}
                  onChange={(val) => updateField("fullDescription", val)}
                  placeholder="Enter detailed venue description here..."
                  minHeight="300px"
                  error={fieldErrors.full_description}
                />
              </div>
            </div>

            <div className="mt-4 flex items-center justify-between rounded-[8px] bg-[#f8fafc] px-3 py-2.5">
              <div>
                <p className="font-semibold text-gray-700">Public Availability</p>
                <p className="text-xs text-gray-500">Allow venue to be booked in the student portal.</p>
              </div>
              <Switch
                checked={values.publicAvailability}
                onCheckedChange={(checked) => updateField("publicAvailability", checked)}
              />
            </div>
          </article>

          <article className="rounded-[10px] border border-gray-200 bg-white p-4 shadow-sm sm:p-5">
            <h2 className="inline-flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.14em] text-[#1f2a44]">
              <ImagePlus size={14} className="text-[#c49a22]" />
              Venue Hero Image
            </h2>

            <div className="mt-4">
              <FileUpload
                label=""
                helperText="Click or drag and drop to upload primary hero image"
                file={heroImageFile}
                previewUrl={values.heroImageUrl || undefined}
                fileName={heroImageFile?.name || values.heroImageName}
                onChange={(file) => setHeroImageFile(file)}
                onClear={() => {
                  setHeroImageFile(null);
                  updateField("heroImageUrl", "");
                  updateField("heroImageName", undefined);
                }}
                className="[&>label]:min-h-[120px] [&>label]:rounded-[10px]"
              />
              {renderError("hero_image")}
            </div>
          </article>

          <article className="rounded-[10px] border border-gray-200 bg-white p-4 shadow-sm sm:p-5">
            <h2 className="inline-flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.14em] text-[#1f2a44]">
              <Camera size={14} className="text-[#c49a22]" />
              Venue Gallery
            </h2>

            <div className="mt-4 flex flex-wrap gap-3">
              {values.gallery.map((item) => (
                <div key={item.id} className="group relative h-20 w-20 overflow-hidden rounded-[8px] border border-gray-200 bg-gray-100">
                  <Image src={item.url} alt="Venue gallery image" fill className="object-cover" />
                  <button
                    type="button"
                    onClick={() => setDeleteImageConfirm(item.id)}
                    className="absolute right-1 top-1 inline-flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-white opacity-0 transition-opacity group-hover:opacity-100"
                    aria-label="Remove gallery image"
                  >
                    <Trash2 size={11} />
                  </button>
                </div>
              ))}

              {pendingGalleryFile && (
                <div className="relative h-20 w-20 overflow-hidden rounded-[8px] border-2 border-[#c49a22] bg-gray-100">
                  <Image 
                    src={URL.createObjectURL(pendingGalleryFile)} 
                    alt="Pending upload" 
                    fill 
                    className="object-cover opacity-60" 
                  />
                  <div className="absolute inset-0 flex flex-col items-center justify-center gap-1 bg-black/20 p-1">
                    <button
                      type="button"
                      onClick={confirmGalleryUpload}
                      disabled={isUploadingGallery}
                      className="inline-flex h-6 w-full items-center justify-center rounded bg-[#c49a22] text-[10px] font-bold text-white hover:bg-[#b38f2b] disabled:opacity-50"
                    >
                      {isUploadingGallery ? "..." : "UPLOAD"}
                    </button>
                    <button
                      type="button"
                      onClick={cancelGalleryUpload}
                      disabled={isUploadingGallery}
                      className="inline-flex h-5 w-full items-center justify-center rounded bg-white/90 text-[10px] font-bold text-red-600 hover:bg-white"
                    >
                      CANCEL
                    </button>
                  </div>
                </div>
              )}

              {mode === "create" ? (
                <div className="flex w-full flex-col items-center justify-center rounded-[8px] border border-dashed border-gray-200 bg-gray-50 py-6 text-center">
                  <Camera size={24} className="mb-2 text-gray-400" />
                  <p className="text-xs font-medium text-gray-500">Gallery images can be added</p>
                  <p className="text-[10px] text-gray-400">after the venue is created</p>
                </div>
              ) : (
                <>
                  {!pendingGalleryFile && (
                    <FileUpload
                      label=""
                      helperText="Add to gallery"
                      onChange={(file) => {
                        if (file) handleGalleryUpload(file);
                      }}
                      className="inline-flex h-20 w-20 flex-col items-center justify-center rounded-[8px] border border-dashed border-gray-300 bg-[#fafcff] text-xs text-gray-500 transition-colors hover:border-[#c49a22]/50 hover:text-[#c49a22] [&>label]:min-h-0 [&>label]:p-0 [&>label>span]:hidden [&>label>p]:mt-0 [&>label>p]:text-[10px]"
                    />
                  )}
                </>
              )}
            </div>
          </article>

          <article className="rounded-[10px] border border-gray-200 bg-white p-4 shadow-sm sm:p-5">
            <h2 className="inline-flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.14em] text-[#1f2a44]">
              <ImagePlus size={14} className="text-[#c49a22]" />
              Venue Thumbnail
            </h2>

            <div className="mt-4 grid gap-3 sm:grid-cols-[120px_minmax(0,1fr)] sm:items-center">
              <div className="relative h-[108px] w-[108px] overflow-hidden rounded-[8px] border border-gray-200 bg-[#f5f7fb]">
                {values.thumbnailUrl ? (
                  <Image src={values.thumbnailUrl} alt="Venue thumbnail" fill className="object-cover" />
                ) : (
                  <div className="flex h-full items-center justify-center text-gray-400">
                    <Camera size={22} />
                  </div>
                )}
              </div>

              <div>
                <p className="text-sm font-semibold text-gray-700">Upload thumbnail for card previews</p>
                <p className="text-xs text-gray-500">Ratio 1:1, Max 1MB (Recommended 400x400px)</p>
                <div className="mt-3">
                  <FileUpload
                    label=""
                    helperText="Select image"
                    file={thumbnailFile}
                    previewUrl={values.thumbnailUrl || undefined}
                    fileName={thumbnailFile?.name || values.thumbnailName}
                    onChange={(file) => setThumbnailFile(file)}
                    onClear={() => {
                      setThumbnailFile(null);
                      updateField("thumbnailUrl", "");
                      updateField("thumbnailName", undefined);
                    }}
                    className="[&>label]:min-h-0 [&>label]:w-fit [&>label]:rounded-[8px] [&>label]:px-4 [&>label]:py-2 [&>label>span]:hidden [&>label>p]:mt-0 [&>label>p]:text-xs"
                  />
                  {renderError("thumbnail")}
                </div>
              </div>
            </div>
          </article>

          <article className="rounded-[10px] border border-gray-200 bg-white p-4 shadow-sm sm:p-5">
            <h2 className="inline-flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.14em] text-[#1f2a44]">
              <Info size={14} className="text-[#c49a22]" />
              Amenities &amp; Specifications
            </h2>

            <div className="mt-4 space-y-3">
              <div className="flex flex-wrap gap-2">
                {values.amenities.map((item) => (
                  <button
                    key={item}
                    type="button"
                    onClick={() => removeAmenity(item)}
                    className="inline-flex items-center gap-1 rounded-full bg-[#f5edcc] px-2.5 py-1 text-xs font-medium text-[#8c6c14]"
                  >
                    {item}
                    <span aria-hidden>×</span>
                  </button>
                ))}
              </div>

              <div className="flex gap-2">
                <Input
                  value={newAmenity}
                  onChange={(event) => setNewAmenity(event.target.value)}
                  placeholder="Add a feature (e.g. AC, Smart Board)"
                  className="h-10 rounded-[8px]"
                />
                <Button
                    type="button"
                    variant="primary"
                    className="h-10 rounded-[8px] px-4 flex items-center gap-2"
                    onClick={addAmenity}
                    >
                    <span className="text-lg leading-none">+</span>
                    <span>Add</span>
                </Button>

              </div>
            </div>
          </article>

          <article className="rounded-[10px] border border-gray-200 bg-white p-4 shadow-sm sm:p-5">
            <h2 className="inline-flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.14em] text-[#1f2a44]">
              <SquarePen size={14} className="text-[#c49a22]" />
              Venue Contact
            </h2>

            <div className="mt-4 grid gap-3 md:grid-cols-2">
              <div className="md:col-span-2">
                <label htmlFor="manager-name" className="mb-1.5 block text-xs font-semibold text-gray-700">
                  Hall Manager Name
                </label>
                <Input
                  id="manager-name"
                  value={values.managerName}
                  onChange={(event) => updateField("managerName", event.target.value)}
                  placeholder="Enter full name"
                  className={`h-10 rounded-[8px] ${getFieldError("manager_name") ? "border-red-500" : ""}`}
                />
                {renderError("manager_name")}
              </div>

              <div>
                <label htmlFor="manager-phone" className="mb-1.5 block text-xs font-semibold text-gray-700">
                  Phone Number
                </label>
                <Input
                  id="manager-phone"
                  value={values.phoneNumber}
                  onChange={(event) => updateField("phoneNumber", event.target.value)}
                  placeholder="+251 ..."
                  className={`h-10 rounded-[8px] ${getFieldError("manager_phone") ? "border-red-500" : ""}`}
                />
                {renderError("manager_phone")}
              </div>

              <div>
                <label htmlFor="manager-email" className="mb-1.5 block text-xs font-semibold text-gray-700">
                  Official Email
                </label>
                <Input
                  id="manager-email"
                  type="email"
                  value={values.officialEmail}
                  onChange={(event) => updateField("officialEmail", event.target.value)}
                  placeholder="venue@aastu.edu.et"
                  className={`h-10 rounded-[8px] ${getFieldError("manager_email") ? "border-red-500" : ""}`}
                />
                {renderError("manager_email")}
              </div>
            </div>
            {getFieldError("contact") && !getFieldError("manager_name") && !getFieldError("manager_phone") && !getFieldError("manager_email") && (
              <div className="mt-3 rounded-md bg-red-50 p-2.5">
                <p className="text-xs text-red-700 font-medium">{getFieldError("contact")}</p>
              </div>
            )}
          </article>

          <div className="flex flex-wrap items-center gap-2">
            <Button 
              type="submit" 
              variant="goldSolid" 
              className="h-10 min-w-[220px] rounded-[10px] px-4"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Saving..." : mode === "create" ? "Save New Venue" : "Save Changes"}
            </Button>
            <Button type="button" variant="outline" className="h-10 rounded-[10px] px-5" onClick={() => window.history.back()}>
              Cancel
            </Button>
          </div>

          </div>
        
        <aside className="space-y-4">
          <article className="rounded-[10px] border border-gray-200 bg-white p-4 shadow-sm">
            <h3 className="inline-flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.12em] text-[#1f2a44]">
              <MapPinned size={14} className="text-[#c49a22]" />
              Pin on Map
            </h3>
            <p className="mt-3 text-[10px] font-semibold uppercase tracking-[0.12em] text-gray-400">Google Maps URL / Coordinates</p>
            <Input
              value={values.mapCoordinates}
              onChange={(event) => updateField("mapCoordinates", event.target.value)}
              placeholder="Paste link or 9.0182, 38.7525"
              className={`mt-2 h-10 rounded-[8px] ${getFieldError("map_coordinates") ? "border-red-500" : ""}`}
            />
            {renderError("map_coordinates")}

            <div className="relative mt-3 h-44 overflow-hidden rounded-[10px] border border-gray-200">
              <Image
                src="https://images.unsplash.com/photo-1524661135-423995f22d0b?w=1200&auto=format&fit=crop"
                alt="Map preview"
                fill
                className="object-cover"
              />
            </div>
            <p className="mt-2 text-xs text-gray-400">The pin shows the preview of provided coordinates.</p>
          </article>

          <article className="rounded-[10px] border border-[#e6dcc0] bg-[#fbf8ef] p-4 shadow-sm">
            <h3 className="inline-flex items-center gap-2 text-sm font-semibold text-[#8c6c14]">
              <Info size={14} />
              Quick Guide
            </h3>
            <ul className="mt-2 space-y-2 text-xs text-[#7a6b44]">
              <li>Ensure venue capacity is accurate for event safety compliance.</li>
              <li>Add photos of entrance and interior to help students find the venue.</li>
              <li>Inactive venues will not appear in the student booking portal.</li>
            </ul>
          </article>
        </aside>
      </section>

      <ConfirmationDialog
        open={deleteImageConfirm !== null}
        title="Remove Image"
        message="Are you sure you want to remove this image from the gallery? This action cannot be undone."
        confirmLabel="Remove Image"
        onConfirm={handleGalleryDelete}
        onCancel={() => setDeleteImageConfirm(null)}
        isLoading={deleteGalleryImage.isPending}
      />
    </form>
  );
}
