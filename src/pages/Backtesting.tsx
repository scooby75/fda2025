
import React, { useState, useEffect } from "react";
import { Strategy } from "@/entities/Strategy";
import { GameData } from "@/entities/GameData";
import { RankingHome } from "@/entities/RankingHome";
import { RankingAway } from "@/entities/RankingAway";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { ArrowLeft, Target, Save, BarChart3 } from "lucide-react";
import { StrategyData, GameDataType } from "@/types";

import StrategyForm from "../Components/backtesting/strategyyform";
import StrategyResults from "../Components/backtesting/strategyresults";
import SavedStrategies from "../Components/backtesting/savedstrategies";
import BacktestingEngine from "@/components/backtesting/BacktestingEngine";

export default function Backtesting() {
  const [activeTab, setActiveTab] = useState("create");
  const [currentStrategy, setCurrentStrategy] = useState<StrategyData | null>(null);
  const [backtestResults, setBacktestResults] = useState<any>(null);
  const [gameData, setGameData] = useState<GameDataType[]>([]);
  const [rankingHomeData, setRankingHomeData] = useState<any[]>([]);
  const [rankingAwayData, setRankingAwayData] = useState<any[]>([]);
  const [savedStrategies, setSavedStrategies] = useState<StrategyData[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setIsLoading(true);
    try {
      const [gameDataRes, rankingHomeRes, rankingAwayRes, strategiesRes] = await Promise.all([
        GameData.list(),
        RankingHome.list(),
        RankingAway.list(),
        Strategy.list()
      ]);

      const transformedGameData: GameDataType[] = gameDataRes.map((game: any) => ({
        id: game.id_jogo?.toString() || `${game.home}-${game.away}-${game.date}`,
        home: game.home,
        away: game.away,
        date: game.date,
        league: game.league,
        season: game.season,
        goals_h_ft: game.goals_h_ft || 0,
        goals_a_ft: game.goals_a_ft || 0,
        rodada: game.rodada || 0
      }));

      const transformedStrategies: StrategyData[] = strategiesRes.map((strategy: any) => ({
        id: strategy.id,
        name: strategy.name,
        description: strategy.description || '',
        market: strategy.market,
        unit_stake: strategy.unit_stake || 10,
        min_odds: strategy.min_odds,
        max_odds: strategy.max_odds,
        start_date: strategy.start_date,
        end_date: strategy.end_date,
        leagues: strategy.leagues || [],
        home_teams: strategy.home_teams || [],
        away_teams: strategy.away_teams || [],
        results: strategy.results,
        season: strategy.season || []
      }));

      setGameData(transformedGameData);
      setRankingHomeData(rankingHomeRes);
      setRankingAwayData(rankingAwayRes);
      setSavedStrategies(transformedStrategies);
    } catch (error) {
      console.error("Erro ao carregar dados:", error);
    }
    setIsLoading(false);
  };

  const handleRunBacktest = async (strategy: StrategyData) => {
    setIsLoading(true);
    try {
      const backtestingEngine = new BacktestingEngine();
      
      // Convert strategy to engine format
      const engineStrategy = {
        id: strategy.id,
        name: strategy.name,
        market: strategy.market,
        season: strategy.season,
        unit_stake: strategy.unit_stake || 10,
        min_odds: strategy.min_odds,
        max_odds: strategy.max_odds
      };

      const results = backtestingEngine.runBacktest(
        engineStrategy, 
        gameData, 
        rankingHomeData, 
        rankingAwayData
      );

      setCurrentStrategy(strategy);
      setBacktestResults(results);
      setActiveTab("results");
    } catch (error) {
      console.error("Erro ao executar backtest:", error);
    }
    setIsLoading(false);
  };

  const handleSaveStrategy = async (strategy: StrategyData) => {
    try {
      const strategyData = {
        name: strategy.name,
        description: strategy.description || '',
        market: strategy.market,
        unit_stake: strategy.unit_stake || 10,
        min_odds: strategy.min_odds,
        max_odds: strategy.max_odds,
        start_date: strategy.start_date,
        end_date: strategy.end_date,
        leagues: strategy.leagues || [],
        home_teams: strategy.home_teams || [],
        away_teams: strategy.away_teams || [],
        results: backtestResults
      };

      await Strategy.create(strategyData);
      await loadData(); // Reload saved strategies
      alert("Estratégia salva com sucesso!");
    } catch (error) {
      console.error("Erro ao salvar estratégia:", error);
      alert("Erro ao salvar estratégia");
    }
  };

  const handleLoadStrategy = (strategy: StrategyData) => {
    setCurrentStrategy(strategy);
    setActiveTab("create");
  };

  return (
    <div className="min-h-screen bg-background text-foreground p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center gap-4 mb-8">
          <Link to={createPageUrl("Dashboard")}>
            <Button variant="outline" size="icon">
              <ArrowLeft className="w-4 h-4" />
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl lg:text-4xl font-semibold text-foreground mb-1">
              Sistema de Backtesting
            </h1>
            <p className="text-muted-foreground text-lg">
              Teste e otimize suas estratégias com dados históricos
            </p>
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full max-w-md grid-cols-3">
            <TabsTrigger value="create">
              <Target className="w-4 h-4 mr-2" />
              Criar
            </TabsTrigger>
            <TabsTrigger value="results">
              <BarChart3 className="w-4 h-4 mr-2" />
              Resultados
            </TabsTrigger>
            <TabsTrigger value="saved">
              <Save className="w-4 h-4 mr-2" />
              Salvas
            </TabsTrigger>
          </TabsList>

          <TabsContent value="create">
            <StrategyForm
              onRunBacktest={handleRunBacktest}
              initialStrategy={currentStrategy}
              isLoading={isLoading}
            />
          </TabsContent>

          <TabsContent value="results">
            {currentStrategy && backtestResults ? (
              <StrategyResults
                strategy={currentStrategy}
                results={backtestResults}
                onSaveStrategy={handleSaveStrategy}
                gameData={gameData}
                onRunNewBacktest={() => setActiveTab("create")}
              />
            ) : (
              <div className="text-center py-12">
                <Target className="w-16 h-16 text-muted-foreground/50 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-foreground mb-2">
                  Nenhum resultado disponível
                </h3>
                <p className="text-muted-foreground mb-6">
                  Execute um backtest para ver os resultados aqui
                </p>
                <Button onClick={() => setActiveTab("create")}>
                  Criar Nova Estratégia
                </Button>
              </div>
            )}
          </TabsContent>

          <TabsContent value="saved">
            <SavedStrategies
              strategies={savedStrategies}
              onLoadStrategy={handleLoadStrategy}
              onDeleteStrategy={async (id: number) => {
                try {
                  await Strategy.delete(id);
                  await loadData();
                } catch (error) {
                  console.error("Erro ao deletar estratégia:", error);
                }
              }}
              isLoading={isLoading}
            />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
