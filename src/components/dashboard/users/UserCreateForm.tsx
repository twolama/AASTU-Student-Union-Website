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
import type { Role } from "@/api/services/user.service";
import { parseApiFormError } from "@/lib/api-errors";

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
  const [fullName, setFullName] = useState(() => user?.name || "");
  const [studentId, setStudentId] = useState(() => user?.studentId || "");
  const [email, setEmail] = useState(() => user?.email || "");
  const [department, setDepartment] = useState(() => user?.department || "");
  const [phone, setPhone] = useState(() => user?.phoneNumber || "");
  const [selectedRoles, setSelectedRoles] = useState<string[]>(() => {
    if (user?.roles && user.roles.length) return user.roles;
    if (user?.rolesDetails && user.rolesDetails.length) return user.rolesDetails.map((r) => r.id as string);
    return [];
  });
  
  
  const [memberRoleCleared, setMemberRoleCleared] = useState(false);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [statusType, setStatusType] = useState<"success" | "error">("success");
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  function clearFieldError(field: string) {
    setFieldErrors((prev) => {
      if (!prev[field]) {
        return prev;
      }

      const next = { ...prev };
      delete next[field];
      return next;
    });
  }

  const avatarPreviewUrl = useMemo(() => {
    if (avatarFile) return URL.createObjectURL(avatarFile);
    return user?.avatar || undefined;
  }, [avatarFile, user?.avatar]);

  useEffect(() => {
    return () => {
      if (avatarPreviewUrl) URL.revokeObjectURL(avatarPreviewUrl);
    };
  }, [avatarPreviewUrl]);

  const memberRoleId = useMemo(() => {
    const memberRole = rolesData?.data?.find(
      (role: Role) => role.slug.toLowerCase() === "member" || role.name.toLowerCase() === "member"
    );
    return memberRole?.id ?? "";
  }, [rolesData]);

  const effectiveSelectedRoles = useMemo(() => {
    if (editMode || !memberRoleId || memberRoleCleared) return selectedRoles;
    if (selectedRoles.includes(memberRoleId)) return selectedRoles;
    return [memberRoleId, ...selectedRoles];
  }, [editMode, memberRoleCleared, memberRoleId, selectedRoles]);

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
    clearFieldError("roles");

    if (!editMode && roleId === memberRoleId) {
      if (selectedRoles.includes(roleId)) {
        setSelectedRoles((prev) => prev.filter((id) => id !== roleId));
        setMemberRoleCleared(true);
        return;
      }

      if (memberRoleCleared) {
        setSelectedRoles((prev) => [...prev, roleId]);
        setMemberRoleCleared(false);
        return;
      }
    }

    setSelectedRoles((prev) =>
      prev.includes(roleId) ? prev.filter((id) => id !== roleId) : [...prev, roleId]
    );
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setFieldErrors({});
    setStatusMessage(null);

    const localFieldErrors: Record<string, string> = {};

    if (!department) {
      localFieldErrors.department = "Please select a department.";
    }

    if (effectiveSelectedRoles.length === 0) {
      localFieldErrors.roles = "Please select at least one system role.";
    }

    if (Object.keys(localFieldErrors).length > 0) {
      setFieldErrors(localFieldErrors);
      return;
    }

    try {
      if (editMode && user) {
        // Update
        if (avatarFile) {
          const formData = new FormData();
          formData.append("name", fullName.trim());
          formData.append("student_id", studentId.trim());
          formData.append("department", department);
          effectiveSelectedRoles.forEach((roleId) => formData.append("roles", roleId));
          formData.append("email", email.trim());
          if (phone.trim()) formData.append("phone_number", phone.trim());
          formData.append("avatar", avatarFile);

          await updateUserMutation.mutateAsync({ id: user.id, data: formData });
        } else {
          await updateUserMutation.mutateAsync({
            id: user.id,
            data: {
              name: fullName.trim(),
              student_id: studentId.trim(),
              department,
              roles: effectiveSelectedRoles,
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
        roles: effectiveSelectedRoles,
        email: email.trim(),
        ...(phone.trim() ? { phone_number: phone.trim() } : {}),
        ...(avatarFile ? { avatar: avatarFile } : {}),
      });

      setStatusType("success");
      setStatusMessage("User account created successfully. Temporary password email has been sent.");
      setFieldErrors({});

      setAvatarFile(null);
      setFullName("");
      setStudentId("");
      setEmail("");
      setDepartment("");
      setPhone("");
      setSelectedRoles([]);
      setMemberRoleCleared(false);
    } catch (error: unknown) {
      const parsed = parseApiFormError(error, {
        fieldAliases: {
          phone: "phone_number",
          role: "roles",
        },
      });

      const knownFieldKeys = new Set([
        "name",
        "student_id",
        "email",
        "department",
        "phone_number",
        "roles",
        "avatar",
      ]);

      const inlineErrors: Record<string, string> = {};
      const nonFieldMessages = [...parsed.nonFieldErrors];

      Object.entries(parsed.fieldErrors).forEach(([key, value]) => {
        if (knownFieldKeys.has(key)) {
          inlineErrors[key] = value;
          return;
        }

        nonFieldMessages.push(`${key}: ${value}`);
      });

      // Fallback: try to safely traverse nested payload -> error -> upstream -> error -> details
      let upstreamDetailsObj: Record<string, unknown> | undefined;
      if (typeof error === "object" && error !== null) {
        const errObj = error as Record<string, unknown>;
        let payloadObj: Record<string, unknown> | undefined;

        if (errObj.payload && typeof errObj.payload === "object" && errObj.payload !== null) {
          payloadObj = errObj.payload as Record<string, unknown>;
        } else if (errObj.response && typeof errObj.response === "object" && errObj.response !== null) {
          const resp = errObj.response as Record<string, unknown>;
          if (resp.data && typeof resp.data === "object" && resp.data !== null) {
            payloadObj = resp.data as Record<string, unknown>;
          }
        }

        if (
          payloadObj &&
          payloadObj.error &&
          typeof payloadObj.error === "object" &&
          (payloadObj.error as Record<string, unknown>).upstream &&
          typeof (payloadObj.error as Record<string, unknown>).upstream === "object"
        ) {
          const up = (payloadObj.error as Record<string, unknown>).upstream as Record<string, unknown>;
          if (up.error && typeof up.error === "object") {
            const ue = up.error as Record<string, unknown>;
            if (ue.details && typeof ue.details === "object") upstreamDetailsObj = ue.details as Record<string, unknown>;
            else if (ue.detail && typeof ue.detail === "object") upstreamDetailsObj = ue.detail as Record<string, unknown>;
          }
        }
      }

      if (upstreamDetailsObj) {
        for (const [key, value] of Object.entries(upstreamDetailsObj)) {
          if (knownFieldKeys.has(key) && !inlineErrors[key]) {
            inlineErrors[key] = Array.isArray(value) ? String(value[0]) : String(value);
          }
        }
      }

      if (Object.keys(inlineErrors).length > 0) {
        setFieldErrors(inlineErrors);
      }

      if (nonFieldMessages.length > 0 || Object.keys(inlineErrors).length === 0) {
        setStatusType("error");
        setStatusMessage(nonFieldMessages[0] || parsed.message || "Failed to save user. Please try again.");
      }
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
              onChange={(file) => {
                setAvatarFile(file);
                clearFieldError("avatar");
              }}
              onClear={() => {
                setAvatarFile(null);
                clearFieldError("avatar");
              }}
              className="[&>p]:hidden [&_label]:min-h-0"
            />
            {fieldErrors.avatar ? (
              <p className="mt-1.5 px-1 text-xs font-medium text-red-500">{fieldErrors.avatar}</p>
            ) : null}

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
                onChange={(event) => {
                  setFullName(event.target.value);
                  clearFieldError("name");
                }}
                placeholder="e.g. Abebe Bikila"
                className="h-10 rounded-[10px]"
                error={fieldErrors.name}
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
                  onChange={(event) => {
                    setStudentId(event.target.value);
                    clearFieldError("student_id");
                  }}
                  placeholder="ETS0000/12"
                  className="h-10 rounded-[10px]"
                  error={fieldErrors.student_id}
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
                  onChange={(event) => {
                    setEmail(event.target.value);
                    clearFieldError("email");
                  }}
                  placeholder="name@aastu.edu.et"
                  className="h-10 rounded-[10px]"
                  error={fieldErrors.email}
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
                  onValueChange={(value) => {
                    setDepartment(value);
                    clearFieldError("department");
                  }}
                  disabled={isDepartmentsLoading || createUserMutation.isPending}
                  error={fieldErrors.department}
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
                  onChange={(event) => {
                    setPhone(event.target.value);
                    clearFieldError("phone_number");
                  }}
                  placeholder="+251 900 000 000"
                  className="h-10 rounded-[10px]"
                  error={fieldErrors.phone_number}
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
                          checked={effectiveSelectedRoles.includes(roleOption.value)}
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
              {fieldErrors.roles ? (
                <p className="mt-1.5 px-1 text-xs font-medium text-red-500">{fieldErrors.roles}</p>
              ) : null}
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
