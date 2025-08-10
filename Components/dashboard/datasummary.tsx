
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Database, Users, Activity, TrendingUp } from "lucide-react";

interface DataSummaryProps {
  stats: any;
  totalRecords: number;
  isLoading: boolean;
}

export default function DataSummary({ stats, totalRecords, isLoading }: DataSummaryProps) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => (
          <Card key={i} className="bg-card border-border">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <Skeleton className="h-4 w-[100px]" />
              <Skeleton className="h-4 w-4" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-8 w-[60px] mb-2" />
              <Skeleton className="h-3 w-[120px]" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  const summaryData = [
    {
      title: "Total de Registros",
      value: totalRecords?.toLocaleString() || "0",
      description: "Jogos na base de dados",
      icon: Database,
      color: "text-blue-600"
    },
    {
      title: "Ligas Ativas",
      value: stats?.leagues || "0",
      description: "Competições diferentes",
      icon: Activity,
      color: "text-green-600"
    },
    {
      title: "Times Únicos",
      value: stats?.teams || "0",
      description: "Equipes cadastradas",
      icon: Users,
      color: "text-purple-600"
    },
    {
      title: "Última Atualização",
      value: stats?.lastUpdate || "N/A",
      description: "Dados mais recentes",
      icon: TrendingUp,
      color: "text-orange-600"
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {summaryData.map((item, index) => {
        const IconComponent = item.icon;
        return (
          <Card key={index} className="bg-card border-border hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {item.title}
              </CardTitle>
              <IconComponent className={`h-4 w-4 ${item.color}`} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-card-foreground">{item.value}</div>
              <p className="text-xs text-muted-foreground mt-1">
                {item.description}
              </p>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
