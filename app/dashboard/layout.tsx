import { createClient } from "@/lib/utils/supabase/server";
import { redirect } from "next/navigation";
import { NavigationProvider } from "@/lib/contexts/navigation-context";
import { DashboardClient } from "@/components/dashboard-client";
import { ThemeProvider } from "@/components/theme-provider";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const { data: userData, error } = await supabase.auth.getUser();

  if (error || !userData?.user) {
    redirect("/login");
  } else if (
    !["admin", "super-admin"].includes(userData.user.app_metadata?.role)
  ) {
    redirect("/");
  }

  return (
    <NavigationProvider>
      <ThemeProvider>
        <DashboardClient>{children}</DashboardClient>
      </ThemeProvider>
    </NavigationProvider>
  );
}
