import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BarChart3, Play, Save, Database } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import StrategyForm from "./StrategyForm";
import StrategyResults from "./StrategyResults";
import BacktestingEngine from "./BacktestingEngine";

const BacktestingPage = () => {
  const [currentStrategy, setCurrentStrategy] = useState(null);
  const [results, setResults] = useState(null);
  const [isRunning, setIsRunning] = useState(false);
  const { toast } = useToast();

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

  // Fetch ranking data
  const { data: rankingHomeData } = useQuery({
    queryKey: ['rankinghome'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('rankinghome')
        .select('*');
      
      if (error) throw error;
      return data || [];
    },
  });

  const { data: rankingAwayData } = useQuery({
    queryKey: ['rankingaway'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('rankingaway')
        .select('*');
      
      if (error) throw error;
      return data || [];
    },
  });

  // Fetch saved strategies
  const { data: savedStrategies, refetch: refetchStrategies } = useQuery({
    queryKey: ['strategies'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('strategy')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data || [];
    },
  });

  const runBacktest = async (strategy) => {
    if (!gameData || gameData.length === 0) {
      toast({
        title: "Erro",
        description: "Dados de jogos não disponíveis. Faça o upload dos dados primeiro.",
        variant: "destructive",
      });
      return;
    }

    setIsRunning(true);
    setCurrentStrategy(strategy);

    try {
      const engine = new BacktestingEngine();
      const backtestResults = engine.runBacktest(
        strategy, 
        gameData, 
        rankingHomeData || [], 
        rankingAwayData || []
      );

      setResults(backtestResults);

      toast({
        title: "Backtesting concluído",
        description: `Estratégia "${strategy.name}" executada com sucesso.`,
      });

    } catch (error) {
      console.error("Erro no backtesting:", error);
      toast({
        title: "Erro no backtesting",
        description: error.message || "Ocorreu um erro durante a execução.",
        variant: "destructive",
      });
    }

    setIsRunning(false);
  };

  const saveStrategy = async (strategy, results) => {
    try {
      const strategyData = {
        ...strategy,
        // Add results to strategy
        total_bets: results.total_bets,
        winning_bets: results.winning_bets,
        hit_rate: results.hit_rate,
        average_odds: results.average_odds,
        total_profit: results.total_profit,
        roi: results.roi,
        max_winning_streak: results.max_winning_streak,
        max_winning_streak_profit: results.max_winning_streak_profit,
        max_losing_streak: results.max_losing_streak,
        max_losing_streak_loss: results.max_losing_streak_loss,
        best_leagues: results.best_leagues,
        worst_leagues: results.worst_leagues,
        best_teams: results.best_teams,
        worst_teams: results.worst_teams,
        common_scores: results.common_scores,
        evolution_chart: results.evolution_chart,
        sample_bets: results.sample_bets,
        results: results
      };

      const { error } = await supabase
        .from('strategy')
        .insert([strategyData]);

      if (error) throw error;

      toast({
        title: "Estratégia salva",
        description: `Estratégia "${strategy.name}" foi salva com sucesso.`,
      });

      refetchStrategies();

    } catch (error) {
      console.error("Erro ao salvar estratégia:", error);
      toast({
        title: "Erro ao salvar",
        description: error.message || "Não foi possível salvar a estratégia.",
        variant: "destructive",
      });
    }
  };

  const loadStrategy = (strategy) => {
    setCurrentStrategy(strategy);
    if (strategy.results) {
      setResults(strategy.results);
    }
  };

  return (
    <div className="p-6 lg:p-8 space-y-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl lg:text-4xl font-bold bg-gradient-to-r from-white via-slate-200 to-slate-400 bg-clip-text text-transparent mb-2">
          Backtesting de Estratégias
        </h1>
        <p className="text-slate-400 text-lg">
          Teste e analise suas estratégias de apostas com dados históricos
        </p>
      </div>

      {/* Data Status */}
      <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Database className="w-6 h-6 text-blue-400" />
              <div>
                <h3 className="text-white font-semibold">Status dos Dados</h3>
                <p className="text-slate-400 text-sm">
                  {gameData?.length || 0} jogos históricos • {rankingHomeData?.length || 0} rankings casa • {rankingAwayData?.length || 0} rankings visitante
                </p>
              </div>
            </div>
            {(!gameData || gameData.length === 0) && (
              <div className="text-orange-400 text-sm">
                ⚠️ Faça upload dos dados primeiro
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Saved Strategies */}
      {savedStrategies && savedStrategies.length > 0 && (
        <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
          <CardHeader className="border-b border-slate-700">
            <CardTitle className="text-white flex items-center gap-2">
              <Save className="w-6 h-6 text-emerald-400" />
              Estratégias Salvas
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {savedStrategies.map((strategy) => (
                <div
                  key={strategy.id}
                  className="p-4 bg-slate-700/30 rounded-lg border border-slate-600 hover:border-slate-500 transition-colors cursor-pointer"
                  onClick={() => loadStrategy(strategy)}
                >
                  <h4 className="text-white font-semibold mb-2">{strategy.name}</h4>
                  <div className="text-sm text-slate-400 space-y-1">
                    <div>Mercado: {strategy.market}</div>
                    {strategy.total_bets && (
                      <>
                        <div>Apostas: {strategy.total_bets}</div>
                        <div className={`${strategy.roi >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                          ROI: {strategy.roi?.toFixed(1)}%
                        </div>
                      </>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Strategy Form */}
        <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
          <CardHeader className="border-b border-slate-700">
            <CardTitle className="text-white flex items-center gap-2">
              <BarChart3 className="w-6 h-6 text-blue-400" />
              Configurar Estratégia
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <StrategyForm
              gameData={gameData || []}
              onRunBacktest={runBacktest}
              isLoading={isRunning}
              initialStrategy={currentStrategy}
              onStrategyChange={setCurrentStrategy}
            />
          </CardContent>
        </Card>

        {/* Results */}
        <div>
          {results ? (
            <StrategyResults
              strategy={currentStrategy}
              results={results}
              onSaveStrategy={saveStrategy}
            />
          ) : (
            <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
              <CardContent className="p-8 text-center">
                <Play className="w-16 h-16 text-slate-600 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-white mb-2">
                  Pronto para começar
                </h3>
                <p className="text-slate-400">
                  Configure uma estratégia e execute o backtesting para ver os resultados aqui.
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default BacktestingPage;
