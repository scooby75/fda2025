import React, { useState, useEffect } from "react";
import { Strategy } from "@/entities/Strategy";
import { GameData } from "@/entities/GameData";
import { User } from "@/entities/User";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import {
  TrendingUp,
  Target,
  Calendar,
  Users,
  BarChart3,
  ArrowRight,
  Activity,
  Zap,
  Database,
  Settings
} from "lucide-react";

import StatsCard from "../Components/dashboard/statscard";
import RecentStrategies from "../Components/dashboard/recentstrategies";
import QuickActions from "../Components/dashboard/QuickActions";
import DataSummary from "../Components/dashboard/datasummary";

interface StrategyData {
  id?: number;
  name: string;
  market?: string;
  created_date?: string;
  results?: {
    roi: number;
    totalGames: number;
    wins: number;
    profit: number;
  };
}

interface GameDataType {
  id?: string;
  home: string;
  away: string;
  date: string;
  league: string;
  season?: number;
  [key: string]: any;
}

interface UserData {
  id: string;
  email: string;
  role?: string;
  [key: string]: any;
}

export default function Dashboard() {
  const [strategies, setStrategies] = useState<StrategyData[]>([]);
  const [gameData, setGameData] = useState<GameDataType[]>([]);
  const [currentUser, setCurrentUser] = useState<UserData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setIsLoading(true);
    try {
      const user = await User.me();
      const [strategiesData, allGameData] = await Promise.all([
        Strategy.filter({ created_by: user.email }),
        GameData.list()
      ]);

      setCurrentUser(user);
      setStrategies(strategiesData as StrategyData[]);
      setGameData(allGameData as GameDataType[]);
    } catch (error) {
      console.error("Error loading data:", error);
    }
    setIsLoading(false);
  };

  const getDateRangeStats = () => {
    const now = new Date();
    const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

    return {
      totalStrategies: strategies.length,
      monthlyStrategies: strategies.filter((s: StrategyData) => {
        if (!s.created_date) return false;
        const createdDate = new Date(s.created_date);
        return createdDate >= thirtyDaysAgo;
      }).length,
      weeklyStrategies: strategies.filter((s: StrategyData) => {
        if (!s.created_date) return false;
        const createdDate = new Date(s.created_date);
        return createdDate >= sevenDaysAgo;
      }).length
    };
  };

  const getPerformanceStats = () => {
    const strategiesWithResults = strategies.filter((s: StrategyData) => s.results);
    
    if (strategiesWithResults.length === 0) {
      return {
        avgROI: 0,
        totalProfit: 0,
        winRate: 0,
        totalGames: 0
      };
    }

    const totalROI = strategiesWithResults.reduce((acc, s) => acc + (s.results?.roi || 0), 0);
    const totalProfit = strategiesWithResults.reduce((acc, s) => acc + (s.results?.profit || 0), 0);
    const totalWins = strategiesWithResults.reduce((acc, s) => acc + (s.results?.wins || 0), 0);
    const totalGames = strategiesWithResults.reduce((acc, s) => acc + (s.results?.totalGames || 0), 0);

    return {
      avgROI: totalROI / strategiesWithResults.length,
      totalProfit,
      winRate: totalGames > 0 ? (totalWins / totalGames) * 100 : 0,
      totalGames
    };
  };

  const getBestStrategy = (): (StrategyData & { name: string | null }) | null => {
    const strategiesWithResults = strategies.filter((s: StrategyData) => s.results?.roi);
    if (strategiesWithResults.length === 0) {
      return {
        results: { roi: 0, totalGames: 0, wins: 0, profit: 0 },
        name: null,
        id: 0,
        market: '',
        created_date: ''
      } as StrategyData & { name: string | null };
    }
    
    return strategiesWithResults.reduce((best, current) => 
      (current.results?.roi || 0) > (best.results?.roi || 0) ? current : best
    ) as StrategyData & { name: string | null };
  };

  const dateRangeStats = getDateRangeStats();
  const performanceStats = getPerformanceStats();
  const bestStrategy = getBestStrategy();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background text-foreground p-4 sm:p-6 lg:p-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Carregando dashboard...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl lg:text-4xl font-bold text-foreground mb-2">
              Dashboard de Análise
            </h1>
            <p className="text-muted-foreground text-lg">
              Bem-vindo ao seu centro de controle de apostas esportivas
            </p>
          </div>
          <QuickActions />
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatsCard
            title="Total de Estratégias"
            value={dateRangeStats.totalStrategies.toString()}
            icon={Target}
            description="estratégias criadas"
          />
          <StatsCard
            title="ROI Médio"
            value={`${performanceStats.avgROI.toFixed(1)}%`}
            icon={TrendingUp}
            description="retorno sobre investimento"
          />
          <StatsCard
            title="Taxa de Acerto"
            value={`${performanceStats.winRate.toFixed(1)}%`}
            icon={Activity}
            description="de apostas certas"
          />
          <StatsCard
            title="Melhor Estratégia"
            value={bestStrategy?.name || "Nenhuma"}
            icon={Zap}
            description={`${(bestStrategy?.results?.roi || 0).toFixed(1)}% ROI`}
          />
        </div>

        {/* Admin Panel Link */}
        {currentUser?.role === 'admin' && (
          <Card className="bg-card border-border backdrop-blur-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Settings className="w-6 h-6 text-primary" />
                  <div>
                    <h3 className="text-lg font-semibold text-card-foreground">Painel Administrativo</h3>
                    <p className="text-muted-foreground">Gerencie usuários e configurações do sistema</p>
                  </div>
                </div>
                <Link to={createPageUrl("Admin")}>
                  <Button className="bg-primary text-primary-foreground hover:bg-primary/90">
                    Acessar Painel
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Recent Strategies */}
          <div className="lg:col-span-2">
            <RecentStrategies 
              strategies={strategies}
            />
          </div>

          {/* Data Summary */}
          <div>
            <DataSummary 
              gameDataCount={gameData.length}
              strategiesCount={strategies.length}
              lastUpdated={new Date().toISOString()}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
