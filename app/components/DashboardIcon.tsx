import type { ReactNode, SVGProps } from "react";

export type DashboardIconName =
  | "dashboard"
  | "fattening"
  | "sows"
  | "feeds"
  | "expense"
  | "sales"
  | "calendar"
  | "reports"
  | "settings"
  | "pigs"
  | "batches"
  | "income"
  | "bell"
  | "menu"
  | "arrowUp"
  | "arrowDown";

type DashboardIconProps = SVGProps<SVGSVGElement> & {
  name: DashboardIconName;
};

const paths: Record<DashboardIconName, ReactNode> = {
  dashboard: (
    <>
      <rect x="3" y="3" width="7" height="7" rx="2" />
      <rect x="14" y="3" width="7" height="7" rx="2" />
      <rect x="3" y="14" width="7" height="7" rx="2" />
      <rect x="14" y="14" width="7" height="7" rx="2" />
    </>
  ),

  fattening: (
    <>
      <path d="M4 12c0-4 3.2-7 8-7 4 0 7 2.2 8 5l2 1v4h-3l-1.5 3H16v2h-3v-2H9v2H6v-3.2C4.7 15.7 4 14 4 12Z" />
      <path d="M8 8h.01M17 8l1-3" />
    </>
  ),

  sows: (
    <>
      <circle cx="12" cy="12" r="8" />
      <path d="M8 10h.01M16 10h.01M9 15c1.7 1.2 4.3 1.2 6 0M5 6 3 3M19 6l2-3" />
    </>
  ),

  feeds: (
    <>
      <path d="M6 3h12l2 5-2 13H6L4 8l2-5Z" />
      <path d="M4 8h16M9 12h6" />
    </>
  ),

  expense: (
    <>
      <rect x="4" y="3" width="16" height="18" rx="2" />
      <path d="M8 8h8M8 12h3M8 16h2" />
      <path d="M15 15c0-1 2-1 2 0s-2 1-2 2 2 1 2 0" />
    </>
  ),

  sales: (
    <>
      <path d="M3 17 9 11l4 4 8-9" />
      <path d="M15 6h6v6" />
    </>
  ),

  calendar: (
    <>
      <rect x="3" y="5" width="18" height="16" rx="2" />
      <path d="M16 3v4M8 3v4M3 10h18" />
    </>
  ),

  reports: (
    <>
      <path d="M4 20V10M10 20V4M16 20v-7M22 20H2" />
    </>
  ),

  settings: (
    <>
      <circle cx="12" cy="12" r="3" />
      <path d="M19.4 15a1.7 1.7 0 0 0 .3 1.9l.1.1-2.8 2.8-.1-.1a1.7 1.7 0 0 0-1.9-.3A1.7 1.7 0 0 0 14 21v.2h-4V21a1.7 1.7 0 0 0-1-1.6 1.7 1.7 0 0 0-1.9.3l-.1.1L4.2 17l.1-.1a1.7 1.7 0 0 0 .3-1.9A1.7 1.7 0 0 0 3 14h-.2v-4H3a1.7 1.7 0 0 0 1.6-1 1.7 1.7 0 0 0-.3-1.9L4.2 7 7 4.2l.1.1A1.7 1.7 0 0 0 9 4a1.7 1.7 0 0 0 1-1.6v-.2h4v.2A1.7 1.7 0 0 0 15 4a1.7 1.7 0 0 0 1.9.3l.1-.1L19.8 7l-.1.1a1.7 1.7 0 0 0-.3 1.9 1.7 1.7 0 0 0 1.6 1h.2v4H21a1.7 1.7 0 0 0-1.6 1Z" />
    </>
  ),

  pigs: (
    <>
      <path d="M4 12c0-4 3.2-7 8-7 4 0 7 2.2 8 5l2 1v4h-3l-1.5 3H16v2h-3v-2H9v2H6v-3.2C4.7 15.7 4 14 4 12Z" />
      <path d="M8 8h.01M17 8l1-3" />
    </>
  ),

  batches: (
    <>
      <circle cx="8" cy="9" r="3" />
      <circle cx="16" cy="9" r="3" />
      <path d="M2 20c0-4 2-6 6-6s6 2 6 6" />
      <path d="M10 20c0-4 2-6 6-6s6 2 6 6" />
    </>
  ),

  income: (
    <>
      <path d="M4 20V10M10 20V4M16 20v-7M22 20H2" />
      <path d="m14 8 3-3 3 3" />
    </>
  ),

  bell: (
    <>
      <path d="M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9" />
      <path d="M10 21h4" />
    </>
  ),

  menu: <path d="M4 6h16M4 12h16M4 18h16" />,

  arrowUp: <path d="m18 15-6-6-6 6" />,

  arrowDown: <path d="m6 9 6 6 6-6" />,
};

export default function DashboardIcon({
  name,
  className = "h-5 w-5",
  ...props
}: DashboardIconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
      {...props}>
      {paths[name]}
    </svg>
  );
}
