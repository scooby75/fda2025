import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { BarChart3, TrendingUp, Target, Users } from "lucide-react";
import StatsCard from "./StatsCard";

const Dashboard = () => {
  // Fetch game data
  const { data: gameData } = useQuery({
    queryKey: ['gamedata'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('gamedata')
        .select('*');
      
      if (error) throw error;
      return data || [];
    },
  });

  // Fetch strategies
  const { data: strategies } = useQuery({
    queryKey: ['strategies'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('strategy')
        .select('*');
      
      if (error) throw error;
      return data || [];
    },
  });

  // Fetch users
  const { data: users } = useQuery({
    queryKey: ['users'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('profiles')
        .select('*');
      
      if (error) throw error;
      return data || [];
    },
  });

  const totalGames = gameData?.length || 0;
  const totalStrategies = strategies?.length || 0;
  const totalUsers = users?.length || 0;
  const profitableStrategies = strategies?.filter(s => s.roi > 0).length || 0;

  return (
    <div className="p-6 lg:p-8 space-y-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl lg:text-4xl font-bold bg-gradient-to-r from-white via-slate-200 to-slate-400 bg-clip-text text-transparent mb-2">
          Dashboard
        </h1>
        <p className="text-slate-400 text-lg">
          Visão geral da plataforma de backtesting
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard
          title="Total de Jogos"
          value={totalGames.toLocaleString()}
          icon={BarChart3}
          bgColor="bg-blue-500"
          trend="+12% este mês"
        />
        
        <StatsCard
          title="Estratégias Criadas"
          value={totalStrategies}
          icon={Target}
          bgColor="bg-emerald-500"
          trend="+8% esta semana"
        />
        
        <StatsCard
          title="Usuários Ativos"
          value={totalUsers}
          icon={Users}
          bgColor="bg-purple-500"
          trend="+15% este mês"
        />
        
        <StatsCard
          title="Estratégias Lucrativas"
          value={profitableStrategies}
          icon={TrendingUp}
          bgColor="bg-orange-500"
          trend={`${totalStrategies > 0 ? Math.round((profitableStrategies / totalStrategies) * 100) : 0}% do total`}
        />
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
          <CardHeader className="border-b border-slate-700">
            <CardTitle className="text-white">Estratégias Recentes</CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            {strategies && strategies.length > 0 ? (
              <div className="space-y-4">
                {strategies.slice(0, 5).map((strategy, index) => (
                  <div key={index} className="flex justify-between items-center p-3 bg-slate-700/30 rounded-lg">
                    <div>
                      <h4 className="text-white font-medium">{strategy.name}</h4>
                      <p className="text-slate-400 text-sm">{strategy.market}</p>
                    </div>
                    <div className="text-right">
                      <p className={`font-medium ${strategy.roi >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                        {strategy.roi?.toFixed(1)}% ROI
                      </p>
                      <p className="text-slate-400 text-sm">{strategy.total_bets} apostas</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <Target className="w-12 h-12 text-slate-600 mx-auto mb-4" />
                <p className="text-slate-400">Nenhuma estratégia criada ainda</p>
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
          <CardHeader className="border-b border-slate-700">
            <CardTitle className="text-white">Status do Sistema</CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-slate-300">Base de Dados</span>
                <span className="text-emerald-400 font-medium">Online</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-300">Jogos Históricos</span>
                <span className="text-emerald-400 font-medium">{totalGames.toLocaleString()}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-300">Última Atualização</span>
                <span className="text-slate-400">Hoje</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-300">Performance</span>
                <span className="text-emerald-400 font-medium">Excelente</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
