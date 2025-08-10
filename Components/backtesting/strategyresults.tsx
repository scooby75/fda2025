import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { 
  Download, 
  Save, 
  Play, 
  TrendingUp, 
  Target,
  BarChart3,
  Calendar,
  Trophy
} from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import BacktestingEngine, { type Game, type GameData, type Strategy } from "@/components/backtesting/BacktestingEngine";

interface StrategyResultsProps {
  strategy: Strategy;
  results: any;
  onSaveStrategy: (strategy: Strategy) => void;
  gameData: GameData[];
  onRunNewBacktest: () => void;
}

export default function StrategyResults({ 
  strategy, 
  results, 
  onSaveStrategy, 
  gameData, 
  onRunNewBacktest 
}: StrategyResultsProps) {
  const [selectedLeagues, setSelectedLeagues] = useState<string[]>([]);

  const handleLeagueToggle = (leagueName: string, checked: boolean) => {
    setSelectedLeagues((prev: string[]) => 
      checked 
        ? [...prev, leagueName]
        : prev.filter((league: string) => league !== leagueName)
    );
  };

  const getMarketResult = (market: string, game: Game) => {
    // Basic market result calculation
    switch (market.toLowerCase()) {
      case 'over 2.5':
        return (game.goals_h_ft + game.goals_a_ft) > 2.5;
      case 'under 2.5':
        return (game.goals_h_ft + game.goals_a_ft) < 2.5;
      case 'btts':
        return game.goals_h_ft > 0 && game.goals_a_ft > 0;
      default:
        return false;
    }
  };

  const calculateStats = (bets: any[]) => {
    const totalBets = bets.length;
    const wins = bets.filter((bet: any) => bet.result === 'win').length;
    const hitRate = totalBets > 0 ? (wins / totalBets) * 100 : 0;
    const profit = bets.reduce((sum: number, bet: any) => sum + (bet.profit || 0), 0);
    const roi = totalBets > 0 ? (profit / totalBets) * 100 : 0;

    return { totalBets, wins, hitRate, profit, roi };
  };

  // Filter games and generate bets
  const backtestingEngine = new BacktestingEngine();
  let bets: any[] = [];
  
  if (strategy && gameData) {
    const filteredGames = backtestingEngine.filterGames(strategy, gameData, [], []);
    
    bets = filteredGames.map((game: Game) => {
      const marketResult = getMarketResult(strategy.market, game);
      const stake = 10; // Default stake
      const odds = 1.8; // Default odds
      const profit = marketResult ? (stake * odds) - stake : -stake;
      
      return {
        id: game.id,
        game,
        market: strategy.market,
        odds,
        stake,
        result: marketResult ? 'win' : 'loss',
        profit
      };
    });
  }

  const stats = calculateStats(bets);

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="bg-slate-800/50 border-slate-700">
        <CardHeader className="border-b border-slate-700">
          <div className="flex justify-between items-center">
            <CardTitle className="text-2xl text-white flex items-center gap-2">
              <Target className="w-7 h-7 text-emerald-400" />
              Resultados do Backtest
            </CardTitle>
            <div className="flex gap-3">
              <Button
                onClick={() => onSaveStrategy(strategy)}
                className="bg-blue-600 hover:bg-blue-700"
              >
                <Save className="w-4 h-4 mr-2" />
                Salvar Estratégia
              </Button>
              <Button
                onClick={onRunNewBacktest}
                variant="outline"
                className="border-slate-600 text-slate-300 hover:bg-slate-700"
              >
                <Play className="w-4 h-4 mr-2" />
                Novo Backtest
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-semibold text-white mb-3">Detalhes da Estratégia</h3>
              <div className="space-y-2 text-slate-300">
                <p><span className="font-medium">Nome:</span> {strategy.name}</p>
                <p><span className="font-medium">Mercado:</span> {strategy.market}</p>
                {strategy.season && (
                  <p><span className="font-medium">Temporada:</span> {Array.isArray(strategy.season) ? strategy.season.join(', ') : strategy.season}</p>
                )}
              </div>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-white mb-3">Resumo dos Resultados</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center">
                  <p className="text-2xl font-bold text-emerald-400">{stats.totalBets}</p>
                  <p className="text-sm text-slate-400">Total de Apostas</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-blue-400">{stats.hitRate.toFixed(1)}%</p>
                  <p className="text-sm text-slate-400">Taxa de Acerto</p>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="bg-slate-800/50 border-slate-700">
          <CardContent className="p-6 text-center">
            <Target className="w-8 h-8 text-blue-400 mx-auto mb-2" />
            <p className="text-sm text-slate-400 mb-1">Total de Apostas</p>
            <p className="text-2xl font-bold text-white">{stats.totalBets}</p>
          </CardContent>
        </Card>

        <Card className="bg-slate-800/50 border-slate-700">
          <CardContent className="p-6 text-center">
            <TrendingUp className="w-8 h-8 text-emerald-400 mx-auto mb-2" />
            <p className="text-sm text-slate-400 mb-1">Taxa de Acerto</p>
            <p className="text-2xl font-bold text-white">{stats.hitRate.toFixed(1)}%</p>
            <p className="text-xs text-slate-400">{stats.wins}/{stats.totalBets}</p>
          </CardContent>
        </Card>

        <Card className="bg-slate-800/50 border-slate-700">
          <CardContent className="p-6 text-center">
            <BarChart3 className="w-8 h-8 text-purple-400 mx-auto mb-2" />
            <p className="text-sm text-slate-400 mb-1">Lucro Total</p>
            <p className={`text-2xl font-bold ${stats.profit >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
              {stats.profit >= 0 ? '+' : ''}${stats.profit.toFixed(2)}
            </p>
          </CardContent>
        </Card>

        <Card className="bg-slate-800/50 border-slate-700">
          <CardContent className="p-6 text-center">
            <Trophy className="w-8 h-8 text-yellow-400 mx-auto mb-2" />
            <p className="text-sm text-slate-400 mb-1">ROI</p>
            <p className={`text-2xl font-bold ${stats.roi >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
              {stats.roi >= 0 ? '+' : ''}{stats.roi.toFixed(1)}%
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Results Table */}
      <Card className="bg-slate-800/50 border-slate-700">
        <CardHeader className="border-b border-slate-700">
          <CardTitle className="text-white flex items-center gap-2">
            <Calendar className="w-5 h-5 text-emerald-400" />
            Apostas Detalhadas
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="border-slate-700">
                  <TableHead className="text-slate-300">Data</TableHead>
                  <TableHead className="text-slate-300">Jogo</TableHead>
                  <TableHead className="text-slate-300">Liga</TableHead>
                  <TableHead className="text-slate-300">Mercado</TableHead>
                  <TableHead className="text-slate-300">Odd</TableHead>
                  <TableHead className="text-slate-300">Stake</TableHead>
                  <TableHead className="text-slate-300">Resultado</TableHead>
                  <TableHead className="text-slate-300">P&L</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {bets.slice(0, 50).map((bet: any, index: number) => (
                  <TableRow key={index} className="border-slate-700 hover:bg-slate-700/50">
                    <TableCell className="text-slate-300">
                      {format(new Date(bet.game.date), 'dd/MM/yyyy', { locale: ptBR })}
                    </TableCell>
                    <TableCell className="text-white">
                      {bet.game.home} vs {bet.game.away}
                    </TableCell>
                    <TableCell className="text-slate-300">{bet.game.league}</TableCell>
                    <TableCell className="text-slate-300">{bet.market}</TableCell>
                    <TableCell className="text-slate-300">{bet.odds.toFixed(2)}</TableCell>
                    <TableCell className="text-slate-300">${bet.stake}</TableCell>
                    <TableCell>
                      <Badge 
                        variant="outline"
                        className={bet.result === 'win' 
                          ? 'border-emerald-500 text-emerald-400' 
                          : 'border-red-500 text-red-400'
                        }
                      >
                        {bet.result === 'win' ? 'Green' : 'Red'}
                      </Badge>
                    </TableCell>
                    <TableCell className={bet.profit >= 0 ? 'text-emerald-400' : 'text-red-400'}>
                      {bet.profit >= 0 ? '+' : ''}${bet.profit.toFixed(2)}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          {bets.length === 0 && (
            <div className="text-center py-8">
              <Target className="w-12 h-12 text-slate-600 mx-auto mb-4" />
              <p className="text-slate-400">Nenhuma aposta encontrada</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* League Filter */}
      <Card className="bg-slate-800/50 border-slate-700">
        <CardHeader className="border-b border-slate-700">
          <CardTitle className="text-white">Filtrar por Liga</CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {Array.from(new Set(gameData.map((game: GameData) => game.league))).map((league: string, index: number) => (
              <div key={index} className="flex items-center space-x-2">
                <Checkbox
                  id={`league-${index}`}
                  checked={selectedLeagues.includes(league)}
                  onCheckedChange={(checked: boolean) => handleLeagueToggle(league, checked)}
                />
                <label htmlFor={`league-${index}`} className="text-sm text-slate-300">
                  {league}
                </label>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
