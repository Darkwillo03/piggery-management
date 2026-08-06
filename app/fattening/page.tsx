"use client";

import { useMemo, useState } from "react";
import BatchModal from "../components/BatchModal";
import BatchTable, { type Batch } from "../components/BatchTable";
import DashboardIcon from "../components/DashboardIcon";
import DeleteBatchModal from "../components/DeleteBatchModal";
import SearchBar from "../components/SearchBar";
import Sidebar from "../components/sidebar";
import ThemeToggle from "../components/ThemeToggle";
import Toast from "../components/Toast";

const initialBatches: Batch[] = [
  {
    id: "F001",
    dateIn: "2026-07-01",
    heads: 50,
    breed: "Landrace",
    status: "Active",
    remarks: "Healthy batch from local supplier.",
  },
  {
    id: "F002",
    dateIn: "2026-07-05",
    heads: 40,
    breed: "Duroc",
    status: "Active",
    remarks: "Scheduled for regular health monitoring.",
  },
  {
    id: "F003",
    dateIn: "2026-06-10",
    heads: 35,
    breed: "Crossbreed",
    status: "Sold",
    remarks: "Batch completed and sold.",
  },
];

type ToastState = {
  message: string;
  type: "success" | "error";
} | null;

export default function FatteningPage() {
  const [batches, setBatches] = useState<Batch[]>(initialBatches);

  const [search, setSearch] = useState("");
  const [openModal, setOpenModal] = useState(false);

  const [editingBatch, setEditingBatch] = useState<Batch | null>(null);

  const [batchToDelete, setBatchToDelete] = useState<Batch | null>(null);

  const [toast, setToast] = useState<ToastState>(null);

  const filteredBatches = useMemo(() => {
    const query = search.trim().toLowerCase();

    if (!query) {
      return batches;
    }

    return batches.filter((batch) => {
      return (
        batch.id.toLowerCase().includes(query) ||
        batch.breed.toLowerCase().includes(query) ||
        batch.status.toLowerCase().includes(query) ||
        batch.remarks.toLowerCase().includes(query)
      );
    });
  }, [batches, search]);

  const totalPigs = batches.reduce((total, batch) => total + batch.heads, 0);

  const activeBatches = batches.filter(
    (batch) => batch.status === "Active",
  ).length;

  const soldBatches = batches.filter((batch) => batch.status === "Sold").length;

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
    setEditingBatch(null);
    setOpenModal(true);
  }

  function openEditModal(batch: Batch) {
    setEditingBatch(batch);
    setOpenModal(true);
  }

  function closeModal() {
    setOpenModal(false);
    setEditingBatch(null);
  }

  function handleSave(batch: Batch) {
    if (editingBatch) {
      setBatches((currentBatches) =>
        currentBatches.map((currentBatch) =>
          currentBatch.id === editingBatch.id ? batch : currentBatch,
        ),
      );

      showToast(`Batch ${batch.id} was updated successfully.`);
    } else {
      setBatches((currentBatches) => [batch, ...currentBatches]);

      showToast(`Batch ${batch.id} was added successfully.`);
    }

    closeModal();
  }

  function openDeleteModal(batch: Batch) {
    setBatchToDelete(batch);
  }

  function closeDeleteModal() {
    setBatchToDelete(null);
  }

  function confirmDelete() {
    if (!batchToDelete) {
      return;
    }

    const deletedBatchId = batchToDelete.id;

    setBatches((currentBatches) =>
      currentBatches.filter((batch) => batch.id !== deletedBatchId),
    );

    setBatchToDelete(null);

    showToast(`Batch ${deletedBatchId} was deleted successfully.`);
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
                Fattening Management
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
                Batch Records
              </p>

              <h2 className="mt-2 text-3xl font-bold tracking-tight text-[var(--foreground)]">
                Fattening Batches
              </h2>

              <p className="mt-2 max-w-2xl text-sm leading-6 text-[var(--muted)]">
                Manage batches of pigs intended for fattening, including their
                population, breed, status, and remarks.
              </p>
            </div>

            <button
              type="button"
              onClick={openAddModal}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-600 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-emerald-950/20 transition hover:bg-emerald-500">
              <span className="text-lg leading-none">+</span>
              Add Batch
            </button>
          </div>

          <div className="mt-7 grid gap-4 sm:grid-cols-3">
            <div className="rounded-2xl border border-[var(--border)] bg-[var(--panel)] p-5 shadow-[var(--shadow)]">
              <p className="text-sm text-[var(--muted)]">Total Batches</p>

              <p className="mt-2 text-3xl font-bold text-[var(--foreground)]">
                {batches.length}
              </p>

              <p className="mt-2 text-xs text-[var(--subtle)]">
                All recorded batches
              </p>
            </div>

            <div className="rounded-2xl border border-[var(--border)] bg-[var(--panel)] p-5 shadow-[var(--shadow)]">
              <p className="text-sm text-[var(--muted)]">Active Batches</p>

              <p className="mt-2 text-3xl font-bold text-emerald-600 dark:text-emerald-400">
                {activeBatches}
              </p>

              <p className="mt-2 text-xs text-[var(--subtle)]">
                Currently under fattening
              </p>
            </div>

            <div className="rounded-2xl border border-[var(--border)] bg-[var(--panel)] p-5 shadow-[var(--shadow)]">
              <p className="text-sm text-[var(--muted)]">Total Pigs</p>

              <p className="mt-2 text-3xl font-bold text-[var(--foreground)]">
                {totalPigs}
              </p>

              <p className="mt-2 text-xs text-[var(--subtle)]">
                {soldBatches} sold {soldBatches === 1 ? "batch" : "batches"}
              </p>
            </div>
          </div>

          <div className="mt-7 rounded-2xl border border-[var(--border)] bg-[var(--panel)] p-4 shadow-[var(--shadow)] sm:p-5">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              <div className="w-full lg:max-w-md">
                <SearchBar value={search} onChange={setSearch} />
              </div>

              <p className="text-xs text-[var(--subtle)]">
                Search by Batch ID, breed, status, or remarks
              </p>
            </div>
          </div>

          <BatchTable
            batches={filteredBatches}
            onEdit={openEditModal}
            onDelete={openDeleteModal}
          />
        </section>
      </div>

      <BatchModal
        open={openModal}
        onClose={closeModal}
        onSave={handleSave}
        editingBatch={editingBatch}
        existingBatchIds={batches.map((batch) => batch.id)}
      />

      <DeleteBatchModal
        batch={batchToDelete}
        onCancel={closeDeleteModal}
        onConfirm={confirmDelete}
      />

      {toast && <Toast message={toast.message} type={toast.type} />}
    </main>
  );
}
