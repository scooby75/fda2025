
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { 
  BarChart3, 
  Trophy, 
  Wallet, 
  History, 
  Settings,
  TrendingUp,
  Target,
  Home
} from "lucide-react";

interface NavigationProps {
  activeSection: string;
  onSectionChange: (section: string) => void;
}

const Navigation = ({ activeSection, onSectionChange }: NavigationProps) => {
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: Home },
    { id: 'games', label: 'Jogos', icon: Trophy },
    { id: 'bankroll', label: 'Banca', icon: Wallet },
    { id: 'bets', label: 'Apostas', icon: History },
    { id: 'strategies', label: 'Estratégias', icon: Target },
    { id: 'analytics', label: 'Análises', icon: BarChart3 },
    { id: 'settings', label: 'Configurações', icon: Settings },
  ];

  return (
    <Card className="p-4 h-fit sticky top-6">
      <div className="space-y-2">
        <div className="flex items-center gap-2 mb-6">
          <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center">
            <TrendingUp className="h-5 w-5 text-primary-foreground" />
          </div>
          <h1 className="font-bold text-lg">BetAnalytics</h1>
        </div>
        
        {menuItems.map((item) => {
          const Icon = item.icon;
          return (
            <Button
              key={item.id}
              variant={activeSection === item.id ? "default" : "ghost"}
              className="w-full justify-start gap-3 h-10"
              onClick={() => onSectionChange(item.id)}
            >
              <Icon className="h-4 w-4" />
              {item.label}
            </Button>
          );
        })}
      </div>
    </Card>
  );
};

export default Navigation;
