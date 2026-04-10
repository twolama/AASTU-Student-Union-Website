"use client";

import { useEffect, useMemo, useState } from "react";
import {
  Bell,
  Camera,
  LockKeyhole,
  ShieldCheck,
  UserCircle2,
} from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { DropdownSelect } from "@/components/ui/DropdownSelect";
import { FileUpload } from "@/components/ui/FileUpload";
import { Input } from "@/components/ui/Input";
import { Switch } from "@/components/ui/Switch";
import { Textarea } from "@/components/ui/Textarea";
import { currentUser } from "@/data/dummy";

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

const timezoneOptions = [
  { value: "africa-addis-ababa", label: "Africa / Addis Ababa (UTC+3)" },
  { value: "africa-nairobi", label: "Africa / Nairobi (UTC+3)" },
  { value: "utc", label: "UTC (UTC+0)" },
];

const languageOptions = [
  { value: "en", label: "English" },
  { value: "am", label: "Amharic" },
];

const roleOptions = [
  { value: "super-admin", label: "Super Admin" },
  { value: "executive", label: "Administrator (SU Executive)" },
  { value: "manager", label: "Department Manager" },
];

export function UserSettingsContent() {
  const [displayName, setDisplayName] = useState(currentUser.name);
  const [email, setEmail] = useState("abebe.kebede@aastu.edu.et");
  const [phone, setPhone] = useState("+251 912 345 678");
  const [department, setDepartment] = useState("Software Engineering");
  const [timezone, setTimezone] = useState("africa-addis-ababa");
  const [language, setLanguage] = useState("en");
  const [role, setRole] = useState("super-admin");
  const [about, setAbout] = useState(
    "Managing student union operations, digital communications, and cross-department coordination."
  );
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [profilePhoto, setProfilePhoto] = useState<File | null>(null);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [securityAlerts, setSecurityAlerts] = useState(true);
  const [weeklyDigest, setWeeklyDigest] = useState(false);
  const [twoFactor, setTwoFactor] = useState(true);

  const avatarPreviewUrl = useMemo(() => {
    if (!profilePhoto) {
      return undefined;
    }

    return URL.createObjectURL(profilePhoto);
  }, [profilePhoto]);

  useEffect(() => {
    return () => {
      if (avatarPreviewUrl) {
        URL.revokeObjectURL(avatarPreviewUrl);
      }
    };
  }, [avatarPreviewUrl]);

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatusMessage("Settings saved successfully. Your dashboard preferences and profile details were updated.");
  }

  return (
    <div className="space-y-4 sm:space-y-5">
      <section className="rounded-[22px] border border-gray-100 bg-white p-5 shadow-sm">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-4">
            <div className="relative">
              <div className="flex h-24 w-24 items-center justify-center overflow-hidden rounded-full border border-[#ead9a3] bg-[#fdf8ec] shadow-sm">
                {avatarPreviewUrl ? (
                  <img src={avatarPreviewUrl} alt="Selected profile preview" className="h-full w-full object-cover" />
                ) : (
                  <UserCircle2 size={54} className="text-[#c49a22]" />
                )}
              </div>
              <div className="absolute bottom-0 right-0 flex h-7 w-7 items-center justify-center rounded-full border-2 border-white bg-[#c49a22] text-white shadow-sm">
                <Camera size={14} />
              </div>
            </div>

            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h2 className="text-xl font-bold tracking-tight text-gray-900 sm:text-2xl">{displayName}</h2>
                <Badge variant="gold">Student Admin</Badge>
              </div>
              <p className="mt-1 text-sm text-gray-500">Department of {department}, AASTU</p>
              <p className="mt-1 text-xs text-gray-400">Member since Sept 2021 • ID: ETS/1234/13</p>
            </div>
          </div>

          <FileUpload
            label="Profile Photo"
            helperText="Upload avatar"
            previewUrl={avatarPreviewUrl}
            fileName={profilePhoto?.name}
            accept="image/png,image/jpeg,image/jpg,image/webp"
            onChange={setProfilePhoto}
            onClear={() => setProfilePhoto(null)}
            className="w-full md:max-w-[280px]"
          />
        </div>
      </section>

      <form onSubmit={handleSubmit} className="space-y-4">
        <section className="rounded-[22px] border border-gray-100 bg-white shadow-sm">
          <div className="flex items-center gap-2 border-b border-gray-100 px-5 py-4">
            <span className="inline-flex h-7 w-7 items-center justify-center rounded-md bg-[#fdf8ec] text-[#c49a22]">
              <UserCircle2 size={14} />
            </span>
            <h2 className="text-xs font-bold uppercase tracking-[0.14em] text-[#1f2a44]">Account Information</h2>
          </div>

          <div className="grid gap-4 px-5 py-5 md:grid-cols-2">
            <div>
              <label htmlFor="settings-display-name" className="mb-1.5 block text-sm font-semibold text-gray-700">
                Display Name
              </label>
              <Input
                id="settings-display-name"
                value={displayName}
                onChange={(event) => setDisplayName(event.target.value)}
                placeholder="Your full name"
              />
            </div>

            <div>
              <label htmlFor="settings-email" className="mb-1.5 block text-sm font-semibold text-gray-700">
                Email Address
              </label>
              <Input
                id="settings-email"
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="name@aastu.edu.et"
              />
            </div>

            <div>
              <label htmlFor="settings-phone" className="mb-1.5 block text-sm font-semibold text-gray-700">
                Phone Number
              </label>
              <Input
                id="settings-phone"
                value={phone}
                onChange={(event) => setPhone(event.target.value)}
                placeholder="+251 900 000 000"
              />
            </div>

            <DropdownSelect
              label="Department"
              value={department}
              options={departmentOptions.map((option) => ({ value: option, label: option }))}
              onValueChange={setDepartment}
            />

            <div className="md:col-span-2">
              <label htmlFor="settings-bio" className="mb-1.5 block text-sm font-semibold text-gray-700">
                Bio / Office Note
              </label>
              <Textarea
                id="settings-bio"
                value={about}
                onChange={(event) => setAbout(event.target.value)}
                placeholder="Short description visible on the dashboard profile card"
                className="min-h-32"
              />
            </div>
          </div>
        </section>

        <section className="rounded-[22px] border border-gray-100 bg-white shadow-sm">
          <div className="flex items-center gap-2 border-b border-gray-100 px-5 py-4">
            <span className="inline-flex h-7 w-7 items-center justify-center rounded-md bg-[#fdf8ec] text-[#c49a22]">
              <ShieldCheck size={14} />
            </span>
            <h2 className="text-xs font-bold uppercase tracking-[0.14em] text-[#1f2a44]">Identity & Permissions</h2>
          </div>

          <div className="grid gap-4 px-5 py-5 lg:grid-cols-3">
            <article className="rounded-2xl border border-gray-100 bg-[#f9fafc] p-4">
              <p className="text-xs font-semibold uppercase tracking-[0.14em] text-gray-400">Student ID</p>
              <p className="mt-2 text-sm font-semibold text-gray-900">ETS/1234/13</p>
            </article>

            <article className="rounded-2xl border border-gray-100 bg-[#f9fafc] p-4">
              <p className="text-xs font-semibold uppercase tracking-[0.14em] text-gray-400">System Role</p>
              <div className="mt-2">
                <DropdownSelect
                  label=""
                  value={role}
                  options={roleOptions}
                  onValueChange={setRole}
                  className="space-y-0 [&>p]:hidden"
                />
              </div>
            </article>

            <article className="rounded-2xl border border-gray-100 bg-[#f9fafc] p-4">
              <p className="text-xs font-semibold uppercase tracking-[0.14em] text-gray-400">Preferred Language</p>
              <div className="mt-2">
                <DropdownSelect
                  label=""
                  value={language}
                  options={languageOptions}
                  onValueChange={setLanguage}
                  className="space-y-0 [&>p]:hidden"
                />
              </div>
            </article>

            <article className="rounded-2xl border border-gray-100 bg-[#f9fafc] p-4">
              <p className="text-xs font-semibold uppercase tracking-[0.14em] text-gray-400">Timezone</p>
              <div className="mt-2">
                <DropdownSelect
                  label=""
                  value={timezone}
                  options={timezoneOptions}
                  onValueChange={setTimezone}
                  className="space-y-0 [&>p]:hidden"
                />
              </div>
            </article>
          </div>
        </section>

        <section className="rounded-[22px] border border-gray-100 bg-white shadow-sm">
          <div className="flex items-center gap-2 border-b border-gray-100 px-5 py-4">
            <span className="inline-flex h-7 w-7 items-center justify-center rounded-md bg-[#fdf8ec] text-[#c49a22]">
              <Bell size={14} />
            </span>
            <h2 className="text-xs font-bold uppercase tracking-[0.14em] text-[#1f2a44]">Notification Preferences</h2>
          </div>

          <div className="grid gap-4 px-5 py-5 lg:grid-cols-2">
            <div className="flex items-start justify-between gap-4 rounded-2xl border border-gray-100 bg-[#f9fafc] p-4">
              <div>
                <p className="text-sm font-semibold text-gray-900">Email notifications</p>
                <p className="mt-1 text-sm text-gray-500">Receive account and activity updates by email.</p>
              </div>
              <Switch checked={emailNotifications} onCheckedChange={setEmailNotifications} />
            </div>

            <div className="flex items-start justify-between gap-4 rounded-2xl border border-gray-100 bg-[#f9fafc] p-4">
              <div>
                <p className="text-sm font-semibold text-gray-900">Security alerts</p>
                <p className="mt-1 text-sm text-gray-500">Notify me about password or login changes.</p>
              </div>
              <Switch checked={securityAlerts} onCheckedChange={setSecurityAlerts} />
            </div>

            <div className="flex items-start justify-between gap-4 rounded-2xl border border-gray-100 bg-[#f9fafc] p-4">
              <div>
                <p className="text-sm font-semibold text-gray-900">Weekly summary</p>
                <p className="mt-1 text-sm text-gray-500">A short digest of upcoming tasks and requests.</p>
              </div>
              <Switch checked={weeklyDigest} onCheckedChange={setWeeklyDigest} />
            </div>

            <div className="flex items-start justify-between gap-4 rounded-2xl border border-gray-100 bg-[#f9fafc] p-4">
              <div>
                <p className="text-sm font-semibold text-gray-900">Two-factor authentication</p>
                <p className="mt-1 text-sm text-gray-500">Add an extra step when signing in.</p>
              </div>
              <Switch checked={twoFactor} onCheckedChange={setTwoFactor} />
            </div>
          </div>
        </section>

        <section className="rounded-[22px] border border-gray-100 bg-white shadow-sm">
          <div className="flex items-center gap-2 border-b border-gray-100 px-5 py-4">
            <span className="inline-flex h-7 w-7 items-center justify-center rounded-md bg-[#fdf8ec] text-[#c49a22]">
              <LockKeyhole size={14} />
            </span>
            <h2 className="text-xs font-bold uppercase tracking-[0.14em] text-[#1f2a44]">Change Password</h2>
          </div>

          <div className="grid gap-4 px-5 py-5 md:grid-cols-2">
            <div className="md:col-span-2">
              <label htmlFor="settings-current-password" className="mb-1.5 block text-sm font-semibold text-gray-700">
                Current Password
              </label>
              <Input
                id="settings-current-password"
                type="password"
                value={currentPassword}
                onChange={(event) => setCurrentPassword(event.target.value)}
                placeholder="Enter current password"
              />
            </div>

            <div>
              <label htmlFor="settings-new-password" className="mb-1.5 block text-sm font-semibold text-gray-700">
                New Password
              </label>
              <Input
                id="settings-new-password"
                type="password"
                value={newPassword}
                onChange={(event) => setNewPassword(event.target.value)}
                placeholder="Create a new password"
              />
            </div>

            <div>
              <label htmlFor="settings-confirm-password" className="mb-1.5 block text-sm font-semibold text-gray-700">
                Confirm Password
              </label>
              <Input
                id="settings-confirm-password"
                type="password"
                value={confirmPassword}
                onChange={(event) => setConfirmPassword(event.target.value)}
                placeholder="Repeat the new password"
              />
            </div>
          </div>
        </section>

        <div className="flex flex-col-reverse items-stretch justify-between gap-3 sm:flex-row sm:items-center">
          <Button type="button" variant="ghost" className="h-10 px-5 text-gray-600">
            Cancel
          </Button>

          <Button type="submit" variant="goldSolid" className="h-10 px-6">
            Save Changes
          </Button>
        </div>
      </form>

      {statusMessage ? (
        <div className="rounded-[12px] border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700 shadow-sm">
          {statusMessage}
        </div>
      ) : null}
    </div>
  );
}