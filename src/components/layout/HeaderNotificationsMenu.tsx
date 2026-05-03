"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import {
  AlertCircle,
  Bell,
  CalendarClock,
  CheckCheck,
  Info,
  Megaphone,
  ShieldAlert,
} from "lucide-react";
import { cn } from "@/lib/utils";
import {
  useMarkAllNotificationsRead,
  useMarkNotificationRead,
  useNotifications,
} from "@/hooks/useNotifications";

const notificationIconMap = {
  booking: CalendarClock,
  announcement: Megaphone,
  security: ShieldAlert,
  alert: AlertCircle,
  system: Info,
} as const;

export function HeaderNotificationsMenu() {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement | null>(null);
  const notificationsQuery = useNotifications(1, 10, open);
  const markReadMutation = useMarkNotificationRead();
  const markAllReadMutation = useMarkAllNotificationsRead();

  const notificationItems = notificationsQuery.data?.data ?? [];
  const unreadCount = notificationItems.filter((item) => item.unread).length;

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      const root = rootRef.current;
      if (root && !root.contains(event.target as Node)) {
        setOpen(false);
      }
    }

    function handleEscape(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    window.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      window.removeEventListener("keydown", handleEscape);
    };
  }, []);

  return (
    <div ref={rootRef} className="relative">
      <button
        type="button"
        onClick={() => setOpen((current) => !current)}
        aria-expanded={open}
        aria-haspopup="menu"
        className={cn(
          "relative flex h-8 w-8 items-center justify-center rounded-full text-gray-500 transition-colors",
          "hover:bg-gray-100 hover:text-gray-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#c49a22]/40",
          open && "bg-gray-100 text-gray-700"
        )}
        aria-label="Notifications"
      >
        <Bell size={18} />
        {unreadCount > 0 ? (
          <span className="absolute -right-0.5 -top-0.5 inline-flex min-w-4 items-center justify-center rounded-full bg-[#c49a22] px-1 text-[10px] font-semibold leading-4 text-white ring-2 ring-white">
            {unreadCount}
          </span>
        ) : null}
      </button>

      {open ? (
        <div className="absolute right-0 top-[calc(100%+10px)] z-30 w-[320px] overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-xl">
          <div className="flex items-center justify-between border-b border-gray-100 px-4 py-3.5">
            <div>
              <p className="text-sm font-semibold text-gray-900">Notifications</p>
              <p className="text-xs text-gray-500">{unreadCount} unread updates</p>
            </div>
            <button
              type="button"
              onClick={() => markAllReadMutation.mutate()}
              disabled={unreadCount === 0 || markAllReadMutation.isPending}
              className="inline-flex items-center gap-1 rounded-lg px-2 py-1 text-xs font-medium text-[#8c6c14] transition-colors hover:bg-[#fdf8ec]"
            >
              <CheckCheck size={13} />
              Mark all read
            </button>
          </div>

          <ul className="max-h-[320px] overflow-y-auto p-2">
            {notificationsQuery.isLoading ? (
              <li className="px-3 py-4 text-sm text-gray-500">Loading notifications...</li>
            ) : null}

            {!notificationsQuery.isLoading && notificationItems.length === 0 ? (
              <li className="px-3 py-4 text-sm text-gray-500">No notifications yet.</li>
            ) : null}

            {!notificationsQuery.isLoading && notificationItems.map((item) => {
              const Icon =
                notificationIconMap[item.notificationType as keyof typeof notificationIconMap] ?? Info;
              const href = item.href || "/announcements";

              return (
                <li key={item.id}>
                  <Link
                    href={href}
                    onClick={() => {
                      if (item.unread) {
                        markReadMutation.mutate(item.id);
                      }
                      setOpen(false);
                    }}
                    className="flex items-start gap-3 rounded-xl px-3 py-2.5 transition-colors hover:bg-[#fdf8ec]"
                  >
                    <span className="mt-0.5 inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#fdf8ec] text-[#c49a22]">
                      <Icon size={14} />
                    </span>

                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between gap-2">
                        <p className="truncate text-sm font-semibold text-gray-800">{item.title}</p>
                        {item.unread ? <span className="h-2 w-2 shrink-0 rounded-full bg-[#c49a22]" /> : null}
                      </div>
                      <p className="mt-0.5 text-xs text-gray-500">{item.description}</p>
                      <p className="mt-1.5 text-[11px] font-medium uppercase tracking-[0.14em] text-gray-400">{item.timeLabel}</p>
                    </div>
                  </Link>
                </li>
              );
            })}
          </ul>

          <div className="border-t border-gray-100 p-2">
            <Link
              href="/announcements"
              onClick={() => setOpen(false)}
              className="block rounded-xl px-3 py-2 text-center text-sm font-medium text-[#8c6c14] transition-colors hover:bg-[#fdf8ec]"
            >
              View all notifications
            </Link>
          </div>
        </div>
      ) : null}
    </div>
  );
}