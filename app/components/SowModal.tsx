"use client";

import { useEffect, useState } from "react";
import type { Sow, SowStatus } from "./SowTable";

interface SowModalProps {
  open: boolean;
  onClose: () => void;
  onSave: (sow: Sow) => void;
  editingSow: Sow | null;
  existingSowIds: string[];
}

type FormErrors = {
  id?: string;
  breed?: string;
  birthDate?: string;
};

const initialForm: Sow = {
  id: "",
  photo: "",
  breed: "",
  birthDate: "",
  aiDate: "",
  expectedFarrowingDate: "",
  actualFarrowingDate: "",
  pigletsBornAlive: 0,
  pigletsBornDead: 0,
  weaningDate: "",
  status: "Open",
  remarks: "",
};

const breeds = [
  "Landrace",
  "Large White",
  "Duroc",
  "Pietrain",
  "Hampshire",
  "Crossbreed",
  "Other",
];

const statuses: SowStatus[] = [
  "Open",
  "Pregnant",
  "Lactating",
  "Weaned",
  "Culled",
];

function addDays(date: string, days: number) {
  if (!date) {
    return "";
  }

  const result = new Date(`${date}T00:00:00`);
  result.setDate(result.getDate() + days);

  return result.toISOString().split("T")[0];
}

export default function SowModal({
  open,
  onClose,
  onSave,
  editingSow,
  existingSowIds,
}: SowModalProps) {
  const [form, setForm] = useState<Sow>(initialForm);
  const [errors, setErrors] = useState<FormErrors>({});

  const isEditing = editingSow !== null;

  useEffect(() => {
    if (!open) {
      return;
    }

    setForm(editingSow ?? initialForm);
    setErrors({});
  }, [open, editingSow]);

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

  function updateField<K extends keyof Sow>(field: K, value: Sow[K]) {
    setForm((current) => ({
      ...current,
      [field]: value,
    }));

    if (field === "id" || field === "breed" || field === "birthDate") {
      setErrors((current) => ({
        ...current,
        [field]: undefined,
      }));
    }
  }

  function handleAiDateChange(aiDate: string) {
    setForm((current) => ({
      ...current,
      aiDate,
      expectedFarrowingDate: addDays(aiDate, 114),
      status: aiDate ? "Pregnant" : current.status,
    }));
  }

  function validateForm() {
    const nextErrors: FormErrors = {};
    const cleanedId = form.id.trim().toUpperCase();
    const originalId = editingSow?.id.toUpperCase();

    if (!cleanedId) {
      nextErrors.id = "Sow ID is required.";
    } else if (
      existingSowIds.some(
        (id) =>
          id.toUpperCase() === cleanedId && id.toUpperCase() !== originalId,
      )
    ) {
      nextErrors.id = "This Sow ID already exists.";
    }

    if (!form.breed.trim()) {
      nextErrors.breed = "Breed is required.";
    }

    if (!form.birthDate) {
      nextErrors.birthDate = "Birth date is required.";
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
      remarks: form.remarks.trim(),
      pigletsBornAlive: Number(form.pigletsBornAlive),
      pigletsBornDead: Number(form.pigletsBornDead),
    });
  }

  if (!open) {
    return null;
  }

  const inputClass =
    "w-full rounded-xl border border-[var(--border)] bg-[var(--panel-soft)] px-4 py-3 text-sm text-[var(--foreground)] outline-none transition placeholder:text-[var(--subtle)] focus:border-emerald-500/50";

  const errorInputClass =
    "w-full rounded-xl border border-rose-500/70 bg-[var(--panel-soft)] px-4 py-3 text-sm text-[var(--foreground)] outline-none";

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) {
          onClose();
        }
      }}>
      <div className="max-h-[94vh] w-full max-w-4xl overflow-y-auto rounded-2xl border border-[var(--border)] bg-[var(--panel)] shadow-[var(--shadow)]">
        <div className="sticky top-0 z-10 flex items-start justify-between border-b border-[var(--border)] bg-[var(--panel)] px-5 py-5 sm:px-6">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-emerald-600 dark:text-emerald-400">
              Sows Management
            </p>

            <h2 className="mt-1 text-xl font-bold text-[var(--foreground)] sm:text-2xl">
              {isEditing ? "Edit Sow Record" : "Add Sow Record"}
            </h2>

            <p className="mt-1 text-sm text-[var(--muted)]">
              Track identification, breeding, farrowing, and weaning
              information.
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="grid h-10 w-10 shrink-0 place-items-center rounded-xl border border-[var(--border)] bg-[var(--panel-soft)] text-[var(--muted)] transition hover:text-[var(--foreground)]"
            aria-label="Close modal">
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="grid gap-5 p-5 sm:grid-cols-2 lg:grid-cols-3 sm:p-6">
            <div>
              <label
                htmlFor="sow-id"
                className="mb-2 block text-sm font-medium text-[var(--foreground)]">
                Sow ID
                <span className="ml-1 text-rose-500">*</span>
              </label>

              <input
                id="sow-id"
                type="text"
                value={form.id}
                onChange={(event) => updateField("id", event.target.value)}
                placeholder="Example: SOW-001"
                className={errors.id ? errorInputClass : inputClass}
              />

              {errors.id && (
                <p className="mt-1.5 text-xs text-rose-500">{errors.id}</p>
              )}
            </div>

            <div>
              <label
                htmlFor="breed"
                className="mb-2 block text-sm font-medium text-[var(--foreground)]">
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

            <div>
              <label
                htmlFor="birth-date"
                className="mb-2 block text-sm font-medium text-[var(--foreground)]">
                Birth Date
                <span className="ml-1 text-rose-500">*</span>
              </label>

              <input
                id="birth-date"
                type="date"
                value={form.birthDate}
                onChange={(event) =>
                  updateField("birthDate", event.target.value)
                }
                className={errors.birthDate ? errorInputClass : inputClass}
              />

              {errors.birthDate && (
                <p className="mt-1.5 text-xs text-rose-500">
                  {errors.birthDate}
                </p>
              )}
            </div>

            <div className="sm:col-span-2 lg:col-span-3">
              <label
                htmlFor="photo-url"
                className="mb-2 block text-sm font-medium text-[var(--foreground)]">
                Sow Photo URL
              </label>

              <input
                id="photo-url"
                type="url"
                value={form.photo}
                onChange={(event) => updateField("photo", event.target.value)}
                placeholder="Optional image URL"
                className={inputClass}
              />
            </div>

            <div>
              <label
                htmlFor="ai-date"
                className="mb-2 block text-sm font-medium text-[var(--foreground)]">
                AI Date
              </label>

              <input
                id="ai-date"
                type="date"
                value={form.aiDate}
                onChange={(event) => handleAiDateChange(event.target.value)}
                className={inputClass}
              />
            </div>

            <div>
              <label
                htmlFor="expected-farrowing"
                className="mb-2 block text-sm font-medium text-[var(--foreground)]">
                Expected Farrowing
              </label>

              <input
                id="expected-farrowing"
                type="date"
                value={form.expectedFarrowingDate}
                readOnly
                className={`${inputClass} cursor-not-allowed opacity-75`}
              />

              <p className="mt-1.5 text-xs text-[var(--subtle)]">
                Automatically calculated as AI Date + 114 days.
              </p>
            </div>

            <div>
              <label
                htmlFor="actual-farrowing"
                className="mb-2 block text-sm font-medium text-[var(--foreground)]">
                Actual Farrowing
              </label>

              <input
                id="actual-farrowing"
                type="date"
                value={form.actualFarrowingDate}
                onChange={(event) => {
                  const actualFarrowingDate = event.target.value;

                  setForm((current) => ({
                    ...current,
                    actualFarrowingDate,
                    weaningDate: addDays(actualFarrowingDate, 30),
                    status: actualFarrowingDate ? "Lactating" : current.status,
                  }));
                }}
                className={inputClass}
              />
            </div>
            <div>
              <label
                htmlFor="born-alive"
                className="mb-2 block text-sm font-medium text-[var(--foreground)]">
                Piglets Born Alive
              </label>

              <input
                id="born-alive"
                type="number"
                min="0"
                step="1"
                value={form.pigletsBornAlive}
                onChange={(event) =>
                  updateField("pigletsBornAlive", Number(event.target.value))
                }
                className={inputClass}
              />
            </div>

            <div>
              <label
                htmlFor="born-dead"
                className="mb-2 block text-sm font-medium text-[var(--foreground)]">
                Piglets Born Dead
              </label>

              <input
                id="born-dead"
                type="number"
                min="0"
                step="1"
                value={form.pigletsBornDead}
                onChange={(event) =>
                  updateField("pigletsBornDead", Number(event.target.value))
                }
                className={inputClass}
              />
            </div>

            <div>
              <label
                htmlFor="weaning-date"
                className="mb-2 block text-sm font-medium text-[var(--foreground)]">
                Expected Weaning Date
              </label>

              <input
                id="weaning-date"
                type="date"
                value={form.weaningDate}
                readOnly
                className={`${inputClass} cursor-not-allowed opacity-75`}
              />

              <p className="mt-1.5 text-xs text-[var(--subtle)]">
                Automatically calculated as Actual Farrowing Date + 30 days.
              </p>
            </div>

            <div>
              <label
                htmlFor="sow-status"
                className="mb-2 block text-sm font-medium text-[var(--foreground)]">
                Current Status
              </label>

              <select
                id="sow-status"
                value={form.status}
                onChange={(event) =>
                  updateField("status", event.target.value as SowStatus)
                }
                className={inputClass}>
                {statuses.map((status) => (
                  <option key={status} value={status}>
                    {status}
                  </option>
                ))}
              </select>
            </div>

            <div className="sm:col-span-2 lg:col-span-3">
              <div className="mb-2 flex items-center justify-between">
                <label
                  htmlFor="sow-remarks"
                  className="text-sm font-medium text-[var(--foreground)]">
                  Remarks
                </label>

                <span className="text-xs text-[var(--subtle)]">Optional</span>
              </div>

              <textarea
                id="sow-remarks"
                rows={4}
                maxLength={300}
                value={form.remarks}
                onChange={(event) => updateField("remarks", event.target.value)}
                placeholder="Enter health, breeding, or management notes..."
                className={`${inputClass} resize-none`}
              />

              <p className="mt-1 text-right text-xs text-[var(--subtle)]">
                {form.remarks.length}/300
              </p>
            </div>
          </div>

          <div className="sticky bottom-0 flex flex-col-reverse gap-3 border-t border-[var(--border)] bg-[var(--panel)] px-5 py-4 sm:flex-row sm:justify-end sm:px-6">
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl border border-[var(--border)] bg-[var(--panel-soft)] px-5 py-3 text-sm font-semibold text-[var(--muted)] transition hover:text-[var(--foreground)]">
              Cancel
            </button>

            <button
              type="submit"
              className="rounded-xl bg-emerald-600 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-emerald-950/20 transition hover:bg-emerald-500">
              {isEditing ? "Save Changes" : "Save Sow"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
