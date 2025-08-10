
import React from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { 
  BarChart3, 
  Target, 
  Wallet, 
  Calendar,
  Settings,
  LogOut,
  User
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { createPageUrl } from '@/utils';

interface UserData {
  id: string;
  email: string;
  role?: string;
}

export default function Layout() {
  const location = useLocation();
  const [user, setUser] = React.useState<UserData | null>(null);

  React.useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ? { 
        id: session.user.id, 
        email: session.user.email || '',
        role: session.user.user_metadata?.role
      } : null);
    });

    // Listen for changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ? { 
        id: session.user.id, 
        email: session.user.email || '',
        role: session.user.user_metadata?.role
      } : null);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
  };

  const navigationItems = [
    {
      name: 'Dashboard',
      href: createPageUrl('Dashboard'),
      icon: BarChart3,
    },
    {
      name: 'Backtesting',
      href: createPageUrl('Backtesting'),
      icon: Target,
    },
    {
      name: 'Gestão de Banca',
      href: createPageUrl('BankrollManagement'),
      icon: Wallet,
    },
    {
      name: 'Jogos do Dia',
      href: createPageUrl('DailyGames'),
      icon: Calendar,
    },
  ];

  if (!user) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="max-w-md w-full space-y-8 p-8">
          <div className="text-center">
            <h2 className="mt-6 text-3xl font-bold text-foreground">
              Sistema de Backtesting
            </h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Faça login para acessar o sistema
            </p>
          </div>
          <Button
            onClick={() => supabase.auth.signInWithOAuth({ provider: 'google' })}
            className="w-full"
          >
            Entrar com Google
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Sidebar */}
      <div className="fixed inset-y-0 left-0 z-50 w-64 bg-card border-r border-border">
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="flex items-center px-6 py-4 border-b border-border">
            <Target className="w-8 h-8 text-primary mr-3" />
            <h1 className="text-xl font-semibold text-card-foreground">
              Backtesting
            </h1>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-4 py-6 space-y-2">
            {navigationItems.map((item) => {
              const isActive = location.pathname === item.href;
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors ${
                    isActive
                      ? 'bg-primary text-primary-foreground'
                      : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                  }`}
                >
                  <item.icon className="w-5 h-5 mr-3" />
                  {item.name}
                </Link>
              );
            })}
          </nav>

          {/* User Info */}
          <div className="px-4 py-4 border-t border-border">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <User className="w-8 h-8 text-muted-foreground mr-3" />
                <div>
                  <p className="text-sm font-medium text-card-foreground">
                    {user.email}
                  </p>
                </div>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleSignOut}
                className="text-muted-foreground hover:text-foreground"
              >
                <LogOut className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="pl-64">
        <main>
          <Outlet />
        </main>
      </div>
    </div>
  );
}
