import { AlertCircle, CircleX, X } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Textarea } from "@/components/ui/Textarea";
import type { BookingRequestItem } from "@/types/dashboard";

interface BookingRejectionModalProps {
  request: BookingRequestItem;
  reason: string;
  onReasonChange: (value: string) => void;
  onClose: () => void;
  onConfirm: () => void;
  isLoading?: boolean;
}

export function BookingRejectionModal({
  request,
  reason,
  onReasonChange,
  onClose,
  onConfirm,
  isLoading,
}: BookingRejectionModalProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/45 p-3 sm:p-4">
      <div className="my-6 w-full max-w-[560px] overflow-hidden rounded-[16px] bg-white shadow-[0_24px_60px_rgba(15,20,35,0.35)] sm:rounded-[18px]">
        <header className="flex items-start justify-between gap-3 px-4 pb-4 pt-5 sm:px-5 sm:pb-4 sm:pt-5">
          <div className="flex items-start gap-3">
            <span className="inline-flex h-8 w-8 items-center justify-center rounded-full text-[#ef4444] sm:h-10 sm:w-10">
              <CircleX size={22} className="sm:hidden" />
              <CircleX size={26} className="hidden sm:block" />
            </span>
            <div>
              <h2 className="text-xl font-bold leading-tight text-[#e3342f] sm:text-2xl">Reject Booking Request</h2>
              <p className="mt-2 text-sm leading-6 text-[#44506b] sm:text-base sm:leading-7">
                You are about to decline the request for the <strong className="text-[#1f2a44]">{request.venueName}</strong> on {request.dateLabel}.
              </p>
            </div>
          </div>

          <button type="button" onClick={onClose} className="text-[#93a0b6] transition-colors hover:text-[#6f7f99]" aria-label="Close dialog">
            <X size={22} />
          </button>
        </header>

        <div className="max-h-[calc(100vh-18rem)] space-y-4 overflow-y-auto px-4 pb-4 sm:max-h-[calc(100vh-20rem)] sm:px-5 sm:pb-5">
          <label className="space-y-2">
            <span className="text-base font-semibold text-[#2b3958] sm:text-lg">Reason for Rejection</span>
            <Textarea
              value={reason}
              onChange={(event) => onReasonChange(event.target.value)}
              className="min-h-28 rounded-[14px] border-gray-200 bg-[#f7f9fc] text-sm sm:min-h-32 sm:text-base"
              placeholder="Please provide a clear reason for the applicant (e.g., Venue maintenance, priority university event, etc.)"
            />
          </label>

          <div className="flex items-start gap-3 rounded-[14px] border border-[#ecc85f] bg-[#fff9e8] px-4 py-3 text-[#a15f0e]">
            <AlertCircle size={17} className="mt-0.5 shrink-0" />
            <p className="text-xs leading-5 sm:text-sm sm:leading-6">
              This action will notify the applicant and mark the slot as available on the public calendar. This cannot be undone.
            </p>
          </div>
        </div>

        <footer className="flex flex-col-reverse gap-2 border-t border-gray-100 px-4 py-4 sm:flex-row sm:items-center sm:justify-end sm:gap-3 sm:px-5 sm:py-4">
          <Button type="button" variant="ghost" className="w-full sm:min-w-28 sm:w-auto" onClick={onClose} disabled={isLoading}>
            Cancel
          </Button>
          <Button type="button" className="w-full bg-[#e3342f] hover:bg-[#c92d29] sm:min-w-44 sm:w-auto" onClick={onConfirm} disabled={isLoading}>
            {isLoading ? "Rejecting..." : "Confirm Rejection"}
          </Button>
        </footer>
      </div>
    </div>
  );
}
