"use client";

import { useMemo, useState } from "react";
import { userManagementItems, userManagementStats } from "@/data/dummy";
import { UsersFilters } from "@/components/dashboard/users/UsersFilters";
import { UsersStatsSection } from "@/components/dashboard/users/UsersStatsSection";
import { UsersTable } from "@/components/dashboard/users/UsersTable";

const ITEMS_PER_PAGE = 4;

const roleOptions = [
  { value: "all", label: "All Roles" },
  { value: "su-admin", label: "SU Admin" },
  { value: "club-president", label: "Club President" },
  { value: "general-student", label: "General Student" },
];

export function UsersContent() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedRole, setSelectedRole] = useState("all");
  const [selectedDepartment, setSelectedDepartment] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);

  const departmentOptions = useMemo(() => {
    const uniqueDepartments = Array.from(new Set(userManagementItems.map((item) => item.department)));

    return [
      { value: "all", label: "All Departments" },
      ...uniqueDepartments.map((department) => ({
        value: department.toLowerCase().replace(/\s+/g, "-"),
        label: department,
      })),
    ];
  }, []);

  const filteredItems = useMemo(() => {
    const normalizedSearch = searchTerm.trim().toLowerCase();

    return userManagementItems.filter((item) => {
      const matchesSearch =
        normalizedSearch.length === 0
          ? true
          : item.name.toLowerCase().includes(normalizedSearch) ||
            item.studentId.toLowerCase().includes(normalizedSearch) ||
            item.department.toLowerCase().includes(normalizedSearch);

      const matchesRole = selectedRole === "all" ? true : item.role === selectedRole;
      const departmentValue = item.department.toLowerCase().replace(/\s+/g, "-");
      const matchesDepartment = selectedDepartment === "all" ? true : departmentValue === selectedDepartment;

      return matchesSearch && matchesRole && matchesDepartment;
    });
  }, [searchTerm, selectedRole, selectedDepartment]);

  const totalPages = Math.max(1, Math.ceil(filteredItems.length / ITEMS_PER_PAGE));
  const clampedPage = Math.min(currentPage, totalPages);

  const paginatedItems = useMemo(() => {
    const start = (clampedPage - 1) * ITEMS_PER_PAGE;
    return filteredItems.slice(start, start + ITEMS_PER_PAGE);
  }, [filteredItems, clampedPage]);

  return (
    <div className="space-y-4 sm:space-y-5">
      <UsersStatsSection items={userManagementStats} />

      <UsersFilters
        searchTerm={searchTerm}
        onSearchTermChange={(value) => {
          setSearchTerm(value);
          setCurrentPage(1);
        }}
        selectedRole={selectedRole}
        onSelectedRoleChange={(value) => {
          setSelectedRole(value);
          setCurrentPage(1);
        }}
        selectedDepartment={selectedDepartment}
        onSelectedDepartmentChange={(value) => {
          setSelectedDepartment(value);
          setCurrentPage(1);
        }}
        roleOptions={roleOptions}
        departmentOptions={departmentOptions}
      />

      <UsersTable
        items={paginatedItems}
        currentPage={clampedPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
        totalCount={filteredItems.length}
        pageSize={ITEMS_PER_PAGE}
      />
    </div>
  );
}
