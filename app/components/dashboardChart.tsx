const labels = ["Jul 1", "Jul 7", "Jul 14", "Jul 21", "Jul 28", "Jul 31"];

export default function DashboardChart() {
  return (
    <div className="mt-6">
      <div className="mb-5 flex flex-wrap gap-5 text-xs text-slate-400">
        <span className="flex items-center gap-2">
          <span className="h-2.5 w-2.5 rounded-full bg-rose-400" />
          Expenses
        </span>

        <span className="flex items-center gap-2">
          <span className="h-2.5 w-2.5 rounded-full bg-emerald-400" />
          Sales
        </span>

        <span className="flex items-center gap-2">
          <span className="h-2.5 w-2.5 rounded-full bg-sky-400" />
          Net Income
        </span>
      </div>

      <div className="relative h-64 overflow-hidden rounded-xl">
        <div className="pointer-events-none absolute inset-0 grid grid-rows-4">
          {[0, 1, 2, 3].map((line) => (
            <div key={line} className="border-t border-white/5.5" />
          ))}
        </div>

        <svg
          viewBox="0 0 760 240"
          preserveAspectRatio="none"
          className="absolute inset-0 h-52.5 w-full"
          aria-label="Monthly financial chart">
          <defs>
            <linearGradient id="salesFill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#34d399" stopOpacity="0.22" />

              <stop offset="100%" stopColor="#34d399" stopOpacity="0" />
            </linearGradient>
          </defs>

          <path
            d="M0 177 C55 162 80 132 125 123 S210 107 255 126 S340 137 385 111 S475 83 520 89 S620 75 760 96 L760 240 L0 240 Z"
            fill="url(#salesFill)"
          />

          <path
            d="M0 177 C55 162 80 132 125 123 S210 107 255 126 S340 137 385 111 S475 83 520 89 S620 75 760 96"
            fill="none"
            stroke="#4ade80"
            strokeWidth="4"
            strokeLinecap="round"
          />

          <path
            d="M0 203 C60 182 85 160 130 157 S205 151 255 170 S345 176 390 151 S470 135 520 145 S625 135 760 141"
            fill="none"
            stroke="#38bdf8"
            strokeWidth="4"
            strokeLinecap="round"
          />

          <path
            d="M0 221 C55 214 85 194 130 195 S210 184 255 207 S340 205 390 201 S470 172 520 180 S620 185 760 199"
            fill="none"
            stroke="#fb7185"
            strokeWidth="4"
            strokeLinecap="round"
          />
        </svg>

        <div className="absolute inset-x-0 bottom-0 flex justify-between px-1 text-[11px] text-slate-600">
          {labels.map((label) => (
            <span key={label}>{label}</span>
          ))}
        </div>
      </div>
    </div>
  );
}
