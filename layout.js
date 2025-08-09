
import React from "react";
import { Link, useLocation } from "react-router-dom";
import { createPageUrl } from "@/utils";
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
  CalendarDays // Add icon for DailyGames
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
    url: createPageUrl("Dashboard"),
    icon: BarChart3,
  },
  {
    title: "Jogos do Dia",
    url: createPageUrl("DailyGames"),
    icon: CalendarDays,
  },
  {
    title: "Backtesting",
    url: createPageUrl("Backtesting"),
    icon: TrendingUp,
  },
  {
    title: "H2H",
    url: createPageUrl("H2H"),
    icon: Users,
  },
  {
    title: "Gestão de Banca",
    url: createPageUrl("BankrollManagement"),
    icon: Wallet,
  },
  {
    title: "Upload Dados",
    url: createPageUrl("UploadData"),
    icon: Upload,
    adminOnly: true
  },
  {
    title: "Admin",
    url: createPageUrl("Admin"),
    icon: Users,
    adminOnly: true
  },
];

export default function Layout({ children, currentPageName }) {
  const location = useLocation();
  const [user, setUser] = React.useState(null);
  const [isLoading, setIsLoading] = React.useState(true);

  React.useEffect(() => {
    checkUser();
    document.title = "Football Data Analysis";
  }, []);

  const checkUser = async () => {
    try {
      const currentUser = await User.me();
      setUser(currentUser);
    } catch (error) {
      setUser(null);
    }
    setIsLoading(false);
  };

  const handleLogout = async () => {
    await User.logout();
    setUser(null);
    window.location.href = createPageUrl("Landing"); // Redirect to new landing page
  };

  const styleVariables = `
    :root {
      --background-rgb: 15, 23, 42;      /* slate-900 (Fundo Principal) */
      --foreground-rgb: 248, 250, 252;   /* slate-50 (Texto Principal) */
      
      --card-rgb: 22, 32, 51;            /* slate-800/ Ajustado (Cor dos Cards) */
      --card-foreground-rgb: 248, 250, 252; /* slate-50 (Texto em Cards) */
      
      --popover-rgb: 22, 32, 51;         /* slate-800/ Ajustado (Cor dos Popovers) */
      --popover-foreground-rgb: 15, 23, 42; /* slate-900 para texto em popovers */
      
      --primary-rgb: 16, 185, 129;       /* emerald-500 (Verde Primário) */
      --primary-foreground-rgb: 15, 23, 42; /* slate-900 (Texto do Primário) */
      
      --secondary-rgb: 59, 130, 246;     /* blue-500 (Azul Secundário) */
      --secondary-foreground-rgb: 15, 23, 42; /* slate-900 (Texto do Secundário) */

      --muted-rgb: 51, 65, 85;           /* slate-700 (Muted Fundo/Hover) */
      --muted-foreground-rgb: 148, 163, 184; /* slate-400 (Texto Secundário/Muted) */
      
      --accent-rgb: var(--primary-rgb);
      --accent-foreground-rgb: var(--primary-foreground-rgb);

      --destructive-rgb: 239, 68, 68;    /* red-500 (Destrutivo) */
      --destructive-foreground-rgb: 248, 250, 252; /* slate-50 (Texto Destrutivo) */
      
      --border-rgb: 51, 65, 85;          /* slate-700 (Bordas) */
      --input-rgb: 30, 41, 59;           /* slate-800 (Inputs) */
      --ring-rgb: 16, 185, 129;          /* emerald-500 (Foco/Ring) */

      /* Sidebar specific vars - fundo escuro */
      --sidebar-background-rgb: 15, 23, 42;  /* slate-900 sidebar background */
      --sidebar-foreground-rgb: 148, 163, 184; /* slate-400 for sidebar text */
      --sidebar-border-rgb: 51, 65, 85;      /* slate-700 for sidebar border */
      
      --sidebar-active-background-rgb: var(--primary-rgb); /* emerald-500 for active */
      --sidebar-active-foreground-rgb: 15, 23, 42; /* slate-900 text on active */
      
      --sidebar-hover-background-rgb: 51, 65, 85; /* slate-700 for hover */
      --sidebar-hover-foreground-rgb: var(--primary-rgb); /* emerald-500 text on hover */
    }
    
    body {
      background-color: rgb(var(--background-rgb));
      color: rgb(var(--foreground-rgb));
      font-family: "Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
      font-feature-settings: "cv02", "cv03", "cv04", "cv11";
      -webkit-font-smoothing: antialiased;
      -moz-osx-font-smoothing: grayscale;
    }
    
    .bg-background { background-color: rgb(var(--background-rgb)) !important; }
    .text-foreground { color: rgb(var(--foreground-rgb)) !important; }
    .bg-card { 
      background-color: rgb(var(--card-rgb)) !important; 
      box-shadow: 0 1px 3px 0 rgba(0,0,0,0.1), 0 1px 2px -1px rgba(0,0,0,0.1), inset 0 1px 0px rgba(var(--border-rgb), 0.5);
      border-radius: 0.75rem; 
    }
    .text-card-foreground { color: rgb(var(--card-foreground-rgb)) !important; }
    .border-border { border-color: rgb(var(--border-rgb)) !important; }
    
    .bg-primary { background-color: rgb(var(--primary-rgb)) !important; }
    .text-primary-foreground { color: rgb(var(--primary-foreground-rgb)) !important; }
    .hover\\:bg-primary\\/90:hover { background-color: rgba(var(--primary-rgb), 0.9) !important; }
    
    .bg-secondary { background-color: rgb(var(--secondary-rgb)) !important; }
    .text-secondary-foreground { color: rgb(var(--secondary-foreground-rgb)) !important; }
    .hover\\:bg-secondary\\/80:hover { background-color: rgba(var(--secondary-rgb), 0.8) !important; }
    
    .text-muted-foreground { color: rgb(var(--muted-foreground-rgb)) !important; }
    
    h1, .text-3xl, .text-4xl { font-weight: 700; letter-spacing: -0.025em; color: rgb(var(--foreground-rgb))}
    h2, .text-2xl { font-weight: 600; letter-spacing: -0.02em; color: rgb(var(--foreground-rgb))}
    h3, .text-xl { font-weight: 600; letter-spacing: -0.01em; color: rgb(var(--foreground-rgb))}
    /* Adjusted default p, span, div color to be --muted-foreground-rgb as per dark theme */
    p, span, div:not(h1):not(h2):not(h3):not([class*="text-foreground"]):not([class*="text-card-foreground"]) { color: rgb(var(--muted-foreground-rgb));} 
    .text-foreground p, .text-foreground span, .text-foreground div {color: rgb(var(--foreground-rgb))} 
    .text-card-foreground p, .text-card-foreground span, .text-card-foreground div {color: rgb(var(--card-foreground-rgb))}


    .sidebar-link {
      border-radius: 0.5rem;
      transition: all 0.2s ease-out;
      padding: 0.75rem 1rem;
      color: rgb(var(--sidebar-foreground-rgb));
    }
    .sidebar-link:hover {
      background-color: rgb(var(--sidebar-hover-background-rgb));
      color: rgb(var(--sidebar-hover-foreground-rgb));
    }
    .sidebar-link-active {
      background-color: rgb(var(--sidebar-active-background-rgb)) !important;
      color: rgb(var(--sidebar-active-foreground-rgb)) !important;
      font-weight: 600;
    }
    .sidebar-link-active svg {
      color: rgb(var(--sidebar-active-foreground-rgb)) !important;
    }
    .sidebar-link:hover svg {
       color: rgb(var(--sidebar-hover-foreground-rgb));
    }
    .sidebar-link:not(.sidebar-link-active) svg {
       color: rgb(var(--sidebar-foreground-rgb));
    }

    button, input, select, textarea {
      transition: border-color 0.2s ease-out, box-shadow 0.2s ease-out;
      border-radius: 0.5rem;
      background-color: rgb(var(--input-rgb));
      border: 1px solid rgb(var(--border-rgb));
      color: rgb(var(--foreground-rgb));
    }
    button:focus-visible,
    input:focus-visible,
    select:focus-visible,
    textarea:focus-visible {
      outline: 2px solid transparent;
      outline-offset: 2px;
      border-color: rgba(var(--ring-rgb),1) !important;
      box-shadow: 0 0 0 2px rgb(var(--background-rgb)), 0 0 0 4px rgba(var(--ring-rgb), 0.5);
    }
    input::placeholder, textarea::placeholder {
      color: rgb(var(--muted-foreground-rgb));
      opacity: 0.7;
    }
    .ring-ring {
      --ring-color: rgba(var(--ring-rgb), 0.5);
      box-shadow: 0 0 0 2px var(--ring-color) !important;
    }

    /* Fix for popover/dropdown text visibility */
    [data-radix-popper-content-wrapper] {
      background-color: rgb(var(--popover-rgb)) !important;
      color: rgb(var(--popover-foreground-rgb)) !important; /* Text color black for popovers */
    }
    [data-radix-select-content] {
      background-color: rgb(var(--popover-rgb)) !important;
      color: rgb(var(--popover-foreground-rgb)) !important; /* Text color black for select content */
    }
    [data-radix-select-item] {
      color: rgb(var(--popover-foreground-rgb)) !important; /* Text color black for select items */
    }
    [data-radix-select-item]:hover {
      background-color: rgba(var(--primary-rgb), 0.1) !important;
    }
    [data-radix-command-input] {
      color: rgb(var(--popover-foreground-rgb)) !important; /* Text color black for command input */
    }

    /* Recharts Tooltip Customization */
    .recharts-tooltip-wrapper {
      background-color: rgb(30, 41, 59) !important; /* slate-800 */
      border: 1px solid rgb(71, 85, 105) !important; /* slate-600 */
      border-radius: 8px !important;
      color: rgb(248, 250, 252) !important; /* slate-50 */
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3) !important;
      padding: 0.75rem !important;
      font-size: 0.875rem !important;
    }
    
    .recharts-default-tooltip {
      background-color: rgb(30, 41, 59) !important;
      border: 1px solid rgb(71, 85, 105) !important;
      border-radius: 8px !important;
      color: rgb(248, 250, 252) !important;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3) !important;
    }
    
    .recharts-tooltip-label {
      color: rgb(248, 250, 252) !important; /* slate-50 */
      font-weight: 600 !important;
      margin-bottom: 0.5rem !important;
      border-bottom: 1px solid rgb(71, 85, 105) !important; /* slate-600 */
      padding-bottom: 0.25rem !important;
      font-size: 0.875rem !important;
    }
    
    .recharts-tooltip-item-list {
      color: rgb(248, 250, 252) !important;
    }
    
    .recharts-tooltip-item {
      color: rgb(248, 250, 252) !important;
      font-size: 0.8125rem !important;
      padding: 0.125rem 0 !important;
    }
    
    .recharts-tooltip-item-name, 
    .recharts-tooltip-item-separator {
      color: rgb(203, 213, 225) !important; /* slate-300 */
    }
    
    .recharts-tooltip-item-value {
      font-weight: 600 !important;
      color: rgb(248, 250, 252) !important; /* slate-50 */
    }

    /* Custom tooltip content styling for better contrast */
    .tooltip-content {
      background-color: rgb(30, 41, 59) !important;
      color: rgb(248, 250, 252) !important;
      border: 1px solid rgb(71, 85, 105) !important;
      border-radius: 8px !important;
      padding: 0.75rem !important;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3) !important;
      font-size: 0.875rem !important;
    }

    /* Ensure all chart tooltips have proper contrast */
    [class*="recharts"] .recharts-tooltip-wrapper * {
      color: rgb(248, 250, 252) !important;
    }
    
    [class*="recharts"] .recharts-tooltip-item-name {
      color: rgb(203, 213, 225) !important;
    }
  `;

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[rgb(var(--background-rgb))] flex items-center justify-center">
        <style>{styleVariables}</style>
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[rgb(var(--primary-rgb))]"></div>
      </div>
    );
  }

  // Public landing page doesn't need this layout wrapper or auth checks
  if (currentPageName === "Landing") {
    return (
      <>
        <style>{styleVariables}</style>
        {children}
      </>
    );
  }
  
  // Checks for authenticated routes
  if (!user) {
    // If not logged in and not on landing page, redirect to landing for login
    if (typeof window !== "undefined") {
         window.location.href = createPageUrl("Landing");
    }
    return ( // Fallback while redirecting
         <div className="min-h-screen bg-[rgb(var(--background-rgb))] flex items-center justify-center">
            <style>{styleVariables}</style>
            <p className="text-[rgb(var(--foreground-rgb))]">Redirecionando para o login...</p>
        </div>
    );
  }

  if (user && user.status !== 'approved') {
    let title = "Acesso Restrito";
    let message = "Sua conta não tem permissão para acessar esta página no momento.";
    let icon = <ShieldOff className="w-12 h-12 text-yellow-400" />; // Default icon

    if (user.status === "pending") {
      title = "Aguardando Aprovação";
      message = "Sua conta está aguardando aprovação de um administrador. Você receberá acesso assim que for aprovado.";
      icon = <Target className="w-12 h-12 text-yellow-400" />;
    } else if (user.status === "blocked") {
      title = "Acesso Bloqueado";
      message = "Sua conta foi bloqueada por um administrador. Entre em contato para mais informações.";
      icon = <X className="w-12 h-12 text-red-400" />;
    } else if (user.status === "denied") {
      title = "Acesso Negado";
      message = "O acesso da sua conta foi negado por um administrador. Entre em contato com o suporte se acredita que isso é um erro.";
      icon = <ShieldOff className="w-12 h-12 text-red-400" />;
    }

    return (
      <div className="min-h-screen bg-[rgb(var(--background-rgb))] flex items-center justify-center p-4">
        <style>{styleVariables}</style>
        <div className="text-center bg-[rgb(var(--card-rgb))] p-8 md:p-12 rounded-lg border border-[rgb(var(--border-rgb))] shadow-xl max-w-md">
          <div className="w-20 h-20 bg-[rgba(var(--primary-rgb),0.1)] rounded-full flex items-center justify-center mx-auto mb-6">
            {icon}
          </div>
          <h2 className="text-2xl md:text-3xl font-bold text-[rgb(var(--card-foreground-rgb))] mb-4">{title}</h2>
          <p className="text-[rgb(var(--muted-foreground-rgb))] mb-8 text-base md:text-lg">{message}</p>
          <Button 
            onClick={handleLogout} 
            variant="outline" 
            className="text-[rgb(var(--muted-foreground-rgb))] border-[rgb(var(--border-rgb))] hover:bg-[rgb(var(--muted-rgb))] hover:text-[rgb(var(--foreground-rgb))] px-6 py-2">
            <LogOut className="w-4 h-4 mr-2" />
            Sair
          </Button>
        </div>
      </div>
    );
  }
  
  return (
    <SidebarProvider>
      <style>{styleVariables}</style>
      
      <div className="min-h-screen flex w-full bg-background">
        <Sidebar className="border-r border-[rgb(var(--sidebar-border-rgb))] bg-[rgb(var(--sidebar-background-rgb))] text-[rgb(var(--sidebar-foreground-rgb))] shadow-lg">
          <SidebarHeader className="border-b border-[rgb(var(--sidebar-border-rgb))] p-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-[rgb(var(--primary-rgb))] to-[rgb(var(--secondary-rgb))] rounded-lg flex items-center justify-center shadow-md">
                <BarChart3 className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="font-bold text-[rgb(var(--foreground-rgb))] text-lg">Football Data Analysis</h2>
                <p className="text-xs text-[rgb(var(--muted-foreground-rgb))] opacity-75">Backtesting Platform</p>
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
                  className={`sidebar-link flex items-center gap-3 ${
                    isActive ? 'sidebar-link-active' : ''
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

          <SidebarFooter className="border-t border-[rgb(var(--sidebar-border-rgb))] p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 bg-slate-700 rounded-full flex items-center justify-center">
                  <span className="text-sm text-white font-semibold">
                    {user?.full_name?.charAt(0)?.toUpperCase() || 'U'}
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-sm text-[rgb(var(--foreground-rgb))] truncate">
                    {user?.full_name || 'Usuário'}
                  </p>
                  <p className="text-xs text-[rgb(var(--muted-foreground-rgb))] opacity-75 truncate">
                    {user?.role === 'admin' ? 'Administrador' : 'Analista'}
                  </p>
                </div>
              </div>
              <Button
                onClick={handleLogout}
                variant="ghost"
                size="icon"
                className="text-[rgb(var(--muted-foreground-rgb))] hover:text-red-400 hover:bg-red-500/20 ml-2"
              >
                <LogOut className="w-4 h-4" />
              </Button>
            </div>
          </SidebarFooter>
        </Sidebar>

        <main className="flex-1 flex flex-col bg-background">
           <header className="bg-[rgb(var(--sidebar-background-rgb))] border-b border-[rgb(var(--sidebar-border-rgb))] px-4 py-3 lg:hidden sticky top-0 z-10 shadow-md">
            <div className="flex items-center gap-3">
              <SidebarTrigger className="text-[rgb(var(--foreground-rgb))] hover:text-[rgb(var(--primary-rgb))]">
                <Menu className="w-5 h-5" />
              </SidebarTrigger>
              <h1 className="text-lg font-semibold text-[rgb(var(--foreground-rgb))]">Football Data Analysis</h1>
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
