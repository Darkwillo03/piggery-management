"use client";

import type { Batch } from "./BatchTable";

interface DeleteBatchModalProps {
  batch: Batch | null;
  onCancel: () => void;
  onConfirm: () => void;
}

export default function DeleteBatchModal({
  batch,
  onCancel,
  onConfirm,
}: DeleteBatchModalProps) {
  if (!batch) {
    return null;
  }

  return (
    <div
      className="fixed inset-0 z-60lex items-center justify-center bg-black/60 p-4 backdrop-blur-sm"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) {
          onCancel();
        }
      }}>
      <div className="w-full max-w-md rounded-2xl border border-[var(--border)] bg-[var(--panel)] p-6 shadow-[var(--shadow)]">
        <div className="grid h-14 w-14 place-items-center rounded-2xl bg-rose-500/10 text-2xl">
          ⚠️
        </div>

        <h2 className="mt-5 text-xl font-bold text-[var(--foreground)]">
          Delete Fattening Batch?
        </h2>

        <p className="mt-2 text-sm leading-6 text-[var(--muted)]">
          Are you sure you want to delete batch{" "}
          <span className="font-semibold text-[var(--foreground)]">
            {batch.id}
          </span>
          ? This action cannot be undone.
        </p>

        <div className="mt-5 rounded-xl border border-[var(--border)] bg-[var(--panel-soft)] p-4">
          <div className="flex justify-between gap-4 text-sm">
            <span className="text-[var(--muted)]">Breed</span>

            <span className="font-medium text-[var(--foreground)]">
              {batch.breed}
            </span>
          </div>

          <div className="mt-3 flex justify-between gap-4 text-sm">
            <span className="text-[var(--muted)]">Number of Pigs</span>

            <span className="font-medium text-[var(--foreground)]">
              {batch.heads}
            </span>
          </div>

          <div className="mt-3 flex justify-between gap-4 text-sm">
            <span className="text-[var(--muted)]">Status</span>

            <span className="font-medium text-[var(--foreground)]">
              {batch.status}
            </span>
          </div>
        </div>

        <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
          <button
            type="button"
            onClick={onCancel}
            className="rounded-xl border border-[var(--border)] bg-[var(--panel-soft)] px-5 py-3 text-sm font-semibold text-[var(--muted)] transition hover:text-[var(--foreground)]">
            Cancel
          </button>

          <button
            type="button"
            onClick={onConfirm}
            className="rounded-xl bg-rose-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-rose-500">
            Delete Batch
          </button>
        </div>
      </div>
    </div>
  );
}
