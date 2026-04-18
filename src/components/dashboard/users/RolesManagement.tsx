"use client";

import { useRoles, useCreateRole, useUpdateRole, useDeleteRole } from "@/hooks/useRoles";
import { Plus, Shield, Loader2, Edit3, Trash2, Users } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { toast } from "sonner";
import { useState } from "react";
import { type Role } from "@/api/services/user.service";
import { cn } from "@/lib/utils";

export function RolesManagement() {
  const { data: rolesData, isLoading } = useRoles();
  const deleteRoleMutation = useDeleteRole();
  const [isAddingNew, setIsAddingNew] = useState(false);

  if (isLoading) {
    return (
      <div className="flex h-[400px] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-[#c49a22]" />
      </div>
    );
  }

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this role? Standard members with this role will lose it.")) return;
    try {
      await deleteRoleMutation.mutateAsync(id);
      toast.success("Role Deleted");
    } catch (error: any) {
      toast.error("Deletion Failed", { description: error.message });
    }
  };

  const roles = rolesData?.data || [];

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h3 className="text-lg font-bold text-[#1f2a44]">Union Roles</h3>
          <p className="text-sm text-gray-500">Manage definitions and permissions for all union staff and members.</p>
        </div>
        <Button variant="goldSolid" className="gap-2 rounded-xl h-10 shadow-lg shadow-[#c49a22]/10" onClick={() => toast.info("Role editor coming soon!")}>
          <Plus size={16} />
          Create New Role
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {roles.map((role) => (
          <article 
            key={role.id} 
            className="group relative flex flex-col rounded-[22px] border border-gray-100 bg-white p-5 shadow-sm transition-all hover:shadow-md hover:border-[#ead9a3]/50"
          >
            <div className="mb-4 flex items-start justify-between">
              <div className={cn(
                "flex h-12 w-12 items-center justify-center rounded-2xl shadow-sm transition-transform group-hover:scale-110",
                role.isStaffRole ? "bg-[#fdf8ec] text-[#c49a22]" : "bg-gray-50 text-gray-400"
              )}>
                <Shield size={24} />
              </div>
              <div className="flex gap-1.5 opacity-0 transition-opacity group-hover:opacity-100">
                <button className="rounded-lg p-2 text-gray-400 hover:bg-gray-50 hover:text-[#c49a22]">
                  <Edit3 size={16} />
                </button>
                <button 
                  onClick={() => handleDelete(role.id)}
                  className="rounded-lg p-2 text-gray-400 hover:bg-red-50 hover:text-red-500"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>

            <div>
              <div className="flex items-center gap-2">
                <h4 className="font-bold text-[#1f2a44]">{role.name}</h4>
                {role.isStaffRole && (
                  <Badge variant="gold" className="rounded-full px-1.5 py-0 text-[9px] uppercase font-bold">Staff</Badge>
                )}
              </div>
              <p className="mt-1.5 line-clamp-2 text-xs leading-relaxed text-gray-500">
                {role.description || "No description provided for this role."}
              </p>
            </div>

            <div className="mt-6 flex items-center justify-between border-t border-gray-50 pt-4">
              <div className="flex items-center gap-1.5 text-[#7f8ba2]">
                <Users size={14} />
                <span className="text-[11px] font-bold uppercase tracking-wider">Dynamic Stats</span>
              </div>
              <p className="text-[10px] font-bold text-gray-300">ID: {role.slug}</p>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
