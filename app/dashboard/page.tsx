"use client";

import { usePageNavigation } from "@/hooks/use-page-navigation";

export default function DashboardPage() {
  usePageNavigation({
    title: "Dashboard",
    breadcrumbs: [{ label: "Dashboard" }],
  });

  return (
    <div className="space-y-6 px-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">
          Welcome to your dashboard. Here you can view and manage your data.
        </p>
      </div>
      {/* Add your dashboard content here */}
    </div>
  );
}
