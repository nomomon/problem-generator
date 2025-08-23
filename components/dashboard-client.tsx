"use client";

import { AppSidebar } from "@/components/app-sidebar";
import { SiteHeader } from "@/components/site-header";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";

interface DashboardClientProps {
  children?: React.ReactNode;
}

export function DashboardClient({ children }: DashboardClientProps) {
  return (
    <div className="h-screen">
      <SidebarProvider
        style={
          {
            "--sidebar-width": "calc(var(--spacing) * 72)",
            "--header-height": "calc(var(--spacing) * 12)",
          } as React.CSSProperties
        }
        className="h-full"
      >
        <AppSidebar variant="inset" />
        <SidebarInset className="flex flex-col min-h-0">
          <SiteHeader />
          <div className="flex flex-1 flex-col min-h-0">
            <div className="@container/main flex flex-1 flex-col min-h-0">
              <div className="flex flex-col flex-1 min-h-0 py-4 md:py-6">
                {children}
              </div>
            </div>
          </div>
        </SidebarInset>
      </SidebarProvider>
    </div>
  );
}
