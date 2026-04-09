import type { Metadata } from "next";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { UserCreateForm } from "@/components/dashboard/users/UserCreateForm";
import { DashboardFooter } from "@/components/layout/DashboardFooter";

export const metadata: Metadata = {
  title: "Create User Account",
};

export default function NewUserPage() {
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
        <span className="text-gray-500">Create User Account</span>
      </nav>

      <section>
        <h1 className="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">Create User Account</h1>
        <p className="mt-1 text-sm text-gray-500">Grant portal access by filling in the student information below.</p>
      </section>

      <UserCreateForm />

      <DashboardFooter />
    </div>
  );
}
