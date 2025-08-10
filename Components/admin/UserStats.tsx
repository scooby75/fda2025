
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, CheckCircle, XCircle, Clock, ShieldOff } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

interface UserStatsProps {
  stats: {
    total: number;
    pending: number;
    approved: number;
    denied: number;
    blocked: number;
  };
  isLoading: boolean;
}

export default function UserStats({ stats, isLoading }: UserStatsProps) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
        {Array(5).fill(0).map((_, i) => (
          <Card key={i} className="bg-card border-border">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="space-y-2">
                  <Skeleton className="h-4 w-24 bg-muted" />
                  <Skeleton className="h-8 w-16 bg-muted" />
                </div>
                <Skeleton className="w-12 h-12 rounded bg-muted" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  const statCards = [
    {
      title: "Total de Usuários",
      value: stats.total,
      icon: Users,
      color: "text-primary"
    },
    {
      title: "Pendentes",
      value: stats.pending,
      icon: Clock,
      color: "text-yellow-400"
    },
    {
      title: "Aprovados",
      value: stats.approved,
      icon: CheckCircle,
      color: "text-emerald-400"
    },
    {
      title: "Negados",
      value: stats.denied,
      icon: XCircle,
      color: "text-red-400"
    },
    {
      title: "Bloqueados",
      value: stats.blocked,
      icon: ShieldOff,
      color: "text-slate-400"
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
      {statCards.map((stat) => {
        const Icon = stat.icon;
        return (
          <Card key={stat.title} className="bg-card border-border shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground mb-1">
                    {stat.title}
                  </p>
                  <p className="text-3xl font-bold text-card-foreground">
                    {stat.value}
                  </p>
                </div>
                <div className={`p-3 rounded-full bg-muted/20 ${stat.color}`}>
                  <Icon className="w-6 h-6" />
                </div>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
