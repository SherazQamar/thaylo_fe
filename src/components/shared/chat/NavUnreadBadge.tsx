import NavCountBadge from "@/components/shared/NavCountBadge";

type NavUnreadBadgeProps = {
  count: number;
  collapsed?: boolean;
};

export default function NavUnreadBadge({ count, collapsed = false }: NavUnreadBadgeProps) {
  return (
    <NavCountBadge
      count={count}
      collapsed={collapsed}
      ariaLabel={`${count} unread messages`}
      maxDisplay={9}
    />
  );
}
