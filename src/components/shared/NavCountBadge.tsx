type NavCountBadgeProps = {
  count: number;
  collapsed?: boolean;
  ariaLabel: string;
  maxDisplay?: number;
};

export default function NavCountBadge({
  count,
  collapsed = false,
  ariaLabel,
  maxDisplay = 99,
}: NavCountBadgeProps) {
  if (count <= 0) return null;

  const label = count > maxDisplay ? `${maxDisplay}+` : String(count);

  if (collapsed) {
    return (
      <span
        className="absolute -top-0.5 -right-0.5 min-w-[16px] h-[16px] px-0.5 rounded-full bg-[#FF4D4F] text-[9px] font-bold text-white flex items-center justify-center ring-2 ring-[#313044]"
        aria-label={ariaLabel}
      >
        {label}
      </span>
    );
  }

  return (
    <span
      className="ml-auto min-w-[18px] h-[18px] shrink-0 rounded-full bg-[#FF4D4F] px-1.5 text-[10px] font-bold text-white flex items-center justify-center"
      aria-label={ariaLabel}
    >
      {label}
    </span>
  );
}
