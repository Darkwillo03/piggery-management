"use client";

import { useMemo, useState } from "react";
import DashboardIcon from "../components/DashboardIcon";
import FeedModal from "../components/FeedModal";
import FeedTable, { type FeedItem } from "../components/FeedTable";
import SearchBar from "../components/SearchBar";
import Sidebar from "../components/sidebar";
import ThemeToggle from "../components/ThemeToggle";
import Toast from "../components/Toast";

const initialFeeds: FeedItem[] = [
  {
    id: "FEED-001",
    name: "Premium Hog Starter",
    category: "Starter",
    quantity: 40,
    unit: "Bag",
    supplier: "San Miguel Feeds",
    purchaseDate: "2026-07-01",
  },
  {
    id: "FEED-002",
    name: "Hog Grower Pellets",
    category: "Grower",
    quantity: 65,
    unit: "Bag",
    supplier: "B-Meg",
    purchaseDate: "2026-07-05",
  },
  {
    id: "FEED-003",
    name: "Lactating Sow Feed",
    category: "Lactating",
    quantity: 25,
    unit: "Bag",
    supplier: "Pilmico",
    purchaseDate: "2026-07-08",
  },
];

type ToastState = {
  message: string;
  type: "success" | "error";
} | null;

export default function FeedsPage() {
  const [feeds, setFeeds] = useState<FeedItem[]>(initialFeeds);

  const [search, setSearch] = useState("");
  const [openModal, setOpenModal] = useState(false);

  const [editingFeed, setEditingFeed] = useState<FeedItem | null>(null);

  const [toast, setToast] = useState<ToastState>(null);

  const filteredFeeds = useMemo(() => {
    const query = search.trim().toLowerCase();

    if (!query) {
      return feeds;
    }

    return feeds.filter((feed) => {
      return (
        feed.name.toLowerCase().includes(query) ||
        feed.category.toLowerCase().includes(query) ||
        feed.supplier.toLowerCase().includes(query) ||
        feed.unit.toLowerCase().includes(query)
      );
    });
  }, [feeds, search]);

  const totalQuantity = feeds.reduce((total, feed) => total + feed.quantity, 0);

  const totalCategories = new Set(feeds.map((feed) => feed.category)).size;

  const totalSuppliers = new Set(
    feeds.map((feed) => feed.supplier.trim()).filter(Boolean),
  ).size;

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
    setEditingFeed(null);
    setOpenModal(true);
  }

  function openEditModal(feed: FeedItem) {
    setEditingFeed(feed);
    setOpenModal(true);
  }

  function closeModal() {
    setOpenModal(false);
    setEditingFeed(null);
  }

  function handleSave(feed: FeedItem) {
    if (editingFeed) {
      setFeeds((currentFeeds) =>
        currentFeeds.map((currentFeed) =>
          currentFeed.id === editingFeed.id ? feed : currentFeed,
        ),
      );

      showToast(`${feed.name} was updated successfully.`);
    } else {
      setFeeds((currentFeeds) => [feed, ...currentFeeds]);

      showToast(`${feed.name} was added successfully.`);
    }

    closeModal();
  }

  function handleDelete(feed: FeedItem) {
    const confirmed = window.confirm(
      `Delete "${feed.name}"?\n\nThis action cannot be undone.`,
    );

    if (!confirmed) {
      return;
    }

    setFeeds((currentFeeds) =>
      currentFeeds.filter((currentFeed) => currentFeed.id !== feed.id),
    );

    showToast(`${feed.name} was deleted successfully.`);
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
                Feeds Management
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
                Inventory Records
              </p>

              <h2 className="mt-2 text-3xl font-bold tracking-tight text-[var(--foreground)]">
                Feed Inventory
              </h2>

              <p className="mt-2 max-w-3xl text-sm leading-6 text-[var(--muted)]">
                Monitor your available feed stock, categories, suppliers,
                purchase dates, and quantities.
              </p>
            </div>

            <button
              type="button"
              onClick={openAddModal}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-600 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-emerald-950/20 transition hover:bg-emerald-500">
              <span className="text-lg leading-none">+</span>
              Add Feed
            </button>
          </div>

          <div className="mt-7 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <div className="rounded-2xl border border-[var(--border)] bg-[var(--panel)] p-5 shadow-[var(--shadow)]">
              <p className="text-sm text-[var(--muted)]">Feed Items</p>

              <p className="mt-2 text-3xl font-bold text-[var(--foreground)]">
                {feeds.length}
              </p>

              <p className="mt-2 text-xs text-[var(--subtle)]">
                Recorded inventory items
              </p>
            </div>

            <div className="rounded-2xl border border-[var(--border)] bg-[var(--panel)] p-5 shadow-[var(--shadow)]">
              <p className="text-sm text-[var(--muted)]">Total Quantity</p>

              <p className="mt-2 text-3xl font-bold text-emerald-600 dark:text-emerald-400">
                {totalQuantity}
              </p>

              <p className="mt-2 text-xs text-[var(--subtle)]">
                Across all units
              </p>
            </div>

            <div className="rounded-2xl border border-[var(--border)] bg-[var(--panel)] p-5 shadow-[var(--shadow)]">
              <p className="text-sm text-[var(--muted)]">Categories</p>

              <p className="mt-2 text-3xl font-bold text-sky-600 dark:text-sky-400">
                {totalCategories}
              </p>

              <p className="mt-2 text-xs text-[var(--subtle)]">
                Unique feed categories
              </p>
            </div>

            <div className="rounded-2xl border border-[var(--border)] bg-[var(--panel)] p-5 shadow-[var(--shadow)]">
              <p className="text-sm text-[var(--muted)]">Suppliers</p>

              <p className="mt-2 text-3xl font-bold text-amber-600 dark:text-amber-400">
                {totalSuppliers}
              </p>

              <p className="mt-2 text-xs text-[var(--subtle)]">
                Active feed suppliers
              </p>
            </div>
          </div>

          <div className="mt-7 rounded-2xl border border-[var(--border)] bg-[var(--panel)] p-4 shadow-[var(--shadow)] sm:p-5">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              <div className="w-full lg:max-w-md">
                <SearchBar value={search} onChange={setSearch} />
              </div>

              <p className="text-xs text-[var(--subtle)]">
                Search by feed name, category, supplier, or unit
              </p>
            </div>
          </div>

          <FeedTable
            feeds={filteredFeeds}
            onEdit={openEditModal}
            onDelete={handleDelete}
          />
        </section>
      </div>

      <FeedModal
        open={openModal}
        onClose={closeModal}
        onSave={handleSave}
        editingFeed={editingFeed}
      />

      {toast && <Toast message={toast.message} type={toast.type} />}
    </main>
  );
}
