const statuses = [
  {
    label: "Fattening",
    value: "65%",
    count: "100 pigs",
    color: "bg-emerald-400",
  },
  {
    label: "Sows",
    value: "23%",
    count: "36 pigs",
    color: "bg-amber-400",
  },
  {
    label: "Piglets",
    value: "12%",
    count: "18 pigs",
    color: "bg-sky-400",
  },
];

export default function PigStatusChart() {
  return (
    <div className="mt-7 flex flex-col items-center gap-8 sm:flex-row sm:justify-around">
      <div className="relative grid h-44 w-44 shrink-0 place-items-center rounded-full bg-[conic-gradient(#4ade80_0_65%,#fbbf24_65%_88%,#38bdf8_88%_100%)]">
        <div className="grid h-28 w-28 place-items-center rounded-full bg-[#10201d] text-center shadow-inner">
          <div>
            <p className="text-3xl font-bold text-white">154</p>

            <p className="text-xs text-slate-500">Total pigs</p>
          </div>
        </div>
      </div>

      <div className="w-full max-w-xs space-y-4">
        {statuses.map((status) => (
          <div key={status.label} className="flex items-center gap-3">
            <span className={`h-2.5 w-2.5 rounded-full ${status.color}`} />

            <div className="min-w-0 flex-1">
              <p className="text-sm font-medium text-slate-300">
                {status.label}
              </p>

              <p className="text-xs text-slate-600">{status.count}</p>
            </div>

            <span className="text-sm font-semibold text-white">
              {status.value}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
