export type FeedUnit = "Bag" | "Kilogram" | "Sack";

export type FeedItem = {
  id: string;
  name: string;
  category: string;
  quantity: number;
  unit: FeedUnit;
  supplier: string;
  purchaseDate: string;
};

interface FeedTableProps {
  feeds: FeedItem[];
  onEdit: (feed: FeedItem) => void;
  onDelete: (feed: FeedItem) => void;
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

export default function FeedTable({ feeds, onEdit, onDelete }: FeedTableProps) {
  return (
    <div className="mt-6 overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--panel)] shadow-[var(--shadow)]">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[900px]">
          <thead className="border-b border-[var(--border)] bg-[var(--panel-soft)]">
            <tr>
              <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wider text-[var(--muted)]">
                Feed Name
              </th>

              <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wider text-[var(--muted)]">
                Category
              </th>

              <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wider text-[var(--muted)]">
                Quantity
              </th>

              <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wider text-[var(--muted)]">
                Supplier
              </th>

              <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wider text-[var(--muted)]">
                Purchase Date
              </th>

              <th className="px-5 py-4 text-center text-xs font-semibold uppercase tracking-wider text-[var(--muted)]">
                Actions
              </th>
            </tr>
          </thead>

          <tbody className="divide-y divide-[var(--border)]">
            {feeds.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-5 py-16 text-center">
                  <div className="mx-auto max-w-sm">
                    <div className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-[var(--panel-soft)] text-2xl">
                      🌾
                    </div>

                    <p className="mt-4 font-semibold text-[var(--foreground)]">
                      No feed records found
                    </p>

                    <p className="mt-1 text-sm text-[var(--muted)]">
                      Add a feed inventory record to start monitoring your
                      stock.
                    </p>
                  </div>
                </td>
              </tr>
            ) : (
              feeds.map((feed) => (
                <tr
                  key={feed.id}
                  className="transition hover:bg-[var(--panel-soft)]">
                  <td className="px-5 py-4">
                    <p className="font-semibold text-[var(--foreground)]">
                      {feed.name}
                    </p>
                  </td>

                  <td className="px-5 py-4 text-sm text-[var(--muted)]">
                    {feed.category}
                  </td>

                  <td className="px-5 py-4">
                    <span className="font-semibold text-[var(--foreground)]">
                      {feed.quantity}
                    </span>

                    <span className="ml-1 text-xs text-[var(--subtle)]">
                      {feed.unit}
                    </span>
                  </td>

                  <td className="px-5 py-4 text-sm text-[var(--muted)]">
                    {feed.supplier || "—"}
                  </td>

                  <td className="px-5 py-4 text-sm text-[var(--muted)]">
                    {formatDate(feed.purchaseDate)}
                  </td>

                  <td className="px-5 py-4">
                    <div className="flex items-center justify-center gap-2">
                      <button
                        type="button"
                        onClick={() => onEdit(feed)}
                        className="rounded-lg border border-sky-500/20 bg-sky-500/10 px-3 py-2 text-xs font-semibold text-sky-700 transition hover:bg-sky-500/20 dark:text-sky-300">
                        Edit
                      </button>

                      <button
                        type="button"
                        onClick={() => onDelete(feed)}
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
          Showing {feeds.length}{" "}
          {feeds.length === 1 ? "feed item" : "feed items"}
        </p>
      </div>
    </div>
  );
}
