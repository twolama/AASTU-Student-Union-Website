"use client";

import { CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { getPasswordStrength } from "@/lib/public/auth";

interface AuthPasswordStrengthProps {
  password: string;
}

export function AuthPasswordStrength({ password }: AuthPasswordStrengthProps) {
  const strength = getPasswordStrength(password);

  return (
    <div className="rounded-[14px] border border-[#e6ebf2] bg-[#fbfcfe] px-4 py-3">
      <div className="mb-2 flex items-center justify-between gap-4 text-xs font-semibold text-[#44526d]">
        <span>Password Strength</span>
        <span className="text-[#a98a2b]">{strength.percent}%</span>
      </div>

      <div className="h-2 rounded-full bg-[#e7ebf2]">
        <div className="h-full rounded-full bg-[#c49a22] transition-all duration-300" style={{ width: `${strength.percent}%` }} />
      </div>

      <p className={cn("mt-2 inline-flex items-start gap-1.5 text-xs", strength.tone === "success" ? "text-[#2b8a57]" : "text-[#6d7b93]")}> 
        <CheckCircle2 size={14} className="mt-0.5 shrink-0" />
        <span>{strength.message}</span>
      </p>

      <div className="mt-3 grid gap-x-4 gap-y-1.5 text-[11px] text-[#78849d] sm:grid-cols-2">
        {strength.criteria.map((criterion) => (
          <p key={criterion.label} className={cn("inline-flex items-center gap-1.5", criterion.matched && "text-[#b48a1b]")}>
            <span className={cn("text-sm leading-none", criterion.matched ? "text-[#b48a1b]" : "text-[#c9d2df]")}>✓</span>
            <span>{criterion.label}</span>
          </p>
        ))}
      </div>
    </div>
  );
}