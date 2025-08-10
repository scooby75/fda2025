
import React, { useState, useEffect } from "react";
import { Strategy } from "@/entities/Strategy";
import { GameData } from "@/entities/GameData";
import { User } from "@/entities/User";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  BarChart3,
  Target,
  TrendingUp,
  Database,
  Activity,
  Calendar,
  Users,
  Zap
} from "lucide-react";

import QuickActions from "../Components/dashboard/QuickActions";
import StatsCard from "../Components/dashboard/statscard";
import DataSummary from "../Components/dashboard/datasummary";
import RecentStrategies from "../Components/dashboard/recentstrategies";

interface StrategyData {
  id?: number;
  name: string | null;
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
  const [strategies, setStrategies] = useState<StrategyData[]>([]);
  const [gameDataCount, setGameDataCount] = useState(0);
  const [gameData, setGameData] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("overview");

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setIsLoading(true);
    try {
      const currentUser = await User.me();
      const [strategiesData, allGameData] = await Promise.all([
        Strategy.filter({ created_by: currentUser.email }),
        GameData.list()
      ]);

      // Transform strategies data with proper name handling
      const transformedStrategies: StrategyData[] = strategiesData
        .filter((s: any) => s.name) // Only include strategies with names
        .map((s: any) => ({
          id: s.id,
          name: s.name,
          market: s.market || 'Over 2.5',
          results: {
            roi: Math.random() * 30 - 10, // Mock data
            totalGames: Math.floor(Math.random() * 100) + 10,
            wins: Math.floor(Math.random() * 50) + 5,
            profit: Math.random() * 1000 - 200
          },
          created_date: s.created_at || new Date().toISOString()
        }));

      setStrategies(transformedStrategies);
      setGameDataCount(allGameData.length);
      setGameData(allGameData);
    } catch (error) {
      console.error("Erro ao carregar dados:", error);
    }
    setIsLoading(false);
  };

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

  // Calculate stats
  const totalStrategies = strategies.length;
  const totalGames = gameDataCount;
  const bestStrategy = strategies.length > 0 
    ? strategies.reduce((best, current) => 
        (current.results?.roi || 0) > (best.results?.roi || 0) ? current : best
      )
    : null;
  
  const averageROI = strategies.length > 0 
    ? strategies.reduce((sum, s) => sum + (s.results?.roi || 0), 0) / strategies.length
    : 0;

  const lastUpdated = new Date().toLocaleDateString('pt-BR');

  return (
    <div className="min-h-screen bg-background text-foreground p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl lg:text-4xl font-semibold text-foreground mb-2">
            Dashboard
          </h1>
          <p className="text-muted-foreground text-lg">
            Visão geral do seu sistema de apostas esportivas
          </p>
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full max-w-md grid-cols-3 bg-card border border-border text-muted-foreground">
            <TabsTrigger
              value="overview"
              className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
            >
              <Activity className="w-4 h-4 mr-2" />
              Visão Geral
            </TabsTrigger>
            <TabsTrigger
              value="analytics"
              className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
            >
              <BarChart3 className="w-4 h-4 mr-2" />
              Analytics
            </TabsTrigger>
            <TabsTrigger
              value="actions"
              className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
            >
              <Zap className="w-4 h-4 mr-2" />
              Ações Rápidas
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <StatsCard
                title="Estratégias"
                value={totalStrategies.toString()}
                icon={Target}
                description="Total de estratégias criadas"
              />
              <StatsCard
                title="Jogos"
                value={totalGames.toString()}
                icon={Database}
                description="Dados de jogos disponíveis"
              />
              <StatsCard
                title="ROI Médio"
                value={`${averageROI.toFixed(1)}%`}
                icon={TrendingUp}
                description="Retorno médio das estratégias"
              />
              <StatsCard
                title="Última Atualização"
                value={lastUpdated}
                icon={Calendar}
                description="Dados atualizados"
              />
            </div>

            {/* Main Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Data Summary */}
              <div className="lg:col-span-2">
                <DataSummary
                  strategies={strategies.filter(s => s.name !== null).map(s => ({
                    ...s,
                    name: s.name!
                  }))}
                  gameData={gameData}
                  lastUpdated={lastUpdated}
                />
              </div>

              {/* Recent Strategies */}
              <div className="lg:col-span-1">
                <RecentStrategies
                  strategies={strategies.filter(s => s.name !== null).map(s => ({
                    ...s,
                    name: s.name!
                  }))}
                />
              </div>
            </div>
          </TabsContent>

          <TabsContent value="analytics" className="space-y-6">
            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle className="text-card-foreground flex items-center gap-2">
                  <BarChart3 className="w-6 h-6 text-primary" />
                  Analytics Avançados
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-12">
                  <BarChart3 className="w-16 h-16 text-muted-foreground/50 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-card-foreground mb-2">
                    Em Desenvolvimento
                  </h3>
                  <p className="text-muted-foreground">
                    Relatórios e análises detalhadas estarão disponíveis em breve
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="actions" className="space-y-6">
            <QuickActions />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
