"use client";

import {
  useEffect,
  useRef,
  useState,
  type ChangeEvent,
  type ReactNode,
} from "react";
import Sidebar from "../components/sidebar";
import ThemeToggle from "../components/ThemeToggle";

type SettingsForm = {
  farmName: string;
  ownerName: string;
  email: string;
  contactNumber: string;
  address: string;
  defaultBreed: string;
  currency: string;
  weightUnit: string;
  dateFormat: string;
  language: string;
  vaccinationReminder: boolean;
  dewormingReminder: boolean;
  breedingReminder: boolean;
  pregnancyReminder: boolean;
  lowFeedAlert: boolean;
  mortalityAlert: boolean;
};

const defaultSettings: SettingsForm = {
  farmName: "FarmCare Demo Farm",
  ownerName: "Farm Owner",
  email: "",
  contactNumber: "",
  address: "",
  defaultBreed: "Landrace",
  currency: "PHP",
  weightUnit: "kg",
  dateFormat: "MM/DD/YYYY",
  language: "English",
  vaccinationReminder: true,
  dewormingReminder: true,
  breedingReminder: true,
  pregnancyReminder: true,
  lowFeedAlert: true,
  mortalityAlert: true,
};

const inputClass =
  "w-full rounded-xl border border-[var(--border)] bg-[var(--panel-soft)] px-4 py-3 text-sm text-[var(--foreground)] outline-none transition placeholder:text-[var(--subtle)] focus:border-emerald-500/60 focus:ring-2 focus:ring-emerald-500/10";

export default function SettingsPage() {
  const [form, setForm] = useState<SettingsForm>(defaultSettings);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState<"success" | "error">(
    "success",
  );
  const [savedAt, setSavedAt] = useState("");
  const importInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const saved = localStorage.getItem("farmcare-settings");
    if (!saved) return;

    try {
      const parsed = JSON.parse(saved) as Partial<SettingsForm>;
      setForm({ ...defaultSettings, ...parsed });
    } catch {
      localStorage.removeItem("farmcare-settings");
    }
  }, []);

  function updateField<K extends keyof SettingsForm>(
    field: K,
    value: SettingsForm[K],
  ) {
    setForm((current) => ({ ...current, [field]: value }));
  }

  function showMessage(text: string, type: "success" | "error" = "success") {
    setMessage(text);
    setMessageType(type);
    window.setTimeout(() => setMessage(""), 3000);
  }

  function saveSettings() {
    if (!form.farmName.trim()) {
      showMessage("Farm name is required.", "error");
      return;
    }

    if (!form.ownerName.trim()) {
      showMessage("Owner name is required.", "error");
      return;
    }

    localStorage.setItem("farmcare-settings", JSON.stringify(form));
    setSavedAt(
      new Date().toLocaleTimeString("en-PH", {
        hour: "2-digit",
        minute: "2-digit",
      }),
    );
    showMessage("Settings saved successfully.");
  }

  function resetSettings() {
    const confirmed = window.confirm(
      "Reset all FarmCare settings to their default values?",
    );

    if (!confirmed) return;

    setForm(defaultSettings);
    setSavedAt("");
    localStorage.removeItem("farmcare-settings");
    showMessage("Settings were reset.");
  }

  function exportSettings() {
    const blob = new Blob([JSON.stringify(form, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");

    link.href = url;
    link.download = "farmcare-settings.json";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    showMessage("Settings exported successfully.");
  }

  function importSettings(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();

    reader.onload = () => {
      try {
        const parsed = JSON.parse(
          String(reader.result),
        ) as Partial<SettingsForm>;
        const importedSettings = { ...defaultSettings, ...parsed };

        setForm(importedSettings);
        localStorage.setItem(
          "farmcare-settings",
          JSON.stringify(importedSettings),
        );
        showMessage("Settings imported successfully.");
      } catch {
        showMessage(
          "The selected file is not a valid FarmCare settings file.",
          "error",
        );
      }

      event.target.value = "";
    };

    reader.readAsText(file);
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
              <h1 className="mt-1 text-xl font-bold">Settings</h1>
            </div>

            <div className="flex items-center gap-3">
              <ThemeToggle />
              <div className="grid h-11 w-11 place-items-center rounded-full bg-gradient-to-br from-emerald-400 to-emerald-700 text-sm font-bold text-white">
                FO
              </div>
            </div>
          </div>
        </header>

        <section className="mx-auto max-w-[1250px] p-4 sm:p-7 lg:p-8">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-emerald-600 dark:text-emerald-400">
                System Preferences
              </p>
              <h2 className="mt-2 text-3xl font-bold tracking-tight">
                Farm Settings
              </h2>
              <p className="mt-2 max-w-2xl text-sm leading-6 text-[var(--muted)]">
                Manage your farm profile, default values, reminders, appearance,
                and local backup settings.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              {savedAt && (
                <span className="text-xs text-[var(--muted)]">
                  Last saved at {savedAt}
                </span>
              )}

              <button
                type="button"
                onClick={saveSettings}
                className="rounded-xl bg-emerald-600 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-emerald-950/20 transition hover:bg-emerald-500">
                Save Settings
              </button>
            </div>
          </div>

          <div className="mt-7 space-y-5">
            <SettingsSection
              title="Farm Profile"
              description="Information used across the FarmCare dashboard and reports.">
              <div className="grid gap-5 sm:grid-cols-2">
                <FormField label="Farm Name" required>
                  <input
                    type="text"
                    value={form.farmName}
                    onChange={(event) =>
                      updateField("farmName", event.target.value)
                    }
                    className={inputClass}
                    placeholder="Enter farm name"
                  />
                </FormField>

                <FormField label="Owner Name" required>
                  <input
                    type="text"
                    value={form.ownerName}
                    onChange={(event) =>
                      updateField("ownerName", event.target.value)
                    }
                    className={inputClass}
                    placeholder="Enter owner name"
                  />
                </FormField>

                <FormField label="Email Address">
                  <input
                    type="email"
                    value={form.email}
                    onChange={(event) =>
                      updateField("email", event.target.value)
                    }
                    className={inputClass}
                    placeholder="owner@example.com"
                  />
                </FormField>

                <FormField label="Contact Number">
                  <input
                    type="tel"
                    value={form.contactNumber}
                    onChange={(event) =>
                      updateField("contactNumber", event.target.value)
                    }
                    className={inputClass}
                    placeholder="09XX XXX XXXX"
                  />
                </FormField>

                <div className="sm:col-span-2">
                  <FormField label="Farm Address">
                    <textarea
                      rows={3}
                      value={form.address}
                      onChange={(event) =>
                        updateField("address", event.target.value)
                      }
                      className={`${inputClass} resize-none`}
                      placeholder="Enter the complete farm address"
                    />
                  </FormField>
                </div>
              </div>
            </SettingsSection>

            <SettingsSection
              title="Farm Defaults"
              description="Default values applied when creating new farm records.">
              <div className="grid gap-5 sm:grid-cols-2">
                <FormField label="Default Breed">
                  <select
                    value={form.defaultBreed}
                    onChange={(event) =>
                      updateField("defaultBreed", event.target.value)
                    }
                    className={inputClass}>
                    <option value="Landrace">Landrace</option>
                    <option value="Large White">Large White</option>
                    <option value="Duroc">Duroc</option>
                    <option value="Pietrain">Pietrain</option>
                    <option value="Crossbreed">Crossbreed</option>
                  </select>
                </FormField>

                <FormField label="Currency">
                  <select
                    value={form.currency}
                    onChange={(event) =>
                      updateField("currency", event.target.value)
                    }
                    className={inputClass}>
                    <option value="PHP">Philippine Peso — PHP</option>
                    <option value="USD">US Dollar — USD</option>
                  </select>
                </FormField>

                <FormField label="Weight Unit">
                  <select
                    value={form.weightUnit}
                    onChange={(event) =>
                      updateField("weightUnit", event.target.value)
                    }
                    className={inputClass}>
                    <option value="kg">Kilograms — kg</option>
                    <option value="lb">Pounds — lb</option>
                  </select>
                </FormField>

                <FormField label="Date Format">
                  <select
                    value={form.dateFormat}
                    onChange={(event) =>
                      updateField("dateFormat", event.target.value)
                    }
                    className={inputClass}>
                    <option value="MM/DD/YYYY">MM/DD/YYYY</option>
                    <option value="DD/MM/YYYY">DD/MM/YYYY</option>
                    <option value="YYYY-MM-DD">YYYY-MM-DD</option>
                  </select>
                </FormField>

                <FormField label="Language">
                  <select
                    value={form.language}
                    onChange={(event) =>
                      updateField("language", event.target.value)
                    }
                    className={inputClass}>
                    <option value="English">English</option>
                    <option value="Filipino">Filipino</option>
                  </select>
                </FormField>

                <FormField label="Appearance">
                  <div className="flex min-h-12 items-center justify-between rounded-xl border border-[var(--border)] bg-[var(--panel-soft)] px-4">
                    <span className="text-sm text-[var(--muted)]">
                      Use the theme button to switch modes
                    </span>
                    <ThemeToggle />
                  </div>
                </FormField>
              </div>
            </SettingsSection>

            <SettingsSection
              title="Notification Preferences"
              description="Choose the reminders and alerts that should be enabled.">
              <div className="grid gap-3 md:grid-cols-2">
                <NotificationToggle
                  label="Vaccination Reminder"
                  description="Remind the farm staff about upcoming vaccination schedules."
                  checked={form.vaccinationReminder}
                  onChange={(checked) =>
                    updateField("vaccinationReminder", checked)
                  }
                />
                <NotificationToggle
                  label="Deworming Reminder"
                  description="Receive reminders for scheduled deworming activities."
                  checked={form.dewormingReminder}
                  onChange={(checked) =>
                    updateField("dewormingReminder", checked)
                  }
                />
                <NotificationToggle
                  label="Breeding Reminder"
                  description="Receive reminders for scheduled breeding or AI dates."
                  checked={form.breedingReminder}
                  onChange={(checked) =>
                    updateField("breedingReminder", checked)
                  }
                />
                <NotificationToggle
                  label="Pregnancy Reminder"
                  description="Receive reminders before expected farrowing dates."
                  checked={form.pregnancyReminder}
                  onChange={(checked) =>
                    updateField("pregnancyReminder", checked)
                  }
                />
                <NotificationToggle
                  label="Low Feed Stock Alert"
                  description="Show an alert when feed inventory falls below its safe level."
                  checked={form.lowFeedAlert}
                  onChange={(checked) => updateField("lowFeedAlert", checked)}
                />
                <NotificationToggle
                  label="Mortality Alert"
                  description="Show an alert when a mortality record is added."
                  checked={form.mortalityAlert}
                  onChange={(checked) => updateField("mortalityAlert", checked)}
                />
              </div>
            </SettingsSection>

            <SettingsSection
              title="Backup & Restore"
              description="Export, import, or reset settings stored in this browser.">
              <input
                ref={importInputRef}
                type="file"
                accept="application/json,.json"
                onChange={importSettings}
                className="hidden"
              />

              <div className="flex flex-wrap gap-3">
                <button
                  type="button"
                  onClick={exportSettings}
                  className="rounded-xl border border-[var(--border)] bg-[var(--panel-soft)] px-5 py-3 text-sm font-semibold transition hover:border-emerald-500/40">
                  Export Settings
                </button>

                <button
                  type="button"
                  onClick={() => importInputRef.current?.click()}
                  className="rounded-xl border border-[var(--border)] bg-[var(--panel-soft)] px-5 py-3 text-sm font-semibold transition hover:border-sky-500/40">
                  Import Settings
                </button>

                <button
                  type="button"
                  onClick={resetSettings}
                  className="rounded-xl border border-rose-500/20 bg-rose-500/10 px-5 py-3 text-sm font-semibold text-rose-700 transition hover:bg-rose-500/20 dark:text-rose-300">
                  Reset Settings
                </button>
              </div>

              <p className="mt-4 max-w-3xl text-xs leading-5 text-[var(--muted)]">
                Settings are temporarily saved through localStorage.
                Database-backed settings will replace this during backend
                integration.
              </p>
            </SettingsSection>

            <SettingsSection
              title="Account"
              description="Current user and access information.">
              <div className="grid gap-4 sm:grid-cols-3">
                <AboutCard label="User Role" value="Administrator" />
                <AboutCard label="Account Status" value="Active" />
                <AboutCard label="Authentication" value="Not connected" />
              </div>
            </SettingsSection>

            <SettingsSection
              title="About FarmCare"
              description="System and application information.">
              <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                <AboutCard label="System" value="FarmCare" />
                <AboutCard label="Version" value="1.0.0" />
                <AboutCard label="Framework" value="Next.js" />
                <AboutCard label="Database" value="Not connected" />
              </div>
            </SettingsSection>
          </div>

          <div className="mt-7 flex justify-end">
            <button
              type="button"
              onClick={saveSettings}
              className="rounded-xl bg-emerald-600 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-emerald-950/20 transition hover:bg-emerald-500">
              Save Settings
            </button>
          </div>
        </section>
      </div>

      {message && (
        <div className="fixed bottom-5 right-5 z-[80] w-[calc(100%-2.5rem)] max-w-sm">
          <div
            className={`flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold text-white shadow-xl ${
              messageType === "success" ? "bg-emerald-600" : "bg-rose-600"
            }`}>
            <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-white/15">
              {messageType === "success" ? "✓" : "!"}
            </span>
            {message}
          </div>
        </div>
      )}
    </main>
  );
}

function SettingsSection({
  title,
  description,
  children,
}: {
  title: string;
  description: string;
  children: ReactNode;
}) {
  return (
    <section className="rounded-2xl border border-[var(--border)] bg-[var(--panel)] p-5 shadow-[var(--shadow)] sm:p-6">
      <div className="border-b border-[var(--border)] pb-4">
        <h3 className="text-lg font-bold">{title}</h3>
        <p className="mt-1 text-sm text-[var(--muted)]">{description}</p>
      </div>
      <div className="pt-5">{children}</div>
    </section>
  );
}

function FormField({
  label,
  required = false,
  children,
}: {
  label: string;
  required?: boolean;
  children: ReactNode;
}) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm font-medium">
        {label}
        {required && <span className="ml-1 text-rose-500">*</span>}
      </span>
      {children}
    </label>
  );
}

function NotificationToggle({
  label,
  description,
  checked,
  onChange,
}: {
  label: string;
  description: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
}) {
  return (
    <button
      type="button"
      onClick={() => onChange(!checked)}
      aria-pressed={checked}
      className="flex items-start justify-between gap-4 rounded-xl border border-[var(--border)] bg-[var(--panel-soft)] p-4 text-left transition hover:border-emerald-500/30">
      <div>
        <p className="text-sm font-semibold">{label}</p>
        <p className="mt-1 text-xs leading-5 text-[var(--muted)]">
          {description}
        </p>
      </div>

      <span
        className={`relative mt-1 h-6 w-11 shrink-0 rounded-full transition ${
          checked ? "bg-emerald-600" : "bg-slate-400/40"
        }`}>
        <span
          className={`absolute top-1 h-4 w-4 rounded-full bg-white transition ${
            checked ? "left-6" : "left-1"
          }`}
        />
      </span>
    </button>
  );
}

function AboutCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-[var(--border)] bg-[var(--panel-soft)] p-4">
      <p className="text-xs font-semibold uppercase tracking-wider text-[var(--muted)]">
        {label}
      </p>
      <p className="mt-2 font-bold">{value}</p>
    </div>
  );
}
