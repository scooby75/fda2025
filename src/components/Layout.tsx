import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { User } from "@/entities/User";
import { Button } from "@/components/ui/button";
import { LayoutDashboard, Settings, LogOut, BarChart3, Users, Menu } from "lucide-react";

type LayoutProps = {
  children: React.ReactNode;
  currentPageName?: string;
};

export default function Layout({ children, currentPageName }: LayoutProps) {
  const navigate = useNavigate();
  const [user, setUser] = React.useState<any | null>(null);
  const [isLoading, setIsLoading] = React.useState(true);
  const [collapsed, setCollapsed] = React.useState(false);

  const styleVariables = React.useMemo(() => `
    :root {
      --background-rgb: 15, 23, 42;
      --foreground-rgb: 255, 255, 255;
      --muted-rgb: 100, 116, 139;
      --primary-rgb: 34, 197, 94;
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
    <div className="min-h-screen flex bg-[rgb(var(--background-rgb))] text-white">
      <style>{styleVariables}</style>
      <aside className={`transition-all duration-200 bg-slate-900 p-4 ${collapsed ? 'w-16' : 'w-64'}`}>
        <div className="flex items-center justify-between mb-6">
          <div className="text-lg font-bold">FDA2025</div>
          <Button variant="ghost" size="icon" onClick={() => setCollapsed(!collapsed)} aria-label="Toggle menu">
            <Menu className="w-5 h-5" />
          </Button>
        </div>

        <nav className="flex flex-col gap-1">
          {navigationItems.map((item) => {
            if (item.adminOnly && user?.role !== "admin") return null;
            return (
              <NavLink
                key={item.title}
                to={item.url}
                className={({ isActive }) =>
                  `flex items-center gap-3 p-2 rounded-md ${isActive ? 'bg-emerald-600 text-black' : 'text-slate-300 hover:bg-slate-800'}`
                }
              >
                <item.icon className="w-5 h-5" />
                {!collapsed && <span className="truncate">{item.title}</span>}
              </NavLink>
            );
          })}
        </nav>

        <div className="mt-auto pt-4">
          {user && (
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-emerald-600 text-black flex items-center justify-center font-bold">
                  {user?.full_name?.trim()?.charAt(0)?.toUpperCase() ?? "U"}
                </div>
                {!collapsed && <span className="truncate">{user.full_name}</span>}
              </div>
              <Button variant="ghost" size="icon" onClick={handleLogout} aria-label="Logout">
                <LogOut className="w-5 h-5" />
              </Button>
            </div>
          )}
        </div>
      </aside>

      <main className="flex-1">
        <div className="p-6">
          {currentPageName && <h1 className="text-2xl font-bold mb-4">{currentPageName}</h1>}
          {children}
        </div>
      </main>
    </div>
  );
}