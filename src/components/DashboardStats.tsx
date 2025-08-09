
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp, TrendingDown, Target, DollarSign } from "lucide-react";

interface StatsCardProps {
  title: string;
  value: string;
  change: string;
  trend: "up" | "down" | "neutral";
  icon: React.ReactNode;
}

const StatsCard = ({ title, value, change, trend, icon }: StatsCardProps) => {
  const trendColor = trend === "up" ? "text-green-600" : trend === "down" ? "text-red-600" : "text-gray-600";
  const TrendIcon = trend === "up" ? TrendingUp : TrendingDown;

  return (
    <Card className="gradient-card border-0 shadow-lg hover:shadow-xl transition-all duration-300">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">{title}</CardTitle>
        <div className="h-8 w-8 text-primary">{icon}</div>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        <div className={`flex items-center text-xs ${trendColor} mt-1`}>
          <TrendIcon className="h-3 w-3 mr-1" />
          {change}
        </div>
      </CardContent>
    </Card>
  );
};

export const DashboardStats = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      <StatsCard
        title="Lucro Total"
        value="R$ 2.547,80"
        change="+12.5% vs mês anterior"
        trend="up"
        icon={<DollarSign />}
      />
      <StatsCard
        title="Taxa de Acerto"
        value="67.3%"
        change="+5.2% vs mês anterior"
        trend="up"
        icon={<Target />}
      />
      <StatsCard
        title="ROI"
        value="18.6%"
        change="+2.1% vs mês anterior"
        trend="up"
        icon={<TrendingUp />}
      />
      <StatsCard
        title="Apostas Ativas"
        value="12"
        change="3 pendentes hoje"
        trend="neutral"
        icon={<TrendingDown />}
      />
    </div>
  );
};
