
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

import StrategyForm from "../Components/backtesting/strategyyform";
import StrategyResults from "../Components/backtesting/strategyresults";
import SavedStrategies from "../Components/backtesting/savedstrategies";
import BacktestingEngine from "../src/components/backtesting/BacktestingEngine";
import TelegramIntegration from "../Components/backtesting/telegramintegration";

interface StrategyData {
  id?: string;
  name: string;
  description: string;
  market: string;
  season?: string | string[];
  min_ranking_home?: number;
  max_ranking_home?: number;
  min_ranking_away?: number;
  max_ranking_away?: number;
  created_date?: string;
  unit_stake: number;
  min_odds: number;
  max_odds: number;
  start_date: string;
  end_date: string;
  leagues: string[];
  home_teams: string[];
  away_teams: string[];
  results?: any;
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

interface FormData {
  name: string;
  description: string;
  market: string;
  unit_stake: number;
  min_odds: number | null;
  max_odds: number | null;
  start_date: string;
  end_date: string;
  leagues: string[];
  home_teams: string[];
  away_teams: string[];
  season?: string;
}

interface StrategyFormProps {
  id: string;
  name: string;
  market: string;
  created_date: string;
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
        Strategy.filter({ created_by: currentUser.email }),
        GameData.list(),
        RankingHome.list(),
        RankingAway.list()
      ]);

      // Transform strategies data
      const transformedStrategies: StrategyData[] = strategiesData.map((s: any) => ({
        id: String(s.id || ''),
        name: s.name,
        description: s.description || '',
        market: s.market || 'Over 2.5',
        unit_stake: s.unit_stake || 1,
        min_odds: s.min_odds || 1,
        max_odds: s.max_odds || 10,
        start_date: s.start_date || '',
        end_date: s.end_date || '',
        leagues: s.leagues || [],
        home_teams: s.home_teams || [],
        away_teams: s.away_teams || [],
        results: s.results
      }));

      setStrategies(transformedStrategies);
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

  const handleRunBacktest = async (formData: FormData) => {
    setIsLoading(true);

    try {
      const backtestingEngine = new BacktestingEngine();
      const strategyData: StrategyData = {
        ...formData,
        description: formData.description || '',
        min_odds: formData.min_odds || 1,
        max_odds: formData.max_odds || 10,
        market: formData.market || 'Over 2.5'
      };
      
      const strategyForEngine = {
        name: strategyData.name,
        market: strategyData.market,
        id: strategyData.id ? Number(strategyData.id) : undefined
      };
      
      const results = backtestingEngine.runBacktest(strategyForEngine, gameData, rankingHomeData, rankingAwayData);

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
    const formData: FormData = {
      name: newStrategy.name,
      description: newStrategy.description,
      market: newStrategy.market,
      unit_stake: newStrategy.unit_stake,
      min_odds: newStrategy.min_odds,
      max_odds: newStrategy.max_odds,
      start_date: newStrategy.start_date,
      end_date: newStrategy.end_date,
      leagues: newStrategy.leagues,
      home_teams: newStrategy.home_teams,
      away_teams: newStrategy.away_teams,
      season: Array.isArray(newStrategy.season) ? newStrategy.season[0] : newStrategy.season
    };
    handleRunBacktest(formData);
  };

  const handleSaveStrategy = async (strategy: StrategyData) => {
    try {
      const strategyToSave = {
        ...strategy,
        results: currentResults
      };

      await Strategy.create(strategyToSave);
      loadData();
      setActiveTab("saved");
    } catch (error) {
      console.error("Erro ao salvar estratégia:", error);
    }
  };

  const handleLoadStrategy = (strategy: StrategyFormProps) => {
    const strategyData: StrategyData = {
      id: strategy.id,
      name: strategy.name,
      description: '',
      market: strategy.market,
      unit_stake: 1,
      min_odds: 1,
      max_odds: 10,
      start_date: '',
      end_date: '',
      leagues: [],
      home_teams: [],
      away_teams: [],
      created_date: strategy.created_date
    };
    setCurrentStrategy(strategyData);
    setActiveTab("form");
  };

  const handleStrategyChange = (strategy: FormData) => {
    const strategyData: StrategyData = {
      ...strategy,
      description: strategy.description || '',
      min_odds: strategy.min_odds || 1,
      max_odds: strategy.max_odds || 10
    };
    setCurrentStrategy(strategyData);
  };

  const convertStrategyToFormData = (strategy: StrategyData): FormData => {
    return {
      name: strategy.name,
      description: strategy.description || '',
      market: strategy.market,
      unit_stake: strategy.unit_stake,
      min_odds: strategy.min_odds || null,
      max_odds: strategy.max_odds || null,
      start_date: strategy.start_date,
      end_date: strategy.end_date,
      leagues: strategy.leagues,
      home_teams: strategy.home_teams,
      away_teams: strategy.away_teams,
      season: Array.isArray(strategy.season) ? strategy.season[0] : strategy.season
    };
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
                    initialStrategy={currentStrategy ? convertStrategyToFormData(currentStrategy) : undefined}
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
                onSaveStrategy={handleSaveStrategy}
                onRunNewBacktest={() => currentStrategy && handleRunNewBacktest(currentStrategy)}
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
              strategies={strategies.map(s => ({ 
                id: s.id || '',
                name: s.name,
                market: s.market,
                created_date: s.created_date || new Date().toISOString()
              }))}
              onLoadStrategy={handleLoadStrategy}
              onDeleteStrategy={async (id: string) => {
                await Strategy.delete(parseInt(id));
                loadData();
              }}
            />
          </TabsContent>

          <TabsContent value="telegram" className="space-y-6">
            <TelegramIntegration 
              strategies={strategies.map(s => ({ 
                id: s.id || '', 
                name: s.name,
                market: s.market || 'Over 2.5',
                created_date: s.created_date || new Date().toISOString()
              }))}
              gameData={gameData}
            />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
