import DashboardChart from "./components/dashboardChart";
import DashboardIcon from "./components/DashboardIcon";
import PigStatusChart from "./components/PigstatusChart";
import Sidebar from "./components/sidebar";
import StatCard from "./components/StatCard";
import ThemeToggle from "./components/ThemeToggle";

const activities = [
  {
    title: "New fattening batch added",
    description: "Batch MB-2026-14 was successfully recorded.",
    time: "2 minutes ago",
    icon: "fattening" as const,
    color: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-300",
  },
  {
    title: "Sow AI record updated",
    description: "Sow SOW-032 received a new AI schedule.",
    time: "1 hour ago",
    icon: "sows" as const,
    color: "bg-sky-500/10 text-sky-600 dark:text-sky-300",
  },
  {
    title: "Feed expense recorded",
    description: "A new feed purchase worth ₱18,500 was added.",
    time: "3 hours ago",
    icon: "expense" as const,
    color: "bg-rose-500/10 text-rose-600 dark:text-rose-300",
  },
  {
    title: "Pig sale completed",
    description: "45 pigs from batch MB-2026-12 were sold.",
    time: "5 hours ago",
    icon: "sales" as const,
    color: "bg-amber-500/10 text-amber-600 dark:text-amber-300",
  },
];

const reminders = [
  {
    title: "AI due",
    description: "5 sows require AI scheduling.",
    date: "July 14, 2026",
    icon: "sows" as const,
  },
  {
    title: "Expected farrowing",
    description: "3 sows are approaching their farrowing date.",
    date: "July 17, 2026",
    icon: "calendar" as const,
  },
  {
    title: "Weaning schedule",
    description: "4 litters are scheduled for weaning.",
    date: "July 20, 2026",
    icon: "pigs" as const,
  },
];

export default function Home() {
  return (
    <main className="min-h-screen bg-(--background) text-(--foreground)">
      <Sidebar />

      <div className="min-h-screen lg:ml-64">
        <header className="sticky top-0 z-30 border-b border-(--border) bg-(--background)/90 backdrop-blur-xl">
          <div className="flex min-h-20 flex-col gap-4 px-4 py-4 sm:px-7 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex items-center gap-3">
              <button
                type="button"
                className="grid h-11 w-11 place-items-center rounded-xl border border-(--border) bg-(--panel) text-(--muted) lg:hidden"
                aria-label="Open navigation menu">
                <DashboardIcon name="menu" className="h-5 w-5" />
              </button>

              <div className="relative w-full max-w-md lg:w-80 xl:w-96">
                <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-(--subtle)">
                  ⌕
                </span>

                <input
                  type="search"
                  placeholder="Search FarmCare..."
                  className="w-full rounded-xl border border-(--border) bg-(--panel) py-3 pl-11 pr-4 text-sm text-(--foreground) outline-none transition placeholder:text-(--subtle) focus:border-emerald-500/50"
                />
              </div>
            </div>

            <div className="flex items-center gap-3">
              <ThemeToggle />

              <button
                type="button"
                className="relative grid h-11 w-11 shrink-0 place-items-center rounded-xl border border-(--border) bg-(--panel) text-(--muted) transition hover:border-emerald-500/30 hover:text-(--foreground)"
                aria-label="Notifications">
                <DashboardIcon name="bell" className="h-5 w-5" />

                <span className="absolute -right-1 -top-1 grid h-5 w-5 place-items-center rounded-full bg-emerald-500 text-[10px] font-bold text-white">
                  3
                </span>
              </button>

              <div className="hidden rounded-xl border border-(--border) bg-(--panel) px-4 py-2 text-right sm:block">
                <p className="text-sm font-semibold text-(--foreground)">
                  July 13, 2026
                </p>

                <p className="text-xs text-(--muted)">Monday</p>
              </div>

              <button
                type="button"
                className="flex items-center gap-3 rounded-xl border border-(--border) bg-(--panel) px-3 py-2 text-left transition hover:border-emerald-500/30">
                <div className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-linear-to-br from-emerald-400 to-emerald-700 font-bold text-white">
                  FO
                </div>

                <div className="hidden sm:block">
                  <p className="text-sm font-semibold text-(--foreground)">
                    Farm Owner
                  </p>

                  <p className="text-xs text-(--muted)">Administrator</p>
                </div>

                <span className="hidden text-(--subtle) sm:block">⌄</span>
              </button>
            </div>
          </div>
        </header>

        <section className="mx-auto max-w-[1600px] p-4 sm:p-7 lg:p-8">
          <div className="mb-8">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-emerald-600 dark:text-emerald-400">
              Farm Overview
            </p>

            <h1 className="mt-2 text-3xl font-bold tracking-tight text-(--foreground) sm:text-4xl">
              Welcome back, Farm Owner
            </h1>

            <p className="mt-2 text-sm text-(--muted) sm:text-base">
              Here&apos;s what is happening on your farm today.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <StatCard title="Total Pigs" value="154" icon="pigs" trend="8.5%" />

            <StatCard
              title="Active Batches"
              value="14"
              icon="batches"
              trend="2 batches"
            />

            <StatCard
              title="Active Sows"
              value="36"
              icon="sows"
              trend="4 sows"
              accent="blue"
            />

            <StatCard
              title="Feed Stock"
              value="245 Bags"
              icon="feeds"
              trend="3.2%"
              trendDirection="down"
              accent="amber"
            />
          </div>

          <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-3">
            <StatCard
              title="Expenses This Month"
              value="₱84,500"
              icon="expense"
              trend="5.4%"
              trendDirection="down"
              accent="red"
            />

            <StatCard
              title="Sales This Month"
              value="₱165,000"
              icon="sales"
              trend="18.7%"
            />

            <StatCard
              title="Net Income"
              value="₱80,500"
              icon="income"
              trend="18.9%"
              accent="blue"
            />
          </div>

          <div className="mt-5 grid gap-5 xl:grid-cols-[1.55fr_1fr]">
            <section className="rounded-2xl border border-(--border) bg-(--panel) p-5 shadow-(--shadow) sm:p-6">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <h2 className="text-lg font-semibold text-(--foreground)">
                    Monthly Overview
                  </h2>

                  <p className="mt-1 text-sm text-(--muted)">
                    Expenses, sales, and net income
                  </p>
                </div>

                <button
                  type="button"
                  className="rounded-lg border border-(--border) bg-(--panel-soft) px-3 py-2 text-xs text-(--muted) transition hover:text-(--foreground)">
                  This month ⌄
                </button>
              </div>

              <DashboardChart />
            </section>

            <section className="rounded-2xl border border-(--border) bg-(--panel) p-5 shadow-(--shadow) sm:p-6">
              <h2 className="text-lg font-semibold text-(--foreground)">
                Pigs by Status
              </h2>

              <p className="mt-1 text-sm text-(--muted)">
                Current pig population
              </p>

              <PigStatusChart />
            </section>
          </div>

          <div className="mt-5 grid gap-5 xl:grid-cols-2">
            <section className="rounded-2xl border border-(--border) bg-(--panel) p-5 shadow-(--shadow) sm:p-6">
              <h2 className="text-lg font-semibold text-(--foreground)">
                Recent Activities
              </h2>

              <p className="mt-1 text-sm text-(--muted)">
                Latest farm transactions and updates
              </p>

              <div className="mt-5 divide-y divide-(--border)">
                {activities.map((activity) => (
                  <div
                    key={activity.title}
                    className="flex items-start gap-3 py-4 first:pt-0">
                    <div
                      className={`grid h-10 w-10 shrink-0 place-items-center rounded-xl ${activity.color}`}>
                      <DashboardIcon name={activity.icon} className="h-5 w-5" />
                    </div>

                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-semibold text-(--foreground)">
                        {activity.title}
                      </p>

                      <p className="mt-1 text-xs leading-5 text-(--muted)">
                        {activity.description}
                      </p>
                    </div>

                    <span className="shrink-0 text-xs text-(--subtle)">
                      {activity.time}
                    </span>
                  </div>
                ))}
              </div>
            </section>

            <section className="rounded-2xl border border-(--border) bg-(--panel) p-5 shadow-(--shadow) sm:p-6">
              <h2 className="text-lg font-semibold text-(--foreground)">
                Upcoming Reminders
              </h2>

              <p className="mt-1 text-sm text-(--muted)">
                Important breeding and farm schedules
              </p>

              <div className="mt-5 divide-y divide-(--border)">
                {reminders.map((reminder) => (
                  <div
                    key={reminder.title}
                    className="flex items-start gap-3 py-4 first:pt-0">
                    <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-300">
                      <DashboardIcon name={reminder.icon} className="h-5 w-5" />
                    </div>

                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-semibold text-(--foreground)">
                        {reminder.title}
                      </p>

                      <p className="mt-1 text-xs leading-5 text-(--muted)">
                        {reminder.description}
                      </p>
                    </div>

                    <span className="shrink-0 text-xs text-(--subtle)">
                      {reminder.date}
                    </span>
                  </div>
                ))}
              </div>
            </section>
          </div>
        </section>
      </div>
    </main>
  );
}
