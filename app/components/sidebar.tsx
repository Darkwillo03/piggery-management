"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import DashboardIcon, { type DashboardIconName } from "./DashboardIcon";

type NavigationItem = {
  label: string;
  href: string;
  icon: DashboardIconName;
};

const managementMenu: NavigationItem[] = [
  {
    label: "Dashboard",
    href: "/",
    icon: "dashboard",
  },
  {
    label: "Fattening",
    href: "/fattening",
    icon: "fattening",
  },
  {
    label: "Sows",
    href: "/sows",
    icon: "sows",
  },
  {
    label: "Feeds",
    href: "/feeds",
    icon: "feeds",
  },
  {
    label: "Expenses",
    href: "/expense",
    icon: "expense",
  },
  {
    label: "Sales",
    href: "/sales",
    icon: "sales",
  },
  {
    label: "Calendar",
    href: "/calendar",
    icon: "calendar",
  },
];

const systemMenu: NavigationItem[] = [
  {
    label: "Reports",
    href: "/reports",
    icon: "reports",
  },
  {
    label: "Settings",
    href: "/settings",
    icon: "settings",
  },
];

export default function Sidebar() {
  const pathname = usePathname();

  function isActive(href: string) {
    if (href === "/") {
      return pathname === "/";
    }

    return pathname.startsWith(href);
  }

  function renderLink(item: NavigationItem) {
    const active = isActive(item.href);

    return (
      <Link
        key={item.href}
        href={item.href}
        className={`group flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium transition ${
          active
            ? "bg-emerald-500/15 text-emerald-600 ring-1 ring-emerald-500/20 dark:text-emerald-300"
            : "text-(--muted) hover:bg-emerald-500/8 hover:text-(--foreground)"
        }`}>
        <DashboardIcon name={item.icon} className="h-5 w-5 shrink-0" />

        <span>{item.label}</span>
      </Link>
    );
  }

  return (
    <aside className="fixed left-0 top-0 z-40 hidden h-screen w-64 border-r border-(--border) bg-(--sidebar) lg:flex lg:flex-col">
      <div className="shrink-0 border-b border-(--border) px-6 py-7">
        <Link href="/" className="flex items-center gap-3">
          <div className="grid h-11 w-11 place-items-center rounded-2xl bg-emerald-600 text-white shadow-lg shadow-emerald-900/20">
            <DashboardIcon name="pigs" className="h-7 w-7" />
          </div>

          <div>
            <p className="text-xl font-bold tracking-tight text-(--foreground)">
              FarmCare
            </p>

            <p className="text-[11px] text-(--muted)">Piggery Management</p>
          </div>
        </Link>
      </div>

      <nav className="flex-1 overflow-y-auto px-4 py-6">
        <div>
          <p className="mb-3 px-3 text-[10px] font-semibold uppercase tracking-[0.2em] text-(--subtle)">
            Management
          </p>

          <div className="space-y-1">{managementMenu.map(renderLink)}</div>
        </div>

        <div className="mt-8">
          <p className="mb-3 px-3 text-[10px] font-semibold uppercase tracking-[0.2em] text-(--subtle)">
            System
          </p>

          <div className="space-y-1">{systemMenu.map(renderLink)}</div>
        </div>
      </nav>

      <div className="shrink-0 border-t border-(--border) px-5 py-4">
        <p className="text-center text-[11px] text-(--subtle)">
          FarmCare Version 1.0
        </p>
      </div>
    </aside>
  );
}
