export default function SettingsPage() {
  return <h1>Settings</h1>;
}
("use client");

import { useEffect, useState } from "react";
import Sidebar from "../components/sidebar";
import ThemeToggle from "../components/ThemeToggle";
import Toast from "../components/Toast";

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
  aiReminder: boolean;
  farrowingReminder: boolean;
  weaningReminder: boolean;
  vaccinationReminder: boolean;
  lowFeedAlert: boolean;
};

type ToastState = {
  message: string;
  type: "success" | "error";
} | null;

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
  aiReminder: true,
  farrowingReminder: true,
  weaningReminder: true,
  vaccinationReminder: true,
  lowFeedAlert: true,
};

export default function SettingsPage() {
  const [form, setForm] = useState<SettingsForm>(defaultSettings);

  const [toast, setToast] = useState<ToastState>(null);

  useEffect(() => {
    const savedSettings = localStorage.getItem("farmcare-settings");

    if (!savedSettings) {
      return;
    }

    try {
      const parsedSettings = JSON.parse(savedSettings) as SettingsForm;

      setForm({
        ...defaultSettings,
        ...parsedSettings,
      });
    } catch {
      localStorage.removeItem("farmcare-settings");
    }
  }, []);

  function updateField<K extends keyof SettingsForm>(
    field: K,
    value: SettingsForm[K],
  ) {
    setForm((current) => ({
      ...current,
      [field]: value,
    }));
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

  function saveSettings() {
    if (!form.farmName.trim()) {
      showToast("Farm name is required.", "error");
      return;
    }

    if (!form.ownerName.trim()) {
      showToast("Owner name is required.", "error");
      return;
    }

    localStorage.setItem("farmcare-settings", JSON.stringify(form));

    showToast("Settings saved successfully.");
  }

  function resetSettings() {
    const confirmed = window.confirm(
      "Reset all settings to their default values?",
    );

    if (!confirmed) {
      return;
    }

    setForm(defaultSettings);
    localStorage.removeItem("farmcare-settings");

    showToast("Settings were reset.");
  }

  function exportSettings() {
    const file = new Blob([JSON.stringify(form, null, 2)], {
      type: "application/json",
    });

    const url = URL.createObjectURL(file);
    const link = document.createElement("a");

    link.href = url;
    link.download = "farmcare-settings.json";
    link.click();

    URL.revokeObjectURL(url);

    showToast("Settings exported successfully.");
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

            <ThemeToggle />
          </div>
        </header>

        <section className="mx-auto max-w-[1200px] p-4 sm:p-7 lg:p-8">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-emerald-600 dark:text-emerald-400">
              System Preferences
            </p>

            <h2 className="mt-2 text-3xl font-bold tracking-tight">
              Farm Settings
            </h2>

            <p className="mt-2 max-w-2xl text-sm leading-6 text-[var(--muted)]">
              Manage your farm profile, default values, notification
              preferences, and system data.
            </p>
          </div>

          <div className="mt-7 space-y-5">
            <SettingsSection
              title="Farm Information"
              description="Basic details shown throughout FarmCare.">
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
                      placeholder="Enter complete farm address"
                    />
                  </FormField>
                </div>
              </div>
            </SettingsSection>

            <SettingsSection
              title="Farm Defaults"
              description="Default values for new farm records.">
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
              </div>
            </SettingsSection>

            <SettingsSection
              title="Notifications"
              description="Choose which farm reminders should be enabled.">
              <div className="grid gap-3 sm:grid-cols-2">
                <NotificationToggle
                  label="AI Due Reminder"
                  description="Receive reminders for scheduled artificial insemination."
                  checked={form.aiReminder}
                  onChange={(checked) => updateField("aiReminder", checked)}
                />

                <NotificationToggle
                  label="Farrowing Reminder"
                  description="Receive reminders before expected farrowing dates."
                  checked={form.farrowingReminder}
                  onChange={(checked) =>
                    updateField("farrowingReminder", checked)
                  }
                />

                <NotificationToggle
                  label="Weaning Reminder"
                  description="Receive reminders for scheduled weaning dates."
                  checked={form.weaningReminder}
                  onChange={(checked) =>
                    updateField("weaningReminder", checked)
                  }
                />

                <NotificationToggle
                  label="Vaccination Reminder"
                  description="Receive reminders for upcoming vaccination schedules."
                  checked={form.vaccinationReminder}
                  onChange={(checked) =>
                    updateField("vaccinationReminder", checked)
                  }
                />

                <NotificationToggle
                  label="Low Feed Stock Alert"
                  description="Receive an alert when feed inventory is running low."
                  checked={form.lowFeedAlert}
                  onChange={(checked) => updateField("lowFeedAlert", checked)}
                />
              </div>
            </SettingsSection>

            <SettingsSection
              title="Data Management"
              description="Export or reset local FarmCare settings.">
              <div className="flex flex-wrap gap-3">
                <button
                  type="button"
                  onClick={exportSettings}
                  className="rounded-xl border border-[var(--border)] bg-[var(--panel-soft)] px-5 py-3 text-sm font-semibold transition hover:border-emerald-500/40">
                  Export Settings
                </button>

                <button
                  type="button"
                  onClick={resetSettings}
                  className="rounded-xl border border-rose-500/20 bg-rose-500/10 px-5 py-3 text-sm font-semibold text-rose-700 transition hover:bg-rose-500/20 dark:text-rose-300">
                  Reset Settings
                </button>
              </div>

              <p className="mt-4 text-xs leading-5 text-[var(--muted)]">
                These settings are currently stored in this browser.
                Database-backed settings will be added during the backend
                integration.
              </p>
            </SettingsSection>

            <SettingsSection
              title="About FarmCare"
              description="System and version information.">
              <div className="grid gap-4 sm:grid-cols-3">
                <AboutCard label="System" value="FarmCare" />

                <AboutCard label="Version" value="1.0.0" />

                <AboutCard label="Platform" value="Next.js" />
              </div>
            </SettingsSection>
          </div>

          <div className="sticky bottom-4 mt-7 flex justify-end">
            <button
              type="button"
              onClick={saveSettings}
              className="rounded-xl bg-emerald-600 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-emerald-950/20 transition hover:bg-emerald-500">
              Save Settings
            </button>
          </div>
        </section>
      </div>

      {toast && <Toast message={toast.message} type={toast.type} />}
    </main>
  );
}

const inputClass =
  "w-full rounded-xl border border-[var(--border)] bg-[var(--panel-soft)] px-4 py-3 text-sm text-[var(--foreground)] outline-none transition placeholder:text-[var(--subtle)] focus:border-emerald-500/50";

function SettingsSection({
  title,
  description,
  children,
}: {
  title: string;
  description: string;
  children: React.ReactNode;
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
  children: React.ReactNode;
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
