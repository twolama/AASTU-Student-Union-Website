"use client";

import { useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

export interface TabOption {
  id: string;
  label: string;
  badge?: string | number;
}

interface TabsProps {
  items: TabOption[];
  value: string;
  onValueChange: (value: string) => void;
  className?: string;
}

interface IndicatorState {
  left: number;
  width: number;
  ready: boolean;
}

export function Tabs({ items, value, onValueChange, className }: TabsProps) {
  const listRef = useRef<HTMLUListElement | null>(null);
  const buttonRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const [indicator, setIndicator] = useState<IndicatorState>({
    left: 0,
    width: 0,
    ready: false,
  });
  const [showControls, setShowControls] = useState(false);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  useEffect(() => {
    const activeIndex = items.findIndex((item) => item.id === value);
    if (activeIndex < 0) return;

    const activeButton = buttonRefs.current[activeIndex];
    if (!activeButton) return;

    const syncIndicator = () => {
      const listElement = listRef.current;
      if (!listElement) return;

      const listRect = listElement.getBoundingClientRect();
      const buttonRect = activeButton.getBoundingClientRect();

      setIndicator({
        left: buttonRect.left - listRect.left + listElement.scrollLeft,
        width: buttonRect.width,
        ready: true,
      });
    };

    const updateOverflow = () => {
      const listElement = listRef.current;
      if (!listElement) return;
      const overflowing = listElement.scrollWidth > listElement.clientWidth + 1;
      setShowControls(overflowing);
      setCanScrollLeft(listElement.scrollLeft > 0);
      setCanScrollRight(listElement.scrollLeft + listElement.clientWidth < listElement.scrollWidth - 1);
    };

    const onScroll = () => {
      syncIndicator();
      updateOverflow();
    };

    // run initially
    syncIndicator();
    updateOverflow();

    const listElement = listRef.current;
    listElement?.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);

    return () => {
      listElement?.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [items, value]);

  const scrollBy = (delta: number) => {
    const listElement = listRef.current;
    if (!listElement) return;
    listElement.scrollBy({ left: delta, behavior: "smooth" });
  };

  return (
    <div
      className={cn(
        "overflow-visible rounded-xl border border-gray-200 bg-gray-50/90 p-1.5 shadow-[inset_0_1px_0_rgba(255,255,255,0.7)]",
        className
      )}
    >
      <div className="relative">
        {showControls && (
          <button
            type="button"
            aria-label="Scroll tabs left"
            onClick={() => scrollBy(-Math.round((listRef.current?.clientWidth || 240) * 0.6))}
            disabled={!canScrollLeft}
            className={cn(
              "absolute left-2 top-1/2 z-20 -translate-y-1/2 inline-flex h-9 w-9 items-center justify-center rounded-full bg-white/80 shadow-sm focus:outline-none",
              !canScrollLeft && "opacity-40"
            )}
          >
            <ChevronLeft size={16} />
          </button>
        )}

        <ul
          ref={listRef}
          role="tablist"
          className="relative flex flex-nowrap gap-1.5 overflow-x-auto overflow-y-visible py-0.5 md:flex-wrap md:overflow-visible"
        >
          <span
            aria-hidden="true"
            className={cn(
              "pointer-events-none absolute bottom-0 top-0 z-0 rounded-lg bg-linear-to-b from-white to-[#fdf8ec] shadow-sm ring-1 ring-[#c49a22]/30",
              "transition-[left,width,opacity] duration-300 ease-[cubic-bezier(.22,.61,.36,1)]",
              indicator.ready ? "opacity-100" : "opacity-0"
            )}
            style={{ left: indicator.left, width: indicator.width }}
          />

          {items.map((item) => {
            const isActive = item.id === value;

            return (
              <li key={item.id} className="z-10 shrink-0 md:shrink">
                <button
                  ref={(node) => {
                    const index = items.findIndex((entry) => entry.id === item.id);
                    if (index >= 0) {
                      buttonRefs.current[index] = node;
                    }
                  }}
                  type="button"
                  onClick={() => onValueChange(item.id)}
                  role="tab"
                  aria-selected={isActive}
                  className={cn(
                    "flex items-center gap-2 cursor-pointer rounded-lg px-3 py-2 text-xs font-medium whitespace-nowrap transition-[color,transform] duration-200 sm:text-sm",
                    isActive ? "text-[#8c6c14]" : "text-gray-500 hover:text-gray-700"
                  )}
                  aria-current={isActive ? "page" : undefined}
                >
                  {item.label}
                  {item.badge !== undefined && (
                    <span
                      className={cn(
                        "inline-flex h-4.5 min-w-4.5 items-center justify-center rounded-full px-1.5 text-[10px] font-bold leading-none",
                        isActive ? "bg-[#c49a22] text-white shadow-sm" : "bg-gray-200 text-gray-600"
                      )}
                    >
                      {item.badge}
                    </span>
                  )}
                </button>
              </li>
            );
          })}
        </ul>

        {showControls && (
          <button
            type="button"
            aria-label="Scroll tabs right"
            onClick={() => scrollBy(Math.round((listRef.current?.clientWidth || 240) * 0.6))}
            disabled={!canScrollRight}
            className={cn(
              "absolute right-2 top-1/2 z-20 -translate-y-1/2 inline-flex h-9 w-9 items-center justify-center rounded-full bg-white/80 shadow-sm focus:outline-none",
              !canScrollRight && "opacity-40"
            )}
          >
            <ChevronRight size={16} />
          </button>
        )}
      </div>
    </div>
  );
}
