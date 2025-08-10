
import React, { useState, useEffect } from "react";
import { GameData } from "@/entities/GameData";
import { RankingHome } from "@/entities/RankingHome";
import { RankingAway } from "@/entities/RankingAway";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import {
  ArrowLeft,
  Search,
  Users,
  Trophy,
  Calendar,
  Target,
  TrendingUp,
  BarChart3
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
  const [homeTeam, setHomeTeam] = useState("");
  const [awayTeam, setAwayTeam] = useState("");
  const [h2hMatches, setH2hMatches] = useState<GameDataType[]>([]);
  const [homeRanking, setHomeRanking] = useState<RankingData[]>([]);
  const [awayRanking, setAwayRanking] = useState<RankingData[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isDataLoading, setIsDataLoading] = useState(true);
  const [allGames, setAllGames] = useState<GameDataType[]>([]);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setIsDataLoading(true);
    try {
      const [allGameData, allRankingHome, allRankingAway] = await Promise.all([
        GameData.list(),
        RankingHome.list(),
        RankingAway.list()
      ]);

      setAllGames(allGameData as GameDataType[]);
      setHomeRanking(allRankingHome as RankingData[]);
      setAwayRanking(allRankingAway as RankingData[]);
    } catch (error) {
      console.error("Error loading data:", error);
    }
    setIsDataLoading(false);
  };

  const searchH2H = async () => {
    if (!homeTeam.trim() || !awayTeam.trim()) return;

    setIsLoading(true);

    try {
      const matches = allGames.filter((game: GameDataType) => {
        const homeMatch = game.home.toLowerCase().includes(homeTeam.toLowerCase()) || 
                         homeTeam.toLowerCase().includes(game.home.toLowerCase());
        const awayMatch = game.away.toLowerCase().includes(awayTeam.toLowerCase()) || 
                         awayTeam.toLowerCase().includes(game.away.toLowerCase());
        
        return (homeMatch && awayMatch) || 
               (game.away.toLowerCase().includes(homeTeam.toLowerCase()) && 
                game.home.toLowerCase().includes(awayTeam.toLowerCase()));
      });

      // Get recent matches for analysis
      const homeTeamMatches = allGames.filter((game: GameDataType) => 
        game.home.toLowerCase().includes(homeTeam.toLowerCase()) || 
        game.away.toLowerCase().includes(homeTeam.toLowerCase())
      ).slice(0, 10);

      const awayTeamMatches = allGames.filter((game: GameDataType) => 
        game.home.toLowerCase().includes(awayTeam.toLowerCase()) || 
        game.away.toLowerCase().includes(awayTeam.toLowerCase())
      ).slice(0, 10);

      // Calculate basic stats
      const homeStats = calculateTeamStats(homeTeamMatches, homeTeam);
      const awayStats = calculateTeamStats(awayTeamMatches, awayTeam);

      const h2hStats = {
        home: homeStats,
        away: awayStats
      };

      setH2hMatches(matches);
    } catch (error) {
      console.error("Error searching H2H:", error);
    }

    setIsLoading(false);
  };

  const calculateTeamStats = (matches: GameDataType[], teamName: string) => {
    let wins = 0, draws = 0, losses = 0;

    matches.forEach((match: GameDataType) => {
      const isHome = match.home.toLowerCase().includes(teamName.toLowerCase());
      const homeGoals = Number(match.goals_h_ft) || 0;
      const awayGoals = Number(match.goals_a_ft) || 0;

      if (isHome) {
        if (homeGoals > awayGoals) wins++;
        else if (homeGoals === awayGoals) draws++;
        else losses++;
      } else {
        if (awayGoals > homeGoals) wins++;
        else if (homeGoals === awayGoals) draws++;
        else losses++;
      }
    });

    return { wins, draws, losses };
  };

  const getMatchResult = (result: GameDataType) => {
    const homeGoals = Number(result.goals_h_ft) || 0;
    const awayGoals = Number(result.goals_a_ft) || 0;
    
    if (homeGoals > awayGoals) return "H";
    if (awayGoals > homeGoals) return "A";
    return "D";
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
              Análise Head-to-Head
            </h1>
            <p className="text-muted-foreground text-lg">
              Compare histórico entre equipes e analise padrões de confronto
            </p>
          </div>
        </div>

        {/* Search Form */}
        <Card className="bg-card border-border mb-8">
          <CardHeader className="border-b border-border">
            <CardTitle className="text-xl text-card-foreground flex items-center gap-2">
              <Search className="w-6 h-6 text-primary" />
              Buscar Confronto Direto
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            {isDataLoading ? (
              <div className="text-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
                <p className="text-muted-foreground">Carregando dados dos jogos...</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-muted-foreground mb-2">
                    Time Mandante
                  </label>
                  <Input
                    placeholder="Ex: Flamengo, São Paulo..."
                    value={homeTeam}
                    onChange={(e) => setHomeTeam(e.target.value)}
                    className="bg-input border-border text-foreground"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-muted-foreground mb-2">
                    Time Visitante
                  </label>
                  <Input
                    placeholder="Ex: Palmeiras, Corinthians..."
                    value={awayTeam}
                    onChange={(e) => setAwayTeam(e.target.value)}
                    className="bg-input border-border text-foreground"
                  />
                </div>
                <div className="flex items-end">
                  <Button
                    onClick={searchH2H}
                    disabled={isLoading || !homeTeam.trim() || !awayTeam.trim()}
                    className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
                  >
                    {isLoading ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        Analisando...
                      </>
                    ) : (
                      <>
                        <Search className="w-4 h-4 mr-2" />
                        Analisar H2H
                      </>
                    )}
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Results */}
        {h2hMatches.length > 0 && (
          <div className="space-y-8">
            {/* H2H Insights */}
            <H2HInsights
              h2hMatches={h2hMatches}
              homeTeam={homeTeam}
              awayTeam={awayTeam}
            />

            {/* Recent Matches */}
            <Card className="bg-card border-border">
              <CardHeader className="border-b border-border">
                <CardTitle className="text-xl text-card-foreground flex items-center gap-2">
                  <Calendar className="w-6 h-6 text-primary" />
                  Histórico de Confrontos ({h2hMatches.length} jogos)
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="space-y-4">
                  {h2hMatches.slice(0, 10).map((match: GameDataType, index: number) => (
                    <div key={index} className="flex items-center justify-between p-4 bg-muted/20 rounded-lg border border-border">
                      <div className="flex items-center gap-4">
                        <div className="text-sm text-muted-foreground">
                          {new Date(match.date).toLocaleDateString('pt-BR')}
                        </div>
                        <div className="font-medium text-foreground">
                          {match.home} vs {match.away}
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-4">
                        <div className="text-center">
                          <div className="text-sm text-muted-foreground">HT</div>
                          <div className="font-bold text-foreground">
                            {(match.goals_h_ht || 0)} - {(match.goals_a_ht || 0)}
                          </div>
                        </div>
                        
                        <div className="text-center">
                          <div className="text-sm text-muted-foreground">FT</div>
                          <div className="font-bold text-foreground">
                            {(match.goals_h_ft || 0)} - {(match.goals_a_ft || 0)}
                          </div>
                        </div>
                        
                        <Badge variant={
                          getMatchResult(match) === 'H' ? 'default' : 
                          getMatchResult(match) === 'A' ? 'secondary' : 'outline'
                        }>
                          {getMatchResult(match) === 'H' && `${match.home} Win`}
                          {getMatchResult(match) === 'A' && `${match.away} Win`}
                          {getMatchResult(match) === 'D' && 'Draw'}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Score Analysis Cards */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <ScoreAnalysisCard
                matches={h2hMatches}
                teamName={homeTeam}
                perspective="home"
              />
              <ScoreAnalysisCard
                matches={h2hMatches}
                teamName={awayTeam}
                perspective="away"
              />
            </div>
          </div>
        )}

        {/* No Results */}
        {!isLoading && homeTeam && awayTeam && h2hMatches.length === 0 && (
          <Card className="bg-card border-border">
            <CardContent className="p-12 text-center">
              <Users className="w-16 h-16 text-muted-foreground/50 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-card-foreground mb-2">
                Nenhum confronto encontrado
              </h3>
              <p className="text-muted-foreground mb-6">
                Não foi possível encontrar jogos entre {homeTeam} e {awayTeam}. 
                Verifique se os nomes dos times estão corretos.
              </p>
              <Button
                onClick={() => {
                  setHomeTeam('');
                  setAwayTeam('');
                  setH2hMatches([]);
                }}
                variant="outline"
                className="border-border text-foreground hover:bg-muted/20"
              >
                Nova Busca
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
