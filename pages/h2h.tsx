
import React, { useState, useEffect, useMemo } from "react";
import { GameData } from "@/entities/GameData";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import {
  ArrowLeft,
  Users,
  Search,
  TrendingUp,
  Calendar,
} from "lucide-react";
import { format } from "date-fns";

import H2HInsights from "../components/h2h/H2HInsights";
import ScoreAnalysisCard from "../components/h2h/ScoreAnalysisCard";

export default function H2H() {
  const [homeTeam, setHomeTeam] = useState("");
  const [awayTeam, setAwayTeam] = useState("");
  const [homeTeamSearch, setHomeTeamSearch] = useState("");
  const [awayTeamSearch, setAwayTeamSearch] = useState("");
  const [h2hMatches, setH2hMatches] = useState([]);
  const [homeRecentGames, setHomeRecentGames] = useState([]);
  const [awayRecentGames, setAwayRecentGames] = useState([]);
  const [availableTeams, setAvailableTeams] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isDataLoading, setIsDataLoading] = useState(true);

  useEffect(() => {
    loadTeams();
  }, []);

  const loadTeams = async () => {
    setIsDataLoading(true);
    try {
      const allGames = await GameData.list();
      const homeTeams = [...new Set(allGames.map(g => g.home))];
      const awayTeams = [...new Set(allGames.map(g => g.away))];
      
      const teams = [...new Set([...homeTeams, ...awayTeams])].filter(Boolean).sort();
      setAvailableTeams(teams);
    } catch (error) {
      console.error("Erro ao carregar times:", error);
    }
    setIsDataLoading(false);
  };

  const filteredHomeTeams = useMemo(() => {
    if (!homeTeamSearch) return [];
    return availableTeams
      .filter(team => 
        team.toLowerCase().includes(homeTeamSearch.toLowerCase())
      )
      .slice(0, 20);
  }, [availableTeams, homeTeamSearch]);

  const filteredAwayTeams = useMemo(() => {
    if (!awayTeamSearch) return [];
    return availableTeams
      .filter(team => 
        team.toLowerCase().includes(awayTeamSearch.toLowerCase())
      )
      .slice(0, 20);
  }, [availableTeams, awayTeamSearch]);

  const loadH2HData = async () => {
    if (!homeTeam || !awayTeam) return;
    
    setIsLoading(true);
    try {
      const allGames = await GameData.list();
      
      const h2h = allGames.filter(game => 
        (game.home === homeTeam && game.away === awayTeam) ||
        (game.home === awayTeam && game.away === homeTeam)
      ).sort((a, b) => new Date(b.date) - new Date(a.date));

      // Últimos 6 jogos do time da casa jogando EM CASA
      const homeRecent = allGames
        .filter(game => game.home === homeTeam) // Apenas jogos onde homeTeam foi mandante
        .sort((a, b) => new Date(b.date) - new Date(a.date))
        .slice(0, 6);

      // Últimos 6 jogos do time visitante jogando FORA DE CASA
      const awayRecent = allGames
        .filter(game => game.away === awayTeam) // Apenas jogos onde awayTeam foi visitante
        .sort((a, b) => new Date(b.date) - new Date(a.date))
        .slice(0, 6);

      setH2hMatches(h2h);
      setHomeRecentGames(homeRecent);
      setAwayRecentGames(awayRecent);
    } catch (error) {
      console.error("Erro ao carregar dados H2H:", error);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    if (homeTeam && awayTeam) {
      loadH2HData();
    }
  }, [homeTeam, awayTeam]);

  const getResult = (game, perspective) => {
    const homeGoals = game.goals_h_ft;
    const awayGoals = game.goals_a_ft;
    
    if (homeGoals == null || awayGoals == null) return "N/A";
    
    if (perspective === "home") {
      if (homeGoals > awayGoals) return "Win";
      if (homeGoals < awayGoals) return "Loss";
      return "Draw";
    } else {
      if (awayGoals > homeGoals) return "Win";
      if (awayGoals < homeGoals) return "Loss";
      return "Draw";
    }
  };

  const getResultBadgeColor = (result) => {
    switch (result) {
      case "Win": return "bg-green-500/20 text-green-400 border-green-500/30";
      case "Loss": return "bg-red-500/20 text-red-400 border-red-500/30";
      case "Draw": return "bg-yellow-500/20 text-yellow-400 border-yellow-500/30";
      default: return "bg-gray-500/20 text-gray-400 border-gray-500/30";
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground p-2 sm:p-4 lg:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 mb-6 sm:mb-8">
          <Link to={createPageUrl("Dashboard")}>
            <Button variant="outline" size="icon" className="border-border text-muted-foreground hover:bg-muted/20">
              <ArrowLeft className="w-4 h-4" />
            </Button>
          </Link>
          <div className="flex-1">
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-semibold text-foreground mb-1 flex items-center gap-3">
              <Users className="w-6 h-6 sm:w-8 sm:h-8 text-primary" />
              Head to Head (H2H)
            </h1>
            <p className="text-sm sm:text-base lg:text-lg text-muted-foreground">
              Compare histórico entre times mandantes e visitantes
            </p>
          </div>
        </div>

        {/* Team Selection */}
        <Card className="bg-card border-border mb-6 sm:mb-8">
          <CardHeader>
            <CardTitle className="text-card-foreground">Seleção de Times</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {/* Home Team Search */}
            <div className="space-y-2">
              <label className="text-sm text-muted-foreground">Time Mandante</label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <Input
                  placeholder="Buscar time mandante..."
                  value={homeTeamSearch}
                  onChange={(e) => setHomeTeamSearch(e.target.value)}
                  className="pl-10 bg-input border-border text-foreground"
                />
              </div>
              {homeTeamSearch && (
                <div className="max-h-48 overflow-y-auto bg-popover border border-border rounded-md">
                  {filteredHomeTeams.map(team => (
                    <div
                      key={team}
                      className="p-2 hover:bg-muted cursor-pointer text-sm"
                      onClick={() => {
                        setHomeTeam(team);
                        setHomeTeamSearch("");
                      }}
                    >
                      {team}
                    </div>
                  ))}
                </div>
              )}
              {homeTeam && (
                <div className="flex items-center justify-between bg-muted/50 p-2 rounded">
                  <span className="text-sm font-medium">{homeTeam}</span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setHomeTeam("")}
                    className="text-xs"
                  >
                    Limpar
                  </Button>
                </div>
              )}
            </div>

            {/* Away Team Search */}
            <div className="space-y-2">
              <label className="text-sm text-muted-foreground">Time Visitante</label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <Input
                  placeholder="Buscar time visitante..."
                  value={awayTeamSearch}
                  onChange={(e) => setAwayTeamSearch(e.target.value)}
                  className="pl-10 bg-input border-border text-foreground"
                />
              </div>
              {awayTeamSearch && (
                <div className="max-h-48 overflow-y-auto bg-popover border border-border rounded-md">
                  {filteredAwayTeams.map(team => (
                    <div
                      key={team}
                      className="p-2 hover:bg-muted cursor-pointer text-sm"
                      onClick={() => {
                        setAwayTeam(team);
                        setAwayTeamSearch("");
                      }}
                    >
                      {team}
                    </div>
                  ))}
                </div>
              )}
              {awayTeam && (
                <div className="flex items-center justify-between bg-muted/50 p-2 rounded">
                  <span className="text-sm font-medium">{awayTeam}</span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setAwayTeam("")}
                    className="text-xs"
                  >
                    Limpar
                  </Button>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {homeTeam && awayTeam && (
          <div className="space-y-6 sm:space-y-8">
            {/* H2H Insights Card */}
            <H2HInsights
              homeRecentGames={homeRecentGames}
              awayRecentGames={awayRecentGames}
              h2hMatches={h2hMatches}
              homeTeam={homeTeam}
              awayTeam={awayTeam}
            />
            
            {/* Score Analysis Card */}
            <ScoreAnalysisCard
              h2hMatches={h2hMatches}
              homeRecentGames={homeRecentGames}
              awayRecentGames={awayRecentGames}
            />

            {/* H2H Direct Matches */}
            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle className="text-card-foreground flex items-center gap-2 text-sm sm:text-base">
                  <TrendingUp className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />
                  Historico Confrontos: {homeTeam} vs {awayTeam}
                </CardTitle>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <div className="flex items-center justify-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                  </div>
                ) : h2hMatches.length > 0 ? (
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow className="border-border">
                          <TableHead className="text-muted-foreground text-xs sm:text-sm">Data</TableHead>
                          <TableHead className="text-muted-foreground text-xs sm:text-sm">Partida</TableHead>
                          <TableHead className="text-muted-foreground text-center text-xs sm:text-sm">HT</TableHead>
                          <TableHead className="text-muted-foreground text-center text-xs sm:text-sm">FT</TableHead>
                          <TableHead className="text-muted-foreground text-center text-xs sm:text-sm">Resultado</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {h2hMatches.map((game, index) => (
                          <TableRow key={index} className="border-border">
                            <TableCell className="text-card-foreground text-xs sm:text-sm">
                              {game.date ? format(new Date(game.date), 'dd/MM/yyyy') : '-'}
                            </TableCell>
                            <TableCell className="text-card-foreground font-medium text-xs sm:text-sm">
                              {game.home} vs {game.away}
                            </TableCell>
                            <TableCell className="text-center text-card-foreground text-xs sm:text-sm">
                              {(game.goals_h_ht != null && game.goals_a_ht != null) 
                                ? `${game.goals_h_ht} x ${game.goals_a_ht}` 
                                : '-'}
                            </TableCell>
                            <TableCell className="text-center text-card-foreground text-xs sm:text-sm">
                              {(game.goals_h_ft != null && game.goals_a_ft != null) 
                                ? `${game.goals_h_ft} x ${game.goals_a_ft}` 
                                : '-'}
                            </TableCell>
                            <TableCell className="text-center">
                              <Badge className={`${getResultBadgeColor(getResult(game, game.home === homeTeam ? "home" : "away"))} text-xs px-2 py-1`}>
                                {getResult(game, game.home === homeTeam ? "home" : "away")}
                              </Badge>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <Users className="w-12 h-12 sm:w-16 sm:h-16 text-muted-foreground/50 mx-auto mb-4" />
                    <p className="text-muted-foreground">Nenhum confronto direto encontrado</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Recent Games Grid */}
            <div className="grid lg:grid-cols-2 gap-6 sm:gap-8">
              {/* Home Team Recent Games */}
              <Card className="bg-card border-border">
                <CardHeader>
                  <CardTitle className="text-card-foreground flex items-center gap-2 text-sm sm:text-base">
                    <Calendar className="w-4 h-4 sm:w-5 sm:h-5 text-emerald-400" />
                    <span className="truncate">Últimos 6 Jogos - {homeTeam} (Casa)</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {homeRecentGames.length > 0 ? (
                    <div className="overflow-x-auto">
                      <Table>
                        <TableHeader>
                          <TableRow className="border-border">
                            <TableHead className="text-muted-foreground text-xs">Data</TableHead>
                            <TableHead className="text-muted-foreground text-xs">Partida</TableHead>
                            <TableHead className="text-muted-foreground text-center text-xs">HT</TableHead>
                            <TableHead className="text-muted-foreground text-center text-xs">FT</TableHead>
                            <TableHead className="text-muted-foreground text-center text-xs">Resultado</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {homeRecentGames.map((game, index) => (
                            <TableRow key={index} className="border-border">
                              <TableCell className="text-card-foreground text-xs">
                                {game.date ? format(new Date(game.date), 'dd/MM') : '-'}
                              </TableCell>
                              <TableCell className="text-card-foreground text-xs">
                                <div className="truncate max-w-32">
                                  {game.home} vs {game.away}
                                </div>
                              </TableCell>
                              <TableCell className="text-center text-card-foreground text-xs">
                                {(game.goals_h_ht != null && game.goals_a_ht != null) 
                                  ? `${game.goals_h_ht}x${game.goals_a_ht}` 
                                  : '-'}
                              </TableCell>
                              <TableCell className="text-center text-card-foreground text-xs">
                                {(game.goals_h_ft != null && game.goals_a_ft != null) 
                                  ? `${game.goals_h_ft}x${game.goals_a_ft}` 
                                  : '-'}
                              </TableCell>
                              <TableCell className="text-center">
                                <Badge className={`${getResultBadgeColor(getResult(game, "home"))} text-xs px-1 py-1`}>
                                  {getResult(game, "home")}
                                </Badge>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <Calendar className="w-8 h-8 sm:w-12 sm:h-12 text-muted-foreground/50 mx-auto mb-4" />
                      <p className="text-muted-foreground text-sm">Nenhum jogo em casa encontrado</p>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Away Team Recent Games */}
              <Card className="bg-card border-border">
                <CardHeader>
                  <CardTitle className="text-card-foreground flex items-center gap-2 text-sm sm:text-base">
                    <Calendar className="w-4 h-4 sm:w-5 sm:h-5 text-blue-400" />
                    <span className="truncate">Últimos 6 Jogos - {awayTeam} (Fora)</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {awayRecentGames.length > 0 ? (
                    <div className="overflow-x-auto">
                      <Table>
                        <TableHeader>
                          <TableRow className="border-border">
                            <TableHead className="text-muted-foreground text-xs">Data</TableHead>
                            <TableHead className="text-muted-foreground text-xs">Partida</TableHead>
                            <TableHead className="text-muted-foreground text-center text-xs">HT</TableHead>
                            <TableHead className="text-muted-foreground text-center text-xs">FT</TableHead>
                            <TableHead className="text-muted-foreground text-center text-xs">Resultado</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {awayRecentGames.map((game, index) => (
                            <TableRow key={index} className="border-border">
                              <TableCell className="text-card-foreground text-xs">
                                {game.date ? format(new Date(game.date), 'dd/MM') : '-'}
                              </TableCell>
                              <TableCell className="text-card-foreground text-xs">
                                <div className="truncate max-w-32">
                                  {game.home} vs {game.away}
                                </div>
                              </TableCell>
                              <TableCell className="text-center text-card-foreground text-xs">
                                {(game.goals_h_ht != null && game.goals_a_ht != null) 
                                  ? `${game.goals_h_ht}x${game.goals_a_ht}` 
                                  : '-'}
                              </TableCell>
                              <TableCell className="text-center text-card-foreground text-xs">
                                {(game.goals_h_ft != null && game.goals_a_ft != null) 
                                  ? `${game.goals_h_ft}x${game.goals_a_ft}` 
                                  : '-'}
                              </TableCell>
                              <TableCell className="text-center">
                                <Badge className={`${getResultBadgeColor(getResult(game, "away"))} text-xs px-1 py-1`}>
                                  {getResult(game, "away")}
                                </Badge>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <Calendar className="w-8 h-8 sm:w-12 sm:h-12 text-muted-foreground/50 mx-auto mb-4" />
                      <p className="text-muted-foreground text-sm">Nenhum jogo fora de casa encontrado</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
