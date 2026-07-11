import { useEffect, useState } from "react";
import { Link, useRouterState } from "@tanstack/react-router";
import { getMockUser, type MockUser } from "@/lib/mock-auth";
import {
  LayoutDashboard,
  Map,
  Route as RouteIcon,
  ListChecks,
  Users,
  BarChart3,
  Settings,
  Bus,
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  SidebarFooter,
} from "@/components/ui/sidebar";

const adminItems = [
  { title: "Overview", url: "/dashboard", icon: LayoutDashboard },
  { title: "Live Map", url: "/dashboard/map", icon: Map },
  { title: "Routes", url: "/dashboard/routes", icon: RouteIcon },
  { title: "Trips", url: "/dashboard/trips", icon: ListChecks },
  { title: "Riders", url: "/dashboard/riders", icon: Users },
  { title: "Analytics", url: "/dashboard/analytics", icon: BarChart3 },
  { title: "Settings", url: "/dashboard/settings", icon: Settings },
];

const studentItems = [
  { title: "Rider Hub", url: "/dashboard", icon: LayoutDashboard },
  { title: "Book a Ride", url: "/ride", icon: Bus },
  { title: "Live Map", url: "/dashboard/map", icon: Map },
  { title: "Settings", url: "/dashboard/settings", icon: Settings },
];

export function AppSidebar() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const [user, setUser] = useState<MockUser | null>(null);

  useEffect(() => {
    setUser(getMockUser());
    const onChange = () => setUser(getMockUser());
    window.addEventListener("shuttle-eta-auth", onChange);
    return () => window.removeEventListener("shuttle-eta-auth", onChange);
  }, []);

  const items = user?.role === "admin" ? adminItems : studentItems;

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader>
        <div className="flex items-center gap-2 px-2 py-1.5">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
            <Bus className="h-4 w-4" />
          </span>
          <div className="flex flex-col group-data-[collapsible=icon]:hidden">
            <span className="font-display text-sm font-semibold">Shuttle ETA</span>
            <span className="text-xs text-sidebar-foreground/60">
              {user?.role === "admin" ? "PESSA Console" : "Rider Account"}
            </span>
          </div>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>
            {user?.role === "admin" ? "Operations" : "Rider Menu"}
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild isActive={pathname === item.url}>
                    <Link to={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <div className="px-2 py-2 text-xs text-sidebar-foreground/60 group-data-[collapsible=icon]:hidden">
          v0.1 · Prototype
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
