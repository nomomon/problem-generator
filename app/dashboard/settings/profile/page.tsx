"use client";

import { usePageNavigation } from "@/hooks/use-page-navigation";

export default function ProfilePage() {
  usePageNavigation({
    title: "Profile Settings",
    breadcrumbs: [
      { label: "Dashboard", href: "/dashboard" },
      { label: "Settings", href: "/dashboard/settings" },
      { label: "Profile" },
    ],
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Profile Settings</h1>
        <p className="text-muted-foreground">
          Manage your profile information and account settings.
        </p>
      </div>
      <div className="grid gap-6">
        <div className="rounded-lg border p-6">
          <h2 className="text-lg font-semibold mb-4">Personal Information</h2>
          <p className="text-sm text-muted-foreground">
            Update your personal details and contact information.
          </p>
        </div>
      </div>
    </div>
  );
}
