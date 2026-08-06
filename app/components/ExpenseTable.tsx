export type ExpenseItem = {
  id: string;
  name: string;
  category: string;
  amount: number;
  date: string;
  notes: string;
};

interface ExpenseTableProps {
  expenses: ExpenseItem[];
  onEdit: (expense: ExpenseItem) => void;
  onDelete: (expense: ExpenseItem) => void;
}

function formatCurrency(amount: number) {
  return new Intl.NumberFormat("en-PH", {
    style: "currency",
    currency: "PHP",
    minimumFractionDigits: 2,
  }).format(amount);
}

function formatDate(date: string) {
  if (!date) {
    return "—";
  }

  return new Intl.DateTimeFormat("en-PH", {
    year: "numeric",
    month: "short",
    day: "numeric",
  }).format(new Date(`${date}T00:00:00`));
}

export default function ExpenseTable({
  expenses,
  onEdit,
  onDelete,
}: ExpenseTableProps) {
  return (
    <div className="mt-6 overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--panel)] shadow-[var(--shadow)]">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[950px]">
          <thead className="border-b border-[var(--border)] bg-[var(--panel-soft)]">
            <tr>
              <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wider text-[var(--muted)]">
                Expense Name
              </th>

              <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wider text-[var(--muted)]">
                Category
              </th>

              <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wider text-[var(--muted)]">
                Amount
              </th>

              <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wider text-[var(--muted)]">
                Date
              </th>

              <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wider text-[var(--muted)]">
                Notes
              </th>

              <th className="px-5 py-4 text-center text-xs font-semibold uppercase tracking-wider text-[var(--muted)]">
                Actions
              </th>
            </tr>
          </thead>

          <tbody className="divide-y divide-[var(--border)]">
            {expenses.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-5 py-16 text-center">
                  <div className="mx-auto max-w-sm">
                    <div className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-[var(--panel-soft)] text-2xl">
                      💸
                    </div>

                    <p className="mt-4 font-semibold text-[var(--foreground)]">
                      No expense records found
                    </p>

                    <p className="mt-1 text-sm text-[var(--muted)]">
                      Add an expense record to begin tracking farm costs.
                    </p>
                  </div>
                </td>
              </tr>
            ) : (
              expenses.map((expense) => (
                <tr
                  key={expense.id}
                  className="transition hover:bg-[var(--panel-soft)]">
                  <td className="px-5 py-4">
                    <p className="font-semibold text-[var(--foreground)]">
                      {expense.name}
                    </p>
                  </td>

                  <td className="px-5 py-4">
                    <span className="inline-flex rounded-full border border-amber-500/20 bg-amber-500/10 px-3 py-1 text-xs font-semibold text-amber-700 dark:text-amber-300">
                      {expense.category}
                    </span>
                  </td>

                  <td className="px-5 py-4 font-semibold text-rose-600 dark:text-rose-400">
                    {formatCurrency(expense.amount)}
                  </td>

                  <td className="px-5 py-4 text-sm text-[var(--muted)]">
                    {formatDate(expense.date)}
                  </td>

                  <td className="max-w-[260px] px-5 py-4">
                    <p
                      className="truncate text-sm text-[var(--muted)]"
                      title={expense.notes}>
                      {expense.notes || "No notes"}
                    </p>
                  </td>

                  <td className="px-5 py-4">
                    <div className="flex items-center justify-center gap-2">
                      <button
                        type="button"
                        onClick={() => onEdit(expense)}
                        className="rounded-lg border border-sky-500/20 bg-sky-500/10 px-3 py-2 text-xs font-semibold text-sky-700 transition hover:bg-sky-500/20 dark:text-sky-300">
                        Edit
                      </button>

                      <button
                        type="button"
                        onClick={() => onDelete(expense)}
                        className="rounded-lg border border-rose-500/20 bg-rose-500/10 px-3 py-2 text-xs font-semibold text-rose-700 transition hover:bg-rose-500/20 dark:text-rose-300">
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <div className="border-t border-[var(--border)] px-5 py-4">
        <p className="text-xs text-[var(--muted)]">
          Showing {expenses.length}{" "}
          {expenses.length === 1 ? "expense" : "expenses"}
        </p>
      </div>
    </div>
  );
}
