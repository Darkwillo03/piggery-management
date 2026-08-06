"use client";

import { useEffect, useMemo, useState } from "react";
import type { Sale } from "./SalesTable";

interface SalesModalProps {
  open: boolean;
  onClose: () => void;
  onSave: (sale: Sale) => void;
  editingSale: Sale | null;
  existingSaleIds: string[];
}

type FormErrors = {
  id?: string;
  batch?: string;
  buyer?: string;
  quantitySold?: string;
  sellingPrice?: string;
  date?: string;
};

const initialForm: Sale = {
  id: "",
  batch: "",
  buyer: "",
  quantitySold: 0,
  sellingPrice: 0,
  totalAmount: 0,
  date: "",
};

export default function SalesModal({
  open,
  onClose,
  onSave,
  editingSale,
  existingSaleIds,
}: SalesModalProps) {
  const [form, setForm] = useState<Sale>(initialForm);
  const [quantityInput, setQuantityInput] = useState("");
  const [priceInput, setPriceInput] = useState("");
  const [errors, setErrors] = useState<FormErrors>({});

  const isEditing = editingSale !== null;

  const totalAmount = useMemo(() => {
    const quantity = Number(quantityInput);
    const price = Number(priceInput);

    if (
      !Number.isFinite(quantity) ||
      !Number.isFinite(price) ||
      quantity <= 0 ||
      price <= 0
    ) {
      return 0;
    }

    return quantity * price;
  }, [quantityInput, priceInput]);

  useEffect(() => {
    if (!open) {
      return;
    }

    if (editingSale) {
      setForm(editingSale);
      setQuantityInput(String(editingSale.quantitySold));
      setPriceInput(String(editingSale.sellingPrice));
    } else {
      setForm(initialForm);
      setQuantityInput("");
      setPriceInput("");
    }

    setErrors({});
  }, [open, editingSale]);

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

  function updateField<K extends keyof Sale>(field: K, value: Sale[K]) {
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
    const originalId = editingSale?.id.toUpperCase();
    const quantity = Number(quantityInput);
    const sellingPrice = Number(priceInput);

    if (!cleanedId) {
      nextErrors.id = "Sale ID is required.";
    } else if (
      existingSaleIds.some(
        (id) =>
          id.toUpperCase() === cleanedId && id.toUpperCase() !== originalId,
      )
    ) {
      nextErrors.id = "This Sale ID already exists.";
    }

    if (!form.batch.trim()) {
      nextErrors.batch = "Batch is required.";
    }

    if (!form.buyer.trim()) {
      nextErrors.buyer = "Buyer is required.";
    }

    if (!quantityInput.trim()) {
      nextErrors.quantitySold = "Quantity sold is required.";
    } else if (!Number.isInteger(quantity) || quantity <= 0) {
      nextErrors.quantitySold = "Enter a whole number greater than zero.";
    }

    if (!priceInput.trim()) {
      nextErrors.sellingPrice = "Selling price is required.";
    } else if (!Number.isFinite(sellingPrice) || sellingPrice <= 0) {
      nextErrors.sellingPrice = "Enter a valid price greater than zero.";
    }

    if (!form.date) {
      nextErrors.date = "Sale date is required.";
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
      batch: form.batch.trim().toUpperCase(),
      buyer: form.buyer.trim(),
      quantitySold: Number(quantityInput),
      sellingPrice: Number(priceInput),
      totalAmount,
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
      <div className="max-h-[92vh] w-full max-w-2xl overflow-y-auto rounded-2xl border border-[var(--border)] bg-[var(--panel)] shadow-[var(--shadow)]">
        <div className="sticky top-0 z-10 flex items-start justify-between border-b border-[var(--border)] bg-[var(--panel)] px-5 py-5 sm:px-6">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-emerald-600 dark:text-emerald-400">
              Sales Management
            </p>

            <h2 className="mt-1 text-xl font-bold text-[var(--foreground)] sm:text-2xl">
              {isEditing ? "Edit Sale" : "Record Sale"}
            </h2>

            <p className="mt-1 text-sm text-[var(--muted)]">
              {isEditing
                ? "Update the information for this sale."
                : "Enter the details of the sale transaction."}
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
            <div>
              <label
                htmlFor="sale-id"
                className="mb-2 block text-sm font-medium text-[var(--foreground)]">
                Sale ID
                <span className="ml-1 text-rose-500">*</span>
              </label>

              <input
                id="sale-id"
                type="text"
                value={form.id}
                onChange={(event) => updateField("id", event.target.value)}
                placeholder="Example: S001"
                className={errors.id ? errorInputClass : inputClass}
              />

              {errors.id && (
                <p className="mt-1.5 text-xs text-rose-500">{errors.id}</p>
              )}
            </div>

            <div>
              <label
                htmlFor="sale-date"
                className="mb-2 block text-sm font-medium text-[var(--foreground)]">
                Sale Date
                <span className="ml-1 text-rose-500">*</span>
              </label>

              <input
                id="sale-date"
                type="date"
                value={form.date}
                onChange={(event) => updateField("date", event.target.value)}
                className={errors.date ? errorInputClass : inputClass}
              />

              {errors.date && (
                <p className="mt-1.5 text-xs text-rose-500">{errors.date}</p>
              )}
            </div>

            <div>
              <label
                htmlFor="sale-batch"
                className="mb-2 block text-sm font-medium text-[var(--foreground)]">
                Batch
                <span className="ml-1 text-rose-500">*</span>
              </label>

              <input
                id="sale-batch"
                type="text"
                value={form.batch}
                onChange={(event) => updateField("batch", event.target.value)}
                placeholder="Example: F001"
                className={errors.batch ? errorInputClass : inputClass}
              />

              {errors.batch && (
                <p className="mt-1.5 text-xs text-rose-500">{errors.batch}</p>
              )}
            </div>

            <div>
              <label
                htmlFor="buyer"
                className="mb-2 block text-sm font-medium text-[var(--foreground)]">
                Buyer
                <span className="ml-1 text-rose-500">*</span>
              </label>

              <input
                id="buyer"
                type="text"
                value={form.buyer}
                onChange={(event) => updateField("buyer", event.target.value)}
                placeholder="Buyer name"
                className={errors.buyer ? errorInputClass : inputClass}
              />

              {errors.buyer && (
                <p className="mt-1.5 text-xs text-rose-500">{errors.buyer}</p>
              )}
            </div>

            <div>
              <label
                htmlFor="quantity-sold"
                className="mb-2 block text-sm font-medium text-[var(--foreground)]">
                Quantity Sold
                <span className="ml-1 text-rose-500">*</span>
              </label>

              <input
                id="quantity-sold"
                type="number"
                min="1"
                step="1"
                value={quantityInput}
                onChange={(event) => {
                  setQuantityInput(event.target.value);

                  setErrors((current) => ({
                    ...current,
                    quantitySold: undefined,
                  }));
                }}
                placeholder="Example: 10"
                className={errors.quantitySold ? errorInputClass : inputClass}
              />

              {errors.quantitySold && (
                <p className="mt-1.5 text-xs text-rose-500">
                  {errors.quantitySold}
                </p>
              )}
            </div>

            <div>
              <label
                htmlFor="selling-price"
                className="mb-2 block text-sm font-medium text-[var(--foreground)]">
                Selling Price per Pig
                <span className="ml-1 text-rose-500">*</span>
              </label>

              <input
                id="selling-price"
                type="number"
                min="0.01"
                step="0.01"
                value={priceInput}
                onChange={(event) => {
                  setPriceInput(event.target.value);

                  setErrors((current) => ({
                    ...current,
                    sellingPrice: undefined,
                  }));
                }}
                placeholder="Example: 6500"
                className={errors.sellingPrice ? errorInputClass : inputClass}
              />

              {errors.sellingPrice && (
                <p className="mt-1.5 text-xs text-rose-500">
                  {errors.sellingPrice}
                </p>
              )}
            </div>

            <div className="sm:col-span-2">
              <label className="mb-2 block text-sm font-medium text-[var(--foreground)]">
                Total Amount
              </label>

              <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/10 px-4 py-4">
                <p className="text-xs font-semibold uppercase tracking-[0.15em] text-emerald-700 dark:text-emerald-300">
                  Automatically computed
                </p>

                <p className="mt-1 text-2xl font-bold text-emerald-700 dark:text-emerald-300">
                  {new Intl.NumberFormat("en-PH", {
                    style: "currency",
                    currency: "PHP",
                    minimumFractionDigits: 2,
                  }).format(totalAmount)}
                </p>

                <p className="mt-1 text-xs text-[var(--muted)]">
                  Quantity sold × selling price
                </p>
              </div>
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
              {isEditing ? "Save Changes" : "Save Sale"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
