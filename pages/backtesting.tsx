
import React, { useState, useEffect } from "react";
import { Strategy } from "@/entities/Strategy";
import { GameData } from "@/entities/GameData";
import { RankingHome } from "@/entities/RankingHome";
import { RankingAway } from "@/entities/RankingAway";
import { User } from "@/entities/User";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import {
  ArrowLeft,
  Target,
  TrendingUp,
  Save,
  Play,
  Settings,
  MessageCircle
} from "lucide-react";

import StrategyForm from "../Components/backtesting/strategyform";
import StrategyResults from "../Components/backtesting/strategyresults";
import SavedStrategies from "../Components/backtesting/savedstrategies";
import BacktestingEngine from "../Components/backtesting/backtestingengine";
import TelegramIntegration from "../Components/backtesting/telegramintegration";

interface StrategyData {
  id?: number;
  name: string;
  market: string;
  season?: string | string[];
  min_ranking_home?: number;
  max_ranking_home?: number;
  min_ranking_away?: number;
  max_ranking_away?: number;
  created_date?: string;
  [key: string]: any;
}

interface GameDataType {
  id?: string;
  home: string;
  away: string;
  date: string;
  league: string;
  season?: number;
  goals_h_ft?: number;
  goals_a_ft?: number;
  [key: string]: any;
}

interface RankingData {
  id: string;
  team: string;
  position: number;
  season: string;
  [key: string]: any;
}

export default function Backtesting() {
  const [activeTab, setActiveTab] = useState("form");
  const [strategies, setStrategies] = useState<StrategyData[]>([]);
  const [gameData, setGameData] = useState<GameDataType[]>([]);
  const [rankingHomeData, setRankingHomeData] = useState<RankingData[]>([]);
  const [rankingAwayData, setRankingAwayData] = useState<RankingData[]>([]);
  const [currentStrategy, setCurrentStrategy] = useState<StrategyData | null>(null);
  const [currentResults, setCurrentResults] = useState<any | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isDataLoading, setIsDataLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setIsDataLoading(true);
    try {
      const currentUser = await User.me();
      const [strategiesData, allGameData, allRankingHome, allRankingAway] = await Promise.all([
        Strategy.filter({ created_by: currentUser.email }, "-created_date"),
        GameData.list(),
        RankingHome.list(),
        RankingAway.list()
      ]);

      setStrategies(strategiesData as StrategyData[]);
      setGameData(allGameData as GameDataType[]);
      
      // Transform ranking data to include season
      const transformedRankingHome = allRankingHome.map((r: any) => ({
        ...r,
        season: r.season || '2024'
      }));
      
      const transformedRankingAway = allRankingAway.map((r: any) => ({
        ...r,
        season: r.season || '2024'
      }));
      
      setRankingHomeData(transformedRankingHome);
      setRankingAwayData(transformedRankingAway);
    } catch (error) {
      console.error("Erro ao carregar dados:", error);
    }
    setIsDataLoading(false);
  };

  const handleRunBacktest = async (strategyData: StrategyData) => {
    setIsLoading(true);

    try {
      const backtestingEngine = new BacktestingEngine();
      const results = backtestingEngine.runBacktest(strategyData, gameData, rankingHomeData, rankingAwayData);

      setCurrentResults(results);
      setCurrentStrategy(strategyData);
      setActiveTab("results");
    } catch (error) {
      console.error("Erro no backtesting:", error);
    }

    setIsLoading(false);
  };

  const handleRunNewBacktest = (newStrategy: StrategyData) => {
    setCurrentStrategy(newStrategy);
    handleRunBacktest(newStrategy);
  };

  const handleSaveStrategy = async (strategyData: StrategyData, results: any) => {
    try {
      const strategyToSave = {
        ...strategyData,
        results: results
      };

      await Strategy.create(strategyToSave);
      loadData();
      setActiveTab("saved");
    } catch (error) {
      console.error("Erro ao salvar estratégia:", error);
    }
  };

  const handleLoadStrategy = (strategy: StrategyData) => {
    setCurrentStrategy(strategy);
    setCurrentResults(strategy.results);
    setActiveTab("form");
  };

  const handleStrategyChange = (updatedStrategy: StrategyData) => {
    setCurrentStrategy(updatedStrategy);
  };

  return (
    <div className="min-h-screen bg-background text-foreground p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Link to={createPageUrl("Dashboard")}>
            <Button variant="outline" size="icon" className="border-border text-muted-foreground hover:bg-muted/20">
              <ArrowLeft className="w-4 h-4" />
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl lg:text-4xl font-semibold text-foreground mb-1">
              Sistema de Backtesting
            </h1>
            <p className="text-muted-foreground text-lg">
              Teste e analise suas estratégias de apostas esportivas
            </p>
          </div>
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full max-w-md grid-cols-4 bg-card border border-border text-muted-foreground">
            <TabsTrigger
              value="form"
              className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
            >
              <Settings className="w-4 h-4 mr-2" />
              Configurar
            </TabsTrigger>
            <TabsTrigger
              value="results"
              className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
            >
              <TrendingUp className="w-4 h-4 mr-2" />
              Resultados
            </TabsTrigger>
            <TabsTrigger
              value="saved"
              className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
            >
              <Save className="w-4 h-4 mr-2" />
              Salvos
            </TabsTrigger>
            <TabsTrigger
              value="telegram"
              className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
            >
              <MessageCircle className="w-4 h-4 mr-2" />
              Telegram
            </TabsTrigger>
          </TabsList>

          <TabsContent value="form" className="space-y-6">
            <Card className="bg-card border-border backdrop-blur-sm">
              <CardHeader className="border-b border-border">
                <CardTitle className="text-xl text-card-foreground flex items-center gap-2">
                  <Target className="w-6 h-6 text-primary" />
                  Configurar Estratégia de Backtesting
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                {isDataLoading ? (
                  <div className="text-center py-12">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
                    <p className="text-muted-foreground">Carregando dados dos jogos...</p>
                  </div>
                ) : (
                  <StrategyForm
                    gameData={gameData}
                    rankingHomeData={rankingHomeData}
                    rankingAwayData={rankingAwayData}
                    onRunBacktest={handleRunBacktest}
                    isLoading={isLoading}
                    initialStrategy={currentStrategy}
                    onStrategyChange={handleStrategyChange}
                  />
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="results" className="space-y-6">
            {currentResults && currentStrategy ? (
              <StrategyResults
                strategy={currentStrategy}
                results={currentResults}
                gameData={gameData}
                onSaveStrategy={() => handleSaveStrategy(currentStrategy, currentResults)}
                onRunNewBacktest={() => handleRunNewBacktest(currentStrategy)}
              />
            ) : (
              <Card className="bg-card border-border">
                <CardContent className="p-12 text-center">
                  <Play className="w-16 h-16 text-muted-foreground/50 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-card-foreground mb-2">
                    Nenhum resultado disponível
                  </h3>
                  <p className="text-muted-foreground mb-6">
                    Configure e execute uma estratégia para ver os resultados
                  </p>
                  <Button
                    onClick={() => setActiveTab("form")}
                    className="bg-primary text-primary-foreground hover:bg-primary/90"
                  >
                    Configurar Estratégia
                  </Button>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="saved" className="space-y-6">
            <SavedStrategies
              strategies={strategies as any}
              onLoadStrategy={handleLoadStrategy}
              onDeleteStrategy={async (strategyId: string) => {
                await Strategy.delete(parseInt(strategyId));
                loadData();
              }}
            />
          </TabsContent>

          <TabsContent value="telegram" className="space-y-6">
            <TelegramIntegration 
              strategies={strategies}
              gameData={gameData}
            />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
