
import React, { useState, useEffect } from "react";
import { GameData } from "@/entities/GameData";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { ArrowLeft, Search, TrendingUp, Calendar, Target } from "lucide-react";

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
  [key: string]: any;
}

export default function H2H() {
  const [homeTeam, setHomeTeam] = useState<string>("");
  const [awayTeam, setAwayTeam] = useState<string>("");
  const [gameData, setGameData] = useState<GameDataType[]>([]);
  const [filteredMatches, setFilteredMatches] = useState<GameDataType[]>([]);
  const [allTeams, setAllTeams] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedPeriod, setSelectedPeriod] = useState<string>("all");

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    if (homeTeam && awayTeam) {
      filterMatches();
    } else {
      setFilteredMatches([]);
    }
  }, [homeTeam, awayTeam, gameData, selectedPeriod]);

  const loadData = async () => {
    setIsLoading(true);
    try {
      const data = await GameData.list();
      const transformedData: GameDataType[] = data.map((game: any) => ({
        id: game.id || `${game.home}-${game.away}-${game.date}`,
        home: game.home,
        away: game.away,
        date: game.date,
        league: game.league || 'Liga Desconhecida',
        season: game.season || new Date(game.date).getFullYear(),
        goals_h_ft: game.goals_h_ft || 0,
        goals_a_ft: game.goals_a_ft || 0
      }));
      
      setGameData(transformedData);
      
      // Extract unique teams
      const teams = new Set<string>();
      transformedData.forEach((game: GameDataType) => {
        teams.add(game.home);
        teams.add(game.away);
      });
      setAllTeams(Array.from(teams).sort());
    } catch (error) {
      console.error("Erro ao carregar dados:", error);
    }
    setIsLoading(false);
  };

  const filterMatches = () => {
    if (!homeTeam || !awayTeam) return;

    let matches = gameData.filter((game: GameDataType) => 
      (game.home === homeTeam && game.away === awayTeam) ||
      (game.home === awayTeam && game.away === homeTeam)
    );

    // Apply date filter
    if (selectedPeriod !== "all") {
      const cutoffDate = new Date();
      const yearsBack = parseInt(selectedPeriod);
      cutoffDate.setFullYear(cutoffDate.getFullYear() - yearsBack);
      
      matches = matches.filter((game: GameDataType) => 
        new Date(game.date) >= cutoffDate
      );
    }

    // Sort by date (most recent first)
    matches.sort((a: GameDataType, b: GameDataType) => 
      new Date(b.date).getTime() - new Date(a.date).getTime()
    );

    setFilteredMatches(matches);
  };

  const handleTeamSelect = (team: string, position: 'home' | 'away') => {
    if (position === 'home') {
      setHomeTeam(team);
    } else {
      setAwayTeam(team);
    }
  };

  const swapTeams = () => {
    const temp = homeTeam;
    setHomeTeam(awayTeam);
    setAwayTeam(temp);
  };

  const getTeamRecord = (team: string, opponent: string) => {
    const matches = filteredMatches.filter((game: GameDataType) => 
      (game.home === team && game.away === opponent) ||
      (game.home === opponent && game.away === team)
    );

    let wins = 0;
    let draws = 0;
    let losses = 0;

    matches.forEach((game: GameDataType) => {
      const isHome = game.home === team;
      const teamGoals = isHome ? game.goals_h_ft || 0 : game.goals_a_ft || 0;
      const opponentGoals = isHome ? game.goals_a_ft || 0 : game.goals_h_ft || 0;

      if (teamGoals > opponentGoals) {
        wins++;
      } else if (teamGoals === opponentGoals) {
        draws++;
      } else {
        losses++;
      }
    });

    return { wins, draws, losses, total: matches.length };
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background text-foreground p-4 sm:p-6 lg:p-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Carregando dados dos jogos...</p>
          </div>
        </div>
      </div>
    );
  }

  const homeRecord = homeTeam && awayTeam ? getTeamRecord(homeTeam, awayTeam) : null;
  const awayRecord = homeTeam && awayTeam ? getTeamRecord(awayTeam, homeTeam) : null;

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
              Head to Head
            </h1>
            <p className="text-muted-foreground text-lg">
              Análise detalhada entre duas equipes
            </p>
          </div>
        </div>

        {/* Team Selection */}
        <Card className="bg-card border-border mb-6">
          <CardHeader className="border-b border-border">
            <CardTitle className="text-xl text-card-foreground flex items-center gap-2">
              <Search className="w-6 h-6 text-primary" />
              Seleção de Equipes
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-end">
              <div className="space-y-2">
                <Label className="text-card-foreground">Time da Casa</Label>
                <Select value={homeTeam} onValueChange={(value) => handleTeamSelect(value, 'home')}>
                  <SelectTrigger className="bg-input border-border text-foreground">
                    <SelectValue placeholder="Selecione o time da casa" />
                  </SelectTrigger>
                  <SelectContent>
                    {allTeams.map((team) => (
                      <SelectItem key={team} value={team}>
                        {team}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="flex justify-center">
                <Button
                  variant="outline"
                  onClick={swapTeams}
                  disabled={!homeTeam || !awayTeam}
                  className="border-border text-muted-foreground hover:bg-muted/20"
                >
                  ⇄ Trocar
                </Button>
              </div>

              <div className="space-y-2">
                <Label className="text-card-foreground">Time Visitante</Label>
                <Select value={awayTeam} onValueChange={(value) => handleTeamSelect(value, 'away')}>
                  <SelectTrigger className="bg-input border-border text-foreground">
                    <SelectValue placeholder="Selecione o time visitante" />
                  </SelectTrigger>
                  <SelectContent>
                    {allTeams.map((team) => (
                      <SelectItem key={team} value={team}>
                        {team}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="mt-6">
              <Label className="text-card-foreground">Período de Análise</Label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-2">
                <Button
                  variant={selectedPeriod === "all" ? "default" : "outline"}
                  onClick={() => setSelectedPeriod("all")}
                  className="text-sm"
                >
                  Todos os Tempos
                </Button>
                <Button
                  variant={selectedPeriod === "1" ? "default" : "outline"}
                  onClick={() => setSelectedPeriod("1")}
                  className="text-sm"
                >
                  Último Ano
                </Button>
                <Button
                  variant={selectedPeriod === "3" ? "default" : "outline"}
                  onClick={() => setSelectedPeriod("3")}
                  className="text-sm"
                >
                  Últimos 3 Anos
                </Button>
                <Button
                  variant={selectedPeriod === "5" ? "default" : "outline"}
                  onClick={() => setSelectedPeriod("5")}
                  className="text-sm"
                >
                  Últimos 5 Anos
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Results */}
        {homeTeam && awayTeam && filteredMatches.length > 0 ? (
          <div className="space-y-6">
            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card className="bg-card border-border">
                <CardContent className="p-6 text-center">
                  <div className="text-2xl font-bold text-primary mb-2">
                    {filteredMatches.length}
                  </div>
                  <p className="text-muted-foreground">Confrontos Diretos</p>
                </CardContent>
              </Card>

              <Card className="bg-card border-border">
                <CardContent className="p-6 text-center">
                  <div className="text-2xl font-bold text-emerald-400 mb-2">
                    {homeRecord?.wins || 0}
                  </div>
                  <p className="text-muted-foreground">Vitórias {homeTeam}</p>
                </CardContent>
              </Card>

              <Card className="bg-card border-border">
                <CardContent className="p-6 text-center">
                  <div className="text-2xl font-bold text-blue-400 mb-2">
                    {awayRecord?.wins || 0}
                  </div>
                  <p className="text-muted-foreground">Vitórias {awayTeam}</p>
                </CardContent>
              </Card>
            </div>

            {/* Analysis Cards */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <ScoreAnalysisCard
                gameData={filteredMatches}
                teamName={homeTeam}
                perspective="home"
              />
              <ScoreAnalysisCard
                gameData={filteredMatches}
                teamName={awayTeam}
                perspective="away"
              />
            </div>

            <H2HInsights
              homeTeam={homeTeam}
              awayTeam={awayTeam}
              matches={filteredMatches}
              homeRecord={homeRecord}
              awayRecord={awayRecord}
            />
          </div>
        ) : homeTeam && awayTeam && filteredMatches.length === 0 ? (
          <Card className="bg-card border-border">
            <CardContent className="p-12 text-center">
              <Target className="w-16 h-16 text-muted-foreground/50 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-card-foreground mb-2">
                Nenhum confronto encontrado
              </h3>
              <p className="text-muted-foreground">
                Não há dados disponíveis para o confronto entre {homeTeam} e {awayTeam} no período selecionado.
              </p>
            </CardContent>
          </Card>
        ) : (
          <Card className="bg-card border-border">
            <CardContent className="p-12 text-center">
              <Search className="w-16 h-16 text-muted-foreground/50 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-card-foreground mb-2">
                Selecione as equipes
              </h3>
              <p className="text-muted-foreground">
                Escolha o time da casa e o time visitante para ver a análise head-to-head
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
