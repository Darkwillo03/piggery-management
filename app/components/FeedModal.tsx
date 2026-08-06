"use client";

import { useEffect, useState } from "react";
import type { FeedItem, FeedUnit } from "./FeedTable";

interface FeedModalProps {
  open: boolean;
  onClose: () => void;
  onSave: (feed: FeedItem) => void;
  editingFeed: FeedItem | null;
}

type FormErrors = {
  name?: string;
  category?: string;
  quantity?: string;
  purchaseDate?: string;
};

const initialForm: FeedItem = {
  id: "",
  name: "",
  category: "",
  quantity: 0,
  unit: "Bag",
  supplier: "",
  purchaseDate: "",
};

const categories = [
  "Pre-Starter",
  "Starter",
  "Grower",
  "Finisher",
  "Gestating",
  "Lactating",
  "Booster",
  "Other",
];

const units: FeedUnit[] = ["Bag", "Kilogram", "Sack"];

function generateId() {
  return `FEED-${Date.now()}`;
}

export default function FeedModal({
  open,
  onClose,
  onSave,
  editingFeed,
}: FeedModalProps) {
  const [form, setForm] = useState<FeedItem>(initialForm);

  const [quantityInput, setQuantityInput] = useState("");

  const [errors, setErrors] = useState<FormErrors>({});

  const isEditing = editingFeed !== null;

  useEffect(() => {
    if (!open) {
      return;
    }

    if (editingFeed) {
      setForm(editingFeed);
      setQuantityInput(String(editingFeed.quantity));
    } else {
      setForm({
        ...initialForm,
        id: generateId(),
      });

      setQuantityInput("");
    }

    setErrors({});
  }, [open, editingFeed]);

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

  function updateField<K extends keyof FeedItem>(field: K, value: FeedItem[K]) {
    setForm((current) => ({
      ...current,
      [field]: value,
    }));

    if (field === "name" || field === "category" || field === "purchaseDate") {
      setErrors((current) => ({
        ...current,
        [field]: undefined,
      }));
    }
  }

  function validateForm() {
    const nextErrors: FormErrors = {};
    const quantity = Number(quantityInput);

    if (!form.name.trim()) {
      nextErrors.name = "Feed name is required.";
    }

    if (!form.category.trim()) {
      nextErrors.category = "Category is required.";
    }

    if (!quantityInput.trim()) {
      nextErrors.quantity = "Quantity is required.";
    } else if (Number.isNaN(quantity) || quantity <= 0) {
      nextErrors.quantity = "Enter a quantity greater than zero.";
    }

    if (!form.purchaseDate) {
      nextErrors.purchaseDate = "Purchase date is required.";
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
      supplier: form.supplier.trim(),
      quantity: Number(quantityInput),
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
              Feed Inventory
            </p>

            <h2 className="mt-1 text-xl font-bold text-[var(--foreground)] sm:text-2xl">
              {isEditing ? "Edit Feed Record" : "Add Feed Record"}
            </h2>

            <p className="mt-1 text-sm text-[var(--muted)]">
              Record feed stock, supplier, quantity, and purchase date.
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
                htmlFor="feed-name"
                className="mb-2 block text-sm font-medium text-[var(--foreground)]">
                Feed Name
                <span className="ml-1 text-rose-500">*</span>
              </label>

              <input
                id="feed-name"
                type="text"
                value={form.name}
                onChange={(event) => updateField("name", event.target.value)}
                placeholder="Example: Premium Hog Grower"
                className={errors.name ? errorInputClass : inputClass}
              />

              {errors.name && (
                <p className="mt-1.5 text-xs text-rose-500">{errors.name}</p>
              )}
            </div>

            <div>
              <label
                htmlFor="feed-category"
                className="mb-2 block text-sm font-medium text-[var(--foreground)]">
                Category
                <span className="ml-1 text-rose-500">*</span>
              </label>

              <select
                id="feed-category"
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
                htmlFor="feed-unit"
                className="mb-2 block text-sm font-medium text-[var(--foreground)]">
                Unit
              </label>

              <select
                id="feed-unit"
                value={form.unit}
                onChange={(event) =>
                  updateField("unit", event.target.value as FeedUnit)
                }
                className={inputClass}>
                {units.map((unit) => (
                  <option key={unit} value={unit}>
                    {unit}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label
                htmlFor="feed-quantity"
                className="mb-2 block text-sm font-medium text-[var(--foreground)]">
                Quantity
                <span className="ml-1 text-rose-500">*</span>
              </label>

              <input
                id="feed-quantity"
                type="number"
                min="0.01"
                step="0.01"
                value={quantityInput}
                onChange={(event) => {
                  setQuantityInput(event.target.value);

                  setErrors((current) => ({
                    ...current,
                    quantity: undefined,
                  }));
                }}
                placeholder="Example: 50"
                className={errors.quantity ? errorInputClass : inputClass}
              />

              {errors.quantity && (
                <p className="mt-1.5 text-xs text-rose-500">
                  {errors.quantity}
                </p>
              )}
            </div>

            <div>
              <label
                htmlFor="purchase-date"
                className="mb-2 block text-sm font-medium text-[var(--foreground)]">
                Purchase Date
                <span className="ml-1 text-rose-500">*</span>
              </label>

              <input
                id="purchase-date"
                type="date"
                value={form.purchaseDate}
                onChange={(event) =>
                  updateField("purchaseDate", event.target.value)
                }
                className={errors.purchaseDate ? errorInputClass : inputClass}
              />

              {errors.purchaseDate && (
                <p className="mt-1.5 text-xs text-rose-500">
                  {errors.purchaseDate}
                </p>
              )}
            </div>

            <div className="sm:col-span-2">
              <label
                htmlFor="feed-supplier"
                className="mb-2 block text-sm font-medium text-[var(--foreground)]">
                Supplier
              </label>

              <input
                id="feed-supplier"
                type="text"
                value={form.supplier}
                onChange={(event) =>
                  updateField("supplier", event.target.value)
                }
                placeholder="Optional supplier name"
                className={inputClass}
              />
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
              {isEditing ? "Save Changes" : "Save Feed"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
