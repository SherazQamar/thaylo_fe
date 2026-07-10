import Image from "next/image";

const inter = { fontFamily: "Inter, sans-serif" } as const;

export function getAvatarInitial(name: string | null | undefined): string {
  const trimmed = name?.trim();
  if (!trimmed) return "?";
  return trimmed.charAt(0).toUpperCase();
}

export function getAvatarWordInitials(name: string | null | undefined): string {
  const trimmed = name?.trim();
  if (!trimmed) return "?";
  const parts = trimmed.split(/\s+/).filter(Boolean);
  if (parts.length >= 2) {
    return `${parts[0].charAt(0)}${parts[1].charAt(0)}`.toUpperCase();
  }
  return trimmed.slice(0, Math.min(2, trimmed.length)).toUpperCase();
}

interface PortalAvatarProps {
  name: string | null | undefined;
  avatarUrl?: string | null;
  size?: number;
  className?: string;
  useWordInitials?: boolean;
}

export default function PortalAvatar({
  name,
  avatarUrl,
  size = 40,
  className = "",
  useWordInitials = false,
}: PortalAvatarProps) {
  const hasAvatar = Boolean(avatarUrl?.trim());

  if (hasAvatar) {
    return (
      <div
        className={`rounded-full overflow-hidden flex-shrink-0 bg-[#525162] ${className}`}
        style={{ width: size, height: size }}
      >
        <Image
          src={avatarUrl!.trim()}
          alt={name?.trim() || "Avatar"}
          width={size}
          height={size}
          className="w-full h-full object-cover"
          unoptimized
        />
      </div>
    );
  }

  const fontSize = size >= 48 ? 22 : size >= 40 ? 16 : 14;

  return (
    <div
      className={`rounded-full bg-[#525162] flex items-center justify-center flex-shrink-0 ${className}`}
      style={{ width: size, height: size }}
      aria-hidden
    >
      <span
        style={{
          ...inter,
          fontWeight: 600,
          fontSize,
          color: "#FFFFFF",
        }}
      >
        {useWordInitials ? getAvatarWordInitials(name) : getAvatarInitial(name)}
      </span>
    </div>
  );
}
