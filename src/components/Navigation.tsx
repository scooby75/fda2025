
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { BarChart3, Calendar, Target, Wallet, Users, Database } from 'lucide-react';
import { createPageUrl } from '@/utils';

const Navigation = () => {
  const location = useLocation();

  const navItems = [
    {
      name: 'Dashboard',
      href: createPageUrl('Dashboard'),
      icon: BarChart3
    },
    {
      name: 'Backtesting',
      href: createPageUrl('Backtesting'),
      icon: Target
    },
    {
      name: 'Jogos do Dia',
      href: createPageUrl('DailyGames'),
      icon: Calendar
    },
    {
      name: 'Gestão de Banca',
      href: createPageUrl('BankrollManagement'),
      icon: Wallet
    },
    {
      name: 'Admin',
      href: createPageUrl('Admin'),
      icon: Users
    }
  ];

  return (
    <nav className="mb-8">
      <div className="flex flex-wrap gap-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.href;
          
          return (
            <Link key={item.name} to={item.href}>
              <Button
                variant={isActive ? "default" : "outline"}
                className={`${
                  isActive 
                    ? 'bg-primary text-primary-foreground' 
                    : 'border-border text-muted-foreground hover:bg-muted/20'
                }`}
              >
                <Icon className="w-4 h-4 mr-2" />
                {item.name}
              </Button>
            </Link>
          );
        })}
      </div>
    </nav>
  );
};

export default Navigation;
