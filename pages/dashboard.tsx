
import React, { useState, useEffect } from "react";
import { Strategy } from "@/entities/Strategy";
import { GameData } from "@/entities/GameData";
import { User } from "@/entities/User";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import {
  BarChart3,
  Target,
  Database,
  TrendingUp,
  Settings,
  Users,
  Upload,
  Calendar,
  DollarSign
} from "lucide-react";

import StatsCard from "../Components/dashboard/statscard";
import QuickActions from "../Components/dashboard/QuickActions";
import RecentStrategies from "../Components/dashboard/recentstrategies";
import DataSummary from "../Components/dashboard/datasummary";

interface StrategyData {
  id?: number;
  name: string;
  market: string;
  results?: {
    roi: number;
    totalGames: number;
    wins: number;
    profit: number;
  };
  created_date?: string;
}

export default function Dashboard() {
  const [user, setUser] = useState<any>(null);
  const [strategies, setStrategies] = useState<StrategyData[]>([]);
  const [gameDataCount, setGameDataCount] = useState<number>(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setIsLoading(true);
    try {
      const currentUser = await User.me();
      setUser(currentUser);

      const [strategiesData, allGameData] = await Promise.all([
        Strategy.filter({ created_by: currentUser.email }),
        GameData.list()
      ]);

      setStrategies(strategiesData as StrategyData[]);
      setGameDataCount(allGameData.length);
    } catch (error) {
      console.error("Erro ao carregar dados:", error);
    }
    setIsLoading(false);
  };

  const getBestStrategy = () => {
    if (strategies.length === 0) return null;
    
    // Find strategy with highest ROI that has results
    const strategiesWithResults = strategies.filter(s => s.results && s.results.roi);
    if (strategiesWithResults.length === 0) return null;
    
    const bestStrategy = strategiesWithResults.reduce((best, current) => 
      (current.results!.roi > (best.results?.roi || 0)) ? current : best
    );

    return {
      ...bestStrategy,
      name: bestStrategy.name || 'Estratégia sem nome'
    };
  };

  const getRecentStrategies = () => {
    return strategies
      .sort((a, b) => 
        new Date(b.created_date || '').getTime() - new Date(a.created_date || '').getTime()
      )
      .slice(0, 5);
  };

  const getTotalProfit = () => {
    return strategies
      .filter(s => s.results)
      .reduce((sum, s) => sum + (s.results?.profit || 0), 0);
  };

  const getTotalBets = () => {
    return strategies
      .filter(s => s.results)
      .reduce((sum, s) => sum + (s.results?.totalGames || 0), 0);
  };

  const getAverageROI = () => {
    const strategiesWithROI = strategies.filter(s => s.results && s.results.roi);
    if (strategiesWithROI.length === 0) return 0;
    
    const totalROI = strategiesWithROI.reduce((sum, s) => sum + (s.results?.roi || 0), 0);
    return totalROI / strategiesWithROI.length;
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white p-4 sm:p-6 lg:p-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-400 mx-auto mb-4"></div>
            <p className="text-slate-300">Carregando dashboard...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl lg:text-4xl font-bold text-white mb-2">
            Bem-vindo de volta, {user?.full_name || user?.email || 'Usuário'}!
          </h1>
          <p className="text-slate-300 text-lg">
            Aqui está um resumo do seu desempenho e atividades recentes
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatsCard
            title="Total de Estratégias"
            value={strategies.length}
            icon={Target}
            trend="up"
            trendValue="12%"
            description="vs. mês anterior"
          />
          <StatsCard
            title="Lucro Total"
            value={`R$ ${getTotalProfit().toFixed(2)}`}
            icon={DollarSign}
            trend="up"
            trendValue="8.2%"
            description="vs. mês anterior"
          />
          <StatsCard
            title="ROI Médio"
            value={`${getAverageROI().toFixed(1)}%`}
            icon={TrendingUp}
            trend={getAverageROI() >= 0 ? "up" : "down"}
            trendValue={`${Math.abs(getAverageROI()).toFixed(1)}%`}
            description="média geral"
          />
          <StatsCard
            title="Total de Apostas"
            value={getTotalBets()}
            icon={BarChart3}
            trend="up"
            trendValue="15%"
            description="vs. mês anterior"
          />
        </div>

        {/* Quick Actions and Data Summary */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <div className="lg:col-span-2">
            <QuickActions />
          </div>
          <div>
            <DataSummary
              totalGames={gameDataCount}
              totalStrategies={strategies.length}
              lastUpdated={new Date().toLocaleDateString('pt-BR')}
            />
          </div>
        </div>

        {/* Recent Strategies */}
        <div className="mb-8">
          <RecentStrategies 
            strategies={getRecentStrategies()}
            bestStrategy={getBestStrategy()}
          />
        </div>

        {/* Navigation Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Link to={createPageUrl("Backtesting")}>
            <Card className="bg-slate-800/50 border-slate-700 hover:bg-slate-700/50 transition-colors cursor-pointer h-full">
              <CardHeader className="pb-4">
                <CardTitle className="text-white flex items-center gap-3">
                  <BarChart3 className="w-6 h-6 text-emerald-400" />
                  Sistema de Backtesting
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-slate-300">
                  Teste e analise suas estratégias de apostas com dados históricos
                </p>
              </CardContent>
            </Card>
          </Link>

          <Link to={createPageUrl("BankrollManagement")}>
            <Card className="bg-slate-800/50 border-slate-700 hover:bg-slate-700/50 transition-colors cursor-pointer h-full">
              <CardHeader className="pb-4">
                <CardTitle className="text-white flex items-center gap-3">
                  <DollarSign className="w-6 h-6 text-blue-400" />
                  Gestão de Bankroll
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-slate-300">
                  Gerencie suas bancas e controle seus investimentos
                </p>
              </CardContent>
            </Card>
          </Link>

          <Link to={createPageUrl("DailyGames")}>
            <Card className="bg-slate-800/50 border-slate-700 hover:bg-slate-700/50 transition-colors cursor-pointer h-full">
              <CardHeader className="pb-4">
                <CardTitle className="text-white flex items-center gap-3">
                  <Calendar className="w-6 h-6 text-purple-400" />
                  Jogos do Dia
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-slate-300">
                  Veja os jogos de hoje e encontre oportunidades
                </p>
              </CardContent>
            </Card>
          </Link>
        </div>
      </div>
    </div>
  );
}
