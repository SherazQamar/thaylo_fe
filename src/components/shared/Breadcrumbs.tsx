"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const inter = { fontFamily: "Inter, sans-serif" } as const;

interface BreadcrumbsProps {
  /** Optional override if you want custom labels for segments */
  items?: { href: string; label: string }[];
  /** Where the leading "Home" crumb should link to (defaults to '/') */
  homeHref?: string;
  /** Optional label for the leading crumb (defaults to 'Home') */
  homeLabel?: string;
  /** Hide the leading home crumb entirely */
  showHome?: boolean;
}

function normalizeLabel(segment: string): string {
  if (!segment) return "";
  const cleaned = segment.replace(/[-_]/g, " ").trim();
  if (!cleaned) return "";
  return cleaned.charAt(0).toUpperCase() + cleaned.slice(1);
}

export default function Breadcrumbs({
  items,
  homeHref = "/",
  homeLabel = "Home",
  showHome = true,
}: BreadcrumbsProps) {
  const pathname = usePathname();

  const autoItems =
    items ??
    pathname
      .split("?")[0]
      .split("/")
      .filter(Boolean)
      .reduce<{ href: string; label: string }[]>((acc, segment, index, all) => {
        const href = "/" + all.slice(0, index + 1).join("/");
        const label = normalizeLabel(segment);
        if (!label) return acc;
        acc.push({ href, label });
        return acc;
      }, []);

  if (!autoItems.length) return null;

  return (
    <nav
      aria-label="Breadcrumb"
      className="flex items-center gap-1.5 text-xs mb-2 text-white/50"
      style={inter}
    >
      {showHome && (
        <Link href={homeHref} className="hover:text-white transition-colors">
          {homeLabel}
        </Link>
      )}
      {autoItems.map((item, index) => {
        const isLast = index === autoItems.length - 1;
        const showSeparator = showHome || index > 0;
        return (
          <span key={item.href} className="flex items-center gap-1.5">
            {showSeparator && <span className="text-white/30">/</span>}
            {isLast ? (
              <span className="text-white/70" aria-current="page">
                {item.label}
              </span>
            ) : (
              <Link href={item.href} className="hover:text-white transition-colors">
                {item.label}
              </Link>
            )}
          </span>
        );
      })}
    </nav>
  );
}
