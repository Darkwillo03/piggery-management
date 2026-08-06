"use client";

import { useMemo, useState } from "react";
import DashboardIcon from "../components/DashboardIcon";
import ExpenseModal from "../components/ExpenseModal";
import ExpenseTable, { type ExpenseItem } from "../components/ExpenseTable";
import SearchBar from "../components/SearchBar";
import Sidebar from "../components/sidebar";
import ThemeToggle from "../components/ThemeToggle";
import Toast from "../components/Toast";

const initialExpenses: ExpenseItem[] = [
  {
    id: "EXP-001",
    name: "Grower Feed Purchase",
    category: "Feeds",
    amount: 18500,
    date: "2026-07-02",
    notes: "Purchased 25 bags of grower feeds.",
  },
  {
    id: "EXP-002",
    name: "Veterinary Medicines",
    category: "Medicines",
    amount: 6200,
    date: "2026-07-05",
    notes: "Antibiotics, vitamins, and deworming supplies.",
  },
  {
    id: "EXP-003",
    name: "Farm Electricity",
    category: "Utilities",
    amount: 4800,
    date: "2026-07-08",
    notes: "Monthly electricity payment.",
  },
];

type ToastState = {
  message: string;
  type: "success" | "error";
} | null;

function formatCurrency(amount: number) {
  return new Intl.NumberFormat("en-PH", {
    style: "currency",
    currency: "PHP",
    minimumFractionDigits: 2,
  }).format(amount);
}

export default function ExpensePage() {
  const [expenses, setExpenses] = useState<ExpenseItem[]>(initialExpenses);

  const [search, setSearch] = useState("");
  const [openModal, setOpenModal] = useState(false);

  const [editingExpense, setEditingExpense] = useState<ExpenseItem | null>(
    null,
  );

  const [toast, setToast] = useState<ToastState>(null);

  const filteredExpenses = useMemo(() => {
    const query = search.trim().toLowerCase();

    if (!query) {
      return expenses;
    }

    return expenses.filter((expense) => {
      return (
        expense.name.toLowerCase().includes(query) ||
        expense.category.toLowerCase().includes(query) ||
        expense.notes.toLowerCase().includes(query) ||
        expense.date.toLowerCase().includes(query)
      );
    });
  }, [expenses, search]);

  const totalExpenses = expenses.reduce(
    (total, expense) => total + expense.amount,
    0,
  );

  const totalCategories = new Set(expenses.map((expense) => expense.category))
    .size;

  const averageExpense =
    expenses.length > 0 ? totalExpenses / expenses.length : 0;

  const largestExpense = expenses.reduce<ExpenseItem | null>(
    (largest, expense) => {
      if (!largest || expense.amount > largest.amount) {
        return expense;
      }

      return largest;
    },
    null,
  );

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
    setEditingExpense(null);
    setOpenModal(true);
  }

  function openEditModal(expense: ExpenseItem) {
    setEditingExpense(expense);
    setOpenModal(true);
  }

  function closeModal() {
    setOpenModal(false);
    setEditingExpense(null);
  }

  function handleSave(expense: ExpenseItem) {
    if (editingExpense) {
      setExpenses((currentExpenses) =>
        currentExpenses.map((currentExpense) =>
          currentExpense.id === editingExpense.id ? expense : currentExpense,
        ),
      );

      showToast(`${expense.name} was updated successfully.`);
    } else {
      setExpenses((currentExpenses) => [expense, ...currentExpenses]);

      showToast(`${expense.name} was added successfully.`);
    }

    closeModal();
  }

  function handleDelete(expense: ExpenseItem) {
    const confirmed = window.confirm(
      `Delete "${expense.name}"?\n\nThis action cannot be undone.`,
    );

    if (!confirmed) {
      return;
    }

    setExpenses((currentExpenses) =>
      currentExpenses.filter(
        (currentExpense) => currentExpense.id !== expense.id,
      ),
    );

    showToast(`${expense.name} was deleted successfully.`);
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
                Expense Management
              </h1>
            </div>

            <div className="flex items-center gap-3">
              <ThemeToggle />

              <button
                type="button"
                className="relative grid h-11 w-11 place-items-center rounded-xl border border-[var(--border)] bg-[var(--panel)] text-[var(--muted)]"
                aria-label="Notifications">
                <DashboardIcon name="bell" className="h-5 w-5" />

                <span className="absolute -right-1 -top-1 grid h-5 w-5 place-items-center rounded-full bg-emerald-500 text-[10px] font-bold text-white">
                  3
                </span>
              </button>

              <div className="hidden rounded-xl border border-[var(--border)] bg-[var(--panel)] px-4 py-2 text-right sm:block">
                <p className="text-sm font-semibold">Farm Owner</p>

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
                Financial Records
              </p>

              <h2 className="mt-2 text-3xl font-bold tracking-tight">
                Farm Expenses
              </h2>

              <p className="mt-2 max-w-3xl text-sm leading-6 text-[var(--muted)]">
                Record and monitor feed purchases, medicines, labor, utilities,
                repairs, transportation, and other operating costs.
              </p>
            </div>

            <button
              type="button"
              onClick={openAddModal}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-600 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-emerald-950/20 transition hover:bg-emerald-500">
              <span className="text-lg leading-none">+</span>
              Add Expense
            </button>
          </div>

          <div className="mt-7 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <div className="rounded-2xl border border-[var(--border)] bg-[var(--panel)] p-5 shadow-[var(--shadow)]">
              <p className="text-sm text-[var(--muted)]">Total Expenses</p>

              <p className="mt-2 text-3xl font-bold text-rose-600 dark:text-rose-400">
                {formatCurrency(totalExpenses)}
              </p>

              <p className="mt-2 text-xs text-[var(--subtle)]">
                Across all records
              </p>
            </div>

            <div className="rounded-2xl border border-[var(--border)] bg-[var(--panel)] p-5 shadow-[var(--shadow)]">
              <p className="text-sm text-[var(--muted)]">Expense Records</p>

              <p className="mt-2 text-3xl font-bold">{expenses.length}</p>

              <p className="mt-2 text-xs text-[var(--subtle)]">
                Total transactions
              </p>
            </div>

            <div className="rounded-2xl border border-[var(--border)] bg-[var(--panel)] p-5 shadow-[var(--shadow)]">
              <p className="text-sm text-[var(--muted)]">Average Expense</p>

              <p className="mt-2 text-3xl font-bold text-amber-600 dark:text-amber-400">
                {formatCurrency(averageExpense)}
              </p>

              <p className="mt-2 text-xs text-[var(--subtle)]">
                Average per transaction
              </p>
            </div>

            <div className="rounded-2xl border border-[var(--border)] bg-[var(--panel)] p-5 shadow-[var(--shadow)]">
              <p className="text-sm text-[var(--muted)]">Categories</p>

              <p className="mt-2 text-3xl font-bold text-sky-600 dark:text-sky-400">
                {totalCategories}
              </p>

              <p
                className="mt-2 truncate text-xs text-[var(--subtle)]"
                title={largestExpense?.name}>
                Largest: {largestExpense?.name ?? "No record"}
              </p>
            </div>
          </div>

          <div className="mt-7 rounded-2xl border border-[var(--border)] bg-[var(--panel)] p-4 shadow-[var(--shadow)] sm:p-5">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              <div className="w-full lg:max-w-md">
                <SearchBar value={search} onChange={setSearch} />
              </div>

              <p className="text-xs text-[var(--subtle)]">
                Search by expense name, category, date, or notes
              </p>
            </div>
          </div>

          <ExpenseTable
            expenses={filteredExpenses}
            onEdit={openEditModal}
            onDelete={handleDelete}
          />
        </section>
      </div>

      <ExpenseModal
        open={openModal}
        onClose={closeModal}
        onSave={handleSave}
        editingExpense={editingExpense}
      />

      {toast && <Toast message={toast.message} type={toast.type} />}
    </main>
  );
}
