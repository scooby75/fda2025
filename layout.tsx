import React from "react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { User } from "@/entities/User";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import {
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar-provider";
import {
  LayoutDashboard,
  Settings,
  LogOut,
  BarChart3,
  Users,
} from "lucide-react";

type LayoutProps = {
  children: React.ReactNode;
  currentPageName?: string;
};

export default function Layout({ children, currentPageName }: LayoutProps) {
  const location = useLocation();
  const navigate = useNavigate();
  const [user, setUser] = React.useState<any | null>(null);
  const [isLoading, setIsLoading] = React.useState(true);

  const styleVariables = React.useMemo(() => `
    :root {
      --background-rgb: 15, 23, 42;
      --foreground-rgb: 255, 255, 255;
      --muted-rgb: 100, 116, 139;
      --muted-foreground-rgb: 148, 163, 184;
      --primary-rgb: 34, 197, 94;
      --primary-foreground-rgb: 255, 255, 255;
    }
    .sidebar-link {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      padding: 0.5rem 0.75rem;
      border-radius: 0.5rem;
      color: rgb(var(--foreground-rgb));
      text-decoration: none;
    }
    .sidebar-link:hover {
      background-color: rgba(var(--primary-rgb), 0.1);
    }
    .sidebar-link-active {
      background-color: rgba(var(--primary-rgb), 0.15);
      font-weight: 500;
    }
  `, []);

  React.useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const currentUser = await User.me();
        if (mounted) setUser(currentUser);
      } catch {
        if (mounted) setUser(null);
      } finally {
        if (mounted) setIsLoading(false);
      }
    })();
    document.title = "Football Data Analysis";
    return () => { mounted = false; };
  }, []);

  const handleLogout = async () => {
    await User.logout();
    setUser(null);
    navigate(createPageUrl("Landing"));
  };

  const navigationItems = [
    { title: "Dashboard", url: "/dashboard", icon: LayoutDashboard },
    { title: "Analytics", url: "/analytics", icon: BarChart3 },
    { title: "Users", url: "/users", icon: Users, adminOnly: true },
    { title: "Settings", url: "/settings", icon: Settings },
  ];

  if (!isLoading && !user) {
    navigate(createPageUrl("Landing"));
    return null;
  }

  return (
    <SidebarProvider>
      <style>{styleVariables}</style>
      <Sidebar>
        <SidebarHeader>
          <div className="text-lg font-bold text-white">My App</div>
        </SidebarHeader>
        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupContent>
              <SidebarMenu>
                {navigationItems.map((item) => {
                  if (item.adminOnly && user?.role !== "admin") return null;
                  return (
                    <SidebarMenuItem key={item.title}>
                      <SidebarMenuButton asChild>
                        <NavLink
                          to={item.url}
                          className={({ isActive }) =>
                            `sidebar-link ${isActive ? "sidebar-link-active" : ""}`
                          }
                        >
                          <item.icon className="w-5 h-5 flex-shrink-0" />
                          <span>{item.title}</span>
                        </NavLink>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  );
                })}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>
        <SidebarFooter>
          {user && (
            <div className="flex items-center justify-between p-2">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-green-600 text-white flex items-center justify-center font-bold">
                  {user?.full_name?.trim()?.charAt(0)?.toUpperCase() ?? "U"}
                </div>
                <span>{user.full_name}</span>
              </div>
              <Button variant="ghost" size="icon" onClick={handleLogout} aria-label="Logout">
                <LogOut className="w-5 h-5" />
              </Button>
            </div>
          )}
        </SidebarFooter>
        <SidebarRail />
      </Sidebar>
      <main className="flex-1 bg-[rgb(var(--background-rgb))] text-white">
        <div className="p-4">
          {currentPageName && <h1 className="text-2xl font-bold mb-4">{currentPageName}</h1>}
          {children}
        </div>
      </main>
    </SidebarProvider>
  );
}
