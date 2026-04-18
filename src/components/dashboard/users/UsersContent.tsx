"use client";

import { useMemo, useState } from "react";
import { UsersFilters } from "@/components/dashboard/users/UsersFilters";
import { UsersStatsSection } from "@/components/dashboard/users/UsersStatsSection";
import { UsersTable } from "@/components/dashboard/users/UsersTable";
import { UserEditDialog } from "@/components/dashboard/users/UserEditDialog";
import { RolesManagement } from "@/components/dashboard/users/RolesManagement";
import { useUsers, useDeleteUser } from "@/hooks/useUsers";
import { useRoles } from "@/hooks/useRoles";
import { useDepartments } from "@/hooks/useDepartments";
import { Tabs } from "@/components/ui/Tabs";
import { Users, ShieldCheck, Loader2 } from "lucide-react";
import { type CurrentUser } from "@/schemas/user.schema";
import { type UserManagementStat } from "@/types/dashboard";
import { toast } from "sonner";

const userManagementStats: UserManagementStat[] = [
  { id: "total", title: "Total Students", value: "0", icon: "Users", accent: "navy" },
  { id: "members", title: "Union Members", value: "0", icon: "Shield", accent: "gold" },
  { id: "roles", title: "Active Roles", value: "0", icon: "ShieldCheck", accent: "slate" },
];

const ITEMS_PER_PAGE = 10;

const USERS_TABS = [
  { id: "students", label: "Students List" },
  { id: "roles", label: "Union Roles" },
];

export function UsersContent() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedRole, setSelectedRole] = useState("all");
  const [selectedDepartment, setSelectedDepartment] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [currentTab, setCurrentTab] = useState("students");

  // Selection states
  const [editingUser, setEditingUser] = useState<CurrentUser | null>(null);

  // Fetch real data
  const { data: usersData, isLoading: isUsersLoading } = useUsers(currentPage, ITEMS_PER_PAGE, searchTerm, selectedRole, selectedDepartment);
  const { data: rolesData, isLoading: isRolesLoading } = useRoles();
  const { data: departments = [], isLoading: isDeptsLoading } = useDepartments();
  const deleteUserMutation = useDeleteUser();

  const roleOptions = useMemo(() => {
    if (!rolesData?.data) return [{ value: "all", label: "All Roles" }];
    return [
      { value: "all", label: "All Roles" },
      ...rolesData.data.map((role) => ({
        value: role.id,
        label: role.name,
      })),
    ];
  }, [rolesData]);

  const departmentOptions = useMemo(() => {
    return [
      { value: "all", label: "All Departments" },
      ...departments.map((dept) => ({
        value: dept.id,
        label: dept.name,
      })),
    ];
  }, [departments]);

  const handleDeleteUser = async (user: CurrentUser) => {
    if (!confirm(`Are you sure you want to delete ${user.name}? This action cannot be undone.`)) return;
    try {
      await deleteUserMutation.mutateAsync(user.id);
      toast.success("User deleted successfully.");
    } catch (error: any) {
      toast.error("Deletion failed", { description: error.message });
    }
  };

  const isInitialLoading = (isUsersLoading && !usersData) || isRolesLoading || isDeptsLoading;

  if (isInitialLoading) {
    return (
      <div className="flex h-[400px] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-[#c49a22]" />
      </div>
    );
  }

  const users = usersData?.data || [];
  const meta = usersData?.meta || { page: 1, limit: 10, total: 0, totalPages: 1 };
  const rolesCount = rolesData?.data?.length || 0;

  const stats: UserManagementStat[] = [
    { ...userManagementStats[0], value: meta.total.toString() },
    { ...userManagementStats[1], value: users.filter(u => u.role).length.toString() },
    { ...userManagementStats[2], value: rolesCount.toString() },
  ];

  return (
    <div className="space-y-6">
      <UsersStatsSection items={stats} />

      <div className="space-y-4">
        <Tabs
          items={USERS_TABS}
          value={currentTab}
          onValueChange={setCurrentTab}
          className="w-full max-w-md"
        />

        {currentTab === "students" ? (
          <div className="space-y-5 animate-in fade-in slide-in-from-left-2 duration-300">
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
              items={users}
              currentPage={currentPage}
              totalPages={meta.totalPages}
              onPageChange={setCurrentPage}
              totalCount={meta.total}
              pageSize={ITEMS_PER_PAGE}
              departments={departments}
              roles={rolesData?.data}
              onEdit={(user) => setEditingUser(user)}
              onDelete={handleDeleteUser}
            />
          </div>
        ) : (
          <div className="animate-in fade-in slide-in-from-right-2 duration-300">
            <RolesManagement />
          </div>
        )}
      </div>

      <UserEditDialog
        user={editingUser}
        isOpen={!!editingUser}
        onClose={() => setEditingUser(null)}
      />
    </div>
  );
}
