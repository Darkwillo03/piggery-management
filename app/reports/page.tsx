"use client";

import { useMemo, useState } from "react";
import Sidebar from "../components/sidebar";
import ThemeToggle from "../components/ThemeToggle";

type ReportRecord = {
  month: string;
  monthNumber: number;
  year: number;
  sales: number;
  expenses: number;
  pigsSold: number;
};

const reportData: ReportRecord[] = [
  {
    month: "January",
    monthNumber: 1,
    year: 2026,
    sales: 125000,
    expenses: 74500,
    pigsSold: 18,
  },
  {
    month: "February",
    monthNumber: 2,
    year: 2026,
    sales: 148000,
    expenses: 82300,
    pigsSold: 21,
  },
  {
    month: "March",
    monthNumber: 3,
    year: 2026,
    sales: 132500,
    expenses: 79800,
    pigsSold: 19,
  },
  {
    month: "April",
    monthNumber: 4,
    year: 2026,
    sales: 176000,
    expenses: 91200,
    pigsSold: 24,
  },
  {
    month: "May",
    monthNumber: 5,
    year: 2026,
    sales: 169500,
    expenses: 88700,
    pigsSold: 23,
  },
  {
    month: "June",
    monthNumber: 6,
    year: 2026,
    sales: 195000,
    expenses: 103500,
    pigsSold: 27,
  },
  {
    month: "July",
    monthNumber: 7,
    year: 2026,
    sales: 186500,
    expenses: 96500,
    pigsSold: 25,
  },
];

const months = [
  { value: "all", label: "All Months" },
  { value: "1", label: "January" },
  { value: "2", label: "February" },
  { value: "3", label: "March" },
  { value: "4", label: "April" },
  { value: "5", label: "May" },
  { value: "6", label: "June" },
  { value: "7", label: "July" },
  { value: "8", label: "August" },
  { value: "9", label: "September" },
  { value: "10", label: "October" },
  { value: "11", label: "November" },
  { value: "12", label: "December" },
];

function formatCurrency(value: number) {
  return new Intl.NumberFormat("en-PH", {
    style: "currency",
    currency: "PHP",
    maximumFractionDigits: 0,
  }).format(value);
}

export default function ReportsPage() {
  const [selectedYear, setSelectedYear] = useState("2026");
  const [selectedMonth, setSelectedMonth] = useState("all");

  const filteredReports = useMemo(() => {
    return reportData.filter((report) => {
      const yearMatches = report.year.toString() === selectedYear;

      const monthMatches =
        selectedMonth === "all" ||
        report.monthNumber.toString() === selectedMonth;

      return yearMatches && monthMatches;
    });
  }, [selectedMonth, selectedYear]);

  const totals = useMemo(() => {
    return filteredReports.reduce(
      (summary, report) => ({
        sales: summary.sales + report.sales,
        expenses: summary.expenses + report.expenses,
        pigsSold: summary.pigsSold + report.pigsSold,
      }),
      {
        sales: 0,
        expenses: 0,
        pigsSold: 0,
      },
    );
  }, [filteredReports]);

  const netIncome = totals.sales - totals.expenses;

  const highestValue = Math.max(
    1,
    ...filteredReports.map((report) => Math.max(report.sales, report.expenses)),
  );

  function exportCSV() {
    const header = [
      "Month",
      "Year",
      "Sales",
      "Expenses",
      "Net Income",
      "Pigs Sold",
    ];

    const rows = filteredReports.map((report) => [
      report.month,
      report.year,
      report.sales,
      report.expenses,
      report.sales - report.expenses,
      report.pigsSold,
    ]);

    const csv = [header.join(","), ...rows.map((row) => row.join(","))].join(
      "\n",
    );

    const blob = new Blob([csv], {
      type: "text/csv;charset=utf-8;",
    });

    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");

    link.href = url;
    link.download = "farmcare-report.csv";
    link.click();

    URL.revokeObjectURL(url);
  }

  return (
    <main className="min-h-screen bg-[var(--background)] text-[var(--foreground)]">
      <Sidebar />

      <div className="min-h-screen lg:ml-64">
        <header className="sticky top-0 z-30 border-b border-[var(--border)] bg-[var(--background)]/90 backdrop-blur-xl">
          <div className="flex min-h-20 items-center justify-between gap-4 px-4 py-4 sm:px-7">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-emerald-600 dark:text-emerald-400">
                FarmCare
              </p>

              <h1 className="mt-1 text-xl font-bold">Reports</h1>
            </div>

            <ThemeToggle />
          </div>
        </header>

        <section className="mx-auto max-w-[1600px] p-4 sm:p-7 lg:p-8">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-emerald-600 dark:text-emerald-400">
                Financial Summary
              </p>

              <h2 className="mt-2 text-3xl font-bold tracking-tight">
                Farm Reports
              </h2>

              <p className="mt-2 max-w-2xl text-sm leading-6 text-[var(--muted)]">
                Review sales, expenses, net income, and pigs sold by month or
                year.
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              <button
                type="button"
                onClick={exportCSV}
                className="rounded-xl border border-[var(--border)] bg-[var(--panel)] px-5 py-3 text-sm font-semibold transition hover:border-emerald-500/40">
                Export CSV
              </button>

              <button
                type="button"
                onClick={() => window.print()}
                className="rounded-xl bg-emerald-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-emerald-500">
                Print Report
              </button>
            </div>
          </div>

          <div className="mt-7 rounded-2xl border border-[var(--border)] bg-[var(--panel)] p-5 shadow-[var(--shadow)]">
            <div className="grid gap-4 sm:grid-cols-2 lg:max-w-xl">
              <div>
                <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-[var(--muted)]">
                  Month
                </label>

                <select
                  value={selectedMonth}
                  onChange={(event) => setSelectedMonth(event.target.value)}
                  className="w-full rounded-xl border border-[var(--border)] bg-[var(--panel-soft)] px-4 py-3 text-sm text-[var(--foreground)] outline-none">
                  {months.map((month) => (
                    <option key={month.value} value={month.value}>
                      {month.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-[var(--muted)]">
                  Year
                </label>

                <select
                  value={selectedYear}
                  onChange={(event) => setSelectedYear(event.target.value)}
                  className="w-full rounded-xl border border-[var(--border)] bg-[var(--panel-soft)] px-4 py-3 text-sm text-[var(--foreground)] outline-none">
                  <option value="2026">2026</option>
                  <option value="2025">2025</option>
                  <option value="2024">2024</option>
                </select>
              </div>
            </div>
          </div>

          <div className="mt-5 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <SummaryCard
              title="Total Sales"
              value={formatCurrency(totals.sales)}
              helper="Gross farm revenue"
            />

            <SummaryCard
              title="Total Expenses"
              value={formatCurrency(totals.expenses)}
              helper="Operating expenses"
            />

            <SummaryCard
              title="Net Income"
              value={formatCurrency(netIncome)}
              helper="Sales minus expenses"
            />

            <SummaryCard
              title="Pigs Sold"
              value={String(totals.pigsSold)}
              helper="Total heads sold"
            />
          </div>

          <div className="mt-5 grid gap-5 xl:grid-cols-[1.4fr_0.8fr]">
            <section className="rounded-2xl border border-[var(--border)] bg-[var(--panel)] p-5 shadow-[var(--shadow)]">
              <h3 className="text-lg font-bold">Sales vs Expenses</h3>

              <p className="mt-1 text-sm text-[var(--muted)]">
                Monthly financial performance.
              </p>

              <div className="mt-7 space-y-6">
                {filteredReports.length === 0 ? (
                  <p className="rounded-xl border border-dashed border-[var(--border)] p-8 text-center text-sm text-[var(--muted)]">
                    No report data found.
                  </p>
                ) : (
                  filteredReports.map((report) => (
                    <div key={`${report.year}-${report.monthNumber}`}>
                      <div className="mb-2 flex items-center justify-between gap-4">
                        <p className="text-sm font-semibold">{report.month}</p>

                        <p className="text-xs text-[var(--muted)]">
                          Net: {formatCurrency(report.sales - report.expenses)}
                        </p>
                      </div>

                      <ReportBar
                        label="Sales"
                        value={report.sales}
                        maximum={highestValue}
                        className="bg-emerald-500"
                      />

                      <div className="mt-2">
                        <ReportBar
                          label="Expenses"
                          value={report.expenses}
                          maximum={highestValue}
                          className="bg-rose-500"
                        />
                      </div>
                    </div>
                  ))
                )}
              </div>
            </section>

            <section className="rounded-2xl border border-[var(--border)] bg-[var(--panel)] p-5 shadow-[var(--shadow)]">
              <h3 className="text-lg font-bold">Income Summary</h3>

              <div className="mt-5 space-y-3">
                <DetailRow
                  label="Gross Sales"
                  value={formatCurrency(totals.sales)}
                />

                <DetailRow
                  label="Expenses"
                  value={formatCurrency(totals.expenses)}
                />

                <DetailRow
                  label="Net Income"
                  value={formatCurrency(netIncome)}
                />

                <DetailRow label="Pigs Sold" value={String(totals.pigsSold)} />
              </div>
            </section>
          </div>

          <section className="mt-5 overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--panel)] shadow-[var(--shadow)]">
            <div className="border-b border-[var(--border)] p-5">
              <h3 className="text-lg font-bold">Monthly Breakdown</h3>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full min-w-[760px]">
                <thead className="bg-[var(--panel-soft)]">
                  <tr>
                    {[
                      "Month",
                      "Sales",
                      "Expenses",
                      "Net Income",
                      "Pigs Sold",
                    ].map((heading) => (
                      <th
                        key={heading}
                        className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wider text-[var(--muted)]">
                        {heading}
                      </th>
                    ))}
                  </tr>
                </thead>

                <tbody>
                  {filteredReports.map((report) => (
                    <tr
                      key={`${report.year}-${report.monthNumber}`}
                      className="border-t border-[var(--border)]">
                      <td className="px-5 py-4 text-sm font-semibold">
                        {report.month} {report.year}
                      </td>

                      <td className="px-5 py-4 text-sm">
                        {formatCurrency(report.sales)}
                      </td>

                      <td className="px-5 py-4 text-sm">
                        {formatCurrency(report.expenses)}
                      </td>

                      <td className="px-5 py-4 text-sm font-semibold text-emerald-600 dark:text-emerald-400">
                        {formatCurrency(report.sales - report.expenses)}
                      </td>

                      <td className="px-5 py-4 text-sm">{report.pigsSold}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        </section>
      </div>
    </main>
  );
}

function SummaryCard({
  title,
  value,
  helper,
}: {
  title: string;
  value: string;
  helper: string;
}) {
  return (
    <article className="rounded-2xl border border-[var(--border)] bg-[var(--panel)] p-5 shadow-[var(--shadow)]">
      <p className="text-sm text-[var(--muted)]">{title}</p>

      <p className="mt-2 text-3xl font-bold">{value}</p>

      <p className="mt-2 text-xs text-[var(--subtle)]">{helper}</p>
    </article>
  );
}

function ReportBar({
  label,
  value,
  maximum,
  className,
}: {
  label: string;
  value: number;
  maximum: number;
  className: string;
}) {
  const width = Math.max(2, Math.min(100, (value / maximum) * 100));

  return (
    <div className="flex items-center gap-3">
      <span className="w-16 text-xs text-[var(--muted)]">{label}</span>

      <div className="h-3 flex-1 overflow-hidden rounded-full bg-[var(--panel-soft)]">
        <div
          className={`h-full rounded-full ${className}`}
          style={{ width: `${width}%` }}
        />
      </div>

      <span className="w-24 text-right text-xs font-semibold">
        {formatCurrency(value)}
      </span>
    </div>
  );
}

function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-4 rounded-xl border border-[var(--border)] bg-[var(--panel-soft)] px-4 py-3">
      <span className="text-sm text-[var(--muted)]">{label}</span>

      <span className="text-sm font-semibold">{value}</span>
    </div>
  );
}
    