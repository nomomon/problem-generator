"use client";

import * as React from "react";
import {
  IconCamera,
  IconDashboard,
  IconFileWord,
  IconInnerShadowTop,
  IconSettings,
} from "@tabler/icons-react";

import { NavDocuments } from "@/components/nav-documents";
import { NavMain } from "@/components/nav-main";
import { NavSecondary } from "@/components/nav-secondary";
import { NavUser } from "@/components/nav-user";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { createClient } from "@/lib/utils/supabase/client";

const data = {
  navMain: [
    {
      title: "Home",
      url: "/",
      icon: IconDashboard,
    },
    {
      title: "Dashboard",
      url: "/dashboard",
      icon: IconDashboard,
    },
    {
      title: "Problems",
      url: "/dashboard/problems",
      icon: IconCamera,
    },
  ],
  navSecondary: [
    {
      title: "Settings",
      url: "/dashboard/settings",
      icon: IconSettings,
    },
  ],
  documents: [
    {
      name: "Word Assistant",
      url: "/",
      icon: IconFileWord,
    },
  ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const [user, setUser] = React.useState({
    name: "",
    email: "",
    avatar: "",
  });

  React.useEffect(() => {
    const supabase = createClient();

    const getUser = async () => {
      // Force refresh the session to get latest metadata
      await supabase.auth.refreshSession();
      const { data: userData } = await supabase.auth.getUser();

      setUser({
        name: userData.user?.user_metadata.full_name || "No Name",
        email: userData.user?.email || "No Email",
        avatar: userData.user?.user_metadata.avatar_url || "",
      });
    };

    getUser();

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      if (session?.user) {
        setUser({
          name: session.user.user_metadata.full_name || "No Name",
          email: session.user.email || "No Email",
          avatar: session.user.user_metadata.avatar_url || undefined,
        });
      } else {
        setUser({
          name: "No Name",
          email: "No Email",
          avatar: "",
        });
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className="data-[slot=sidebar-menu-button]:!p-1.5"
            >
              <a href="#">
                <IconInnerShadowTop className="!size-5" />
                <span className="text-base font-semibold">Acme Inc.</span>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
        <NavDocuments items={data.documents} />
        <NavSecondary items={data.navSecondary} className="mt-auto" />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={user} />
      </SidebarFooter>
    </Sidebar>
  );
}
