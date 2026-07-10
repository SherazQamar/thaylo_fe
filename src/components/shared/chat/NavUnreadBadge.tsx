type NavUnreadBadgeProps = {
  count: number;
  collapsed?: boolean;
};

export default function NavUnreadBadge({ count, collapsed = false }: NavUnreadBadgeProps) {
  if (count <= 0) return null;

  if (collapsed) {
    return (
      <span
        className="absolute top-2 right-2 h-2.5 w-2.5 rounded-full bg-[#FF4D4F] ring-2 ring-[#313044]"
        aria-label={`${count} unread messages`}
      />
    );
  }

  return (
    <span
      className="ml-auto min-w-[18px] h-[18px] shrink-0 rounded-full bg-[#FF4D4F] px-1.5 text-[10px] font-bold text-white flex items-center justify-center"
      aria-label={`${count} unread messages`}
    >
      {count > 9 ? "9+" : count}
    </span>
  );
}
