"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { AlertCircle, Camera } from "lucide-react";
import { FileUpload } from "@/components/ui/FileUpload";
import { Input } from "@/components/ui/Input";
import { DropdownSelect } from "@/components/ui/DropdownSelect";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";
import type { UserManagementRole } from "@/types/dashboard";

const departmentOptions = [
  "Software Engineering",
  "Architecture",
  "Electrical Engineering",
  "Civil Engineering",
  "Computer Science",
  "Mechanical Engineering",
  "Chemical Engineering",
  "Biomedical Engineering",
];

const departmentDropdownOptions = [
  { value: "", label: "Select Department" },
  ...departmentOptions.map((option) => ({ value: option, label: option })),
];

const roleOptions: { value: UserManagementRole; label: string }[] = [
  { value: "general-student", label: "General Student" },
  { value: "club-president", label: "Club President" },
  { value: "su-admin", label: "SU Admin" },
];

export function UserCreateForm() {
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [fullName, setFullName] = useState("");
  const [studentId, setStudentId] = useState("");
  const [email, setEmail] = useState("");
  const [department, setDepartment] = useState("");
  const [phone, setPhone] = useState("");
  const [role, setRole] = useState<UserManagementRole>("general-student");
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  const avatarPreviewUrl = useMemo(() => {
    if (!avatarFile) {
      return undefined;
    }

    return URL.createObjectURL(avatarFile);
  }, [avatarFile]);

  useEffect(() => {
    return () => {
      if (avatarPreviewUrl) {
        URL.revokeObjectURL(avatarPreviewUrl);
      }
    };
  }, [avatarPreviewUrl]);

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatusMessage("User account created successfully. Invitation email will be sent shortly.");
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

            <fieldset>
              <legend className="mb-2 block text-sm font-semibold text-[#3b4660]">System Role</legend>
              <div className="grid gap-2 sm:grid-cols-3">
                {roleOptions.map((option) => {
                  const isActive = role === option.value;

                  return (
                    <label
                      key={option.value}
                      className={cn(
                        "flex cursor-pointer items-center gap-2 rounded-[10px] border px-3 py-2 text-sm transition-colors",
                        isActive
                          ? "border-[#c49a22]/40 bg-[#fdf8ec] text-[#1f2a44]"
                          : "border-gray-200 bg-white text-[#4f5f7c] hover:border-[#c49a22]/30"
                      )}
                    >
                      <input
                        type="radio"
                        name="user-role"
                        checked={isActive}
                        onChange={() => setRole(option.value)}
                        className="h-4 w-4 border-gray-300 text-[#c49a22] focus:ring-[#c49a22]/30"
                      />
                      <span className="font-medium">{option.label}</span>
                    </label>
                  );
                })}
              </div>
            </fieldset>
          </div>
        </div>

        <div className="mt-6 flex flex-col-reverse items-stretch justify-end gap-2 border-t border-gray-100 pt-4 sm:flex-row sm:items-center">
          <Link href="/users" className="inline-flex">
            <Button type="button" variant="ghost" className="h-10 w-full text-[#4f5f7c] sm:w-auto">
              Cancel
            </Button>
          </Link>
          <Button type="submit" variant="goldSolid" className="h-10 w-full sm:w-auto">
            Save User
          </Button>
        </div>
      </form>

      <article className="rounded-[10px] border border-[#ead9a3] bg-[#fffaf0] px-4 py-3 text-sm text-[#5e5b52] shadow-sm">
        <p className="inline-flex items-start gap-2">
          <AlertCircle size={16} className="mt-0.5 shrink-0 text-[#b48a1b]" />
          <span>
            <span className="font-semibold text-[#3d3a32]">Note:</span> After saving, the student will receive an invitation email to set their portal password. Ensure the email address is correct.
          </span>
        </p>
      </article>

      {statusMessage ? (
        <div className="rounded-[10px] border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
          {statusMessage}
        </div>
      ) : null}
    </div>
  );
}
