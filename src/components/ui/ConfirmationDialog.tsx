"use client";

import { AlertTriangle, X } from "lucide-react";
import { Button } from "@/components/ui/Button";

interface ConfirmationDialogProps {
  open: boolean;
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  isLoading?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export function ConfirmationDialog({
  open,
  title,
  message,
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
  isLoading = false,
  onConfirm,
  onCancel,
}: ConfirmationDialogProps) {
  if (!open) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/45 p-3 sm:p-4">
      <div className="my-6 w-full max-w-[520px] overflow-hidden rounded-[18px] bg-white shadow-[0_24px_60px_rgba(15,20,35,0.35)]">
        <header className="flex items-start justify-between gap-3 border-b border-gray-100 px-4 py-4 sm:px-5 sm:py-5">
          <div className="flex items-start gap-3">
            <span className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-[#fff3f1] text-[#d92d20]">
              <AlertTriangle size={16} />
            </span>
            <div>
              <h2 className="text-xl font-bold leading-tight text-[#1f2a44] sm:text-2xl">{title}</h2>
            </div>
          </div>

          <button
            type="button"
            onClick={onCancel}
            className="text-[#93a0b6] transition-colors hover:text-[#6f7f99]"
            aria-label="Close dialog"
          >
            <X size={22} />
          </button>
        </header>

        <div className="px-4 py-4 sm:px-5 sm:py-5">
          <p className="text-sm leading-6 text-[#44506b] sm:text-base">{message}</p>
        </div>

        <footer className="flex flex-col-reverse gap-2 border-t border-gray-100 px-4 py-4 sm:flex-row sm:items-center sm:justify-end sm:gap-3 sm:px-5 sm:py-4">
          <Button type="button" variant="outline" className="w-full sm:min-w-32 sm:w-auto" onClick={onCancel}>
            {cancelLabel}
          </Button>
          <Button
            type="button"
            variant="goldSolid"
            className="w-full bg-[#d92d20] hover:bg-[#c42318] active:bg-[#ae1f16] sm:min-w-44 sm:w-auto"
            onClick={onConfirm}
            isLoading={isLoading}
          >
            {confirmLabel}
          </Button>
        </footer>
      </div>
    </div>
  );
}