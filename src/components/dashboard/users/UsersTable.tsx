"use client";

import { ChevronLeft, ChevronRight, MoreVertical, UserCog2, Trash2, Shield } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { cn } from "@/lib/utils";
import type { CurrentUser } from "@/schemas/user.schema";
import { type Role } from "@/api/services/user.service";

interface UsersTableProps {
  items: CurrentUser[];
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  totalCount: number;
  pageSize: number;
  departments?: { id: string; name: string }[];
  roles?: Role[];
  onEdit?: (user: CurrentUser) => void;
  onDelete?: (user: CurrentUser) => void;
  canEditUsers?: boolean;
  canDeleteUsers?: boolean;
}

export function UsersTable({
  items,
  currentPage,
  totalPages,
  onPageChange,
  totalCount,
  pageSize,
  departments = [],
  roles = [],
  onEdit,
  onDelete,
  canEditUsers = false,
  canDeleteUsers = false,
}: UsersTableProps) {
  const start = items.length > 0 ? (currentPage - 1) * pageSize + 1 : 0;
  const end = (currentPage - 1) * pageSize + items.length;

  const getDepartmentName = (user: CurrentUser) => {
    // Priority 1: Use departmentDetails name if available
    if (user.departmentDetails?.name) return user.departmentDetails.name;
    
    // Priority 2: Use matching department from the provided list if available
    if (user.department && departments.length > 0) {
      const dept = departments.find(d => d.id === user.department);
      if (dept) return dept.name;
    }
    
    return "Unassigned";
  };

  const getMatchedRoles = (user: CurrentUser) => {
    if (user.rolesDetails?.length) return user.rolesDetails;
    if (user.roleDetails) return [user.roleDetails];

    if (user.roles?.length && roles.length > 0) {
      const resolved = user.roles
        .map((roleId) => roles.find((roleItem) => roleItem.id === roleId))
        .filter(Boolean);
      if (resolved.length > 0) return resolved;
    }

    if (user.role && roles.length > 0) {
      const byId = roles.find((roleItem) => roleItem.id === user.role);
      if (byId) return [byId];
      const bySlug = roles.find((roleItem) => roleItem.slug === user.role);
      if (bySlug) return [bySlug];
    }

    return [];
  };

  const getRoleLabel = (user: CurrentUser) => {
    const matchedRoles = getMatchedRoles(user);
    if (matchedRoles.length === 0) return "Member";
    if (matchedRoles.length <= 2) return matchedRoles.map((roleItem) => roleItem.name).join(", ");
    const firstTwo = matchedRoles.slice(0, 2).map((roleItem) => roleItem.name).join(", ");
    return `${firstTwo} +${matchedRoles.length - 2}`;
  };

  const getRoleClass = (user: CurrentUser) => {
    const matchedRoles = getMatchedRoles(user);
    if (matchedRoles.some((roleItem) => roleItem.isStaffRole)) return "bg-[#fbf1d8] text-[#9a7618]";
    return "bg-[#eef2f7] text-[#4f5f79]";
  };

  return (
    <section className="overflow-hidden rounded-[15px] border border-gray-100 bg-white shadow-sm transition-all duration-300">
      <div className="hidden overflow-x-auto md:block">
        <table className="min-w-full text-sm">
          <thead>
            <tr className="border-b border-gray-50 bg-[#fbfcff]/50 text-left text-[10px] font-bold uppercase tracking-[0.12em] text-[#7f8ba2]">
              <th className="px-5 py-4">Student Details</th>
              <th className="px-5 py-4">Student ID</th>
              <th className="px-5 py-4">Department</th>
              <th className="px-5 py-4">Union Roles</th>
              <th className="px-5 py-4 text-right">Actions</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-50">
            {items.map((item) => (
              <tr key={item.id} className="group transition-colors hover:bg-gray-50/50">
                <td className="px-5 py-4">
                  <div className="flex items-center gap-3">
                    <div className="relative h-9 w-9 overflow-hidden rounded-full border border-gray-100 bg-[#fdf8ec] shadow-inner">
                      {item.avatar ? (
                        <img src={item.avatar} alt={item.name} className="h-full w-full object-cover" />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center text-xs font-bold text-[#c49a22]">
                          {item.initials}
                        </div>
                      )}
                    </div>
                    <div>
                      <p className="font-bold text-[#1f2a44]">{item.name}</p>
                      <p className="text-[11px] text-[#7f8ba2] font-medium">{item.email}</p>
                    </div>
                  </div>
                </td>

                <td className="px-5 py-4 text-[13px] font-medium text-[#60708e]">{item.studentId || "N/A"}</td>
                <td className="px-5 py-4 text-[13px] font-medium text-[#475672]">
                  {getDepartmentName(item)}
                </td>
                <td className="px-5 py-4">
                  <Badge className={cn("rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.08em] shadow-sm", getRoleClass(item))}>
                    <Shield size={10} className="mr-1 inline" />
                    {getRoleLabel(item)}
                  </Badge>
                </td>
                <td className="px-5 py-4 text-right">
                  <div className="flex items-center justify-end gap-1 opacity-0 transition-opacity group-hover:opacity-100">
                    {canEditUsers ? (
                      <button
                        onClick={() => onEdit?.(item)}
                        className="inline-flex h-8 w-8 items-center justify-center rounded-lg text-gray-400 transition-all hover:bg-[#ead9a3]/30 hover:text-[#c49a22]"
                        title="Edit User"
                      >
                        <UserCog2 size={16} />
                      </button>
                    ) : null}
                    {canDeleteUsers ? (
                      <button
                        onClick={() => onDelete?.(item)}
                        className="inline-flex h-8 w-8 items-center justify-center rounded-lg text-gray-400 transition-all hover:bg-red-50 hover:text-red-500"
                        title="Delete User"
                      >
                        <Trash2 size={16} />
                      </button>
                    ) : null}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile view */}
      <div className="space-y-3 p-4 md:hidden">
        {items.map((item) => (
          <article key={item.id} className="rounded-2xl border border-gray-100 bg-[#fbfcff]/50 p-4 transition-all active:scale-[0.98]">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 overflow-hidden rounded-full border border-gray-100 bg-[#fdf8ec]">
                  {item.avatar ? (
                    <img src={item.avatar} alt={item.name} className="h-full w-full object-cover" />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center font-bold text-[#c49a22]">
                      {item.initials}
                    </div>
                  )}
                </div>
                <div>
                  <p className="font-bold text-[#1f2a44]">{item.name}</p>
                  <p className="text-xs text-[#7f8ba2] font-medium">{item.email}</p>
                </div>
              </div>
              
              {canEditUsers ? (
                <button onClick={() => onEdit?.(item)} className="p-1 text-gray-400">
                  <MoreVertical size={18} />
                </button>
              ) : null}
            </div>

            <div className="mt-4 grid grid-cols-2 gap-4">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-wider text-gray-400">Student ID</p>
                <p className="text-xs font-semibold text-[#60708e]">{item.studentId || "N/A"}</p>
              </div>
              <div>
                <p className="text-[10px] font-bold uppercase tracking-wider text-gray-400">Department</p>
                <p className="truncate text-xs font-semibold text-[#475672]">{getDepartmentName(item)}</p>
              </div>
            </div>

            <div className="mt-4 flex items-center justify-between border-t border-gray-100 pt-3">
              <Badge className={cn("rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.08em]", getRoleClass(item))}>
                {getRoleLabel(item)}
              </Badge>
              {canDeleteUsers ? (
                <button className="text-xs font-bold text-red-500 hover:underline" onClick={() => onDelete?.(item)}>
                  Delete Account
                </button>
              ) : null}
            </div>
          </article>
        ))}
      </div>

      {/* Pagination */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-t border-gray-50 px-5 py-4">
        <p className="text-xs font-medium text-gray-500">
          Showing <span className="text-gray-900">{start}</span> to <span className="text-gray-900">{end}</span> of <span className="text-gray-900 font-bold">{totalCount}</span> students
        </p>

        <div className="flex items-center gap-2">
          <button
            type="button"
            className="inline-flex h-9 items-center justify-center gap-1.5 rounded-xl border border-gray-100 px-3 text-xs font-bold text-gray-600 transition-all hover:bg-gray-50 active:bg-gray-100 disabled:opacity-40"
            onClick={() => onPageChange(currentPage - 1)}
            disabled={currentPage === 1}
          >
            <ChevronLeft size={16} />
            <span className="hidden sm:inline">Prev</span>
          </button>

          <div className="flex items-center gap-1">
            {Array.from({ length: totalPages }, (_, i) => i + 1)
              .filter(p => p === 1 || p === totalPages || Math.abs(p - currentPage) <= 1)
              .map((page, i, arr) => (
                <div key={page} className="flex items-center">
                  {i > 0 && arr[i-1] !== page - 1 && <span className="px-1 text-gray-300">...</span>}
                  <button
                    onClick={() => onPageChange(page)}
                    className={cn(
                      "h-9 w-9 rounded-xl text-xs font-bold transition-all",
                      currentPage === page
                        ? "bg-[#c49a22] text-white shadow-lg shadow-[#c49a22]/20"
                        : "text-gray-500 hover:bg-gray-50"
                    )}
                  >
                    {page}
                  </button>
                </div>
              ))}
          </div>

          <button
            type="button"
            className="inline-flex h-9 items-center justify-center gap-1.5 rounded-xl border border-gray-100 px-3 text-xs font-bold text-gray-600 transition-all hover:bg-gray-50 active:bg-gray-100 disabled:opacity-40"
            onClick={() => onPageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
          >
            <span className="hidden sm:inline">Next</span>
            <ChevronRight size={16} />
          </button>
        </div>
      </div>
    </section>
  );
}
