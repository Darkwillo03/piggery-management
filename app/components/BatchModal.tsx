"use client";

import { useEffect, useState } from "react";
import type { Batch, BatchStatus } from "./BatchTable";

interface BatchModalProps {
  open: boolean;
  onClose: () => void;
  onSave: (batch: Batch) => void;
  editingBatch: Batch | null;
  existingBatchIds: string[];
}

type FormErrors = {
  id?: string;
  dateIn?: string;
  heads?: string;
  breed?: string;
};

const initialForm: Batch = {
  id: "",
  dateIn: "",
  heads: 0,
  breed: "",
  status: "Active",
  remarks: "",
};

const breeds = [
  "Landrace",
  "Large White",
  "Duroc",
  "Pietrain",
  "Crossbreed",
  "Other",
];

const statuses: BatchStatus[] = ["Active", "Closed", "Sold"];

export default function BatchModal({
  open,
  onClose,
  onSave,
  editingBatch,
  existingBatchIds,
}: BatchModalProps) {
  const [form, setForm] = useState<Batch>(initialForm);
  const [headsInput, setHeadsInput] = useState("");
  const [errors, setErrors] = useState<FormErrors>({});

  const isEditing = editingBatch !== null;

  useEffect(() => {
    if (!open) {
      return;
    }

    if (editingBatch) {
      setForm(editingBatch);
      setHeadsInput(String(editingBatch.heads));
    } else {
      setForm(initialForm);
      setHeadsInput("");
    }

    setErrors({});
  }, [open, editingBatch]);

  useEffect(() => {
    function handleEscape(event: KeyboardEvent) {
      if (event.key === "Escape" && open) {
        onClose();
      }
    }

    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("keydown", handleEscape);
    };
  }, [open, onClose]);

  function updateField<K extends keyof Batch>(field: K, value: Batch[K]) {
    setForm((current) => ({
      ...current,
      [field]: value,
    }));

    setErrors((current) => ({
      ...current,
      [field]: undefined,
    }));
  }

  function validateForm() {
    const nextErrors: FormErrors = {};
    const cleanedId = form.id.trim().toUpperCase();
    const originalId = editingBatch?.id.toUpperCase();

    if (!cleanedId) {
      nextErrors.id = "Batch ID is required.";
    } else if (
      existingBatchIds.some(
        (id) =>
          id.toUpperCase() === cleanedId && id.toUpperCase() !== originalId,
      )
    ) {
      nextErrors.id = "This Batch ID already exists.";
    }

    if (!form.dateIn) {
      nextErrors.dateIn = "Date In is required.";
    }

    const heads = Number(headsInput);

    if (!headsInput.trim()) {
      nextErrors.heads = "Number of pigs is required.";
    } else if (!Number.isInteger(heads) || heads <= 0) {
      nextErrors.heads = "Enter a whole number greater than zero.";
    }

    if (!form.breed.trim()) {
      nextErrors.breed = "Breed is required.";
    }

    setErrors(nextErrors);

    return Object.keys(nextErrors).length === 0;
  }

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!validateForm()) {
      return;
    }

    onSave({
      ...form,
      id: form.id.trim().toUpperCase(),
      breed: form.breed.trim(),
      heads: Number(headsInput),
      remarks: form.remarks.trim(),
    });
  }

  if (!open) {
    return null;
  }

  const inputClass =
    "w-full rounded-xl border border-[var(--border)] bg-[var(--panel-soft)] px-4 py-3 text-sm text-[var(--foreground)] outline-none transition placeholder:text-[var(--subtle)] focus:border-emerald-500/50";

  const errorInputClass =
    "w-full rounded-xl border border-rose-500/70 bg-[var(--panel-soft)] px-4 py-3 text-sm text-[var(--foreground)] outline-none transition placeholder:text-[var(--subtle)]";

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) {
          onClose();
        }
      }}>
      <div className="max-h-[92vh] w-full max-w-2xl overflow-y-auto rounded-2xl border border-(--border) bg-(--panel) shadow-(--shadow)">
        <div className="sticky top-0 z-10 flex items-start justify-between border-b border-(--border) bg-(--panel) px-5 py-5 sm:px-6">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-emerald-600 dark:text-emerald-400">
              Fattening Management
            </p>

            <h2 className="mt-1 text-xl font-bold text-(--foreground) sm:text-2xl">
              {isEditing ? "Edit Fattening Batch" : "Add Fattening Batch"}
            </h2>

            <p className="mt-1 text-sm text-(--muted)">
              {isEditing
                ? "Update the information for this batch."
                : "Enter the details of the new batch."}
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="grid h-10 w-10 shrink-0 place-items-center rounded-xl border border-(--border) bg-(--panel-soft) text-(--muted) transition hover:text-(--foreground)"
            aria-label="Close modal">
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="grid gap-5 p-5 sm:grid-cols-2 sm:p-6">
            <div>
              <label
                htmlFor="batch-id"
                className="mb-2 block text-sm font-medium text-(--foreground)">
                Batch ID
                <span className="ml-1 text-rose-500">*</span>
              </label>

              <input
                id="batch-id"
                type="text"
                value={form.id}
                onChange={(event) => updateField("id", event.target.value)}
                placeholder="Example: F001"
                className={errors.id ? errorInputClass : inputClass}
              />

              {errors.id && (
                <p className="mt-1.5 text-xs text-rose-500">{errors.id}</p>
              )}
            </div>

            <div>
              <label
                htmlFor="date-in"
                className="mb-2 block text-sm font-medium text-(--foreground)">
                Date In
                <span className="ml-1 text-rose-500">*</span>
              </label>

              <input
                id="date-in"
                type="date"
                value={form.dateIn}
                onChange={(event) => updateField("dateIn", event.target.value)}
                className={errors.dateIn ? errorInputClass : inputClass}
              />

              {errors.dateIn && (
                <p className="mt-1.5 text-xs text-rose-500">{errors.dateIn}</p>
              )}
            </div>

            <div>
              <label
                htmlFor="number-of-pigs"
                className="mb-2 block text-sm font-medium text-(--foreground)">
                Number of Pigs
                <span className="ml-1 text-rose-500">*</span>
              </label>

              <input
                id="number-of-pigs"
                type="number"
                min="1"
                step="1"
                value={headsInput}
                onChange={(event) => {
                  setHeadsInput(event.target.value);

                  setErrors((current) => ({
                    ...current,
                    heads: undefined,
                  }));
                }}
                placeholder="Example: 50"
                className={errors.heads ? errorInputClass : inputClass}
              />

              {errors.heads && (
                <p className="mt-1.5 text-xs text-rose-500">{errors.heads}</p>
              )}
            </div>

            <div>
              <label
                htmlFor="breed"
                className="mb-2 block text-sm font-medium text-(--foreground)">
                Breed
                <span className="ml-1 text-rose-500">*</span>
              </label>

              <select
                id="breed"
                value={form.breed}
                onChange={(event) => updateField("breed", event.target.value)}
                className={errors.breed ? errorInputClass : inputClass}>
                <option value="">Select breed</option>

                {breeds.map((breed) => (
                  <option key={breed} value={breed}>
                    {breed}
                  </option>
                ))}
              </select>

              {errors.breed && (
                <p className="mt-1.5 text-xs text-rose-500">{errors.breed}</p>
              )}
            </div>

            <div className="sm:col-span-2">
              <label
                htmlFor="batch-status"
                className="mb-2 block text-sm font-medium text-(--foreground)">
                Status
              </label>

              <select
                id="batch-status"
                value={form.status}
                onChange={(event) =>
                  updateField("status", event.target.value as BatchStatus)
                }
                className={inputClass}>
                {statuses.map((status) => (
                  <option key={status} value={status}>
                    {status}
                  </option>
                ))}
              </select>
            </div>

            <div className="sm:col-span-2">
              <div className="mb-2 flex items-center justify-between">
                <label
                  htmlFor="remarks"
                  className="block text-sm font-medium text-(--foreground)">
                  Remarks
                </label>

                <span className="text-xs text-(--subtle)">Optional</span>
              </div>

              <textarea
                id="remarks"
                rows={4}
                maxLength={250}
                value={form.remarks}
                onChange={(event) => updateField("remarks", event.target.value)}
                placeholder="Enter optional notes about this batch..."
                className={`${inputClass} resize-none`}
              />

              <p className="mt-1 text-right text-xs text-(--subtle)">
                {form.remarks.length}/250
              </p>
            </div>
          </div>

          <div className="sticky bottom-0 flex flex-col-reverse gap-3 border-t border-(--border) bg-(--panel) px-5 py-4 sm:flex-row sm:justify-end sm:px-6">
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl border border-(--border) bg-(--panel-soft) px-5 py-3 text-sm font-semibold text-(--muted) transition hover:text-(--foreground)">
              Cancel
            </button>

            <button
              type="submit"
              className="rounded-xl bg-emerald-600 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-emerald-950/20 transition hover:bg-emerald-500">
              {isEditing ? "Save Changes" : "Save Batch"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
