
import React, { useState, useEffect } from "react";
import { GameData } from "@/entities/GameData";
import { RankingHome } from "@/entities/RankingHome";
import { RankingAway } from "@/entities/RankingAway";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import {
  ArrowLeft,
  Search,
  BarChart3,
  TrendingUp
} from "lucide-react";

import H2HInsights from "../Components/h2h/h2hinsights";
import ScoreAnalysisCard from "../Components/h2h/scoreanalysiscard";

interface GameDataType {
  id?: string;
  home: string;
  away: string;
  date: string;
  league: string;
  season?: number;
  goals_h_ft?: number;
  goals_a_ft?: number;
  goals_h_ht?: number;
  goals_a_ht?: number;
  [key: string]: any;
}

interface RankingData {
  id: string;
  team: string;
  position: number;
  season: string;
  [key: string]: any;
}

export default function H2H() {
  const [gameData, setGameData] = useState<GameDataType[]>([]);
  const [rankingHomeData, setRankingHomeData] = useState<RankingData[]>([]);
  const [rankingAwayData, setRankingAwayData] = useState<RankingData[]>([]);
  const [homeTeam, setHomeTeam] = useState("");
  const [awayTeam, setAwayTeam] = useState("");
  const [h2hMatches, setH2hMatches] = useState<GameDataType[]>([]);
  const [homeRecentGames, setHomeRecentGames] = useState<GameDataType[]>([]);
  const [awayRecentGames, setAwayRecentGames] = useState<GameDataType[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setIsLoading(true);
    try {
      const [allGameData, allRankingHome, allRankingAway] = await Promise.all([
        GameData.list(),
        RankingHome.list(),
        RankingAway.list()
      ]);

      setGameData(allGameData as GameDataType[]);
      
      // Transform ranking data
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
    setIsLoading(false);
  };

  const getUniqueTeams = () => {
    const teams = new Set<string>();
    gameData.forEach((game: GameDataType) => {
      if (typeof game.home === 'string') teams.add(game.home);
      if (typeof game.away === 'string') teams.add(game.away);
    });
    return Array.from(teams).sort();
  };

  const analyzeH2H = () => {
    if (!homeTeam || !awayTeam) return;

    // Find head-to-head matches
    const h2hGames = gameData.filter((game: GameDataType) =>
      (game.home === homeTeam && game.away === awayTeam) ||
      (game.home === awayTeam && game.away === homeTeam)
    );

    // Find recent games for home team
    const homeGames = gameData
      .filter((game: GameDataType) => game.home === homeTeam || game.away === homeTeam)
      .sort((a: GameDataType, b: GameDataType) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .slice(0, 10);

    // Find recent games for away team
    const awayGames = gameData
      .filter((game: GameDataType) => game.home === awayTeam || game.away === awayTeam)
      .sort((a: GameDataType, b: GameDataType) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .slice(0, 10);

    setH2hMatches(h2hGames);
    setHomeRecentGames(homeGames);
    setAwayRecentGames(awayGames);
  };

  const getTeamForm = (games: GameDataType[], team: string, perspective: string) => {
    return games.slice(0, 5).map((game: GameDataType) => {
      const isHome = game.home === team;
      const teamGoals = isHome ? (game.goals_h_ft || 0) : (game.goals_a_ft || 0);
      const opponentGoals = isHome ? (game.goals_a_ft || 0) : (game.goals_h_ft || 0);

      if (teamGoals > opponentGoals) return 'W';
      if (teamGoals < opponentGoals) return 'L';
      return 'D';
    });
  };

  const calculateStats = (games: GameDataType[], team: string) => {
    let wins = 0, draws = 0, losses = 0;
    let goalsFor = 0, goalsAgainst = 0;

    games.forEach((game: GameDataType) => {
      const isHome = game.home === team;
      const teamGoals = isHome ? (game.goals_h_ft || 0) : (game.goals_a_ft || 0);
      const opponentGoals = isHome ? (game.goals_a_ft || 0) : (game.goals_h_ft || 0);

      goalsFor += teamGoals;
      goalsAgainst += opponentGoals;

      if (teamGoals > opponentGoals) wins++;
      else if (teamGoals < opponentGoals) losses++;
      else draws++;
    });

    return {
      wins,
      draws,
      losses,
      goalsFor,
      goalsAgainst,
      avgGoalsFor: games.length > 0 ? goalsFor / games.length : 0,
      avgGoalsAgainst: games.length > 0 ? goalsAgainst / games.length : 0
    };
  };

  const calculateH2HStats = (matches: GameDataType[], team: string) => {
    return matches.reduce((acc, game: GameDataType) => {
      const result = getMatchResult(game, team, 'any');
      if (result === 'W') acc.wins++;
      else if (result === 'L') acc.losses++;
      else acc.draws++;
      return acc;
    }, { wins: 0, draws: 0, losses: 0 });
  };

  const getMatchResult = (game: GameDataType, team: string, perspective: string) => {
    const isHome = game.home === team;
    const teamGoals = isHome ? (game.goals_h_ft || 0) : (game.goals_a_ft || 0);
    const opponentGoals = isHome ? (game.goals_a_ft || 0) : (game.goals_h_ft || 0);

    if (teamGoals > opponentGoals) return 'W';
    if (teamGoals < opponentGoals) return 'L';
    return 'D';
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background text-foreground p-4 sm:p-6 lg:p-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Carregando dados...</p>
          </div>
        </div>
      </div>
    );
  }

  const uniqueTeams = getUniqueTeams();
  const homeStats = homeRecentGames.length > 0 ? calculateStats(homeRecentGames, homeTeam) : null;
  const awayStats = awayRecentGames.length > 0 ? calculateStats(awayRecentGames, awayTeam) : null;
  const h2hStats = h2hMatches.length > 0 ? {
    home: calculateH2HStats(h2hMatches, homeTeam),
    away: calculateH2HStats(h2hMatches, awayTeam)
  } : null;

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
              Análise Head-to-Head
            </h1>
            <p className="text-muted-foreground text-lg">
              Compare o histórico entre duas equipes
            </p>
          </div>
        </div>

        {/* Team Selection */}
        <Card className="bg-card border-border backdrop-blur-sm mb-8">
          <CardHeader className="border-b border-border">
            <CardTitle className="text-xl text-card-foreground flex items-center gap-2">
              <Search className="w-6 h-6 text-primary" />
              Selecionar Equipes
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label className="text-card-foreground">Time da Casa</Label>
                <Select value={homeTeam} onValueChange={setHomeTeam}>
                  <SelectTrigger className="bg-input border-border text-foreground">
                    <SelectValue placeholder="Selecione o time da casa" />
                  </SelectTrigger>
                  <SelectContent>
                    {uniqueTeams.map((team) => (
                      <SelectItem key={team} value={team}>
                        {team}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label className="text-card-foreground">Time Visitante</Label>
                <Select value={awayTeam} onValueChange={setAwayTeam}>
                  <SelectTrigger className="bg-input border-border text-foreground">
                    <SelectValue placeholder="Selecione o time visitante" />
                  </SelectTrigger>
                  <SelectContent>
                    {uniqueTeams.map((team) => (
                      <SelectItem key={team} value={team}>
                        {team}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-end">
                <Button
                  onClick={analyzeH2H}
                  disabled={!homeTeam || !awayTeam}
                  className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
                >
                  <BarChart3 className="w-4 h-4 mr-2" />
                  Analisar
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Analysis Results */}
        {h2hMatches.length > 0 && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* H2H Insights */}
            <H2HInsights
              h2hMatches={h2hMatches}
              homeTeam={homeTeam}
              awayTeam={awayTeam}
              h2hStats={h2hStats}
            />

            {/* Score Analysis */}
            <ScoreAnalysisCard
              h2hMatches={h2hMatches}
              homeRecentGames={homeRecentGames}
              awayRecentGames={awayRecentGames}
            />
          </div>
        )}

        {/* Recent Form Comparison */}
        {homeRecentGames.length > 0 && awayRecentGames.length > 0 && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-8">
            {/* Home Team Form */}
            <Card className="bg-card border-border backdrop-blur-sm">
              <CardHeader className="border-b border-border">
                <CardTitle className="text-lg text-card-foreground flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-primary" />
                  Forma Recente - {homeTeam}
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-muted-foreground">Últimos 5 jogos:</span>
                    <div className="flex gap-1">
                      {getTeamForm(homeRecentGames, homeTeam, 'home').map((result, index) => (
                        <span
                          key={index}
                          className={`w-6 h-6 rounded-full text-xs font-bold flex items-center justify-center text-white ${
                            result === 'W' ? 'bg-green-500' :
                            result === 'L' ? 'bg-red-500' : 'bg-yellow-500'
                          }`}
                        >
                          {result}
                        </span>
                      ))}
                    </div>
                  </div>

                  {homeStats && (
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="text-muted-foreground">Vitórias: <span className="text-green-500 font-semibold">{homeStats.wins}</span></p>
                        <p className="text-muted-foreground">Empates: <span className="text-yellow-500 font-semibold">{homeStats.draws}</span></p>
                        <p className="text-muted-foreground">Derrotas: <span className="text-red-500 font-semibold">{homeStats.losses}</span></p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Gols Feitos: <span className="text-card-foreground font-semibold">{homeStats.goalsFor}</span></p>
                        <p className="text-muted-foreground">Gols Sofridos: <span className="text-card-foreground font-semibold">{homeStats.goalsAgainst}</span></p>
                        <p className="text-muted-foreground">Média de Gols: <span className="text-card-foreground font-semibold">{homeStats.avgGoalsFor.toFixed(1)}</span></p>
                      </div>
                    </div>
                  )}

                  <div className="space-y-2">
                    <h4 className="text-sm font-medium text-card-foreground">Últimos Jogos:</h4>
                    {homeRecentGames.slice(0, 5).map((game: GameDataType, index) => (
                      <div key={index} className="text-xs p-2 bg-muted/20 rounded">
                        <div className="flex justify-between items-center">
                          <span className="text-muted-foreground">
                            {new Date(game.date).toLocaleDateString()} - {game.league}
                          </span>
                        </div>
                        <div className="flex justify-between items-center mt-1">
                          <span className="text-card-foreground font-medium">
                            {game.home} vs {game.away}
                          </span>
                          <span className="text-card-foreground font-bold">
                            {game.goals_h_ft || 0} - {game.goals_a_ft || 0}
                            <span className="text-xs text-muted-foreground ml-1">
                              (HT: {game.goals_h_ht || 0}-{game.goals_a_ht || 0})
                            </span>
                          </span>
                        </div>
                        <div className="mt-1">
                          <span className={`text-xs px-2 py-1 rounded ${
                            getMatchResult(game, homeTeam, 'any') === 'W' ? 'bg-green-500/20 text-green-400' :
                            getMatchResult(game, homeTeam, 'any') === 'L' ? 'bg-red-500/20 text-red-400' :
                            'bg-yellow-500/20 text-yellow-400'
                          }`}>
                            {getMatchResult(game, homeTeam, 'any') === 'W' ? 'Vitória' :
                             getMatchResult(game, homeTeam, 'any') === 'L' ? 'Derrota' : 'Empate'} para {game.home === homeTeam ? 'Casa' : 'Visitante'}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Away Team Form */}
            <Card className="bg-card border-border backdrop-blur-sm">
              <CardHeader className="border-b border-border">
                <CardTitle className="text-lg text-card-foreground flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-primary" />
                  Forma Recente - {awayTeam}
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-muted-foreground">Últimos 5 jogos:</span>
                    <div className="flex gap-1">
                      {getTeamForm(awayRecentGames, awayTeam, 'away').map((result, index) => (
                        <span
                          key={index}
                          className={`w-6 h-6 rounded-full text-xs font-bold flex items-center justify-center text-white ${
                            result === 'W' ? 'bg-green-500' :
                            result === 'L' ? 'bg-red-500' : 'bg-yellow-500'
                          }`}
                        >
                          {result}
                        </span>
                      ))}
                    </div>
                  </div>

                  {awayStats && (
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="text-muted-foreground">Vitórias: <span className="text-green-500 font-semibold">{awayStats.wins}</span></p>
                        <p className="text-muted-foreground">Empates: <span className="text-yellow-500 font-semibold">{awayStats.draws}</span></p>
                        <p className="text-muted-foreground">Derrotas: <span className="text-red-500 font-semibold">{awayStats.losses}</span></p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Gols Feitos: <span className="text-card-foreground font-semibold">{awayStats.goalsFor}</span></p>
                        <p className="text-muted-foreground">Gols Sofridos: <span className="text-card-foreground font-semibold">{awayStats.goalsAgainst}</span></p>
                        <p className="text-muted-foreground">Média de Gols: <span className="text-card-foreground font-semibold">{awayStats.avgGoalsFor.toFixed(1)}</span></p>
                      </div>
                    </div>
                  )}

                  <div className="space-y-2">
                    <h4 className="text-sm font-medium text-card-foreground">Últimos Jogos:</h4>
                    {awayRecentGames.slice(0, 5).map((game: GameDataType, index) => (
                      <div key={index} className="text-xs p-2 bg-muted/20 rounded">
                        <div className="flex justify-between items-center">
                          <span className="text-muted-foreground">
                            {new Date(game.date).toLocaleDateString()} - {game.league}
                          </span>
                        </div>
                        <div className="flex justify-between items-center mt-1">
                          <span className="text-card-foreground font-medium">
                            {game.home} vs {game.away}
                          </span>
                          <span className="text-card-foreground font-bold">
                            {game.goals_h_ft || 0} - {game.goals_a_ft || 0}
                            <span className="text-xs text-muted-foreground ml-1">
                              (HT: {game.goals_h_ht || 0}-{game.goals_a_ht || 0})
                            </span>
                          </span>
                        </div>
                        <div className="mt-1">
                          <span className={`text-xs px-2 py-1 rounded ${
                            getMatchResult(game, awayTeam, 'any') === 'W' ? 'bg-green-500/20 text-green-400' :
                            getMatchResult(game, awayTeam, 'any') === 'L' ? 'bg-red-500/20 text-red-400' :
                            'bg-yellow-500/20 text-yellow-400'
                          }`}>
                            {getMatchResult(game, awayTeam, 'any') === 'W' ? 'Vitória' :
                             getMatchResult(game, awayTeam, 'any') === 'L' ? 'Derrota' : 'Empate'} para {game.home === awayTeam ? 'Casa' : 'Visitante'}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}
