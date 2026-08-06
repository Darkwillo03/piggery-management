export type BatchStatus = "Active" | "Closed" | "Sold";

export type Batch = {
  id: string;
  dateIn: string;
  heads: number;
  breed: string;
  status: BatchStatus;
  remarks: string;
};

interface BatchTableProps {
  batches: Batch[];
  onEdit: (batch: Batch) => void;
  onDelete: (batch: Batch) => void;
}

const statusStyles: Record<BatchStatus, string> = {
  Active:
    "border border-emerald-500/20 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300",
  Closed:
    "border border-slate-500/20 bg-slate-500/10 text-slate-700 dark:text-slate-300",
  Sold: "border border-sky-500/20 bg-sky-500/10 text-sky-700 dark:text-sky-300",
};

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

export default function BatchTable({
  batches,
  onEdit,
  onDelete,
}: BatchTableProps) {
  return (
    <div className="mt-6 overflow-hidden rounded-2xl border border-(--border) bg-[var(--panel)] shadow-[var(--shadow)]">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[950px]">
          <thead className="border-b border-(--border) bg-[var(--panel-soft)]">
            <tr>
              <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wider text-[var(--muted)]">
                Batch ID
              </th>

              <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wider text-[var(--muted)]">
                Date In
              </th>

              <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wider text-[var(--muted)]">
                Number of Pigs
              </th>

              <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wider text-[var(--muted)]">
                Breed
              </th>

              <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wider text-[var(--muted)]">
                Status
              </th>

              <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wider text-[var(--muted)]">
                Remarks
              </th>

              <th className="px-5 py-4 text-center text-xs font-semibold uppercase tracking-wider text-[var(--muted)]">
                Actions
              </th>
            </tr>
          </thead>

          <tbody className="divide-y divide-[var(--border)]">
            {batches.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-5 py-16 text-center">
                  <div className="mx-auto max-w-sm">
                    <div className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-[var(--panel-soft)] text-2xl">
                      🐷
                    </div>

                    <p className="mt-4 font-semibold text-[var(--foreground)]">
                      No batches found
                    </p>

                    <p className="mt-1 text-sm text-[var(--muted)]">
                      Try changing your search or add a new fattening batch.
                    </p>
                  </div>
                </td>
              </tr>
            ) : (
              batches.map((batch) => (
                <tr
                  key={batch.id}
                  className="transition hover:bg-[var(--panel-soft)]">
                  <td className="px-5 py-4">
                    <p className="font-semibold text-[var(--foreground)]">
                      {batch.id}
                    </p>
                  </td>

                  <td className="px-5 py-4 text-sm text-[var(--muted)]">
                    {formatDate(batch.dateIn)}
                  </td>

                  <td className="px-5 py-4">
                    <span className="font-semibold text-[var(--foreground)]">
                      {batch.heads}
                    </span>

                    <span className="ml-1 text-xs text-[var(--subtle)]">
                      pigs
                    </span>
                  </td>

                  <td className="px-5 py-4 text-sm text-[var(--foreground)]">
                    {batch.breed}
                  </td>

                  <td className="px-5 py-4">
                    <span
                      className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${statusStyles[batch.status]}`}>
                      {batch.status}
                    </span>
                  </td>

                  <td className="max-w-[230px] px-5 py-4">
                    <p
                      className="truncate text-sm text-[var(--muted)]"
                      title={batch.remarks}>
                      {batch.remarks || "No remarks"}
                    </p>
                  </td>

                  <td className="px-5 py-4">
                    <div className="flex items-center justify-center gap-2">
                      <button
                        type="button"
                        onClick={() => onEdit(batch)}
                        className="rounded-lg border border-sky-500/20 bg-sky-500/10 px-3 py-2 text-xs font-semibold text-sky-700 transition hover:bg-sky-500/20 dark:text-sky-300">
                        Edit
                      </button>

                      <button
                        type="button"
                        onClick={() => onDelete(batch)}
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
          Showing {batches.length} {batches.length === 1 ? "batch" : "batches"}
        </p>
      </div>
    </div>
  );
}
