"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { AlertCircle, Camera } from "lucide-react";
import { FileUpload } from "@/components/ui/FileUpload";
import { Input } from "@/components/ui/Input";
import { DropdownSelect } from "@/components/ui/DropdownSelect";
import { Button } from "@/components/ui/Button";
import { useDepartments } from "@/hooks/useDepartments";
import { useRoles } from "@/hooks/useRoles";
import { useCreateUser, useUpdateUser } from "@/hooks/useUsers";
import { cn } from "@/lib/utils";
import { type CurrentUser } from "@/schemas/user.schema";
import { useRouter } from "next/navigation";

interface UserCreateFormProps {
  user?: CurrentUser | null;
  editMode?: boolean;
}

export function UserCreateForm({ user = null, editMode = false }: UserCreateFormProps) {
  const { data: departments = [], isLoading: isDepartmentsLoading } = useDepartments();
  const { data: rolesData, isLoading: isRolesLoading } = useRoles();
  const createUserMutation = useCreateUser();
  const updateUserMutation = useUpdateUser();
  const router = useRouter();

  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [fullName, setFullName] = useState("");
  const [studentId, setStudentId] = useState("");
  const [email, setEmail] = useState("");
  const [department, setDepartment] = useState("");
  const [phone, setPhone] = useState("");
  const [selectedRoles, setSelectedRoles] = useState<string[]>([]);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [statusType, setStatusType] = useState<"success" | "error">("success");

  const avatarPreviewUrl = useMemo(() => {
    if (avatarFile) return URL.createObjectURL(avatarFile);
    return user?.avatar || undefined;
  }, [avatarFile, user?.avatar]);

  useEffect(() => {
    return () => {
      if (avatarPreviewUrl) URL.revokeObjectURL(avatarPreviewUrl);
    };
  }, [avatarPreviewUrl]);

  useEffect(() => {
    if (!user) return;
    setFullName(user.name || "");
    setStudentId(user.studentId || "");
    setEmail(user.email || "");
    setDepartment(user.department || "");
    setPhone(user.phoneNumber || "");
    if (user.roles?.length) {
      setSelectedRoles(user.roles);
    } else if (user.roleDetails?.id) {
      setSelectedRoles([user.roleDetails.id]);
    } else {
      setSelectedRoles([]);
    }
  }, [user]);

  const departmentDropdownOptions = useMemo(
    () => [
      { value: "", label: isDepartmentsLoading ? "Loading departments..." : "Select Department" },
      ...departments.map((dept) => ({ value: dept.id, label: dept.name })),
    ],
    [departments, isDepartmentsLoading]
  );

  const roleOptions = useMemo(
    () => (rolesData?.data || []).map((roleOption) => ({
      value: roleOption.id,
      label: roleOption.name,
    })),
    [rolesData]
  );

  function toggleRole(roleId: string) {
    setSelectedRoles((prev) =>
      prev.includes(roleId) ? prev.filter((id) => id !== roleId) : [...prev, roleId]
    );
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!department) {
      setStatusType("error");
      setStatusMessage("Please select a department.");
      return;
    }

    if (selectedRoles.length === 0) {
      setStatusType("error");
      setStatusMessage("Please select at least one system role.");
      return;
    }

    setStatusMessage(null);

    try {
      if (editMode && user) {
        // Update
        if (avatarFile) {
          const formData = new FormData();
          formData.append("name", fullName.trim());
          formData.append("student_id", studentId.trim());
          formData.append("department", department);
          selectedRoles.forEach((roleId) => formData.append("roles", roleId));
          formData.append("email", email.trim());
          if (phone.trim()) formData.append("phone_number", phone.trim());
          formData.append("avatar", avatarFile);

          await updateUserMutation.mutateAsync({ id: user.id, data: formData } as any);
        } else {
          await updateUserMutation.mutateAsync({
            id: user.id,
            data: {
              name: fullName.trim(),
              student_id: studentId.trim(),
              department,
              roles: selectedRoles,
              email: email.trim(),
              ...(phone.trim() ? { phone_number: phone.trim() } : {}),
            },
          });
        }

        setStatusType("success");
        setStatusMessage("User profile updated successfully.");
        router.push("/users");
        return;
      }

      // Create
      await createUserMutation.mutateAsync({
        name: fullName.trim(),
        student_id: studentId.trim(),
        department,
        roles: selectedRoles,
        email: email.trim(),
        ...(phone.trim() ? { phone_number: phone.trim() } : {}),
        ...(avatarFile ? { avatar: avatarFile } : {}),
      });

      setStatusType("success");
      setStatusMessage("User account created successfully. Temporary password email has been sent.");

      setAvatarFile(null);
      setFullName("");
      setStudentId("");
      setEmail("");
      setDepartment("");
      setPhone("");
      setSelectedRoles([]);
    } catch (error: any) {
      setStatusType("error");
      setStatusMessage(error?.message || "Failed to save user. Please try again.");
    }
  }

  return (
    <div className="space-y-4">
      <form onSubmit={handleSubmit} className="rounded-[12px] border border-gray-200 bg-white p-4 shadow-sm sm:p-6">
        <div className="grid gap-5 lg:grid-cols-[220px_minmax(0,1fr)]">
          <div className="space-y-2">
            <h2 className="text-xs font-semibold uppercase tracking-[0.12em] text-[#2b3551]">Profile Photo</h2>
            <p className="text-xs text-[#8a95a8]">Recommended: square image, max 2MB. JPG or PNG.</p>

            <FileUpload
              label=""
              helperText="Upload Avatar"
              previewUrl={avatarPreviewUrl}
              fileName={avatarFile?.name}
              accept="image/png,image/jpeg,image/jpg"
              onChange={setAvatarFile}
              onClear={() => setAvatarFile(null)}
              className="[&>p]:hidden [&_label]:min-h-0"
            />

            {!avatarFile ? (
              <div className="inline-flex items-center gap-1.5 text-[11px] font-medium text-[#8a95a8]">
                <Camera size={12} />
                Optional
              </div>
            ) : null}
          </div>

          <div className="space-y-4">
            <div>
              <label htmlFor="user-full-name" className="mb-1.5 block text-sm font-semibold text-[#3b4660]">
                Full Name
              </label>
              <Input
                id="user-full-name"
                value={fullName}
                onChange={(event) => setFullName(event.target.value)}
                placeholder="e.g. Abebe Bikila"
                className="h-10 rounded-[10px]"
                required
              />
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              <div>
                <label htmlFor="user-student-id" className="mb-1.5 block text-sm font-semibold text-[#3b4660]">
                  Student ID
                </label>
                <Input
                  id="user-student-id"
                  value={studentId}
                  onChange={(event) => setStudentId(event.target.value)}
                  placeholder="ETS0000/12"
                  className="h-10 rounded-[10px]"
                  required
                />
              </div>

              <div>
                <label htmlFor="user-email" className="mb-1.5 block text-sm font-semibold text-[#3b4660]">
                  Email Address
                </label>
                <Input
                  id="user-email"
                  type="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  placeholder="name@aastu.edu.et"
                  className="h-10 rounded-[10px]"
                  required
                />
              </div>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              <div>
                <label htmlFor="user-department" className="mb-1.5 block text-sm font-semibold text-[#3b4660]">
                  Department
                </label>
                <DropdownSelect
                  label=""
                  value={department}
                  options={departmentDropdownOptions}
                  onValueChange={setDepartment}
                  disabled={isDepartmentsLoading || createUserMutation.isPending}
                  className="[&>p]:hidden [&>div>button]:h-10 [&>div>button]:rounded-[10px]"
                />
              </div>

              <div>
                <label htmlFor="user-phone" className="mb-1.5 block text-sm font-semibold text-[#3b4660]">
                  Phone Number
                </label>
                <Input
                  id="user-phone"
                  value={phone}
                  onChange={(event) => setPhone(event.target.value)}
                  placeholder="+251 900 000 000"
                  className="h-10 rounded-[10px]"
                />
              </div>
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-semibold text-[#3b4660]">System Roles</label>
              <div className="rounded-[10px] border border-gray-200 bg-gray-50/50 p-3">
                {isRolesLoading ? (
                  <p className="text-xs text-[#8a95a8]">Loading roles...</p>
                ) : roleOptions.length === 0 ? (
                  <p className="text-xs text-[#8a95a8]">No roles available.</p>
                ) : (
                  <div className="grid gap-2 sm:grid-cols-2">
                    {roleOptions.map((roleOption) => (
                      <label
                        key={roleOption.value}
                        className="flex cursor-pointer items-center gap-2 rounded-md border border-transparent px-2 py-1.5 text-sm text-[#3b4660] hover:border-[#ead9a3] hover:bg-white"
                      >
                        <input
                          type="checkbox"
                          checked={selectedRoles.includes(roleOption.value)}
                          onChange={() => toggleRole(roleOption.value)}
                          className="h-4 w-4 rounded border-gray-300 text-[#c49a22] focus:ring-[#c49a22]"
                          disabled={createUserMutation.isPending || updateUserMutation.isPending}
                        />
                        <span>{roleOption.label}</span>
                      </label>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="mt-6 flex flex-col-reverse items-stretch justify-end gap-2 border-t border-gray-100 pt-4 sm:flex-row sm:items-center">
          <Link href="/users" className="inline-flex">
            <Button type="button" variant="ghost" className="h-10 w-full text-[#4f5f7c] sm:w-auto">
              Cancel
            </Button>
          </Link>
          <Button
            type="submit"
            variant="goldSolid"
            className="h-10 w-full sm:w-auto"
            isLoading={editMode ? updateUserMutation.isPending : createUserMutation.isPending}
            disabled={editMode ? updateUserMutation.isPending : createUserMutation.isPending}
          >
            Save User
          </Button>
        </div>
      </form>

      <article className="rounded-[10px] border border-[#ead9a3] bg-[#fffaf0] px-4 py-3 text-sm text-[#5e5b52] shadow-sm">
        <p className="inline-flex items-start gap-2">
          <AlertCircle size={16} className="mt-0.5 shrink-0 text-[#b48a1b]" />
          <span>
            <span className="font-semibold text-[#3d3a32]">Note:</span> After saving, the student will receive a temporary password by email and must change it immediately after first login.
          </span>
        </p>
      </article>

      {statusMessage ? (
        <div
          className={cn(
            "rounded-[10px] px-4 py-3 text-sm",
            statusType === "success"
              ? "border border-emerald-200 bg-emerald-50 text-emerald-700"
              : "border border-red-200 bg-red-50 text-red-700"
          )}
        >
          {statusMessage}
        </div>
      ) : null}
    </div>
  );
}
