export type Sale = {
  id: string;
  batch: string;
  buyer: string;
  quantitySold: number;
  sellingPrice: number;
  totalAmount: number;
  date: string;
};

interface SalesTableProps {
  sales: Sale[];
  onEdit: (sale: Sale) => void;
  onDelete: (sale: Sale) => void;
}

function formatCurrency(value: number) {
  return new Intl.NumberFormat("en-PH", {
    style: "currency",
    currency: "PHP",
    minimumFractionDigits: 2,
  }).format(value);
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

export default function SalesTable({
  sales,
  onEdit,
  onDelete,
}: SalesTableProps) {
  return (
    <div className="mt-6 overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--panel)] shadow-[var(--shadow)]">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[1000px]">
          <thead className="border-b border-[var(--border)] bg-[var(--panel-soft)]">
            <tr>
              <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wider text-[var(--muted)]">
                Sale ID
              </th>

              <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wider text-[var(--muted)]">
                Batch
              </th>

              <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wider text-[var(--muted)]">
                Buyer
              </th>

              <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wider text-[var(--muted)]">
                Quantity
              </th>

              <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wider text-[var(--muted)]">
                Selling Price
              </th>

              <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wider text-[var(--muted)]">
                Total Amount
              </th>

              <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wider text-[var(--muted)]">
                Date
              </th>

              <th className="px-5 py-4 text-center text-xs font-semibold uppercase tracking-wider text-[var(--muted)]">
                Actions
              </th>
            </tr>
          </thead>

          <tbody className="divide-y divide-[var(--border)]">
            {sales.length === 0 ? (
              <tr>
                <td colSpan={8} className="px-5 py-16 text-center">
                  <div className="mx-auto max-w-sm">
                    <div className="mx-auto grid h-16 w-16 place-items-center rounded-2xl bg-[var(--panel-soft)] text-3xl">
                      💰
                    </div>

                    <p className="mt-4 font-semibold text-[var(--foreground)]">
                      No sales records found
                    </p>

                    <p className="mt-1 text-sm text-[var(--muted)]">
                      Add your first sale transaction to start tracking farm
                      income.
                    </p>
                  </div>
                </td>
              </tr>
            ) : (
              sales.map((sale) => (
                <tr
                  key={sale.id}
                  className="transition hover:bg-[var(--panel-soft)]">
                  <td className="px-5 py-4 font-semibold text-[var(--foreground)]">
                    {sale.id}
                  </td>

                  <td className="px-5 py-4 text-sm text-[var(--foreground)]">
                    {sale.batch}
                  </td>

                  <td className="px-5 py-4 text-sm text-[var(--foreground)]">
                    {sale.buyer}
                  </td>

                  <td className="px-5 py-4 text-sm text-[var(--muted)]">
                    {sale.quantitySold} pigs
                  </td>

                  <td className="px-5 py-4 text-sm text-[var(--muted)]">
                    {formatCurrency(sale.sellingPrice)}
                  </td>

                  <td className="px-5 py-4 font-semibold text-emerald-600 dark:text-emerald-400">
                    {formatCurrency(sale.totalAmount)}
                  </td>

                  <td className="px-5 py-4 text-sm text-[var(--muted)]">
                    {formatDate(sale.date)}
                  </td>

                  <td className="px-5 py-4">
                    <div className="flex items-center justify-center gap-2">
                      <button
                        type="button"
                        onClick={() => onEdit(sale)}
                        className="rounded-lg border border-sky-500/20 bg-sky-500/10 px-3 py-2 text-xs font-semibold text-sky-700 transition hover:bg-sky-500/20 dark:text-sky-300">
                        Edit
                      </button>

                      <button
                        type="button"
                        onClick={() => onDelete(sale)}
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
          Showing {sales.length} {sales.length === 1 ? "sale" : "sales"}
        </p>
      </div>
    </div>
  );
}
