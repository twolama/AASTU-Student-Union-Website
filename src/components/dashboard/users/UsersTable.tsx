"use client";

import { ChevronLeft, ChevronRight, MoreVertical } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { cn } from "@/lib/utils";
import type { UserManagementItem, UserManagementRole } from "@/types/dashboard";

interface UsersTableProps {
  items: UserManagementItem[];
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  totalCount: number;
  pageSize: number;
}

const roleLabelMap: Record<UserManagementRole, string> = {
  "su-admin": "SU Admin",
  "club-president": "Club President",
  "general-student": "General Student",
};

const roleClassMap: Record<UserManagementRole, string> = {
  "su-admin": "bg-[#fbf1d8] text-[#9a7618]",
  "club-president": "bg-[#eef2f7] text-[#4f5f79]",
  "general-student": "bg-[#eef2f7] text-[#4f5f79]",
};

export function UsersTable({
  items,
  currentPage,
  totalPages,
  onPageChange,
  totalCount,
  pageSize,
}: UsersTableProps) {
  const start = items.length > 0 ? (currentPage - 1) * pageSize + 1 : 0;
  const end = (currentPage - 1) * pageSize + items.length;

  return (
    <section className="overflow-hidden rounded-[10px] border border-gray-200 bg-white shadow-sm">
      <div className="hidden overflow-x-auto md:block">
        <table className="min-w-full text-sm">
          <thead>
            <tr className="border-b border-gray-100 bg-[#fbfcff] text-left text-[10px] font-semibold uppercase tracking-[0.12em] text-[#7f8ba2]">
              <th className="px-4 py-3">Student Details</th>
              <th className="px-4 py-3">Student ID</th>
              <th className="px-4 py-3">Department</th>
              <th className="px-4 py-3">Role</th>
              <th className="px-4 py-3 text-right">Actions</th>
            </tr>
          </thead>

          <tbody>
            {items.map((item) => (
              <tr key={item.id} className="border-b border-gray-100 last:border-b-0">
                <td className="px-4 py-3.5">
                  <div className="flex items-center gap-3">
                    <div className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-[#2a3654] text-xs font-semibold text-white">
                      {item.initials}
                    </div>
                    <div>
                      <p className="font-semibold text-[#1f2a44]">{item.name}</p>
                      <p className="text-xs text-[#7f8ba2]">{item.email}</p>
                    </div>
                  </div>
                </td>

                <td className="px-4 py-3.5 text-[#60708e]">{item.studentId}</td>
                <td className="px-4 py-3.5 text-[#475672]">{item.department}</td>
                <td className="px-4 py-3.5">
                  <Badge className={cn("rounded-full px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.08em]", roleClassMap[item.role])}>
                    {roleLabelMap[item.role]}
                  </Badge>
                </td>
                <td className="px-4 py-3.5 text-right">
                  <button
                    type="button"
                    aria-label={`More actions for ${item.name}`}
                    className="inline-flex h-8 w-8 items-center justify-center rounded-md text-[#7f8ba2] transition-colors hover:bg-gray-100 hover:text-[#1f2a44]"
                  >
                    <MoreVertical size={16} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="space-y-3 p-3 md:hidden">
        {items.map((item) => (
          <article key={item.id} className="rounded-[10px] border border-gray-100 bg-[#fbfcff] p-3">
            <div className="flex items-start justify-between gap-3">
              <div className="flex min-w-0 items-start gap-2.5">
                <div className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#2a3654] text-xs font-semibold text-white">
                  {item.initials}
                </div>
                <div className="min-w-0">
                  <p className="truncate font-semibold text-[#1f2a44]">{item.name}</p>
                  <p className="truncate text-xs text-[#7f8ba2]">{item.email}</p>
                </div>
              </div>

              <button
                type="button"
                aria-label={`More actions for ${item.name}`}
                className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-md text-[#7f8ba2] transition-colors hover:bg-gray-100 hover:text-[#1f2a44]"
              >
                <MoreVertical size={16} />
              </button>
            </div>

            <div className="mt-2 grid gap-1 text-xs text-[#60708e]">
              <p>
                <span className="font-semibold text-[#1f2a44]">ID:</span> {item.studentId}
              </p>
              <p>
                <span className="font-semibold text-[#1f2a44]">Dept:</span> {item.department}
              </p>
            </div>

            <Badge className={cn("mt-2 rounded-full px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.08em]", roleClassMap[item.role])}>
              {roleLabelMap[item.role]}
            </Badge>
          </article>
        ))}
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3 border-t border-gray-100 px-3 py-3 sm:px-4">
        <p className="text-xs text-gray-500">
          Showing {start} to {end} of {totalCount} students
        </p>

        <div className="flex items-center gap-1.5">
          <button
            type="button"
            className="inline-flex h-8 items-center justify-center rounded-md border border-gray-200 px-2.5 text-xs text-gray-500 transition-colors hover:bg-gray-50 disabled:opacity-50"
            onClick={() => onPageChange(Math.max(1, currentPage - 1))}
            disabled={currentPage === 1}
          >
            <ChevronLeft size={14} />
            Previous
          </button>

          {Array.from({ length: totalPages }, (_, index) => {
            const page = index + 1;
            const isActive = page === currentPage;

            return (
              <button
                key={page}
                type="button"
                onClick={() => onPageChange(page)}
                className={cn(
                  "inline-flex h-8 w-8 items-center justify-center rounded-md border text-xs font-semibold transition-colors",
                  isActive
                    ? "border-[#c49a22] bg-[#c49a22] text-white"
                    : "border-gray-200 text-[#6f7f99] hover:bg-gray-50"
                )}
              >
                {page}
              </button>
            );
          })}

          <button
            type="button"
            className="inline-flex h-8 items-center justify-center rounded-md border border-gray-200 px-2.5 text-xs text-gray-500 transition-colors hover:bg-gray-50 disabled:opacity-50"
            onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
            disabled={currentPage === totalPages}
          >
            Next
            <ChevronRight size={14} />
          </button>
        </div>
      </div>
    </section>
  );
}
