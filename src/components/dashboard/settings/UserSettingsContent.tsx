"use client";

import { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Bell,
  Camera,
  LockKeyhole,
  ShieldCheck,
  UserCircle2,
  Loader2,
} from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { DropdownSelect } from "@/components/ui/DropdownSelect";
import { FileUpload } from "@/components/ui/FileUpload";
import { Input } from "@/components/ui/Input";
import { Switch } from "@/components/ui/Switch";
import { Textarea } from "@/components/ui/Textarea";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { useDepartments } from "@/hooks/useDepartments";
import { useUpdateProfile } from "@/hooks/useUpdateProfile";
import { useChangePassword } from "@/hooks/useChangePassword";
import { 
  ProfileUpdateSchema, 
  ChangePasswordSchema, 
  type ProfileUpdate, 
  type ChangePasswordRequest 
} from "@/schemas/user.schema";
import { toast } from "sonner";

export function UserSettingsContent() {
  const { data: user, isLoading: isUserLoading } = useCurrentUser();
  const { data: departments = [], isLoading: isDeptsLoading } = useDepartments();
  const updateProfileMutation = useUpdateProfile();
  const changePasswordMutation = useChangePassword();

  const [profilePhoto, setProfilePhoto] = useState<File | null>(null);
  const [isAvatarDeleted, setIsAvatarDeleted] = useState(false);

  // Profile Form
  const {
    register: registerProfile,
    handleSubmit: handleProfileSubmit,
    setValue: setProfileValue,
    watch: watchProfile,
    reset: resetProfile,
    formState: { errors: profileErrors },
  } = useForm<ProfileUpdate>({
    resolver: zodResolver(ProfileUpdateSchema),
  });

  // Password Form
  const {
    register: registerPassword,
    handleSubmit: handlePasswordSubmit,
    reset: resetPassword,
    formState: { errors: passwordErrors },
  } = useForm<ChangePasswordRequest>({
    resolver: zodResolver(ChangePasswordSchema),
  });

  // Sync profile form with user data
  useEffect(() => {
    if (user) {
      resetProfile({
        name: user.name ?? "",
        phone_number: user.phoneNumber ?? "",
        department: user.department ?? "",
        dorm_block: user.dormBlock ?? "",
        dorm_room: user.dormRoom ?? "",
        bio: user.bio ?? "",
      });
    }
  }, [user, resetProfile]);

  const avatarPreviewUrl = useMemo(() => {
    if (profilePhoto) return URL.createObjectURL(profilePhoto);
    if (isAvatarDeleted) return undefined;
    return user?.avatar || undefined;
  }, [profilePhoto, user?.avatar, isAvatarDeleted]);

  useEffect(() => {
    return () => {
      if (profilePhoto && avatarPreviewUrl) URL.revokeObjectURL(avatarPreviewUrl);
    };
  }, [avatarPreviewUrl, profilePhoto]);

  const onProfileSubmit = async (data: ProfileUpdate) => {
    try {
      await updateProfileMutation.mutateAsync({
        ...data,
        avatar: profilePhoto ? profilePhoto : (isAvatarDeleted ? null : undefined),
      });
      toast.success("Profile Updated!", {
        description: "Your settings have been successfully synced with the server.",
      });
      setProfilePhoto(null);
      setIsAvatarDeleted(false);
    } catch (error: any) {
      toast.error("Update Failed", {
        description: error.message || "We couldn't save your profile changes.",
      });
    }
  };

  const onPasswordSubmit = async (data: ChangePasswordRequest) => {
    try {
      await changePasswordMutation.mutateAsync(data);
      toast.success("Security Updated!", {
        description: "Your password has been changed successfully.",
      });
      resetPassword();
    } catch (error: any) {
      toast.error("Security Change Failed", {
        description: error.message || "Check your current password and try again.",
      });
    }
  };

  if (isUserLoading) {
    return (
      <div className="flex h-[400px] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-[#c49a22]" />
      </div>
    );
  }

  const departmentOptions = departments.map((dept) => ({
    value: dept.id,
    label: dept.name,
  }));

  const userRoleDisplay =
    user?.rolesDetails?.length
      ? user.rolesDetails.map((roleItem) => roleItem.name).join(", ")
      : user?.roleDetails?.name || user?.role || "Member";

  return (
    <div className="space-y-4 sm:space-y-5 pb-10">
      {/* Profile Header Card */}
      <section className="rounded-[22px] border border-gray-100 bg-white p-5 shadow-sm transition-all duration-300 hover:shadow-md">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-4">
            <div className="relative group">
              <div className="flex h-24 w-24 items-center justify-center overflow-hidden rounded-full border-2 border-[#ead9a3] bg-[#fdf8ec] shadow-inner transition-transform duration-300 group-hover:scale-105">
                {avatarPreviewUrl ? (
                  <img src={avatarPreviewUrl} alt="Profile preview" className="h-full w-full object-cover" />
                ) : (
                  <UserCircle2 size={54} className="text-[#c49a22]" />
                )}
              </div>
              <div className="absolute bottom-0 right-0 flex h-8 w-8 items-center justify-center rounded-full border-2 border-white bg-[#c49a22] text-white shadow-lg transition-transform duration-300 group-hover:rotate-12">
                <Camera size={16} />
              </div>
            </div>

            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h2 className="text-xl font-bold tracking-tight text-gray-900 sm:text-2xl">{user?.name}</h2>
                <Badge variant="gold" className="rounded-full px-3">{userRoleDisplay}</Badge>
              </div>
              <p className="mt-1 text-sm font-medium text-gray-500">
                {user?.departmentDetails?.name ? `Department of ${user.departmentDetails.name}, AASTU` : "AASTU Student"}
              </p>
              <p className="mt-1 text-xs text-gray-400">
                Member since {user?.registrationDate && typeof user.registrationDate === 'string' ? new Date(user.registrationDate).toLocaleDateString(undefined, { month: 'short', year: 'numeric' }) : "unknown"} • ID: {user?.studentId}
              </p>
            </div>
          </div>

          <FileUpload
            label="Profile Photo"
            helperText="Upload image"
            previewUrl={avatarPreviewUrl}
            fileName={profilePhoto?.name}
            accept="image/png,image/jpeg,image/jpg,image/webp"
            onChange={(file) => {
              setProfilePhoto(file);
              setIsAvatarDeleted(false);
            }}
            onClear={() => {
              setProfilePhoto(null);
              setIsAvatarDeleted(true);
            }}
            className="w-full md:max-w-[280px]"
          />
        </div>
      </section>

      {/* Main Account Settings Form */}
      <form onSubmit={handleProfileSubmit(onProfileSubmit)} className="space-y-4">
        <section className="rounded-[22px] border border-gray-100 bg-white shadow-sm overflow-hidden">
          <div className="flex items-center gap-2 border-b border-gray-100 bg-gray-50/50 px-5 py-4">
            <span className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-white text-[#c49a22] shadow-sm">
              <UserCircle2 size={16} />
            </span>
            <h2 className="text-xs font-bold uppercase tracking-[0.14em] text-[#1f2a44]">Account Information</h2>
          </div>

          <div className="grid gap-4 px-5 py-5 md:grid-cols-2">
            <div>
              <label htmlFor="name" className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-gray-500">
                Display Name
              </label>
              <Input
                id="name"
                {...registerProfile("name")}
                error={profileErrors.name?.message}
                placeholder="Your full name"
              />
            </div>

            <div>
              <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-gray-500">
                Email Address
              </label>
              <Input
                value={user?.email ?? ""}
                disabled
                placeholder="name@aastu.edu.et"
                className="bg-gray-50/80 cursor-not-allowed border-dashed"
              />
            </div>

            <div>
              <label htmlFor="phone_number" className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-gray-500">
                Phone Number
              </label>
              <Input
                id="phone_number"
                {...registerProfile("phone_number")}
                error={profileErrors.phone_number?.message}
                placeholder="+251 900 000 000"
              />
            </div>

            <DropdownSelect
              label="Department"
              value={watchProfile("department") || ""}
              options={departmentOptions}
              onValueChange={(val) => setProfileValue("department", val)}
              disabled={isDeptsLoading}
              error={profileErrors.department?.message}
            />

            <div className="md:col-span-2">
              <label htmlFor="bio" className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-gray-500">
                Bio / Office Note
              </label>
              <Textarea
                id="bio"
                {...registerProfile("bio")}
                placeholder="Share a bit about yourself or your union role"
                className="min-h-32 rounded-xl focus:ring-[#c49a22]/10"
              />
            </div>
          </div>
        </section>

        <section className="rounded-[22px] border border-gray-100 bg-white shadow-sm overflow-hidden">
          <div className="flex items-center gap-2 border-b border-gray-100 bg-gray-50/50 px-5 py-4">
            <span className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-white text-[#c49a22] shadow-sm">
              <ShieldCheck size={16} />
            </span>
            <h2 className="text-xs font-bold uppercase tracking-[0.14em] text-[#1f2a44]">Identity & Residency</h2>
          </div>

          <div className="grid gap-4 px-5 py-5 md:grid-cols-2 lg:grid-cols-4">
            <article className="rounded-2xl border border-gray-100 bg-[#f9fafc] p-4 transition-colors hover:border-[#ead9a3]/50">
              <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-gray-400">Student ID</p>
              <p className="mt-2 text-sm font-bold text-gray-900">{user?.studentId || "N/A"}</p>
            </article>

            <article className="rounded-2xl border border-gray-100 bg-[#f9fafc] p-4 transition-colors hover:border-[#ead9a3]/50">
              <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-gray-400">Dorm Block</p>
              <div className="mt-1">
                <input
                  {...registerProfile("dorm_block")}
                  className="w-full bg-transparent text-sm font-bold text-gray-900 outline-none placeholder:text-gray-300"
                  placeholder="Block #"
                />
              </div>
            </article>

            <article className="rounded-2xl border border-gray-100 bg-[#f9fafc] p-4 transition-colors hover:border-[#ead9a3]/50">
              <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-gray-400">Dorm Room</p>
              <div className="mt-1">
                <input
                  {...registerProfile("dorm_room")}
                  className="w-full bg-transparent text-sm font-bold text-gray-900 outline-none placeholder:text-gray-300"
                  placeholder="Room #"
                />
              </div>
            </article>

            <article className="rounded-2xl border border-gray-100 bg-[#f9fafc] p-4 transition-colors hover:border-[#ead9a3]/50">
              <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-gray-400">System Role</p>
              <p className="mt-2 text-sm font-bold text-gray-900">{userRoleDisplay}</p>
            </article>
          </div>
        </section>

        <div className="flex items-center justify-end gap-3 px-2">
          <Button type="button" variant="ghost" className="h-11 px-6 font-semibold text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-xl" onClick={() => window.location.reload()}>
            Reset Changes
          </Button>

          <Button 
            type="submit" 
            variant="goldSolid" 
            className="h-11 px-8 rounded-xl shadow-lg shadow-[#c49a22]/10"
            isLoading={updateProfileMutation.isPending}
          >
            Update Profile
          </Button>
        </div>
      </form>

      {/* Password Change Section */}
      <form onSubmit={handlePasswordSubmit(onPasswordSubmit)} className="space-y-4 pt-4">
        <section className="rounded-[22px] border border-gray-100 bg-white shadow-sm overflow-hidden">
          <div className="flex items-center gap-2 border-b border-gray-100 bg-gray-50/50 px-5 py-4">
            <span className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-white text-[#c49a22] shadow-sm">
              <LockKeyhole size={16} />
            </span>
            <h2 className="text-xs font-bold uppercase tracking-[0.14em] text-[#1f2a44]">Security Credentials</h2>
          </div>

          <div className="grid gap-4 px-5 py-5 md:grid-cols-2">
            <div className="md:col-span-2">
              <label htmlFor="current_password" className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-gray-500">
                Current Password
              </label>
              <Input
                id="current_password"
                type="password"
                {...registerPassword("current_password")}
                error={passwordErrors.current_password?.message}
                placeholder="••••••••"
              />
            </div>

            <div>
              <label htmlFor="new_password" className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-gray-500">
                New Password
              </label>
              <Input
                id="new_password"
                type="password"
                {...registerPassword("new_password")}
                error={passwordErrors.new_password?.message}
                placeholder="At least 8 characters"
              />
            </div>

            <div>
              <label htmlFor="confirm_password" className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-gray-500">
                Confirm New Password
              </label>
              <Input
                id="confirm_password"
                type="password"
                {...registerPassword("confirm_password")}
                error={passwordErrors.confirm_password?.message}
                placeholder="Match the new password"
              />
            </div>
          </div>
        </section>

        <div className="flex items-center justify-end gap-3 px-2">
          <Button 
            type="submit" 
            variant="goldSolid" 
            className="h-11 px-8 rounded-xl shadow-lg shadow-[#c49a22]/10"
            isLoading={changePasswordMutation.isPending}
          >
            Verify & Change Password
          </Button>
        </div>
      </form>

      {/* Notifications Section - Static for now */}
      <section className="rounded-[22px] border border-gray-100 bg-white shadow-sm opacity-60 grayscale-[0.05] cursor-not-allowed">
        <div className="flex items-center gap-2 border-b border-gray-100 bg-gray-50/20 px-5 py-4">
          <span className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-white text-[#c49a22] shadow-sm">
            <Bell size={16} />
          </span>
          <h2 className="text-xs font-bold uppercase tracking-[0.14em] text-[#1f2a44]">Notification Preferences</h2>
        </div>

        <div className="grid gap-4 px-5 py-5 lg:grid-cols-2 pointer-events-none">
          <div className="flex items-start justify-between gap-4 rounded-2xl border border-gray-100 bg-[#f9fafc]/50 p-4">
            <div>
              <p className="text-sm font-semibold text-gray-900">Email notifications</p>
              <p className="mt-1 text-sm text-gray-500">Coming soon.</p>
            </div>
            <Switch checked={true} onCheckedChange={() => {}} disabled />
          </div>

          <div className="flex items-start justify-between gap-4 rounded-2xl border border-gray-100 bg-[#f9fafc]/50 p-4">
            <div>
              <p className="text-sm font-semibold text-gray-900">Security alerts</p>
              <p className="mt-1 text-sm text-gray-500">Coming soon.</p>
            </div>
            <Switch checked={true} onCheckedChange={() => {}} disabled />
          </div>
        </div>
      </section>
    </div>
  );
}