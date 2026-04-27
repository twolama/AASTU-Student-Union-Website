"use client";

import { useState } from "react";
import { Check, ShieldAlert, X } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";

export type ClubStatus = "active" | "pending" | "rejected";

interface StatusChangeModalProps {
  open: boolean;
  currentStatus: ClubStatus;
  isLoading?: boolean;
  onConfirm: (status: ClubStatus) => void;
  onCancel: () => void;
}

const statusOptions: Array<{ value: ClubStatus; label: string; description: string; color: string; bgColor: string }> = [
  {
    value: "active",
    label: "Active",
    description: "The club is fully operational and visible to everyone.",
    color: "#059669",
    bgColor: "#ecfdf5",
  },
  {
    value: "pending",
    label: "Pending",
    description: "The club is under review or waiting for additional info.",
    color: "#d97706",
    bgColor: "#fffbeb",
  },
  {
    value: "rejected",
    label: "Rejected",
    description: "The club has been rejected or is currently suspended.",
    color: "#dc2626",
    bgColor: "#fef2f2",
  },
];

export function StatusChangeModal({
  open,
  currentStatus,
  isLoading = false,
  onConfirm,
  onCancel,
}: StatusChangeModalProps) {
  const [selectedStatus, setSelectedStatus] = useState<ClubStatus>(currentStatus);

  if (!open) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/45 p-3 sm:p-4">
      <div className="my-6 w-full max-w-[520px] overflow-hidden rounded-[18px] bg-white shadow-[0_24px_60px_rgba(15,20,35,0.35)]">
        <header className="flex items-start justify-between gap-3 border-b border-gray-100 px-4 py-4 sm:px-5 sm:py-5">
          <div className="flex items-start gap-3">
            <span className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-[#fdf8ec] text-[#c49a22]">
              <ShieldAlert size={16} />
            </span>
            <div>
              <h2 className="text-xl font-bold leading-tight text-[#1f2a44] sm:text-2xl">Change Club Status</h2>
              <p className="mt-1 text-xs text-gray-400 font-medium">Update the operational status of this club</p>
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

        <div className="px-4 py-6 sm:px-5">
          <div className="space-y-3">
            {statusOptions.map((option) => (
              <button
                key={option.value}
                type="button"
                onClick={() => setSelectedStatus(option.value)}
                className={cn(
                  "relative flex w-full items-start gap-4 rounded-xl border p-4 text-left transition-all duration-200",
                  selectedStatus === option.value
                    ? "border-[#c49a22] bg-[#fdf8ec]/30 shadow-sm"
                    : "border-gray-100 bg-white hover:border-gray-200 hover:bg-gray-50"
                )}
              >
                <div 
                  className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 transition-colors"
                  style={{ 
                    borderColor: selectedStatus === option.value ? "#c49a22" : "#e5e7eb",
                    backgroundColor: selectedStatus === option.value ? "#c49a22" : "transparent"
                  }}
                >
                  {selectedStatus === option.value && <Check size={10} className="text-white" />}
                </div>
                
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-[#1f2a44]">{option.label}</span>
                    <span 
                      className="rounded-md px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wider"
                      style={{ color: option.color, backgroundColor: option.bgColor }}
                    >
                      {option.value}
                    </span>
                  </div>
                  <p className="mt-1 text-xs leading-relaxed text-gray-500">{option.description}</p>
                </div>
              </button>
            ))}
          </div>
        </div>

        <footer className="flex flex-col-reverse gap-2 border-t border-gray-100 px-4 py-4 sm:flex-row sm:items-center sm:justify-end sm:gap-3 sm:px-5 sm:py-4">
          <Button type="button" variant="outline" className="w-full sm:min-w-32 sm:w-auto" onClick={onCancel}>
            Cancel
          </Button>
          <Button
            type="button"
            variant="goldSolid"
            className="w-full sm:min-w-44 sm:w-auto"
            onClick={() => onConfirm(selectedStatus)}
            isLoading={isLoading}
            disabled={selectedStatus === currentStatus}
          >
            Update Status
          </Button>
        </footer>
      </div>
    </div>
  );
}
