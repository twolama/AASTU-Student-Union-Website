"use client";

import { SlidersHorizontal } from "lucide-react";
import { DropdownSelect, type DropdownOption } from "@/components/ui/DropdownSelect";
import { SearchBar } from "@/components/ui/SearchBar";

interface UsersFiltersProps {
  searchTerm: string;
  onSearchTermChange: (value: string) => void;
  selectedRole: string;
  onSelectedRoleChange: (value: string) => void;
  selectedDepartment: string;
  onSelectedDepartmentChange: (value: string) => void;
  roleOptions: DropdownOption[];
  departmentOptions: DropdownOption[];
}

export function UsersFilters({
  searchTerm,
  onSearchTermChange,
  selectedRole,
  onSelectedRoleChange,
  selectedDepartment,
  onSelectedDepartmentChange,
  roleOptions,
  departmentOptions,
}: UsersFiltersProps) {
  return (
    <section className="rounded-[10px] border border-gray-200 bg-white p-3 shadow-sm sm:p-4">
      <div className="grid gap-3 lg:grid-cols-[minmax(0,1fr)_180px_220px_auto]">
        <SearchBar
          value={searchTerm}
          onChange={(event) => onSearchTermChange(event.target.value)}
          placeholder="Search by name, ID, or department..."
          className="h-10 rounded-[10px]"
          containerClassName="w-full"
        />

        <DropdownSelect
          label=""
          value={selectedRole}
          options={roleOptions}
          onValueChange={onSelectedRoleChange}
          className="[&>p]:hidden [&>div>button]:h-10 [&>div>button]:rounded-[10px]"
        />

        <DropdownSelect
          label=""
          value={selectedDepartment}
          options={departmentOptions}
          onValueChange={onSelectedDepartmentChange}
          className="[&>p]:hidden [&>div>button]:h-10 [&>div>button]:rounded-[10px]"
        />

        <button
          type="button"
          aria-label="Advanced filters"
          className="inline-flex h-10 w-10 items-center justify-center self-start rounded-[10px] border border-gray-200 bg-[#f8fbff] text-[#6f7f99] transition-colors hover:border-[#b48a1b]/40 hover:text-[#b48a1b]"
        >
          <SlidersHorizontal size={16} />
        </button>
      </div>
    </section>
  );
}
