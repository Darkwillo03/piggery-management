"use client";

import { useMemo, useState } from "react";
import DashboardIcon from "../components/DashboardIcon";
import SalesModal from "../components/SalesModal";
import SalesTable, { type Sale } from "../components/SalesTable";
import SearchBar from "../components/SearchBar";
import Sidebar from "../components/sidebar";
import ThemeToggle from "../components/ThemeToggle";
import Toast from "../components/Toast";

const initialSales: Sale[] = [
  {
    id: "S001",
    batch: "F001",
    buyer: "Juan Dela Cruz",
    quantitySold: 10,
    sellingPrice: 6500,
    totalAmount: 65000,
    date: "2026-07-10",
  },
  {
    id: "S002",
    batch: "F002",
    buyer: "Pedro Santos",
    quantitySold: 8,
    sellingPrice: 6800,
    totalAmount: 54400,
    date: "2026-07-12",
  },
];

type ToastState = {
  message: string;
  type: "success" | "error";
} | null;

export default function SalesPage() {
  const [sales, setSales] = useState<Sale[]>(initialSales);

  const [search, setSearch] = useState("");
  const [openModal, setOpenModal] = useState(false);

  const [editingSale, setEditingSale] = useState<Sale | null>(null);

  const [toast, setToast] = useState<ToastState>(null);

  const filteredSales = useMemo(() => {
    const query = search.trim().toLowerCase();

    if (!query) {
      return sales;
    }

    return sales.filter((sale) => {
      return (
        sale.id.toLowerCase().includes(query) ||
        sale.batch.toLowerCase().includes(query) ||
        sale.buyer.toLowerCase().includes(query) ||
        sale.date.toLowerCase().includes(query)
      );
    });
  }, [sales, search]);

  const totalSalesAmount = sales.reduce(
    (total, sale) => total + sale.totalAmount,
    0,
  );

  const totalPigsSold = sales.reduce(
    (total, sale) => total + sale.quantitySold,
    0,
  );

  const averageSaleValue =
    sales.length > 0 ? totalSalesAmount / sales.length : 0;

  function formatCurrency(value: number) {
    return new Intl.NumberFormat("en-PH", {
      style: "currency",
      currency: "PHP",
      minimumFractionDigits: 2,
    }).format(value);
  }

  function showToast(message: string, type: "success" | "error" = "success") {
    setToast({
      message,
      type,
    });

    window.setTimeout(() => {
      setToast(null);
    }, 3000);
  }

  function openAddModal() {
    setEditingSale(null);
    setOpenModal(true);
  }

  function openEditModal(sale: Sale) {
    setEditingSale(sale);
    setOpenModal(true);
  }

  function closeModal() {
    setOpenModal(false);
    setEditingSale(null);
  }

  function handleSave(sale: Sale) {
    if (editingSale) {
      setSales((currentSales) =>
        currentSales.map((currentSale) =>
          currentSale.id === editingSale.id ? sale : currentSale,
        ),
      );

      showToast(`Sale ${sale.id} was updated successfully.`);
    } else {
      setSales((currentSales) => [sale, ...currentSales]);

      showToast(`Sale ${sale.id} was recorded successfully.`);
    }

    closeModal();
  }

  function handleDelete(sale: Sale) {
    const confirmed = window.confirm(
      `Delete sale "${sale.id}"?\n\nThis action cannot be undone.`,
    );

    if (!confirmed) {
      return;
    }

    setSales((currentSales) =>
      currentSales.filter((currentSale) => currentSale.id !== sale.id),
    );

    showToast(`Sale ${sale.id} was deleted successfully.`);
  }

  return (
    <main className="min-h-screen bg-[var(--background)] text-[var(--foreground)]">
      <Sidebar />

      <div className="min-h-screen lg:ml-64">
        <header className="sticky top-0 z-30 border-b border-[var(--border)] bg-[var(--background)]/90 backdrop-blur-xl">
          <div className="flex min-h-20 items-center justify-between gap-4 px-4 py-4 sm:px-7">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-emerald-600 dark:text-emerald-400">
                FarmCare
              </p>

              <h1 className="mt-1 text-xl font-bold text-[var(--foreground)]">
                Sales Management
              </h1>
            </div>

            <div className="flex items-center gap-3">
              <ThemeToggle />

              <button
                type="button"
                className="relative grid h-11 w-11 place-items-center rounded-xl border border-[var(--border)] bg-[var(--panel)] text-[var(--muted)] transition hover:border-emerald-500/30 hover:text-[var(--foreground)]"
                aria-label="Notifications">
                <DashboardIcon name="bell" className="h-5 w-5" />

                <span className="absolute -right-1 -top-1 grid h-5 w-5 place-items-center rounded-full bg-emerald-500 text-[10px] font-bold text-white">
                  3
                </span>
              </button>

              <div className="hidden rounded-xl border border-[var(--border)] bg-[var(--panel)] px-4 py-2 text-right sm:block">
                <p className="text-sm font-semibold text-[var(--foreground)]">
                  Farm Owner
                </p>

                <p className="text-xs text-[var(--muted)]">Administrator</p>
              </div>

              <div className="grid h-11 w-11 place-items-center rounded-full bg-gradient-to-br from-emerald-400 to-emerald-700 text-sm font-bold text-white">
                FO
              </div>
            </div>
          </div>
        </header>

        <section className="mx-auto max-w-[1600px] p-4 sm:p-7 lg:p-8">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-emerald-600 dark:text-emerald-400">
                Sales Records
              </p>

              <h2 className="mt-2 text-3xl font-bold tracking-tight text-[var(--foreground)]">
                Farm Sales
              </h2>

              <p className="mt-2 max-w-2xl text-sm leading-6 text-[var(--muted)]">
                Record pig sales, buyer information, quantity sold, selling
                price, and total revenue.
              </p>
            </div>

            <button
              type="button"
              onClick={openAddModal}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-600 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-emerald-950/20 transition hover:bg-emerald-500">
              <span className="text-lg leading-none">+</span>
              Record Sale
            </button>
          </div>

          <div className="mt-7 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <div className="rounded-2xl border border-[var(--border)] bg-[var(--panel)] p-5 shadow-[var(--shadow)]">
              <p className="text-sm text-[var(--muted)]">Total Transactions</p>

              <p className="mt-2 text-3xl font-bold text-[var(--foreground)]">
                {sales.length}
              </p>

              <p className="mt-2 text-xs text-[var(--subtle)]">
                Recorded sales
              </p>
            </div>

            <div className="rounded-2xl border border-[var(--border)] bg-[var(--panel)] p-5 shadow-[var(--shadow)]">
              <p className="text-sm text-[var(--muted)]">Total Pigs Sold</p>

              <p className="mt-2 text-3xl font-bold text-[var(--foreground)]">
                {totalPigsSold}
              </p>

              <p className="mt-2 text-xs text-[var(--subtle)]">
                Across all batches
              </p>
            </div>

            <div className="rounded-2xl border border-[var(--border)] bg-[var(--panel)] p-5 shadow-[var(--shadow)]">
              <p className="text-sm text-[var(--muted)]">Total Sales</p>

              <p className="mt-2 text-3xl font-bold text-emerald-600 dark:text-emerald-400">
                {formatCurrency(totalSalesAmount)}
              </p>

              <p className="mt-2 text-xs text-[var(--subtle)]">
                Gross sales revenue
              </p>
            </div>

            <div className="rounded-2xl border border-[var(--border)] bg-[var(--panel)] p-5 shadow-[var(--shadow)]">
              <p className="text-sm text-[var(--muted)]">Average Sale</p>

              <p className="mt-2 text-3xl font-bold text-[var(--foreground)]">
                {formatCurrency(averageSaleValue)}
              </p>

              <p className="mt-2 text-xs text-[var(--subtle)]">
                Per transaction
              </p>
            </div>
          </div>

          <div className="mt-7 rounded-2xl border border-[var(--border)] bg-[var(--panel)] p-4 shadow-[var(--shadow)] sm:p-5">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              <div className="w-full lg:max-w-md">
                <SearchBar value={search} onChange={setSearch} />
              </div>

              <p className="text-xs text-[var(--subtle)]">
                Search by Sale ID, batch, buyer, or date
              </p>
            </div>
          </div>

          <SalesTable
            sales={filteredSales}
            onEdit={openEditModal}
            onDelete={handleDelete}
          />
        </section>
      </div>

      <SalesModal
        open={openModal}
        onClose={closeModal}
        onSave={handleSave}
        editingSale={editingSale}
        existingSaleIds={sales.map((sale) => sale.id)}
      />

      {toast && <Toast message={toast.message} type={toast.type} />}
    </main>
  );
}
