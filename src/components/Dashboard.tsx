
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp, Users, Database, BarChart3, DollarSign, Target } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import TodaysGames from "@/components/TodaysGames";
import RecentBets from "@/components/RecentBets";
import StatsCard from "../statscard";

const Dashboard = () => {
  // Fetch dashboard stats
  const { data: stats } = useQuery({
    queryKey: ['dashboard-stats'],
    queryFn: async () => {
      const [betsResult, bankrollResult, gamesResult, strategiesResult] = await Promise.all([
        supabase.from('bet_transaction').select('*', { count: 'exact' }),
        supabase.from('bankroll').select('*'),
        supabase.from('dailygame').select('*', { count: 'exact' }),
        supabase.from('strategy').select('*', { count: 'exact' })
      ]);

      const totalProfit = betsResult.data?.reduce((sum, bet) => sum + (Number(bet.profit) || 0), 0) || 0;
      const totalBalance = bankrollResult.data?.reduce((sum, bank) => sum + (Number(bank.current_balance) || 0), 0) || 0;

      return {
        totalBets: betsResult.count || 0,
        totalProfit,
        totalBalance,
        gamesCount: gamesResult.count || 0,
        strategiesCount: strategiesResult.count || 0
      };
    },
  });

  return (
    <div className="p-6 lg:p-8 space-y-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl lg:text-4xl font-bold bg-gradient-to-r from-white via-slate-200 to-slate-400 bg-clip-text text-transparent mb-2">
          Dashboard
        </h1>
        <p className="text-slate-400 text-lg">
          Visão geral da sua plataforma de análise esportiva
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <StatsCard
          title="Total de Apostas"
          value={stats?.totalBets?.toString() || "0"}
          icon={Target}
          bgColor="bg-blue-500"
          trend="+12% este mês"
        />
        
        <StatsCard
          title="Lucro Total"
          value={`R$ ${stats?.totalProfit?.toFixed(2) || "0.00"}`}
          icon={TrendingUp}
          bgColor="bg-emerald-500"
          trend={stats?.totalProfit && stats.totalProfit > 0 ? "+ROI positivo" : "ROI negativo"}
        />
        
        <StatsCard
          title="Saldo Total"
          value={`R$ ${stats?.totalBalance?.toFixed(2) || "0.00"}`}
          icon={DollarSign}
          bgColor="bg-purple-500"
        />
        
        <StatsCard
          title="Jogos Disponíveis"
          value={stats?.gamesCount?.toString() || "0"}
          icon={Database}
          bgColor="bg-orange-500"
        />
        
        <StatsCard
          title="Estratégias"
          value={stats?.strategiesCount?.toString() || "0"}
          icon={BarChart3}
          bgColor="bg-indigo-500"
        />
        
        <StatsCard
          title="Usuários Ativos"
          value="5"
          icon={Users}
          bgColor="bg-pink-500"
        />
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <TodaysGames />
        <RecentBets />
      </div>

      {/* Additional Info Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <BarChart3 className="h-5 w-5 text-emerald-400" />
              Performance Recente
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-slate-400">Taxa de Acerto (7 dias)</span>
                <span className="text-emerald-400 font-semibold">67.3%</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-400">ROI Médio</span>
                <span className="text-blue-400 font-semibold">+8.2%</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-400">Maior Sequência</span>
                <span className="text-purple-400 font-semibold">5 green</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Database className="h-5 w-5 text-blue-400" />
              Dados da Plataforma
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-slate-400">Jogos Históricos</span>
                <span className="text-blue-400 font-semibold">50,247</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-400">Ligas Cobertas</span>
                <span className="text-emerald-400 font-semibold">25</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-400">Última Atualização</span>
                <span className="text-slate-300">Há 2 horas</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
