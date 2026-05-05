"use client";

import Image from "next/image";
import Link from "next/link";
import { Search, X } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { PublicClubCard } from "@/components/public/clubs/PublicClubCard";
import { DropdownSelect } from "@/components/ui/DropdownSelect";
import type { ClubItem } from "@/types/dashboard";
import { usePermissions } from "@/hooks/usePermissions";

interface PublicClubsContentProps {
  clubs: ClubItem[];
}

export function PublicClubsContent({ clubs }: PublicClubsContentProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [submitState, setSubmitState] = useState<"idle" | "success">("idle");
  const [formData, setFormData] = useState({
    proposedClubName: "",
    category: "",
    ideaSummary: "",
    goals: "",
    studentName: "",
    studentId: "",
    email: "",
    phone: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [activeCategory, setActiveCategory] = useState("All");
  const [query, setQuery] = useState("");
  const { hasPermission } = usePermissions(undefined, { loadCurrentUser: false });
  const canProposeClub = hasPermission("clubs.create");

  const categories = useMemo(() => {
    const unique = Array.from(new Set(clubs.map((club) => club.categoryLabel)));
    return ["All", ...unique];
  }, [clubs]);

  const filteredClubs = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    return clubs.filter((club) => {
      const matchesCategory =
        activeCategory === "All" || club.categoryLabel === activeCategory;

      const matchesQuery =
        normalizedQuery.length === 0 ||
        club.name.toLowerCase().includes(normalizedQuery) ||
        club.presidentName.toLowerCase().includes(normalizedQuery) ||
        club.advisorName.toLowerCase().includes(normalizedQuery);

      return matchesCategory && matchesQuery;
    });
  }, [activeCategory, clubs, query]);

  const featuredClub = filteredClubs[0];
  const supportingClubs = filteredClubs.slice(1);
  const featuredSummary =
    featuredClub?.description ||
    "Join a vibrant student-led community and build projects, friendships, and campus impact.";
  const featuredMembers = featuredClub?.memberCount ?? "--";

  const proposalCategoryOptions: { value: string; label: string }[] = [
    { value: "", label: "Select category" },
    { value: "Engineering & Tech", label: "Engineering & Tech" },
    { value: "Arts & Culture", label: "Arts & Culture" },
    { value: "Humanities", label: "Humanities" },
    { value: "Entrepreneurship", label: "Entrepreneurship" },
    { value: "Sports", label: "Sports" },
    { value: "Other", label: "Other" },
  ];

  useEffect(() => {
    if (!isModalOpen) {
      return;
    }

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const onEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsModalOpen(false);
      }
    };

    window.addEventListener("keydown", onEscape);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", onEscape);
    };
  }, [isModalOpen]);

  const openModal = () => {
    setSubmitState("idle");
    setErrors({});
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const onFieldChange = (
    key: keyof typeof formData,
    value: string
  ) => {
    setFormData((current) => ({ ...current, [key]: value }));
    if (errors[key]) {
      setErrors((current) => {
        const next = { ...current };
        delete next[key];
        return next;
      });
    }
  };

  const onSubmitProposal = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const nextErrors: Record<string, string> = {};

    if (!formData.proposedClubName.trim()) {
      nextErrors.proposedClubName = "Club name is required.";
    }
    if (!formData.category.trim()) {
      nextErrors.category = "Please select a category.";
    }
    if (!formData.ideaSummary.trim()) {
      nextErrors.ideaSummary = "Please provide a short summary of your idea.";
    }
    if (!formData.studentName.trim()) {
      nextErrors.studentName = "Your full name is required.";
    }
    if (!formData.email.trim()) {
      nextErrors.email = "Email is required.";
    }

    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors);
      return;
    }

    setErrors({});
    setSubmitState("success");
    setFormData({
      proposedClubName: "",
      category: "",
      ideaSummary: "",
      goals: "",
      studentName: "",
      studentId: "",
      email: "",
      phone: "",
    });
  };

  return (
    <>
      <section>
        <p className="text-xs font-bold uppercase tracking-[0.24em] text-[#b6861f]">
          Student Communities
        </p>
        <h1 className="mt-3 max-w-[16ch] text-4xl font-black leading-[1.05] text-[#05123a] sm:text-5xl lg:text-6xl">
          Discover your tribe in the <span className="text-[#b6861f]">Digital Age.</span>
        </h1>
        <p className="mt-5 max-w-[68ch] text-base leading-8 text-slate-600">
          Explore the diverse ecosystem of organizations at AASTU. From cutting-edge
          robotics to expressive arts, find where you belong and make your mark on campus.
        </p>

        <div className="mt-8 flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
          <div className="flex flex-wrap gap-2.5">
            {categories.map((category) => {
              const selected = category === activeCategory;
              return (
                <button
                  key={category}
                  type="button"
                  onClick={() => setActiveCategory(category)}
                  className={
                    selected
                      ? "rounded-full bg-[#061649] px-5 py-2.5 text-xs font-semibold text-white"
                      : "rounded-full border border-slate-200 bg-white px-5 py-2.5 text-xs font-semibold text-slate-600 transition-colors hover:border-[#b6861f] hover:text-[#b6861f]"
                  }
                >
                  {category}
                </button>
              );
            })}
          </div>

          <label className="relative block w-full max-w-[380px]">
            <span className="sr-only">Search clubs</span>
            <Search
              size={16}
              className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
            />
            <input
              type="text"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search clubs..."
              className="h-12 w-full rounded-full border border-slate-200 bg-[#f8f8f8] pl-11 pr-4 text-sm text-slate-700 outline-none transition-colors placeholder:text-slate-400 focus:border-[#b6861f]"
            />
          </label>
        </div>

        <p className="mt-4 text-sm text-slate-500">
          Showing {filteredClubs.length} of {clubs.length} clubs
        </p>
      </section>

      {filteredClubs.length > 0 ? (
        <section className="mt-8 space-y-12">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredClubs.map((club) => (
              <PublicClubCard key={club.id} club={club} />
            ))}
          </div>

          {canProposeClub ? (
            <section className="overflow-hidden rounded-[20px] bg-[#14213d] text-white shadow-sm">
              <div className="grid gap-0 lg:grid-cols-[1fr_0.54fr]">
                <div className="p-8 sm:p-10 lg:p-12">
                  <h3 className="text-3xl font-black leading-tight sm:text-4xl">
                    Can&apos;t find your community?
                  </h3>
                  <p className="mt-4 max-w-[54ch] text-sm leading-7 text-[#b9c4df] sm:text-base">
                    The Student Union supports the birth of new ideas. If you have a passion
                    that is not represented, we&apos;ll help you build it from the ground up with
                    resources and guidance.
                  </p>
                  <button
                    type="button"
                    onClick={openModal}
                    className="mt-7 inline-flex rounded-[10px] bg-[#f1c54c] px-6 py-3 text-sm font-semibold text-[#0d183b] transition-colors hover:bg-[#ffd66a]"
                  >
                    Start a New Club
                  </button>
                </div>

                <div className="relative min-h-[250px]">
                  <Image
                    src="/aastu_hero.png"
                    alt="Students collaborating on a club initiative"
                    fill
                    sizes="(max-width: 1024px) 100vw, 38vw"
                    className="object-cover"
                  />
                </div>
              </div>
            </section>
          ) : null}
        </section>
      ) : (
        <section className="mt-8 rounded-[14px] border border-dashed border-slate-300 bg-white p-10 text-center shadow-sm">
          <p className="text-lg font-semibold text-[#14213d]">No clubs match your filters</p>
          <p className="mt-2 text-sm text-slate-500">
            Try another category or clear your search text.
          </p>
        </section>
      )}

      {isModalOpen ? (
        <div className="fixed inset-0 z-50">
          <button
            type="button"
            aria-label="Close modal overlay"
            onClick={closeModal}
            className="absolute inset-0 bg-slate-950/55"
          />

          <div className="absolute left-1/2 top-1/2 w-[92%] max-w-[760px] -translate-x-1/2 -translate-y-1/2 rounded-[20px] border border-slate-200 bg-white shadow-[0_35px_85px_rgba(7,18,56,0.35)]">
            <div className="flex items-start justify-between gap-4 border-b border-slate-200 px-5 py-4 sm:px-7 sm:py-5">
              <div>
                <h3 className="text-xl font-black text-[#0f1d49] sm:text-2xl">
                  Propose a New Club
                </h3>
                <p className="mt-1 text-sm text-slate-500">
                  Share your idea and the Student Union team will review it.
                </p>
              </div>
              <button
                type="button"
                onClick={closeModal}
                aria-label="Close"
                className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-slate-200 text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-700"
              >
                <X size={16} />
              </button>
            </div>

            {submitState === "success" ? (
              <div className="px-5 py-8 text-center sm:px-7 sm:py-10">
                <p className="text-2xl font-black text-[#0f1d49]">Proposal submitted</p>
                <p className="mx-auto mt-3 max-w-[54ch] text-sm leading-7 text-slate-600">
                  Thanks for your initiative. The Student Union will contact you by email
                  after the initial review.
                </p>
                <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
                  <button
                    type="button"
                    onClick={() => setSubmitState("idle")}
                    className="rounded-[10px] border border-slate-200 bg-white px-5 py-2.5 text-sm font-semibold text-[#0f1d49] transition-colors hover:bg-slate-50"
                  >
                    Submit Another
                  </button>
                  <button
                    type="button"
                    onClick={closeModal}
                    className="rounded-[10px] bg-[#05123a] px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#1a2e67]"
                  >
                    Close
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={onSubmitProposal} className="max-h-[72vh] overflow-y-auto px-5 py-5 sm:px-7 sm:py-6">
                <div className="grid gap-4 sm:grid-cols-2">
                  <label className="block">
                    <span className="text-xs font-semibold uppercase tracking-widest text-slate-500">
                      Proposed Club Name
                    </span>
                    <input
                      type="text"
                      value={formData.proposedClubName}
                      onChange={(event) => onFieldChange("proposedClubName", event.target.value)}
                      className="mt-1 h-11 w-full rounded-[10px] border border-slate-200 px-3 text-sm text-slate-700 outline-none transition-colors focus:border-[#b6861f]"
                      placeholder="e.g. Green Innovation Society"
                    />
                    {errors.proposedClubName ? (
                      <p className="mt-1 text-xs text-red-500">{errors.proposedClubName}</p>
                    ) : null}
                  </label>

                  <div className="block">
                    <DropdownSelect
                      label="Category"
                      value={formData.category}
                      options={proposalCategoryOptions}
                      onValueChange={(value) => onFieldChange("category", value)}
                    />
                    {errors.category ? (
                      <p className="mt-1 text-xs text-red-500">{errors.category}</p>
                    ) : null}
                  </div>
                </div>

                <label className="mt-4 block">
                  <span className="text-xs font-semibold uppercase tracking-widest text-slate-500">
                    Idea Summary
                  </span>
                  <textarea
                    value={formData.ideaSummary}
                    onChange={(event) => onFieldChange("ideaSummary", event.target.value)}
                    className="mt-1 min-h-[96px] w-full rounded-[10px] border border-slate-200 px-3 py-2.5 text-sm text-slate-700 outline-none transition-colors focus:border-[#b6861f]"
                    placeholder="What community need or student interest does this club address?"
                  />
                  {errors.ideaSummary ? (
                    <p className="mt-1 text-xs text-red-500">{errors.ideaSummary}</p>
                  ) : null}
                </label>

                <label className="mt-4 block">
                  <span className="text-xs font-semibold uppercase tracking-widest text-slate-500">
                    Initial Goals or Activities (Optional)
                  </span>
                  <textarea
                    value={formData.goals}
                    onChange={(event) => onFieldChange("goals", event.target.value)}
                    className="mt-1 min-h-[88px] w-full rounded-[10px] border border-slate-200 px-3 py-2.5 text-sm text-slate-700 outline-none transition-colors focus:border-[#b6861f]"
                    placeholder="List possible projects, events, workshops, or collaborations."
                  />
                </label>

                <div className="mt-4 grid gap-4 sm:grid-cols-2">
                  <label className="block">
                    <span className="text-xs font-semibold uppercase tracking-widest text-slate-500">
                      Full Name
                    </span>
                    <input
                      type="text"
                      value={formData.studentName}
                      onChange={(event) => onFieldChange("studentName", event.target.value)}
                      className="mt-1 h-11 w-full rounded-[10px] border border-slate-200 px-3 text-sm text-slate-700 outline-none transition-colors focus:border-[#b6861f]"
                      placeholder="Your full name"
                    />
                    {errors.studentName ? (
                      <p className="mt-1 text-xs text-red-500">{errors.studentName}</p>
                    ) : null}
                  </label>

                  <label className="block">
                    <span className="text-xs font-semibold uppercase tracking-widest text-slate-500">
                      Student ID (Optional)
                    </span>
                    <input
                      type="text"
                      value={formData.studentId}
                      onChange={(event) => onFieldChange("studentId", event.target.value)}
                      className="mt-1 h-11 w-full rounded-[10px] border border-slate-200 px-3 text-sm text-slate-700 outline-none transition-colors focus:border-[#b6861f]"
                      placeholder="UGR/0000/00"
                    />
                  </label>
                </div>

                <div className="mt-4 grid gap-4 sm:grid-cols-2">
                  <label className="block">
                    <span className="text-xs font-semibold uppercase tracking-widest text-slate-500">
                      AASTU Email
                    </span>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(event) => onFieldChange("email", event.target.value)}
                      className="mt-1 h-11 w-full rounded-[10px] border border-slate-200 px-3 text-sm text-slate-700 outline-none transition-colors focus:border-[#b6861f]"
                      placeholder="name@aastu.edu.et"
                    />
                    {errors.email ? (
                      <p className="mt-1 text-xs text-red-500">{errors.email}</p>
                    ) : null}
                  </label>

                  <label className="block">
                    <span className="text-xs font-semibold uppercase tracking-widest text-slate-500">
                      Phone Number (Optional)
                    </span>
                    <input
                      type="tel"
                      value={formData.phone}
                      onChange={(event) => onFieldChange("phone", event.target.value)}
                      className="mt-1 h-11 w-full rounded-[10px] border border-slate-200 px-3 text-sm text-slate-700 outline-none transition-colors focus:border-[#b6861f]"
                      placeholder="+251 9xx xxx xxx"
                    />
                  </label>
                </div>

                <div className="mt-6 flex flex-wrap justify-end gap-3 border-t border-slate-200 pt-4">
                  <button
                    type="button"
                    onClick={closeModal}
                    className="rounded-[10px] border border-slate-200 bg-white px-5 py-2.5 text-sm font-semibold text-slate-700 transition-colors hover:bg-slate-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="rounded-[10px] bg-[#05123a] px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#1a2e67]"
                  >
                    Submit Proposal
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      ) : null}
    </>
  );
}
