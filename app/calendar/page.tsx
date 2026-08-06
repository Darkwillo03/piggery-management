"use client";

import { useMemo, useState } from "react";
import DashboardIcon from "../components/DashboardIcon";
import Sidebar from "../components/sidebar";
import ThemeToggle from "../components/ThemeToggle";

type CalendarEventType =
  | "AI Due"
  | "Expected Farrowing"
  | "Weaning"
  | "Vaccination"
  | "Other";

type CalendarEvent = {
  id: string;
  title: string;
  date: string;
  type: CalendarEventType;
  notes: string;
};

const initialEvents: CalendarEvent[] = [
  {
    id: "E001",
    title: "AI Due - SOW-012",
    date: "2026-07-18",
    type: "AI Due",
    notes: "Schedule artificial insemination.",
  },
  {
    id: "E002",
    title: "Expected Farrowing - SOW-008",
    date: "2026-07-21",
    type: "Expected Farrowing",
    notes: "Prepare farrowing pen.",
  },
  {
    id: "E003",
    title: "Weaning - Litter 014",
    date: "2026-07-24",
    type: "Weaning",
    notes: "Transfer piglets to nursery area.",
  },
  {
    id: "E004",
    title: "Vaccination - Batch F002",
    date: "2026-07-28",
    type: "Vaccination",
    notes: "Routine vaccination schedule.",
  },
];

const typeStyles: Record<CalendarEventType, string> = {
  "AI Due":
    "border-violet-500/20 bg-violet-500/10 text-violet-700 dark:text-violet-300",
  "Expected Farrowing":
    "border-amber-500/20 bg-amber-500/10 text-amber-700 dark:text-amber-300",
  Weaning: "border-sky-500/20 bg-sky-500/10 text-sky-700 dark:text-sky-300",
  Vaccination:
    "border-emerald-500/20 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300",
  Other:
    "border-slate-500/20 bg-slate-500/10 text-slate-700 dark:text-slate-300",
};

const weekDays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

function toDateKey(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

function formatLongDate(date: string) {
  return new Intl.DateTimeFormat("en-PH", {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(new Date(`${date}T00:00:00`));
}

export default function CalendarPage() {
  const [currentMonth, setCurrentMonth] = useState(new Date(2026, 6, 1));

  const [events, setEvents] = useState<CalendarEvent[]>(initialEvents);

  const [selectedDate, setSelectedDate] = useState("2026-07-18");

  const [openModal, setOpenModal] = useState(false);
  const [editingEvent, setEditingEvent] = useState<CalendarEvent | null>(null);

  const [title, setTitle] = useState("");
  const [eventDate, setEventDate] = useState("");
  const [eventType, setEventType] = useState<CalendarEventType>("AI Due");
  const [notes, setNotes] = useState("");

  const monthLabel = currentMonth.toLocaleDateString("en-PH", {
    month: "long",
    year: "numeric",
  });

  const calendarDays = useMemo(() => {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();

    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);

    const days: Array<{
      date: Date;
      currentMonth: boolean;
    }> = [];

    for (let index = firstDay.getDay() - 1; index >= 0; index -= 1) {
      days.push({
        date: new Date(year, month, -index),
        currentMonth: false,
      });
    }

    for (let day = 1; day <= lastDay.getDate(); day += 1) {
      days.push({
        date: new Date(year, month, day),
        currentMonth: true,
      });
    }

    let nextMonthDay = 1;

    while (days.length < 42) {
      days.push({
        date: new Date(year, month + 1, nextMonthDay),
        currentMonth: false,
      });

      nextMonthDay += 1;
    }

    return days;
  }, [currentMonth]);

  const selectedEvents = events.filter((event) => event.date === selectedDate);

  const upcomingEvents = [...events]
    .sort(
      (first, second) =>
        new Date(first.date).getTime() - new Date(second.date).getTime(),
    )
    .slice(0, 5);

  function openAddEvent(date?: string) {
    const defaultDate = date || selectedDate || toDateKey(new Date());

    setEditingEvent(null);
    setTitle("");
    setEventDate(defaultDate);
    setEventType("AI Due");
    setNotes("");
    setOpenModal(true);
  }

  function openEditEvent(event: CalendarEvent) {
    setEditingEvent(event);
    setTitle(event.title);
    setEventDate(event.date);
    setEventType(event.type);
    setNotes(event.notes);
    setOpenModal(true);
  }

  function closeModal() {
    setOpenModal(false);
    setEditingEvent(null);
  }

  function saveEvent() {
    if (!title.trim() || !eventDate) {
      alert("Event title and date are required.");
      return;
    }

    if (editingEvent) {
      setEvents((currentEvents) =>
        currentEvents.map((event) =>
          event.id === editingEvent.id
            ? {
                ...event,
                title: title.trim(),
                date: eventDate,
                type: eventType,
                notes: notes.trim(),
              }
            : event,
        ),
      );
    } else {
      setEvents((currentEvents) => [
        ...currentEvents,
        {
          id: `E${Date.now()}`,
          title: title.trim(),
          date: eventDate,
          type: eventType,
          notes: notes.trim(),
        },
      ]);
    }

    setSelectedDate(eventDate);
    closeModal();
  }

  function deleteEvent(event: CalendarEvent) {
    const confirmed = window.confirm(`Delete event "${event.title}"?`);

    if (!confirmed) {
      return;
    }

    setEvents((currentEvents) =>
      currentEvents.filter((currentEvent) => currentEvent.id !== event.id),
    );
  }

  function goToToday() {
    const today = new Date();

    setCurrentMonth(new Date(today.getFullYear(), today.getMonth(), 1));

    setSelectedDate(toDateKey(today));
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
                Calendar & Reminders
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
                Farm Schedule
              </p>

              <h2 className="mt-2 text-3xl font-bold tracking-tight text-[var(--foreground)]">
                Calendar
              </h2>

              <p className="mt-2 max-w-2xl text-sm leading-6 text-[var(--muted)]">
                Track AI schedules, expected farrowing, weaning dates,
                vaccination, and other farm reminders.
              </p>
            </div>

            <button
              type="button"
              onClick={() => openAddEvent()}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-600 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-emerald-950/20 transition hover:bg-emerald-500">
              <span className="text-lg leading-none">+</span>
              Add Event
            </button>
          </div>

          <div className="mt-7 grid gap-5 xl:grid-cols-[1.65fr_0.75fr]">
            <section className="overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--panel)] shadow-[var(--shadow)]">
              <div className="flex flex-col gap-4 border-b border-[var(--border)] p-5 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h3 className="text-xl font-bold text-[var(--foreground)]">
                    {monthLabel}
                  </h3>

                  <p className="mt-1 text-sm text-[var(--muted)]">
                    Select a date to view or add events.
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() =>
                      setCurrentMonth(
                        (current) =>
                          new Date(
                            current.getFullYear(),
                            current.getMonth() - 1,
                            1,
                          ),
                      )
                    }
                    className="grid h-10 w-10 place-items-center rounded-xl border border-[var(--border)] bg-[var(--panel-soft)] text-[var(--muted)] transition hover:text-[var(--foreground)]">
                    ←
                  </button>

                  <button
                    type="button"
                    onClick={goToToday}
                    className="rounded-xl border border-[var(--border)] bg-[var(--panel-soft)] px-4 py-2.5 text-sm font-semibold text-[var(--foreground)]">
                    Today
                  </button>

                  <button
                    type="button"
                    onClick={() =>
                      setCurrentMonth(
                        (current) =>
                          new Date(
                            current.getFullYear(),
                            current.getMonth() + 1,
                            1,
                          ),
                      )
                    }
                    className="grid h-10 w-10 place-items-center rounded-xl border border-[var(--border)] bg-[var(--panel-soft)] text-[var(--muted)] transition hover:text-[var(--foreground)]">
                    →
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-7 border-b border-[var(--border)] bg-[var(--panel-soft)]">
                {weekDays.map((day) => (
                  <div
                    key={day}
                    className="px-2 py-3 text-center text-xs font-semibold uppercase tracking-wider text-[var(--muted)]">
                    {day}
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-7">
                {calendarDays.map(({ date, currentMonth: isCurrent }) => {
                  const dateKey = toDateKey(date);

                  const dayEvents = events.filter(
                    (event) => event.date === dateKey,
                  );

                  const selected = selectedDate === dateKey;

                  return (
                    <button
                      key={dateKey}
                      type="button"
                      onClick={() => setSelectedDate(dateKey)}
                      onDoubleClick={() => openAddEvent(dateKey)}
                      className={`min-h-28 border-b border-r border-[var(--border)] p-2 text-left align-top transition hover:bg-[var(--panel-soft)] ${
                        selected
                          ? "bg-emerald-500/8 ring-1 ring-inset ring-emerald-500/30"
                          : ""
                      }`}>
                      <span
                        className={`grid h-7 w-7 place-items-center rounded-lg text-xs font-semibold ${
                          isCurrent
                            ? "text-[var(--foreground)]"
                            : "text-[var(--subtle)]"
                        } ${selected ? "bg-emerald-600 text-white" : ""}`}>
                        {date.getDate()}
                      </span>

                      <div className="mt-2 space-y-1">
                        {dayEvents.slice(0, 2).map((event) => (
                          <div
                            key={event.id}
                            className={`truncate rounded-md border px-2 py-1 text-[10px] font-semibold ${typeStyles[event.type]}`}>
                            {event.title}
                          </div>
                        ))}

                        {dayEvents.length > 2 && (
                          <p className="px-1 text-[10px] text-[var(--muted)]">
                            +{dayEvents.length - 2} more
                          </p>
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>
            </section>

            <div className="space-y-5">
              <section className="rounded-2xl border border-[var(--border)] bg-[var(--panel)] p-5 shadow-[var(--shadow)]">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h3 className="text-lg font-bold text-[var(--foreground)]">
                      Selected Date
                    </h3>

                    <p className="mt-1 text-sm text-[var(--muted)]">
                      {formatLongDate(selectedDate)}
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() => openAddEvent(selectedDate)}
                    className="grid h-9 w-9 place-items-center rounded-xl bg-emerald-600 text-lg text-white">
                    +
                  </button>
                </div>

                <div className="mt-5 space-y-3">
                  {selectedEvents.length === 0 ? (
                    <div className="rounded-xl border border-dashed border-[var(--border)] bg-[var(--panel-soft)] p-5 text-center">
                      <p className="text-sm font-semibold text-[var(--foreground)]">
                        No events
                      </p>

                      <p className="mt-1 text-xs text-[var(--muted)]">
                        Add an event for this date.
                      </p>
                    </div>
                  ) : (
                    selectedEvents.map((event) => (
                      <div
                        key={event.id}
                        className="rounded-xl border border-[var(--border)] bg-[var(--panel-soft)] p-4">
                        <span
                          className={`inline-flex rounded-full border px-2.5 py-1 text-[10px] font-semibold ${typeStyles[event.type]}`}>
                          {event.type}
                        </span>

                        <p className="mt-3 text-sm font-semibold text-[var(--foreground)]">
                          {event.title}
                        </p>

                        <p className="mt-1 text-xs leading-5 text-[var(--muted)]">
                          {event.notes || "No notes"}
                        </p>

                        <div className="mt-4 flex gap-2">
                          <button
                            type="button"
                            onClick={() => openEditEvent(event)}
                            className="rounded-lg border border-sky-500/20 bg-sky-500/10 px-3 py-2 text-xs font-semibold text-sky-700 dark:text-sky-300">
                            Edit
                          </button>

                          <button
                            type="button"
                            onClick={() => deleteEvent(event)}
                            className="rounded-lg border border-rose-500/20 bg-rose-500/10 px-3 py-2 text-xs font-semibold text-rose-700 dark:text-rose-300">
                            Delete
                          </button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </section>

              <section className="rounded-2xl border border-[var(--border)] bg-[var(--panel)] p-5 shadow-[var(--shadow)]">
                <h3 className="text-lg font-bold text-[var(--foreground)]">
                  Upcoming Events
                </h3>

                <div className="mt-4 space-y-3">
                  {upcomingEvents.map((event) => (
                    <button
                      key={event.id}
                      type="button"
                      onClick={() => {
                        setSelectedDate(event.date);

                        const date = new Date(`${event.date}T00:00:00`);

                        setCurrentMonth(
                          new Date(date.getFullYear(), date.getMonth(), 1),
                        );
                      }}
                      className="flex w-full items-start gap-3 rounded-xl border border-[var(--border)] bg-[var(--panel-soft)] p-3 text-left transition hover:border-emerald-500/30">
                      <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-emerald-500/10 text-emerald-700 dark:text-emerald-300">
                        <DashboardIcon name="calendar" className="h-5 w-5" />
                      </div>

                      <div className="min-w-0">
                        <p className="truncate text-sm font-semibold text-[var(--foreground)]">
                          {event.title}
                        </p>

                        <p className="mt-1 text-xs text-[var(--muted)]">
                          {formatLongDate(event.date)}
                        </p>
                      </div>
                    </button>
                  ))}
                </div>
              </section>
            </div>
          </div>
        </section>
      </div>

      {openModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) {
              closeModal();
            }
          }}>
          <div className="w-full max-w-xl rounded-2xl border border-[var(--border)] bg-[var(--panel)] shadow-[var(--shadow)]">
            <div className="flex items-start justify-between border-b border-[var(--border)] p-5">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-emerald-600 dark:text-emerald-400">
                  Calendar Event
                </p>

                <h3 className="mt-1 text-xl font-bold text-[var(--foreground)]">
                  {editingEvent ? "Edit Event" : "Add Event"}
                </h3>
              </div>

              <button
                type="button"
                onClick={closeModal}
                className="grid h-10 w-10 place-items-center rounded-xl border border-[var(--border)] bg-[var(--panel-soft)] text-[var(--muted)]">
                ✕
              </button>
            </div>

            <div className="space-y-5 p-5">
              <div>
                <label className="mb-2 block text-sm font-medium text-[var(--foreground)]">
                  Event Title
                </label>

                <input
                  type="text"
                  value={title}
                  onChange={(event) => setTitle(event.target.value)}
                  placeholder="Example: AI Due - SOW-015"
                  className="w-full rounded-xl border border-[var(--border)] bg-[var(--panel-soft)] px-4 py-3 text-sm text-[var(--foreground)] outline-none focus:border-emerald-500/50"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-[var(--foreground)]">
                  Date
                </label>

                <input
                  type="date"
                  value={eventDate}
                  onChange={(event) => setEventDate(event.target.value)}
                  className="w-full rounded-xl border border-[var(--border)] bg-[var(--panel-soft)] px-4 py-3 text-sm text-[var(--foreground)] outline-none focus:border-emerald-500/50"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-[var(--foreground)]">
                  Event Type
                </label>

                <select
                  value={eventType}
                  onChange={(event) =>
                    setEventType(event.target.value as CalendarEventType)
                  }
                  className="w-full rounded-xl border border-[var(--border)] bg-[var(--panel-soft)] px-4 py-3 text-sm text-[var(--foreground)] outline-none focus:border-emerald-500/50">
                  {Object.keys(typeStyles).map((type) => (
                    <option key={type} value={type}>
                      {type}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-[var(--foreground)]">
                  Notes
                </label>

                <textarea
                  rows={4}
                  value={notes}
                  onChange={(event) => setNotes(event.target.value)}
                  placeholder="Optional notes..."
                  className="w-full resize-none rounded-xl border border-[var(--border)] bg-[var(--panel-soft)] px-4 py-3 text-sm text-[var(--foreground)] outline-none focus:border-emerald-500/50"
                />
              </div>
            </div>

            <div className="flex flex-col-reverse gap-3 border-t border-[var(--border)] p-5 sm:flex-row sm:justify-end">
              <button
                type="button"
                onClick={closeModal}
                className="rounded-xl border border-[var(--border)] bg-[var(--panel-soft)] px-5 py-3 text-sm font-semibold text-[var(--muted)]">
                Cancel
              </button>

              <button
                type="button"
                onClick={saveEvent}
                className="rounded-xl bg-emerald-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-emerald-500">
                {editingEvent ? "Save Changes" : "Save Event"}
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
