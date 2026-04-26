"use client";

import { useEffect, useId, useMemo, type ChangeEvent } from "react";
import Image from "next/image";
import { UploadCloud, X } from "lucide-react";
import { cn } from "@/lib/utils";

interface FileUploadProps {
  label?: string;
  helperText?: string;
  file?: File | null;
  previewUrl?: string;
  fileName?: string;
  accept?: string;
  onChange: (file: File | null) => void;
  onClear?: () => void;
  className?: string;
}

export function FileUpload({
  label = "Cover Image",
  helperText = "Click to upload or drag & drop",
  file,
  previewUrl,
  fileName,
  accept = "image/png,image/jpeg,image/jpg,image/webp",
  onChange,
  onClear,
  className,
}: FileUploadProps) {
  const id = useId();
  const objectPreviewUrl = useMemo(() => {
    if (!file) {
      return undefined;
    }

    return URL.createObjectURL(file);
  }, [file]);

  useEffect(() => {
    return () => {
      if (objectPreviewUrl) {
        URL.revokeObjectURL(objectPreviewUrl);
      }
    };
  }, [objectPreviewUrl]);

  const resolvedPreviewUrl = objectPreviewUrl ?? previewUrl;
  const isLocalPreview = Boolean(
    resolvedPreviewUrl && (resolvedPreviewUrl.startsWith("blob:") || resolvedPreviewUrl.startsWith("data:"))
  );

  function handleChange(event: ChangeEvent<HTMLInputElement>) {
    onChange(event.target.files?.[0] ?? null);
  }

  return (
    <div className={cn("space-y-2", className)}>
      <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-gray-400">
        {label}
      </p>

      <label
        htmlFor={id}
        className={cn(
          "group flex min-h-36 cursor-pointer flex-col items-center justify-center rounded-2xl border border-dashed border-[#d8def0] bg-[#fbfcfe] p-4 text-center transition-colors",
          "hover:border-[#c49a22]/50 hover:bg-[#fdfaf0]"
        )}
      >
        <input id={id} type="file" accept={accept} className="sr-only" onChange={handleChange} />

        {resolvedPreviewUrl ? (
          <div className="relative w-full overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
            <div className="relative h-28 w-full">
              {isLocalPreview ? (
                <img src={resolvedPreviewUrl} alt="Selected cover image preview" className="h-full w-full object-cover" />
              ) : (
                <Image src={resolvedPreviewUrl} alt="Selected cover image preview" fill className="object-cover" />
              )}
            </div>
            <div className="flex items-center justify-between gap-3 px-3 py-2 text-left">
              <div className="min-w-0">
                <p className="truncate text-sm font-medium text-gray-800">
                  {fileName ?? "Current cover image"}
                </p>
                <p className="text-xs text-gray-500">Replace by uploading a new file.</p>
              </div>
              {onClear ? (
                <button
                  type="button"
                  onClick={(event) => {
                    event.preventDefault();
                    onClear();
                  }}
                  className="flex h-8 w-8 items-center justify-center rounded-full text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600"
                  aria-label="Remove cover image"
                >
                  <X size={14} />
                </button>
              ) : null}
            </div>
          </div>
        ) : (
          <>
            <span className="flex h-12 w-12 items-center justify-center rounded-full bg-white text-[#c49a22] shadow-sm ring-1 ring-[#c49a22]/15">
              <UploadCloud size={20} />
            </span>
            <p className="mt-3 text-sm font-medium text-gray-700">{helperText}</p>
            <p className="mt-1 text-xs text-gray-400">PNG, JPG up to 5MB</p>
          </>
        )}
      </label>
    </div>
  );
}