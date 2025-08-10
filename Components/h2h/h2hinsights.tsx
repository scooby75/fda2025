
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Trophy,
  TrendingUp,
  BarChart3,
  Target
} from "lucide-react";

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

interface H2HInsightsProps {
  h2hMatches: GameDataType[];
  homeTeam: string;
  awayTeam: string;
}

export default function H2HInsights({ h2hMatches, homeTeam, awayTeam }: H2HInsightsProps) {
  const calculateStats = () => {
    let homeWins = 0, draws = 0, awayWins = 0;
    let totalGoalsHome = 0, totalGoalsAway = 0;
    let over25 = 0, under25 = 0;
    let btts = 0, noBtts = 0;

    h2hMatches.forEach((match) => {
      const homeGoals = Number(match.goals_h_ft) || 0;
      const awayGoals = Number(match.goals_a_ft) || 0;
      
      totalGoalsHome += homeGoals;
      totalGoalsAway += awayGoals;
      
      const totalGoals = homeGoals + awayGoals;
      if (totalGoals > 2.5) over25++;
      else under25++;
      
      if (homeGoals > 0 && awayGoals > 0) btts++;
      else noBtts++;
      
      if (homeGoals > awayGoals) homeWins++;
      else if (awayGoals > homeGoals) awayWins++;
      else draws++;
    });

    return {
      homeWins,
      draws,
      awayWins,
      avgGoalsHome: h2hMatches.length > 0 ? (totalGoalsHome / h2hMatches.length).toFixed(1) : "0.0",
      avgGoalsAway: h2hMatches.length > 0 ? (totalGoalsAway / h2hMatches.length).toFixed(1) : "0.0",
      over25Percentage: h2hMatches.length > 0 ? ((over25 / h2hMatches.length) * 100).toFixed(1) : "0.0",
      bttsPercentage: h2hMatches.length > 0 ? ((btts / h2hMatches.length) * 100).toFixed(1) : "0.0"
    };
  };

  const stats = calculateStats();

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {/* Head to Head Record */}
      <Card className="bg-card border-border">
        <CardHeader className="border-b border-border pb-3">
          <CardTitle className="text-lg text-card-foreground flex items-center gap-2">
            <Trophy className="w-5 h-5 text-primary" />
            Histórico H2H
          </CardTitle>
        </CardHeader>
        <CardContent className="p-4">
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">{homeTeam}</span>
              <Badge variant="default" className="bg-emerald-500/20 text-emerald-400">
                {stats.homeWins}
              </Badge>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Empates</span>
              <Badge variant="outline" className="border-muted-foreground/30">
                {stats.draws}
              </Badge>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">{awayTeam}</span>
              <Badge variant="secondary" className="bg-blue-500/20 text-blue-400">
                {stats.awayWins}
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Goals Average */}
      <Card className="bg-card border-border">
        <CardHeader className="border-b border-border pb-3">
          <CardTitle className="text-lg text-card-foreground flex items-center gap-2">
            <Target className="w-5 h-5 text-primary" />
            Média de Gols
          </CardTitle>
        </CardHeader>
        <CardContent className="p-4">
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">{homeTeam}</span>
              <span className="font-semibold text-foreground">{stats.avgGoalsHome}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">{awayTeam}</span>
              <span className="font-semibold text-foreground">{stats.avgGoalsAway}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Total Médio</span>
              <span className="font-semibold text-primary">
                {(parseFloat(stats.avgGoalsHome) + parseFloat(stats.avgGoalsAway)).toFixed(1)}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Over/Under 2.5 */}
      <Card className="bg-card border-border">
        <CardHeader className="border-b border-border pb-3">
          <CardTitle className="text-lg text-card-foreground flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-primary" />
            Over/Under 2.5
          </CardTitle>
        </CardHeader>
        <CardContent className="p-4">
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Over 2.5</span>
              <Badge variant="default" className="bg-orange-500/20 text-orange-400">
                {stats.over25Percentage}%
              </Badge>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Under 2.5</span>
              <Badge variant="outline" className="border-muted-foreground/30">
                {(100 - parseFloat(stats.over25Percentage)).toFixed(1)}%
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* BTTS */}
      <Card className="bg-card border-border">
        <CardHeader className="border-b border-border pb-3">
          <CardTitle className="text-lg text-card-foreground flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-primary" />
            Ambas Marcam
          </CardTitle>
        </CardHeader>
        <CardContent className="p-4">
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Sim</span>
              <Badge variant="default" className="bg-purple-500/20 text-purple-400">
                {stats.bttsPercentage}%
              </Badge>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Não</span>
              <Badge variant="outline" className="border-muted-foreground/30">
                {(100 - parseFloat(stats.bttsPercentage)).toFixed(1)}%
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
