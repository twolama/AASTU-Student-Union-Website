"use client";

import { useState, useEffect } from "react";
import { PublicEventsContent } from "@/components/public/events/PublicEventsContent";

export function PublicEventsPage() {
  const [activeCategory, setActiveCategory] = useState("All Events");
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <section className="mx-auto w-full max-w-[1280px] px-4 py-8 sm:px-6 sm:py-10 lg:px-8">
      <PublicEventsContent 
        activeCategory={activeCategory}
        onCategoryChange={setActiveCategory}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
      />
    </section>
  );
}
