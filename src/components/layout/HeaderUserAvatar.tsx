import { resolveMediaUrl } from "@/lib/utils";

interface HeaderUserAvatarProps {
  name?: string;
  src?: string | null;
}

export function HeaderUserAvatar({ name = "", src }: HeaderUserAvatarProps) {
  const resolvedSrc = resolveMediaUrl(src);
  const initials = name
    .split(" ")
    .map((chunk) => chunk[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <div className="flex h-9 w-9 shrink-0 items-center justify-center overflow-hidden rounded-full bg-[#c49a22]/20 text-sm font-bold text-[#c49a22] ring-2 ring-[#c49a22]/30">
      {resolvedSrc ? (
        <img
          src={resolvedSrc}
          alt={name}
          className="h-full w-full object-cover"
          onError={(e) => {
            (e.target as HTMLImageElement).style.display = "none";
          }}
        />
      ) : (
        <span>{initials}</span>
      )}
    </div>
  );
}