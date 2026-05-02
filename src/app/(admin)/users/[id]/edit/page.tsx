"use client";

import { useParams } from "next/navigation";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { UserCreateForm } from "@/components/dashboard/users/UserCreateForm";
import { DashboardFooter } from "@/components/layout/DashboardFooter";
import { useUser } from "@/hooks/useUsers";

export default function EditUserPage() {
  const params = useParams();
  const id = params?.id as string | undefined;
  const { data: userResp, isLoading } = useUser(id ?? "");

  const user = userResp?.data ?? null;

  return (
    <div className="flex flex-col gap-6">
      <nav aria-label="Breadcrumb" className="flex flex-wrap items-center gap-1.5 text-sm text-gray-400">
        <Link href="/dashboard" className="font-medium text-[#c49a22] hover:underline">
          Dashboard
        </Link>
        <ChevronRight size={14} />
        <Link href="/users" className="text-gray-500 hover:text-gray-700">
          Users
        </Link>
        <ChevronRight size={14} />
        <span className="text-gray-500">Edit User Account</span>
      </nav>

      <section>
        <h1 className="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">Edit User Account</h1>
        <p className="mt-1 text-sm text-gray-500">Update the student's profile and account details below.</p>
      </section>

      <div>{isLoading ? <p>Loading...</p> : <UserCreateForm user={user} editMode />}</div>

      <DashboardFooter />
    </div>
  );
}
