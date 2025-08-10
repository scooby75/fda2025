
import React from 'react';
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, Clock, CheckCircle, XCircle } from "lucide-react";

interface Stats {
  total: number;
  pending: number;
  approved: number;
  denied: number;
}

interface UserStatsProps {
  stats: Stats;
  isLoading: boolean;
}

export default function UserStats({ stats, isLoading }: UserStatsProps) {
  const statCards = [
    {
      title: "Total de Usuários",
      value: stats.total,
      icon: Users,
      bgColor: "bg-blue-600",
      trend: "Registrados no sistema"
    },
    {
      title: "Aguardando Aprovação",
      value: stats.pending,
      icon: Clock,
      bgColor: "bg-yellow-600",
      trend: "Pendentes de análise"
    },
    {
      title: "Usuários Aprovados",
      value: stats.approved,
      icon: CheckCircle,
      bgColor: "bg-emerald-600",
      trend: "Com acesso liberado"
    },
    {
      title: "Usuários Negados",
      value: stats.denied,
      icon: XCircle,
      bgColor: "bg-red-600",
      trend: "Acesso negado"
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {statCards.map((stat, index) => (
        <Card key={index} className="bg-slate-800/50 border-slate-700 backdrop-blur-sm hover:bg-slate-800/70 transition-all duration-300">
          <div className="relative overflow-hidden">
            <div className={`absolute top-0 right-0 w-32 h-32 transform translate-x-8 -translate-y-8 ${stat.bgColor} rounded-full opacity-10`} />
            <CardHeader className="p-6">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-sm font-medium text-slate-400 mb-2">{stat.title}</p>
                  <CardTitle className="text-2xl lg:text-3xl font-bold text-white">
                    {isLoading ? '-' : stat.value}
                  </CardTitle>
                </div>
                <div className={`p-3 rounded-xl ${stat.bgColor} bg-opacity-20`}>
                  <stat.icon className={`w-6 h-6 ${stat.bgColor.replace('bg-', 'text-')}`} />
                </div>
              </div>
              <p className="text-xs text-slate-500 mt-2">{stat.trend}</p>
            </CardHeader>
          </div>
        </Card>
      ))}
    </div>
  );
}
