export type SowStatus = "Open" | "Pregnant" | "Lactating" | "Weaned" | "Culled";

export type Sow = {
  id: string;
  photo: string;
  breed: string;
  birthDate: string;
  aiDate: string;
  expectedFarrowingDate: string;
  actualFarrowingDate: string;
  pigletsBornAlive: number;
  pigletsBornDead: number;
  weaningDate: string;
  status: SowStatus;
  remarks: string;
};

interface SowTableProps {
  sows: Sow[];
  onEdit: (sow: Sow) => void;
  onDelete: (sow: Sow) => void;
}

const statusStyles: Record<SowStatus, string> = {
  Open: "border border-slate-500/20 bg-slate-500/10 text-slate-700 dark:text-slate-300",
  Pregnant:
    "border border-violet-500/20 bg-violet-500/10 text-violet-700 dark:text-violet-300",
  Lactating:
    "border border-emerald-500/20 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300",
  Weaned:
    "border border-sky-500/20 bg-sky-500/10 text-sky-700 dark:text-sky-300",
  Culled:
    "border border-rose-500/20 bg-rose-500/10 text-rose-700 dark:text-rose-300",
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

export default function SowTable({ sows, onEdit, onDelete }: SowTableProps) {
  return (
    <div className="mt-6 overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--panel)] shadow-[var(--shadow)]">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[1350px]">
          <thead className="border-b border-[var(--border)] bg-[var(--panel-soft)]">
            <tr>
              <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wider text-[var(--muted)]">
                Sow
              </th>

              <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wider text-[var(--muted)]">
                Breed
              </th>

              <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wider text-[var(--muted)]">
                Birth Date
              </th>

              <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wider text-[var(--muted)]">
                AI Date
              </th>

              <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wider text-[var(--muted)]">
                Expected Farrowing
              </th>

              <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wider text-[var(--muted)]">
                Actual Farrowing
              </th>

              <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wider text-[var(--muted)]">
                Born Alive
              </th>

              <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wider text-[var(--muted)]">
                Born Dead
              </th>

              <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wider text-[var(--muted)]">
                Weaning Date
              </th>

              <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wider text-[var(--muted)]">
                Status
              </th>

              <th className="px-5 py-4 text-center text-xs font-semibold uppercase tracking-wider text-[var(--muted)]">
                Actions
              </th>
            </tr>
          </thead>

          <tbody className="divide-y divide-[var(--border)]">
            {sows.length === 0 ? (
              <tr>
                <td colSpan={11} className="px-5 py-16 text-center">
                  <div className="mx-auto max-w-sm">
                    <div className="mx-auto grid h-16 w-16 place-items-center rounded-2xl bg-[var(--panel-soft)] text-3xl">
                      🐖
                    </div>

                    <p className="mt-4 font-semibold text-[var(--foreground)]">
                      No sow records found
                    </p>

                    <p className="mt-1 text-sm text-[var(--muted)]">
                      Add your first sow record to start tracking breeding and
                      farrowing.
                    </p>
                  </div>
                </td>
              </tr>
            ) : (
              sows.map((sow) => (
                <tr
                  key={sow.id}
                  className="transition hover:bg-[var(--panel-soft)]">
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      {sow.photo ? (
                        <img
                          src={sow.photo}
                          alt={sow.id}
                          className="h-11 w-11 rounded-xl object-cover"
                        />
                      ) : (
                        <div className="grid h-11 w-11 place-items-center rounded-xl bg-emerald-500/10 text-xl">
                          🐖
                        </div>
                      )}

                      <div>
                        <p className="font-semibold text-[var(--foreground)]">
                          {sow.id}
                        </p>

                        <p className="mt-0.5 max-w-[180px] truncate text-xs text-[var(--muted)]">
                          {sow.remarks || "No remarks"}
                        </p>
                      </div>
                    </div>
                  </td>

                  <td className="px-5 py-4 text-sm text-[var(--foreground)]">
                    {sow.breed}
                  </td>

                  <td className="px-5 py-4 text-sm text-[var(--muted)]">
                    {formatDate(sow.birthDate)}
                  </td>

                  <td className="px-5 py-4 text-sm text-[var(--muted)]">
                    {formatDate(sow.aiDate)}
                  </td>

                  <td className="px-5 py-4 text-sm text-[var(--muted)]">
                    {formatDate(sow.expectedFarrowingDate)}
                  </td>

                  <td className="px-5 py-4 text-sm text-[var(--muted)]">
                    {formatDate(sow.actualFarrowingDate)}
                  </td>

                  <td className="px-5 py-4 font-semibold text-emerald-600 dark:text-emerald-400">
                    {sow.pigletsBornAlive}
                  </td>

                  <td className="px-5 py-4 font-semibold text-rose-600 dark:text-rose-400">
                    {sow.pigletsBornDead}
                  </td>

                  <td className="px-5 py-4 text-sm text-[var(--muted)]">
                    {formatDate(sow.weaningDate)}
                  </td>

                  <td className="px-5 py-4">
                    <span
                      className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${statusStyles[sow.status]}`}>
                      {sow.status}
                    </span>
                  </td>

                  <td className="px-5 py-4">
                    <div className="flex items-center justify-center gap-2">
                      <button
                        type="button"
                        onClick={() => onEdit(sow)}
                        className="rounded-lg border border-sky-500/20 bg-sky-500/10 px-3 py-2 text-xs font-semibold text-sky-700 transition hover:bg-sky-500/20 dark:text-sky-300">
                        Edit
                      </button>

                      <button
                        type="button"
                        onClick={() => onDelete(sow)}
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
          Showing {sows.length} {sows.length === 1 ? "sow" : "sows"}
        </p>
      </div>
    </div>
  );
}
