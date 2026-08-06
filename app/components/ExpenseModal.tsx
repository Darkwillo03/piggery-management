"use client";

import { useEffect, useState } from "react";

export type ExpenseItem = {
  id: string;
  name: string;
  category: string;
  amount: number;
  date: string;
  notes: string;
};

interface ExpenseModalProps {
  open: boolean;
  onClose: () => void;
  onSave: (expense: ExpenseItem) => void;
  editingExpense: ExpenseItem | null;
}

type FormErrors = {
  name?: string;
  category?: string;
  amount?: string;
  date?: string;
};

const initialForm: ExpenseItem = {
  id: "",
  name: "",
  category: "",
  amount: 0,
  date: "",
  notes: "",
};

const categories = [
  "Feeds",
  "Medicines",
  "Labor",
  "Utilities",
  "Transportation",
  "Repairs",
  "Equipment",
  "Breeding",
  "Others",
];

function generateId() {
  return `EXP-${Date.now()}`;
}

export default function ExpenseModal({
  open,
  onClose,
  onSave,
  editingExpense,
}: ExpenseModalProps) {
  const [form, setForm] = useState<ExpenseItem>(initialForm);

  const [amountInput, setAmountInput] = useState("");

  const [errors, setErrors] = useState<FormErrors>({});

  const isEditing = editingExpense !== null;

  useEffect(() => {
    if (!open) {
      return;
    }

    if (editingExpense) {
      setForm(editingExpense);
      setAmountInput(String(editingExpense.amount));
    } else {
      setForm({
        ...initialForm,
        id: generateId(),
      });

      setAmountInput("");
    }

    setErrors({});
  }, [open, editingExpense]);

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

  function updateField<K extends keyof ExpenseItem>(
    field: K,
    value: ExpenseItem[K],
  ) {
    setForm((current) => ({
      ...current,
      [field]: value,
    }));

    if (field === "name" || field === "category" || field === "date") {
      setErrors((current) => ({
        ...current,
        [field]: undefined,
      }));
    }
  }

  function validateForm() {
    const nextErrors: FormErrors = {};
    const amount = Number(amountInput);

    if (!form.name.trim()) {
      nextErrors.name = "Expense name is required.";
    }

    if (!form.category.trim()) {
      nextErrors.category = "Category is required.";
    }

    if (!amountInput.trim()) {
      nextErrors.amount = "Amount is required.";
    } else if (Number.isNaN(amount) || amount <= 0) {
      nextErrors.amount = "Enter an amount greater than zero.";
    }

    if (!form.date) {
      nextErrors.date = "Expense date is required.";
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
      name: form.name.trim(),
      category: form.category.trim(),
      amount: Number(amountInput),
      notes: form.notes.trim(),
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
      <div className="max-h-[92vh] w-full max-w-2xl overflow-y-auto rounded-2xl border border-[var(--border)] bg-[var(--panel)] shadow-[var(--shadow)]">
        <div className="sticky top-0 z-10 flex items-start justify-between border-b border-[var(--border)] bg-[var(--panel)] px-5 py-5 sm:px-6">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-emerald-600 dark:text-emerald-400">
              Expense Management
            </p>

            <h2 className="mt-1 text-xl font-bold text-[var(--foreground)] sm:text-2xl">
              {isEditing ? "Edit Expense" : "Add Expense"}
            </h2>

            <p className="mt-1 text-sm text-[var(--muted)]">
              Record farm costs and operating expenses.
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
          <div className="grid gap-5 p-5 sm:grid-cols-2 sm:p-6">
            <div className="sm:col-span-2">
              <label
                htmlFor="expense-name"
                className="mb-2 block text-sm font-medium text-[var(--foreground)]">
                Expense Name
                <span className="ml-1 text-rose-500">*</span>
              </label>

              <input
                id="expense-name"
                type="text"
                value={form.name}
                onChange={(event) => updateField("name", event.target.value)}
                placeholder="Example: Grower feed purchase"
                className={errors.name ? errorInputClass : inputClass}
              />

              {errors.name && (
                <p className="mt-1.5 text-xs text-rose-500">{errors.name}</p>
              )}
            </div>

            <div>
              <label
                htmlFor="expense-category"
                className="mb-2 block text-sm font-medium text-[var(--foreground)]">
                Category
                <span className="ml-1 text-rose-500">*</span>
              </label>

              <select
                id="expense-category"
                value={form.category}
                onChange={(event) =>
                  updateField("category", event.target.value)
                }
                className={errors.category ? errorInputClass : inputClass}>
                <option value="">Select category</option>

                {categories.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>

              {errors.category && (
                <p className="mt-1.5 text-xs text-rose-500">
                  {errors.category}
                </p>
              )}
            </div>

            <div>
              <label
                htmlFor="expense-amount"
                className="mb-2 block text-sm font-medium text-[var(--foreground)]">
                Amount
                <span className="ml-1 text-rose-500">*</span>
              </label>

              <div className="relative">
                <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-sm text-[var(--muted)]">
                  ₱
                </span>

                <input
                  id="expense-amount"
                  type="number"
                  min="0.01"
                  step="0.01"
                  value={amountInput}
                  onChange={(event) => {
                    setAmountInput(event.target.value);

                    setErrors((current) => ({
                      ...current,
                      amount: undefined,
                    }));
                  }}
                  placeholder="0.00"
                  className={`${
                    errors.amount ? errorInputClass : inputClass
                  } pl-9`}
                />
              </div>

              {errors.amount && (
                <p className="mt-1.5 text-xs text-rose-500">{errors.amount}</p>
              )}
            </div>

            <div className="sm:col-span-2">
              <label
                htmlFor="expense-date"
                className="mb-2 block text-sm font-medium text-[var(--foreground)]">
                Date
                <span className="ml-1 text-rose-500">*</span>
              </label>

              <input
                id="expense-date"
                type="date"
                value={form.date}
                onChange={(event) => updateField("date", event.target.value)}
                className={errors.date ? errorInputClass : inputClass}
              />

              {errors.date && (
                <p className="mt-1.5 text-xs text-rose-500">{errors.date}</p>
              )}
            </div>

            <div className="sm:col-span-2">
              <div className="mb-2 flex items-center justify-between">
                <label
                  htmlFor="expense-notes"
                  className="text-sm font-medium text-[var(--foreground)]">
                  Notes
                </label>

                <span className="text-xs text-[var(--subtle)]">Optional</span>
              </div>

              <textarea
                id="expense-notes"
                rows={4}
                maxLength={300}
                value={form.notes}
                onChange={(event) => updateField("notes", event.target.value)}
                placeholder="Add optional expense details..."
                className={`${inputClass} resize-none`}
              />

              <p className="mt-1 text-right text-xs text-[var(--subtle)]">
                {form.notes.length}/300
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
              {isEditing ? "Save Changes" : "Save Expense"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
