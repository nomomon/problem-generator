"use client";

import { usePageNavigation } from "@/hooks/use-page-navigation";

export default function SettingsPage() {
  usePageNavigation({
    title: "Settings",
    breadcrumbs: [
      { label: "Dashboard", href: "/dashboard" },
      { label: "Settings" },
    ],
  });

  return (
    <div className="space-y-6 px-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Settings</h1>
        <p className="text-muted-foreground">
          Manage your application settings and preferences.
        </p>
      </div>
      <div className="grid gap-6">
        <div className="rounded-lg border p-6">
          <h2 className="text-lg font-semibold mb-4">General Settings</h2>
          <p className="text-sm text-muted-foreground">
            Configure your general application preferences.
          </p>
        </div>
      </div>
    </div>
  );
}
