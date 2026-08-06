"use client";

import { useMemo, useState } from "react";
import DashboardIcon from "../components/DashboardIcon";
import SearchBar from "../components/SearchBar";
import Sidebar from "../components/sidebar";
import SowModal from "../components/SowModal";
import SowTable, { type Sow } from "../components/SowTable";
import ThemeToggle from "../components/ThemeToggle";
import Toast from "../components/Toast";

const initialSows: Sow[] = [
  {
    id: "SOW-001",
    photo: "",
    breed: "Landrace",
    birthDate: "2024-01-15",
    aiDate: "2026-05-01",
    expectedFarrowingDate: "2026-08-23",
    actualFarrowingDate: "",
    pigletsBornAlive: 0,
    pigletsBornDead: 0,
    weaningDate: "",
    status: "Pregnant",
    remarks: "First pregnancy monitoring.",
  },
  {
    id: "SOW-002",
    photo: "",
    breed: "Large White",
    birthDate: "2023-11-20",
    aiDate: "2026-02-10",
    expectedFarrowingDate: "2026-06-04",
    actualFarrowingDate: "2026-06-05",
    pigletsBornAlive: 11,
    pigletsBornDead: 1,
    weaningDate: "",
    status: "Lactating",
    remarks: "Healthy litter.",
  },
  {
    id: "SOW-003",
    photo: "",
    breed: "Crossbreed",
    birthDate: "2023-08-08",
    aiDate: "2026-01-05",
    expectedFarrowingDate: "2026-04-29",
    actualFarrowingDate: "2026-04-30",
    pigletsBornAlive: 10,
    pigletsBornDead: 0,
    weaningDate: "2026-05-28",
    status: "Weaned",
    remarks: "Completed weaning successfully.",
  },
];

type ToastState = {
  message: string;
  type: "success" | "error";
} | null;

export default function SowsPage() {
  const [sows, setSows] = useState<Sow[]>(initialSows);

  const [search, setSearch] = useState("");
  const [openModal, setOpenModal] = useState(false);

  const [editingSow, setEditingSow] = useState<Sow | null>(null);

  const [toast, setToast] = useState<ToastState>(null);

  const filteredSows = useMemo(() => {
    const query = search.trim().toLowerCase();

    if (!query) {
      return sows;
    }

    return sows.filter((sow) => {
      return (
        sow.id.toLowerCase().includes(query) ||
        sow.breed.toLowerCase().includes(query) ||
        sow.status.toLowerCase().includes(query) ||
        sow.remarks.toLowerCase().includes(query)
      );
    });
  }, [search, sows]);

  const pregnantSows = sows.filter((sow) => sow.status === "Pregnant").length;

  const lactatingSows = sows.filter((sow) => sow.status === "Lactating").length;

  const totalPigletsBornAlive = sows.reduce(
    (total, sow) => total + sow.pigletsBornAlive,
    0,
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
    setEditingSow(null);
    setOpenModal(true);
  }

  function openEditModal(sow: Sow) {
    setEditingSow(sow);
    setOpenModal(true);
  }

  function closeModal() {
    setOpenModal(false);
    setEditingSow(null);
  }

  function handleSave(sow: Sow) {
    if (editingSow) {
      setSows((currentSows) =>
        currentSows.map((currentSow) =>
          currentSow.id === editingSow.id ? sow : currentSow,
        ),
      );

      showToast(`Sow ${sow.id} was updated successfully.`);
    } else {
      setSows((currentSows) => [sow, ...currentSows]);

      showToast(`Sow ${sow.id} was added successfully.`);
    }

    closeModal();
  }

  function handleDelete(sow: Sow) {
    const confirmed = window.confirm(
      `Delete sow "${sow.id}"?\n\nThis action cannot be undone.`,
    );

    if (!confirmed) {
      return;
    }

    setSows((currentSows) =>
      currentSows.filter((currentSow) => currentSow.id !== sow.id),
    );

    showToast(`Sow ${sow.id} was deleted successfully.`);
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
                Sows Management
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
                Breeding Records
              </p>

              <h2 className="mt-2 text-3xl font-bold tracking-tight text-[var(--foreground)]">
                Sow Records
              </h2>

              <p className="mt-2 max-w-3xl text-sm leading-6 text-[var(--muted)]">
                Track each sow individually, including breeding, pregnancy,
                farrowing, piglet production, and weaning records.
              </p>
            </div>

            <button
              type="button"
              onClick={openAddModal}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-600 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-emerald-950/20 transition hover:bg-emerald-500">
              <span className="text-lg leading-none">+</span>
              Add Sow
            </button>
          </div>

          <div className="mt-7 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <div className="rounded-2xl border border-[var(--border)] bg-[var(--panel)] p-5 shadow-[var(--shadow)]">
              <p className="text-sm text-[var(--muted)]">Total Sows</p>

              <p className="mt-2 text-3xl font-bold text-[var(--foreground)]">
                {sows.length}
              </p>

              <p className="mt-2 text-xs text-[var(--subtle)]">
                All registered sow records
              </p>
            </div>

            <div className="rounded-2xl border border-[var(--border)] bg-[var(--panel)] p-5 shadow-[var(--shadow)]">
              <p className="text-sm text-[var(--muted)]">Pregnant</p>

              <p className="mt-2 text-3xl font-bold text-violet-600 dark:text-violet-400">
                {pregnantSows}
              </p>

              <p className="mt-2 text-xs text-[var(--subtle)]">
                Currently expecting
              </p>
            </div>

            <div className="rounded-2xl border border-[var(--border)] bg-[var(--panel)] p-5 shadow-[var(--shadow)]">
              <p className="text-sm text-[var(--muted)]">Lactating</p>

              <p className="mt-2 text-3xl font-bold text-emerald-600 dark:text-emerald-400">
                {lactatingSows}
              </p>

              <p className="mt-2 text-xs text-[var(--subtle)]">
                Nursing current litters
              </p>
            </div>

            <div className="rounded-2xl border border-[var(--border)] bg-[var(--panel)] p-5 shadow-[var(--shadow)]">
              <p className="text-sm text-[var(--muted)]">Piglets Born Alive</p>

              <p className="mt-2 text-3xl font-bold text-sky-600 dark:text-sky-400">
                {totalPigletsBornAlive}
              </p>

              <p className="mt-2 text-xs text-[var(--subtle)]">
                Recorded across all litters
              </p>
            </div>
          </div>

          <div className="mt-7 rounded-2xl border border-[var(--border)] bg-[var(--panel)] p-4 shadow-[var(--shadow)] sm:p-5">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              <div className="w-full lg:max-w-md">
                <SearchBar value={search} onChange={setSearch} />
              </div>

              <p className="text-xs text-[var(--subtle)]">
                Search by Sow ID, breed, status, or remarks
              </p>
            </div>
          </div>

          <SowTable
            sows={filteredSows}
            onEdit={openEditModal}
            onDelete={handleDelete}
          />
        </section>
      </div>

      <SowModal
        open={openModal}
        onClose={closeModal}
        onSave={handleSave}
        editingSow={editingSow}
        existingSowIds={sows.map((sow) => sow.id)}
      />

      {toast && <Toast message={toast.message} type={toast.type} />}
    </main>
  );
}
