
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import {
  TrendingUp,
  TrendingDown,
  Target,
  Trophy,
  Save,
  BarChart3,
  Calendar,
  DollarSign,
  Lightbulb,
  Play,
  Filter
} from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { format } from "date-fns";
import BacktestingEngine from "./BacktestingEngine";

export default function StrategyResults({ strategy, results, onSaveStrategy, gameData, onRunNewBacktest }) {
  const [selectedLeagues, setSelectedLeagues] = useState([]);

  const handleSave = () => {
    onSaveStrategy(strategy, results);
  };

  const handleLeagueToggle = (leagueName, checked) => {
    if (checked) {
      setSelectedLeagues(prev => [...prev, leagueName]);
    } else {
      setSelectedLeagues(prev => prev.filter(league => league !== leagueName));
    }
  };

  const handleRunWithSelectedLeagues = () => {
    if (selectedLeagues.length === 0) {
      alert("Selecione pelo menos uma liga para executar o backtesting.");
      return;
    }

    const newStrategy = {
      ...strategy,
      leagues: selectedLeagues,
      name: `${strategy.name} - Ligas Selecionadas`
    };

    onRunNewBacktest(newStrategy);
  };

  // Helper function to get bet result for a specific market
  const getBetResultForMarket = (market, game) => {
    const homeGoals = game.goals_h_ft;
    const awayGoals = game.goals_a_ft;
    const homeGoalsHT = game.goals_h_ht;
    const awayGoalsHT = game.goals_a_ht;

    // Check if full-time scores are available for FT markets
    if (homeGoals == null || awayGoals == null) {
      const ftMarkets = ["home_win", "draw", "away_win", "over_15", "over_25",
                         "under_15", "under_25", "btts_yes", "btts_no",
                         "dc_1x", "dc_12", "dc_x2"];
      if (ftMarkets.includes(market)) return "undefined";
    }

    // Check if half-time scores are available for HT markets
    if ((homeGoalsHT == null || awayGoalsHT == null) && ["home_win_ht", "draw_ht", "away_win_ht"].includes(market)) {
        return "undefined";
    }

    const totalGoals = homeGoals + awayGoals;

    switch (market) {
      case "home_win":
        return homeGoals > awayGoals ? "win" : "loss";
      case "draw":
        return homeGoals === awayGoals ? "win" : "loss";
      case "away_win":
        return awayGoals > homeGoals ? "win" : "loss";
      case "home_win_ht":
        return homeGoalsHT > awayGoalsHT ? "win" : "loss";
      case "draw_ht":
        return homeGoalsHT === awayGoalsHT ? "win" : "loss";
      case "away_win_ht":
        return awayGoalsHT > homeGoalsHT ? "win" : "loss";
      case "over_15":
        return totalGoals >= 2 ? "win" : "loss";
      case "over_25":
        return totalGoals >= 3 ? "win" : "loss";
      case "under_15":
        return totalGoals < 2 ? "win" : "loss";
      case "under_25":
        return totalGoals < 3 ? "win" : "loss";
      case "btts_yes":
        return homeGoals >= 1 && awayGoals >= 1 ? "win" : "loss";
      case "btts_no":
        return homeGoals < 1 || awayGoals < 1 ? "win" : "loss";
      case "dc_1x":
        return homeGoals >= awayGoals ? "win" : "loss";
      case "dc_12":
        return homeGoals !== awayGoals ? "win" : "loss";
      case "dc_x2":
        return awayGoals >= homeGoals ? "win" : "loss";
      default:
        return "loss";
    }
  };

  // Calculate streaks for a specific market
  const calculateStreaksForMarket = (bets) => {
    let maxWinningStreak = 0;
    let maxLosingStreak = 0;
    let currentWinningStreak = 0;
    let currentLosingStreak = 0;

    bets.forEach(bet => {
      if (bet.result === "win") {
        currentWinningStreak++;
        currentLosingStreak = 0;
        if (currentWinningStreak > maxWinningStreak) {
          maxWinningStreak = currentWinningStreak;
        }
      } else {
        currentLosingStreak++;
        currentWinningStreak = 0;
        if (currentLosingStreak > maxLosingStreak) {
          maxLosingStreak = currentLosingStreak;
        }
      }
    });

    return { maxWinningStreak, maxLosingStreak };
  };

  // Calculate insights for all markets using FILTERED games only, including streaks
  const calculateMarketInsights = () => {
    if (!gameData || gameData.length === 0 || !strategy || !strategy.unit_stake) return [];

    const backtestingEngine = new BacktestingEngine();
    const filteredGameData = backtestingEngine.filterGames(strategy, gameData);

    const markets = [
      { key: "home_win", label: "Casa Vence (FT)", oddField: "odd_h_ft" },
      { key: "draw", label: "Empate (FT)", oddField: "odd_d_ft" },
      { key: "away_win", label: "Fora Vence (FT)", oddField: "odd_a_ft" },
      { key: "home_win_ht", label: "Casa Vence (HT)", oddField: "odd_h_ht" },
      { key: "draw_ht", label: "Empate (HT)", oddField: "odd_d_ht" },
      { key: "away_win_ht", label: "Fora Vence (HT)", oddField: "odd_a_ht" },
      { key: "over_15", label: "Over 1.5 Gols", oddField: "odd_over15_ft" },
      { key: "over_25", label: "Over 2.5 Gols", oddField: "odd_over25_ft" },
      { key: "under_15", label: "Under 1.5 Gols", oddField: "odd_under15_ft" },
      { key: "under_25", label: "Under 2.5 Gols", oddField: "odd_under25_ft" },
      { key: "btts_yes", label: "Ambos Marcam Sim", oddField: "odd_btts_yes" },
      { key: "btts_no", label: "Ambos Marcam Não", oddField: "odd_btts_no" },
      { key: "dc_1x", label: "Dupla Chance 1X", oddField: "odd_dc_1x" },
      { key: "dc_12", label: "Dupla Chance 12", oddField: "odd_dc_12" },
      { key: "dc_x2", label: "Dupla Chance X2", oddField: "odd_dc_x2" }
    ];

    return markets.map(market => {
      let totalProfit = 0;
      let totalBets = 0;
      let wins = 0;
      const bets = [];

      filteredGameData.forEach(game => {
        const odds = game[market.oddField];
        if (!odds || odds === 0) return;

        const result = getBetResultForMarket(market.key, game);
        if (result === "undefined") return;

        totalBets++;
        let profit = 0;
        if (result === "win") {
          wins++;
          profit = (odds - 1) * strategy.unit_stake;
        } else {
          profit = -strategy.unit_stake;
        }
        totalProfit += profit;
        
        bets.push({ result, profit });
      });

      const streaks = calculateStreaksForMarket(bets);

      return {
        ...market,
        totalProfit,
        totalBets,
        wins,
        hitRate: totalBets > 0 ? (wins / totalBets) * 100 : 0,
        maxWinningStreak: streaks.maxWinningStreak,
        maxLosingStreak: streaks.maxLosingStreak
      };
    }).filter(market => market.totalBets > 0);
  };

  const marketInsights = calculateMarketInsights();

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="bg-slate-800/50 border-slate-700">
        <CardHeader className="border-b border-slate-700">
          <div className="flex justify-between items-center">
            <CardTitle className="text-xl text-white flex items-center gap-2">
              <BarChart3 className="w-6 h-6 text-emerald-400" />
              Resultados: {strategy?.name}
            </CardTitle>
            <Button onClick={handleSave} className="bg-emerald-600 hover:bg-emerald-700">
              <Save className="w-4 h-4 mr-2" />
              Salvar Estratégia
            </Button>
          </div>
        </CardHeader>
      </Card>

      {/* Main Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="bg-slate-800/50 border-slate-700">
          <CardContent className="p-6 text-center">
            <Target className="w-8 h-8 text-blue-400 mx-auto mb-2" />
            <p className="text-sm text-slate-400 mb-1">Total de Apostas</p>
            <p className="text-2xl font-bold text-white">{results.total_bets}</p>
          </CardContent>
        </Card>

        <Card className="bg-slate-800/50 border-slate-700">
          <CardContent className="p-6 text-center">
            <Trophy className="w-8 h-8 text-emerald-400 mx-auto mb-2" />
            <p className="text-sm text-slate-400 mb-1">Taxa de Acerto</p>
            <p className="text-2xl font-bold text-white">{results.hit_rate.toFixed(1)}%</p>
          </CardContent>
        </Card>

        <Card className="bg-slate-800/50 border-slate-700">
          <CardContent className="p-6 text-center">
            <DollarSign className="w-8 h-8 text-purple-400 mx-auto mb-2" />
            <p className="text-sm text-slate-400 mb-1">Lucro Total</p>
            <p className={`text-2xl font-bold ${results.total_profit >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
              ${results.total_profit.toFixed(2)}
            </p>
          </CardContent>
        </Card>

        <Card className="bg-slate-800/50 border-slate-700">
          <CardContent className="p-6 text-center">
            <TrendingUp className="w-8 h-8 text-orange-400 mx-auto mb-2" />
            <p className="text-sm text-slate-400 mb-1">ROI</p>
            <p className={`text-2xl font-bold ${results.roi >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
              {results.roi.toFixed(1)}%
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Additional Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="bg-slate-800/50 border-slate-700">
          <CardContent className="p-6">
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp className="w-5 h-5 text-emerald-400" />
              <p className="text-sm text-slate-400">Maior Seq. Vitórias</p>
            </div>
            <p className="text-xl font-bold text-white">{results.max_winning_streak} green</p>
            <p className="text-sm text-emerald-400">+${results.max_winning_streak_profit.toFixed(2)}</p>
          </CardContent>
        </Card>

        <Card className="bg-slate-800/50 border-slate-700">
          <CardContent className="p-6">
            <div className="flex items-center gap-2 mb-2">
              <TrendingDown className="w-5 h-5 text-red-400" />
              <p className="text-sm text-slate-400">Maior Seq. Derrotas</p>
            </div>
            <p className="text-xl font-bold text-white">{results.max_losing_streak} red</p>
            <p className="text-sm text-red-400">${results.max_losing_streak_loss.toFixed(2)}</p>
          </CardContent>
        </Card>

        <Card className="bg-slate-800/50 border-slate-700">
          <CardContent className="p-6">
            <div className="flex items-center gap-2 mb-2">
              <Target className="w-5 h-5 text-blue-400" />
              <p className="text-sm text-slate-400">Apostas Vencedoras</p>
            </div>
            <p className="text-xl font-bold text-white">{results.winning_bets}</p>
            <p className="text-sm text-slate-400">de {results.total_bets}</p>
          </CardContent>
        </Card>

        <Card className="bg-slate-800/50 border-slate-700">
          <CardContent className="p-6">
            <div className="flex items-center gap-2 mb-2">
              <BarChart3 className="w-5 h-5 text-purple-400" />
              <p className="text-sm text-slate-400">Odd Média</p>
            </div>
            <p className="text-xl font-bold text-white">{results.average_odds.toFixed(2)}</p>
          </CardContent>
        </Card>
      </div>

      {/* Market Insights Card */}
      <Card className="bg-slate-800/50 border-slate-700">
        <CardHeader className="border-b border-slate-700">
          <CardTitle className="text-white flex items-center gap-2">
            <Lightbulb className="w-6 h-6 text-yellow-400" />
            Insights por Mercado
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {marketInsights
              .sort((a, b) => b.totalProfit - a.totalProfit)
              .map((market, index) => (
                <div
                  key={market.key}
                  className="bg-slate-700/30 rounded-lg p-4 hover:bg-slate-700/50 transition-colors"
                >
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="text-sm font-medium text-white">{market.label}</h4>
                    <span 
                      className="text-lg font-bold"
                      style={{ 
                        color: market.totalProfit >= 0 ? '#10b981' : '#ef4444'
                      }}
                    >
                      {market.totalProfit >= 0 ? '+' : ''}${market.totalProfit.toFixed(2)}
                    </span>
                  </div>
                  <div className="text-xs text-slate-400 space-y-1">
                    <div className="flex justify-between">
                      <span>Apostas:</span>
                      <span>{market.totalBets}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Acertos:</span>
                      <span>{market.wins}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Taxa:</span>
                      <span>{market.hitRate.toFixed(1)}%</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Seq. Vitórias:</span>
                      <span className="text-emerald-400">{market.maxWinningStreak}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Seq. Derrotas:</span>
                      <span className="text-red-400">{market.maxLosingStreak}</span>
                    </div>
                  </div>
                </div>
              ))
            }
          </div>
          {marketInsights.length === 0 && (
            <div className="text-center py-8">
              <Lightbulb className="w-12 h-12 text-slate-600 mx-auto mb-4" />
              <p className="text-slate-400">Nenhum insight disponível para os dados filtrados</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Evolution Chart */}
      <Card className="bg-slate-800/50 border-slate-700">
        <CardHeader className="border-b border-slate-700">
          <CardTitle className="text-white">Evolução da Estratégia</CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={results.evolution_chart}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                <XAxis dataKey="bet" stroke="#94a3b8" />
                <YAxis stroke="#94a3b8" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#1e293b',
                    border: '1px solid #475569',
                    borderRadius: '8px'
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="profit"
                  stroke="#10b981"
                  strokeWidth={2}
                  dot={{ fill: '#10b981', strokeWidth: 2, r: 3 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Sample Bets */}
      <Card className="bg-slate-800/50 border-slate-700">
        <CardHeader className="border-b border-slate-700">
          <CardTitle className="text-white">Amostra de Apostas (20 primeiras)</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="border-slate-700">
                  <TableHead className="text-slate-300">Data</TableHead>
                  <TableHead className="text-slate-300">Jogo</TableHead>
                  <TableHead className="text-slate-300">Placar HT</TableHead>
                  <TableHead className="text-slate-300">Resultado FT</TableHead>
                  <TableHead className="text-slate-300">Odd</TableHead>
                  <TableHead className="text-slate-300">Resultado</TableHead>
                  <TableHead className="text-slate-300">Lucro</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {results.sample_bets.map((bet, index) => (
                  <TableRow key={index} className="border-slate-700">
                    <TableCell className="text-slate-300">
                      {format(bet.date, 'dd/MM/yyyy')}
                    </TableCell>
                    <TableCell className="text-white font-medium">
                      {bet.match}
                    </TableCell>
                    <TableCell className="text-slate-300">
                      {bet.game && bet.game.goals_h_ht !== null && bet.game.goals_a_ht !== null 
                        ? `${bet.game.goals_h_ht}-${bet.game.goals_a_ht}` 
                        : '-'}
                    </TableCell>
                    <TableCell className="text-slate-300">
                      {bet.score}
                    </TableCell>
                    <TableCell className="text-slate-300">
                      {bet.odds.toFixed(2)}
                    </TableCell>
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
                    <TableCell className={`font-medium ${bet.profit >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                      ${bet.profit.toFixed(2)}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Analysis Tables */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Best/Worst Leagues with Selection */}
        <div className="space-y-6">
          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader className="border-b border-slate-700">
              <div className="flex justify-between items-center">
                <CardTitle style={{ color: 'rgb(16, 185, 129)' }}>Top 10 Ligas</CardTitle>
                {selectedLeagues.length > 0 && (
                  <Button
                    onClick={handleRunWithSelectedLeagues}
                    size="sm"
                    className="bg-blue-600 hover:bg-blue-700"
                  >
                    <Play className="w-4 h-4 mr-2" />
                    Executar ({selectedLeagues.length})
                  </Button>
                )}
              </div>
            </CardHeader>
            <CardContent className="p-4">
              <div className="space-y-2">
                {results.best_leagues.slice(0, 10).map((league, index) => (
                  <div key={index} className="flex items-center justify-between p-2 bg-slate-700/30 rounded hover:bg-slate-700/50 transition-colors">
                    <div className="flex items-center space-x-3">
                      <Checkbox
                        id={`league-${index}`}
                        checked={selectedLeagues.includes(league.name)}
                        onCheckedChange={(checked) => handleLeagueToggle(league.name, checked)}
                      />
                      <label 
                        htmlFor={`league-${index}`}
                        className="text-white text-sm cursor-pointer flex-1"
                      >
                        {league.name}
                      </label>
                    </div>
                    <span className="font-medium" style={{ color: 'rgb(16, 185, 129)' }}>
                      ${league.profit.toFixed(2)}
                    </span>
                  </div>
                ))}
              </div>
              {selectedLeagues.length > 0 && (
                <div className="mt-4 p-3 bg-blue-500/10 border border-blue-500/20 rounded-lg">
                  <p className="text-blue-400 text-sm">
                    <Filter className="w-4 h-4 inline mr-2" />
                    {selectedLeagues.length} liga{selectedLeagues.length > 1 ? 's' : ''} selecionada{selectedLeagues.length > 1 ? 's' : ''} para novo backtesting
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader className="border-b border-slate-700">
              <CardTitle style={{ color: 'rgb(239, 68, 68)' }}>10 Piores Ligas</CardTitle>
            </CardHeader>
            <CardContent className="p-4">
              {results.worst_leagues.length > 0 ? (
                <div className="space-y-2">
                  {results.worst_leagues.slice(0, 10).map((league, index) => (
                    <div key={index} className="flex justify-between items-center p-2 bg-slate-700/30 rounded">
                      <span className="text-white text-sm">{league.name}</span>
                      <span className="font-medium" style={{ color: 'rgb(239, 68, 68)' }}>${league.profit.toFixed(2)}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <p className="text-slate-400 text-sm">Nenhuma liga com resultado negativo</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Best/Worst Teams and Common Scores */}
        <div className="space-y-6">
          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader className="border-b border-slate-700">
              <CardTitle style={{ color: 'rgb(16, 185, 129)' }}>Top 10 Times</CardTitle>
            </CardHeader>
            <CardContent className="p-4">
              <div className="space-y-2">
                {results.best_teams.slice(0, 10).map((team, index) => (
                  <div key={index} className="flex justify-between items-center p-2 bg-slate-700/30 rounded">
                    <span className="text-white text-sm">{team.name}</span>
                    <span className="font-medium" style={{ color: 'rgb(16, 185, 129)' }}>${team.profit.toFixed(2)}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader className="border-b border-slate-700">
              <CardTitle style={{ color: 'rgb(239, 68, 68)' }}>10 Piores Times</CardTitle>
            </CardHeader>
            <CardContent className="p-4">
              {results.worst_teams.length > 0 ? (
                <div className="space-y-2">
                  {results.worst_teams.slice(0, 10).map((team, index) => (
                    <div key={index} className="flex justify-between items-center p-2 bg-slate-700/30 rounded">
                      <span className="text-white text-sm">{team.name}</span>
                      <span className="font-medium" style={{ color: 'rgb(239, 68, 68)' }}>${team.profit.toFixed(2)}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <p className="text-slate-400 text-sm">Nenhuma time com resultado negativo</p>
                </div>
              )}
            </CardContent>
          </Card>

          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader className="border-b border-slate-700">
              <CardTitle className="text-blue-400">5 Placares Mais Comuns</CardTitle>
            </CardHeader>
            <CardContent className="p-4">
              <div className="space-y-2">
                {results.common_scores.map((score, index) => (
                  <div key={index} className="flex justify-between items-center p-2 bg-slate-700/30 rounded">
                    <span className="text-white font-medium">{score.score}</span>
                    <div className="text-right">
                      <span className="text-blue-400 font-medium">{score.count} vezes</span>
                      <span className="text-slate-400 text-sm ml-2">({score.percentage}%)</span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
