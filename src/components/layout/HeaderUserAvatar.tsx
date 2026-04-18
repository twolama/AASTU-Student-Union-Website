interface HeaderUserAvatarProps {
  name?: string;
}

export function HeaderUserAvatar({ name = "User" }: HeaderUserAvatarProps) {
  const initials = name
    .split(" ")
    .map((chunk) => chunk[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#c49a22]/20 text-sm font-bold text-[#c49a22] ring-2 ring-[#c49a22]/30">
      {initials}
    </div>
  );
}