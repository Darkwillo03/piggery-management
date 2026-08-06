"use client";

interface ToastProps {
  message: string;
  type: "success" | "error";
}

export default function Toast({ message, type }: ToastProps) {
  return (
    <div className="fixed bottom-5 right-5 z-[70] w-[calc(100%-2.5rem)] max-w-sm">
      <div
        className={`flex items-center gap-3 rounded-xl border px-4 py-3 shadow-xl ${
          type === "success"
            ? "border-emerald-500/20 bg-emerald-600 text-white"
            : "border-rose-500/20 bg-rose-600 text-white"
        }`}>
        <div className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-white/15">
          {type === "success" ? "✓" : "!"}
        </div>

        <p className="text-sm font-semibold">{message}</p>
      </div>
    </div>
  );
}
