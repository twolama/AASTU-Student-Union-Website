"use client";

import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

export interface TabOption {
  id: string;
  label: string;
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

  useEffect(() => {
    const activeIndex = items.findIndex((item) => item.id === value);
    if (activeIndex < 0) {
      return;
    }

    const activeButton = buttonRefs.current[activeIndex];
    if (!activeButton) {
      return;
    }

    const syncIndicator = () => {
      const listElement = listRef.current;
      if (!listElement) {
        return;
      }

      const listRect = listElement.getBoundingClientRect();
      const buttonRect = activeButton.getBoundingClientRect();

      setIndicator({
        left: buttonRect.left - listRect.left + listElement.scrollLeft,
        width: buttonRect.width,
        ready: true,
      });
    };

    syncIndicator();
    const listElement = listRef.current;
    listElement?.addEventListener("scroll", syncIndicator, { passive: true });
    window.addEventListener("resize", syncIndicator);

    return () => {
      listElement?.removeEventListener("scroll", syncIndicator);
      window.removeEventListener("resize", syncIndicator);
    };
  }, [items, value]);

  return (
    <div
      className={cn(
        "overflow-visible rounded-xl border border-gray-200 bg-gray-50/90 p-1.5 shadow-[inset_0_1px_0_rgba(255,255,255,0.7)]",
        className
      )}
    >
      <ul
        ref={listRef}
        role="tablist"
        className="relative flex flex-nowrap gap-1.5 overflow-x-auto overflow-y-visible py-0.5 md:flex-wrap md:overflow-visible"
      >
        <span
          aria-hidden="true"
          className={cn(
            "pointer-events-none absolute bottom-0 top-0 z-0 rounded-lg bg-gradient-to-b from-white to-[#fdf8ec] shadow-sm ring-1 ring-[#c49a22]/30",
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
                  "cursor-pointer rounded-lg px-3 py-2 text-xs font-medium whitespace-nowrap transition-[color,transform] duration-200 sm:text-sm",
                  isActive
                    ? "text-[#8c6c14]"
                    : "text-gray-500 hover:text-gray-700"
                )}
                aria-current={isActive ? "page" : undefined}
              >
                {item.label}
              </button>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
