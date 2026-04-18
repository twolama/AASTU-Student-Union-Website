"use client";

import { useState, useEffect } from "react";
import { X, Shield, User, Loader2 } from "lucide-react";
import { type CurrentUser } from "@/schemas/user.schema";
import { type Role } from "@/api/services/user.service";
import { useRoles } from "@/hooks/useRoles";
import { useUpdateUser } from "@/hooks/useUsers";
import { Button } from "@/components/ui/Button";
import { DropdownSelect } from "@/components/ui/DropdownSelect";
import { toast } from "sonner";

interface UserEditDialogProps {
  user: CurrentUser | null;
  isOpen: boolean;
  onClose: () => void;
}

export function UserEditDialog({ user, isOpen, onClose }: UserEditDialogProps) {
  const { data: rolesData, isLoading: isRolesLoading } = useRoles();
  const updateUserMutation = useUpdateUser();
  const [selectedRoleId, setSelectedRoleId] = useState<string>("");

  useEffect(() => {
    if (user) {
      setSelectedRoleId(user.role || "");
    }
  }, [user]);

  if (!isOpen || !user) return null;

  const handleSave = async () => {
    try {
      await updateUserMutation.mutateAsync({
        id: user.id,
        data: { role: selectedRoleId || null },
      });
      toast.success("User Updated!", {
        description: `Successfully updated roles for ${user.name}.`,
      });
      onClose();
    } catch (error: any) {
      toast.error("Update Failed", {
        description: error.message || "Failed to update user role.",
      });
    }
  };

  const roleOptions = [
    { value: "", label: "No Role (Standard Member)" },
    ...(rolesData?.data || []).map((role: Role) => ({
      value: role.id,
      label: role.name,
    })),
  ];

  return (
    <div className="fixed inset-0 z-100 flex items-center justify-center p-4 sm:p-6">
      <div 
        className="absolute inset-0 bg-[#0f172a]/40 backdrop-blur-sm transition-opacity animate-in fade-in duration-300" 
        onClick={onClose} 
      />
      
      <div className="relative w-full max-w-lg overflow-hidden rounded-[28px] border border-white/20 bg-white/95 shadow-2xl backdrop-blur-md animate-in zoom-in-95 fade-in duration-300">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-gray-100 px-6 py-5">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#fdf8ec] text-[#c49a22]">
              <Shield size={20} />
            </div>
            <div>
              <h2 className="text-lg font-bold text-[#1f2a44]">Manage Permissions</h2>
              <p className="text-xs font-medium text-gray-500">Edit union roles and access levels</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="rounded-full p-2 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600"
          >
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          <div className="mb-6 flex items-center gap-4 rounded-2xl bg-gray-50/50 p-4 border border-gray-100">
            <div className="h-12 w-12 overflow-hidden rounded-full border border-white shadow-sm ring-2 ring-gray-100">
              {user.avatar ? (
                <img src={user.avatar} alt={user.name} className="h-full w-full object-cover" />
              ) : (
                <div className="flex h-full w-full items-center justify-center bg-[#2a3654] text-white">
                  <User size={20} />
                </div>
              )}
            </div>
            <div>
              <p className="font-bold text-[#1f2a44]">{user.name}</p>
              <p className="text-xs text-gray-500">{user.email || user.studentId}</p>
            </div>
          </div>

          <div className="space-y-4">
            <DropdownSelect
              label="Assigned Union Role"
              value={selectedRoleId}
              options={roleOptions}
              onValueChange={setSelectedRoleId}
              disabled={isRolesLoading}
              className="[&>div>button]:h-12 [&>div>button]:rounded-xl"
            />
            
            <div className="rounded-xl bg-[#fdf8ec]/50 p-4 border border-[#ead9a3]/30">
              <p className="text-[11px] font-bold uppercase tracking-wider text-[#8c6c14]">Role Impact</p>
              <p className="mt-2 text-xs leading-relaxed text-[#8c6c14]/80">
                Changing a user's role will immediately update their permissions across the platform. 
                They may gain or lose access to specific dashboard features.
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 border-t border-gray-100 bg-gray-50/30 px-6 py-4">
          <Button variant="ghost" onClick={onClose} className="rounded-xl font-semibold text-gray-500">
            Cancel
          </Button>
          <Button 
            variant="goldSolid" 
            onClick={handleSave} 
            className="rounded-xl px-8 shadow-lg shadow-[#c49a22]/20"
            isLoading={updateUserMutation.isPending}
          >
            Save Changes
          </Button>
        </div>
      </div>
    </div>
  );
}
