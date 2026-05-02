"use client";

import { useState, useEffect } from "react";
import { X, Shield, User, Loader2 } from "lucide-react";
import { type CurrentUser } from "@/schemas/user.schema";
import { type Role } from "@/api/services/user.service";
import { useRoles } from "@/hooks/useRoles";
import { useDepartments } from "@/hooks/useDepartments";
import { useUpdateUser } from "@/hooks/useUsers";
import { Button } from "@/components/ui/Button";
import { DropdownSelect } from "@/components/ui/DropdownSelect";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { toast } from "sonner";

interface UserEditDialogProps {
  user: CurrentUser | null;
  isOpen: boolean;
  onClose: () => void;
}

export function UserEditDialog({ user, isOpen, onClose }: UserEditDialogProps) {
  const { data: rolesData, isLoading: isRolesLoading } = useRoles();
  const { data: departments = [], isLoading: isDepartmentsLoading } = useDepartments();
  const updateUserMutation = useUpdateUser();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [studentId, setStudentId] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [dormBlock, setDormBlock] = useState("");
  const [dormRoom, setDormRoom] = useState("");
  const [selectedDepartmentId, setSelectedDepartmentId] = useState<string>("");
  const [selectedRoleId, setSelectedRoleId] = useState<string>("");
  const [bio, setBio] = useState("");

  useEffect(() => {
    if (user) {
      setFullName(user.name || "");
      setEmail(user.email || "");
      setStudentId(user.studentId || "");
      setPhoneNumber(user.phoneNumber || "");
      setDormBlock(user.dormBlock || "");
      setDormRoom(user.dormRoom || "");
      setSelectedDepartmentId(user.department || "");
      setSelectedRoleId(user.role || "");
      setBio(user.bio || "");
    }
  }, [user]);

  if (!isOpen || !user) return null;

  const handleSave = async () => {
    try {
      await updateUserMutation.mutateAsync({
        id: user.id,
        data: {
          name: fullName.trim(),
          email: email.trim(),
          studentId: studentId.trim(),
          phoneNumber: phoneNumber.trim() || null,
          dormBlock: dormBlock.trim() || null,
          dormRoom: dormRoom.trim() || null,
          department: selectedDepartmentId || null,
          role: selectedRoleId || null,
          bio: bio.trim() || null,
        },
      });
      toast.success("User Updated!", {
        description: `Successfully updated profile for ${fullName || user.name}.`,
      });
      onClose();
    } catch (error: any) {
      toast.error("Update Failed", {
        description: error.message || "Failed to update user information.",
      });
    }
  };

  const departmentOptions = [
    { value: "", label: "No Department" },
    ...departments.map((department) => ({
      value: department.id,
      label: department.name,
    })),
  ];

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
              <h2 className="text-lg font-bold text-[#1f2a44]">Edit User Profile</h2>
              <p className="text-xs font-medium text-gray-500">Update student information and access level</p>
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

          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label htmlFor="edit-user-name" className="mb-1.5 block text-sm font-semibold text-[#3b4660]">
                Full Name
              </label>
              <Input
                id="edit-user-name"
                value={fullName}
                onChange={(event) => setFullName(event.target.value)}
                placeholder="Student full name"
              />
            </div>
            <div>
              <label htmlFor="edit-user-email" className="mb-1.5 block text-sm font-semibold text-[#3b4660]">
                Email
              </label>
              <Input
                id="edit-user-email"
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="student@aastu.edu.et"
              />
            </div>

            <div>
              <label htmlFor="edit-user-student-id" className="mb-1.5 block text-sm font-semibold text-[#3b4660]">
                Student ID
              </label>
              <Input
                id="edit-user-student-id"
                value={studentId}
                onChange={(event) => setStudentId(event.target.value)}
                placeholder="ETS0000/12"
              />
            </div>
            <div>
              <label htmlFor="edit-user-phone" className="mb-1.5 block text-sm font-semibold text-[#3b4660]">
                Phone Number
              </label>
              <Input
                id="edit-user-phone"
                value={phoneNumber}
                onChange={(event) => setPhoneNumber(event.target.value)}
                placeholder="+251 900 000 000"
              />
            </div>

            <div>
              <label htmlFor="edit-user-dorm-block" className="mb-1.5 block text-sm font-semibold text-[#3b4660]">
                Dorm Block
              </label>
              <Input
                id="edit-user-dorm-block"
                value={dormBlock}
                onChange={(event) => setDormBlock(event.target.value)}
                placeholder="Block"
              />
            </div>
            <div>
              <label htmlFor="edit-user-dorm-room" className="mb-1.5 block text-sm font-semibold text-[#3b4660]">
                Dorm Room
              </label>
              <Input
                id="edit-user-dorm-room"
                value={dormRoom}
                onChange={(event) => setDormRoom(event.target.value)}
                placeholder="Room"
              />
            </div>

            <div>
              <DropdownSelect
                label="Department"
                value={selectedDepartmentId}
                options={departmentOptions}
                onValueChange={setSelectedDepartmentId}
                disabled={isDepartmentsLoading}
                className="[&>div>button]:h-11 [&>div>button]:rounded-xl"
              />
            </div>
            <div>
              <DropdownSelect
                label="Assigned Union Role"
                value={selectedRoleId}
                options={roleOptions}
                onValueChange={setSelectedRoleId}
                disabled={isRolesLoading}
                className="[&>div>button]:h-11 [&>div>button]:rounded-xl"
              />
            </div>
          </div>

          <div className="mt-4">
            <label htmlFor="edit-user-bio" className="mb-1.5 block text-sm font-semibold text-[#3b4660]">
              Bio
            </label>
            <Textarea
              id="edit-user-bio"
              value={bio}
              onChange={(event) => setBio(event.target.value)}
              placeholder="Short user bio or note"
              className="min-h-24"
            />
          </div>

          <div className="mt-4 rounded-xl bg-[#fdf8ec]/50 p-4 border border-[#ead9a3]/30">
            <p className="text-[11px] font-bold uppercase tracking-wider text-[#8c6c14]">Role Impact</p>
            <p className="mt-2 text-xs leading-relaxed text-[#8c6c14]/80">
              Changing a user's role will immediately update their permissions across the platform.
            </p>
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
