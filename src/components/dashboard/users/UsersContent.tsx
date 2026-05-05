"use client";

import { useMemo, useState } from "react";
import { UsersFilters } from "@/components/dashboard/users/UsersFilters";
import { UsersStatsSection } from "@/components/dashboard/users/UsersStatsSection";
import { UsersTable } from "@/components/dashboard/users/UsersTable";
import { useRouter } from "next/navigation";
import { RolesManagement } from "@/components/dashboard/users/RolesManagement";
import { ConfirmationDialog } from "@/components/ui/ConfirmationDialog";
import { useUsers, useDeleteUser } from "@/hooks/useUsers";
import { useRoles } from "@/hooks/useRoles";
import { useDepartments } from "@/hooks/useDepartments";
import { usePermissions } from "@/hooks/usePermissions";
import { Tabs } from "@/components/ui/Tabs";
import { Loader2 } from "lucide-react";
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
  const router = useRouter();
  const [deleteTarget, setDeleteTarget] = useState<CurrentUser | null>(null);

  // Fetch real data
  const { data: usersData, isLoading: isUsersLoading } = useUsers(currentPage, ITEMS_PER_PAGE, searchTerm, selectedRole, selectedDepartment);
  const { data: rolesData } = useRoles();
  const { data: departments = [] } = useDepartments();
  const { hasPermission } = usePermissions();
  const deleteUserMutation = useDeleteUser();
  const canEditUsers = hasPermission("users.edit");
  const canDeleteUsers = hasPermission("users.delete");
  const canManageRoles = hasPermission("users.edit");

  const isUsersInitialLoading = isUsersLoading && !usersData;

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
    try {
      await deleteUserMutation.mutateAsync(user.id);
      toast.success("User deleted successfully.");
      setDeleteTarget(null);
    } catch (error) {
      toast.error("Deletion failed", {
        description: error instanceof Error ? error.message : "Please try again.",
      });
    }
  };

  if (isUsersInitialLoading) {
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
    { ...userManagementStats[1], value: users.filter((u) => (u.roles?.length ?? 0) > 0 || !!u.role).length.toString() },
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
              canEditUsers={canEditUsers}
              canDeleteUsers={canDeleteUsers}
              onEdit={(user) => router.push(`/users/${user.id}/edit`)}
              onDelete={(user) => setDeleteTarget(user)}
            />
          </div>
        ) : (
          canManageRoles ? (
            <div className="animate-in fade-in slide-in-from-right-2 duration-300">
              <RolesManagement />
            </div>
          ) : (
            <div className="rounded-[22px] border border-dashed border-gray-200 bg-white px-6 py-10 text-center text-sm text-gray-500">
              You do not have permission to manage roles.
            </div>
          )
        )}
      </div>

      {/* Edit handled on separate page */}

      <ConfirmationDialog
        open={deleteTarget !== null}
        title="Delete User Account"
        message={`Are you sure you want to delete ${deleteTarget?.name}? This action cannot be undone.`}
        confirmLabel="Delete User"
        onConfirm={() => {
          if (deleteTarget) {
            void handleDeleteUser(deleteTarget);
          }
        }}
        onCancel={() => setDeleteTarget(null)}
        isLoading={deleteUserMutation.isPending}
      />
    </div>
  );
}
