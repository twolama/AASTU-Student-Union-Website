"use client";

import Image from "next/image";
import { useMemo, useState } from "react";
import Link from "next/link";
import {
  Camera,
  ChevronRight,
  ImagePlus,
  Info,
  MapPinned,
  Plus,
  SquarePen,
  Trash2,
} from "lucide-react";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { DropdownSelect } from "@/components/ui/DropdownSelect";
import { FileUpload } from "@/components/ui/FileUpload";
import { Switch } from "@/components/ui/Switch";
import { Button } from "@/components/ui/Button";

type EditorMode = "create" | "edit";

export interface VenueEditorValues {
  name: string;
  category: string;
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
  galleryImages: string[];
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

const categoryOptions = [
  { value: "auditorium", label: "Auditorium" },
  { value: "meeting-room", label: "Meeting Room" },
  { value: "outdoor-space", label: "Outdoor Space" },
  { value: "indoor-space", label: "Indoor Space" },
  { value: "seminar-hall", label: "Seminar Hall" },
  { value: "laboratory", label: "Laboratory" },
  { value: "debate-room", label: "Debate Room" },
];

export function VenueEditor({ mode, venueId, initialValues }: VenueEditorProps) {
  const [values, setValues] = useState<VenueEditorValues>(initialValues);
  const [heroImageFile, setHeroImageFile] = useState<File | null>(null);
  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null);
  const [newAmenity, setNewAmenity] = useState("");
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  const title = mode === "create" ? "Create New Venue" : "Edit Venue";
  const subtitle =
    mode === "create"
      ? "Register a new physical space for student activities, clubs, and academic events."
      : "Update venue records, specifications, and gallery assets.";

  const completionPercent = useMemo(() => {
    const checks = [
      values.name.trim().length > 3,
      values.category.length > 0,
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

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setStatusMessage(
      mode === "create"
        ? "Venue draft is ready to save."
        : `Venue ${venueId ?? "record"} updates were saved locally.`
    );
  }

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
                  className="h-10 rounded-[8px]"
                />
              </div>

              <DropdownSelect
                label="Venue Category"
                value={values.category}
                options={[{ value: "", label: "Select Category" }, ...categoryOptions]}
                onValueChange={(value) => updateField("category", value)}
                className="[&>div>button]:h-10 [&>div>button]:rounded-[8px]"
              />

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
                  className="h-10 rounded-[8px]"
                />
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
                  className="h-10 rounded-[8px]"
                />
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
                  className="h-10 rounded-[8px]"
                />
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
                  className="h-10 rounded-[8px]"
                />
              </div>

              <div className="md:col-span-2">
                <label htmlFor="venue-short-description" className="mb-1.5 block text-xs font-semibold text-gray-700">
                  Short Description
                </label>
                <Textarea
                  id="venue-short-description"
                  value={values.shortDescription}
                  onChange={(event) => updateField("shortDescription", event.target.value)}
                  placeholder="A brief summary of the venue for card previews..."
                  className="min-h-[86px] rounded-[8px]"
                />
              </div>

              <div className="md:col-span-2">
                <label htmlFor="venue-full-description" className="mb-1.5 block text-xs font-semibold text-gray-700">
                  Full Description
                </label>
                <Textarea
                  id="venue-full-description"
                  value={values.fullDescription}
                  onChange={(event) => updateField("fullDescription", event.target.value)}
                  placeholder="Detailed information about the venue, rules, and specific details..."
                  className="min-h-[140px] rounded-[8px]"
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
            </div>
          </article>

          <article className="rounded-[10px] border border-gray-200 bg-white p-4 shadow-sm sm:p-5">
            <h2 className="inline-flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.14em] text-[#1f2a44]">
              <Camera size={14} className="text-[#c49a22]" />
              Venue Gallery
            </h2>

            <div className="mt-4 flex flex-wrap gap-3">
              {values.galleryImages.map((item, index) => (
                <div key={`${item}-${index}`} className="group relative h-20 w-20 overflow-hidden rounded-[8px] border border-gray-200 bg-gray-100">
                  <Image src={item} alt={`Venue gallery ${index + 1}`} fill className="object-cover" />
                  <button
                    type="button"
                    onClick={() => {
                      updateField(
                        "galleryImages",
                        values.galleryImages.filter((_, currentIndex) => currentIndex !== index)
                      );
                    }}
                    className="absolute right-1 top-1 inline-flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-white opacity-0 transition-opacity group-hover:opacity-100"
                    aria-label="Remove gallery image"
                  >
                    <Trash2 size={11} />
                  </button>
                </div>
              ))}

              <button
                type="button"
                onClick={() =>
                  updateField("galleryImages", [
                    ...values.galleryImages,
                    "https://images.unsplash.com/photo-1497366811353-6870744d04b2?w=500&auto=format&fit=crop",
                  ])
                }
                className="inline-flex h-20 w-20 flex-col items-center justify-center rounded-[8px] border border-dashed border-gray-300 bg-[#fafcff] text-xs text-gray-500 transition-colors hover:border-[#c49a22]/50 hover:text-[#c49a22]"
              >
                <Plus size={15} />
                Add More
              </button>
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
                  className="h-10 rounded-[8px]"
                />
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
                  className="h-10 rounded-[8px]"
                />
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
                  className="h-10 rounded-[8px]"
                />
              </div>
            </div>
          </article>

          <div className="flex flex-wrap items-center gap-2">
            <Button type="submit" variant="goldSolid" className="h-10 min-w-[220px] rounded-[10px] px-4">
              {mode === "create" ? "Save New Venue" : "Save Changes"}
            </Button>
            <Button type="button" variant="outline" className="h-10 rounded-[10px] px-5" onClick={() => window.history.back()}>
              Cancel
            </Button>
          </div>

          {statusMessage ? (
            <div className="rounded-[10px] border border-[#c49a22]/30 bg-[#fdf8ec] p-4 text-sm text-[#896814]">
              {statusMessage}
            </div>
          ) : null}
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
              className="mt-2 h-10 rounded-[8px]"
            />

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
    </form>
  );
}
