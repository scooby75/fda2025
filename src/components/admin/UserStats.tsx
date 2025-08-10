
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, UserCheck, UserX, Clock } from "lucide-react";

interface Stats {
  total: number;
  approved: number;
  pending: number;
  blocked: number;
}

interface UserStatsProps {
  stats: Stats;
  isLoading: boolean;
}

export default function UserStats({ stats, isLoading }: UserStatsProps) {
  if (isLoading) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {[...Array(4)].map((_, i) => (
          <Card key={i} className="bg-card border-border">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-card-foreground">
                <div className="h-4 bg-muted animate-pulse rounded"></div>
              </CardTitle>
              <div className="h-4 w-4 bg-muted animate-pulse rounded"></div>
            </CardHeader>
            <CardContent>
              <div className="h-8 bg-muted animate-pulse rounded mb-1"></div>
              <div className="h-3 bg-muted animate-pulse rounded w-2/3"></div>
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
      color: "text-blue-600"
    },
    {
      title: "Aprovados",
      value: stats.approved,
      icon: UserCheck,
      color: "text-green-600"
    },
    {
      title: "Pendentes",
      value: stats.pending,
      icon: Clock,
      color: "text-yellow-600"
    },
    {
      title: "Bloqueados",
      value: stats.blocked,
      icon: UserX,
      color: "text-red-600"
    }
  ];

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {statCards.map((stat) => (
        <Card key={stat.title} className="bg-card border-border">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-card-foreground">
              {stat.title}
            </CardTitle>
            <stat.icon className={`h-4 w-4 ${stat.color}`} />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-card-foreground">{stat.value}</div>
            <p className="text-xs text-muted-foreground">
              {stat.title === "Aprovados" && `${((stat.value / stats.total) * 100).toFixed(1)}% do total`}
              {stat.title === "Pendentes" && `${((stat.value / stats.total) * 100).toFixed(1)}% do total`}
              {stat.title === "Bloqueados" && `${((stat.value / stats.total) * 100).toFixed(1)}% do total`}
              {stat.title === "Total de Usuários" && "usuários registrados"}
            </p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
