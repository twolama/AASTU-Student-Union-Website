import { Lightbulb, ShieldCheck, X } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Textarea } from "@/components/ui/Textarea";
import type { BookingRequestItem } from "@/types/dashboard";

interface BookingApprovalModalProps {
  request: BookingRequestItem;
  note: string;
  onNoteChange: (value: string) => void;
  onClose: () => void;
  onConfirm: () => void;
}

export function BookingApprovalModal({ request, note, onNoteChange, onClose, onConfirm }: BookingApprovalModalProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/45 p-3 sm:p-4">
      <div className="my-6 w-full max-w-[560px] overflow-hidden rounded-[16px] bg-white shadow-[0_24px_60px_rgba(15,20,35,0.35)] sm:rounded-[18px]">
        <header className="flex items-start justify-between gap-3 border-b border-gray-100 px-4 py-4 sm:px-5 sm:py-5">
          <div className="flex items-start gap-3">
            <span className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-[#fdf8ec] text-[#b48a1b]">
              <ShieldCheck size={16} />
            </span>
            <div>
              <h2 className="text-xl font-bold leading-tight text-[#1f2a44] sm:text-2xl">Confirm Approval</h2>
              <p className="mt-1.5 text-xs font-semibold tracking-[0.14em] text-[#6f7f99] uppercase">Request #{request.id}</p>
            </div>
          </div>

          <button type="button" onClick={onClose} className="text-[#93a0b6] transition-colors hover:text-[#6f7f99]" aria-label="Close dialog">
            <X size={22} />
          </button>
        </header>

        <div className="max-h-[calc(100vh-18rem)] space-y-4 overflow-y-auto px-4 py-4 sm:max-h-[calc(100vh-20rem)] sm:px-5 sm:py-5">
          <label className="space-y-2">
            <span className="text-base font-semibold text-[#2b3958] sm:text-lg">Approval Conditions / Internal Notes</span>
            <Textarea
              value={note}
              onChange={(event) => onNoteChange(event.target.value)}
              className="min-h-28 rounded-[14px] border-gray-200 bg-[#f7f9fc] text-sm sm:min-h-32 sm:text-base"
              placeholder="Add any final instructions for the applicant or logistics team (e.g., 'Please ensure all equipment is returned by 6 PM')."
            />
          </label>

          <div className="flex items-start gap-3 rounded-[14px] border border-[#ecc85f] bg-[#fff9e8] px-4 py-3 text-[#a15f0e]">
            <Lightbulb size={17} className="mt-0.5 shrink-0" />
            <p className="text-xs leading-5 sm:text-sm sm:leading-6">
              Approving this request will automatically notify the applicant and block {request.venueName} on {request.dateLabel} from the public calendar.
            </p>
          </div>
        </div>

        <footer className="flex flex-col-reverse gap-2 border-t border-gray-100 px-4 py-4 sm:flex-row sm:items-center sm:justify-end sm:gap-3 sm:px-5 sm:py-4">
          <Button type="button" variant="outline" className="w-full sm:min-w-32 sm:w-auto" onClick={onClose}>
            Cancel
          </Button>
          <Button type="button" variant="goldSolid" className="w-full sm:min-w-48 sm:w-auto" onClick={onConfirm}>
            Confirm & Approve
          </Button>
        </footer>
      </div>
    </div>
  );
}
