
import React from "react";
import { Link, useLocation } from "react-router-dom";
import { User } from "@/entities/User";
import {
  BarChart3,
  Settings,
  TrendingUp,
  Upload,
  Users,
  Target,
  Home,
  LogOut,
  Menu,
  X,
  ShieldOff, 
  Wallet,
  CalendarDays
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarFooter,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";

const navigationItems = [
  {
    title: "Dashboard",
    url: "/",
    icon: BarChart3,
  },
  {
    title: "Jogos do Dia",
    url: "/daily-games",
    icon: CalendarDays,
  },
  {
    title: "Backtesting",
    url: "/backtesting",
    icon: TrendingUp,
  },
  {
    title: "H2H",
    url: "/h2h",
    icon: Users,
  },
  {
    title: "Gestão de Banca",
    url: "/bankroll",
    icon: Wallet,
  },
  {
    title: "Upload Dados",
    url: "/upload",
    icon: Upload,
    adminOnly: true
  },
  {
    title: "Admin",
    url: "/admin",
    icon: Users,
    adminOnly: true
  },
];

interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const location = useLocation();
  const [user, setUser] = React.useState(null);
  const [isLoading, setIsLoading] = React.useState(true);

  React.useEffect(() => {
    checkUser();
    document.title = "Football Data Analysis";
  }, []);

  const checkUser = async () => {
    try {
      // For now, we'll simulate a user check
      // In a real app, this would use your User entity
      setUser({ 
        id: '1', 
        full_name: 'Usuário Demo', 
        email: 'demo@example.com',
        role: 'user',
        status: 'approved'
      });
    } catch (error) {
      setUser(null);
    }
    setIsLoading(false);
  };

  const handleLogout = async () => {
    setUser(null);
    // In a real app, this would call User.logout()
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!user || user.status !== 'approved') {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <div className="text-center bg-card p-8 md:p-12 rounded-lg border shadow-xl max-w-md">
          <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
            <ShieldOff className="w-12 h-12 text-yellow-400" />
          </div>
          <h2 className="text-2xl md:text-3xl font-bold text-card-foreground mb-4">
            Acesso Restrito
          </h2>
          <p className="text-muted-foreground mb-8 text-base md:text-lg">
            Entre em contato com o administrador para obter acesso.
          </p>
          <Button onClick={handleLogout} variant="outline">
            <LogOut className="w-4 h-4 mr-2" />
            Voltar ao Login
          </Button>
        </div>
      </div>
    );
  }
  
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-background">
        <Sidebar className="border-r bg-card text-card-foreground shadow-lg">
          <SidebarHeader className="border-b p-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-primary to-secondary rounded-lg flex items-center justify-center shadow-md">
                <BarChart3 className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="font-bold text-foreground text-lg">Football Data Analysis</h2>
                <p className="text-xs text-muted-foreground opacity-75">Backtesting Platform</p>
              </div>
            </div>
          </SidebarHeader>
          
          <SidebarContent className="p-4 space-y-1">
            {navigationItems.map((item) => {
              if (item.adminOnly && user?.role !== 'admin') return null;
              
              const isActive = location.pathname === item.url;
              return (
                <Link
                  key={item.title}
                  to={item.url}
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                    isActive 
                      ? 'bg-primary text-primary-foreground font-semibold' 
                      : 'hover:bg-muted text-muted-foreground hover:text-foreground'
                  }`}
                >
                  <item.icon className="w-5 h-5 flex-shrink-0" />
                  <span>{item.title}</span>
                </Link>
              );
            })}

            <div className="!mt-auto pt-6">
              <div className="p-3 bg-emerald-500/20 border border-emerald-500/30 rounded-lg">
                <div className="flex items-center gap-2 text-sm">
                  <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></div>
                  <span className="text-emerald-400 font-medium">Sistema Ativo</span>
                </div>
                <p className="text-xs text-emerald-400/80 mt-1">
                  Plataforma funcionando.
                </p>
              </div>
            </div>
          </SidebarContent>

          <SidebarFooter className="border-t p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 bg-muted rounded-full flex items-center justify-center">
                  <span className="text-sm font-semibold">
                    {user?.full_name?.charAt(0)?.toUpperCase() || 'U'}
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-sm truncate">
                    {user?.full_name || 'Usuário'}
                  </p>
                  <p className="text-xs text-muted-foreground opacity-75 truncate">
                    {user?.role === 'admin' ? 'Administrador' : 'Analista'}
                  </p>
                </div>
              </div>
              <Button
                onClick={handleLogout}
                variant="ghost"
                size="icon"
                className="text-muted-foreground hover:text-red-400 hover:bg-red-500/20 ml-2"
              >
                <LogOut className="w-4 h-4" />
              </Button>
            </div>
          </SidebarFooter>
        </Sidebar>

        <main className="flex-1 flex flex-col bg-background">
          <header className="bg-card border-b px-4 py-3 lg:hidden sticky top-0 z-10 shadow-md">
            <div className="flex items-center gap-3">
              <SidebarTrigger className="text-foreground hover:text-primary">
                <Menu className="w-5 h-5" />
              </SidebarTrigger>
              <h1 className="text-lg font-semibold">Football Data Analysis</h1>
            </div>
          </header>

          <div className="flex-1 overflow-auto">
            {children}
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
}
