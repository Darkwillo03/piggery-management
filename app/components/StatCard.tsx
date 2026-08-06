import DashboardIcon, { type DashboardIconName } from "./DashboardIcon";

type StatCardProps = {
  title: string;
  value: string;
  icon: DashboardIconName;
  trend: string;
  trendDirection?: "up" | "down";
  helper?: string;
  accent?: "green" | "blue" | "amber" | "red";
};

const accentStyles = {
  green:
    "bg-emerald-500/12 text-emerald-600 ring-emerald-500/20 dark:text-emerald-300",
  blue: "bg-sky-500/12 text-sky-600 ring-sky-500/20 dark:text-sky-300",
  amber: "bg-amber-500/12 text-amber-600 ring-amber-500/20 dark:text-amber-300",
  red: "bg-rose-500/12 text-rose-600 ring-rose-500/20 dark:text-rose-300",
};

export default function StatCard({
  title,
  value,
  icon,
  trend,
  trendDirection = "up",
  helper = "from last month",
  accent = "green",
}: StatCardProps) {
  const positive = trendDirection === "up";

  return (
    <article className="rounded-2xl border border-(--border) bg-(--panel) p-5 shadow-(--shadow) transition hover:-translate-y-0.5">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm text-(--muted)">{title}</p>

          <p className="mt-2 text-2xl font-bold tracking-tight text-(--foreground) xl:text-3xl">
            {value}
          </p>
        </div>

        <div
          className={`grid h-12 w-12 shrink-0 place-items-center rounded-2xl ring-1 ${accentStyles[accent]}`}>
          <DashboardIcon name={icon} className="h-6 w-6" />
        </div>
      </div>

      <div className="mt-4 flex items-center gap-1.5 text-xs">
        <span
          className={`inline-flex items-center gap-1 font-semibold ${
            positive
              ? "text-emerald-600 dark:text-emerald-400"
              : "text-rose-600 dark:text-rose-400"
          }`}>
          <DashboardIcon
            name={positive ? "arrowUp" : "arrowDown"}
            className="h-3 w-3"
          />

          {trend}
        </span>

        <span className="text-(--subtle)">{helper}</span>
      </div>
    </article>
  );
}
