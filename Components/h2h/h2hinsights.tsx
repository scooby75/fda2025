
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Users, TrendingUp, BarChart2 } from "lucide-react";

export default function H2HInsights({ homeRecentGames, awayRecentGames, h2hMatches, homeTeam, awayTeam }) {

  const calculateInsights = (games, team) => {
    let wins = 0;
    let draws = 0;
    let losses = 0;

    games.forEach(game => {
      const homeGoals = game.goals_h_ft;
      const awayGoals = game.goals_a_ft;

      if (homeGoals == null || awayGoals == null) return;
      
      if (game.home === team) { // If the team in perspective was the home team in this game
        if (homeGoals > awayGoals) wins++;
        else if (homeGoals < awayGoals) losses++;
        else draws++;
      } else if (game.away === team) { // If the team in perspective was the away team in this game
        if (awayGoals > homeGoals) wins++;
        else if (awayGoals < homeGoals) losses++;
        else draws++;
      }
    });
    
    const total = wins + draws + losses;
    const winRate = total > 0 ? (wins / total) * 100 : 0;

    return { wins, draws, losses, total, winRate };
  };

  const h2hHomeInsights = calculateInsights(h2hMatches, homeTeam);
  const h2hAwayInsights = calculateInsights(h2hMatches, awayTeam);
  
  const homeRecentInsights = calculateInsights(homeRecentGames, homeTeam);
  const awayRecentInsights = calculateInsights(awayRecentGames, awayTeam);

  const InsightRow = ({ title, homeValue, awayValue, homeColor, awayColor }) => (
    <div className="flex justify-between items-center text-sm py-2 border-b border-border/50 last:border-b-0">
      <span className={`font-semibold ${homeColor || 'text-emerald-400'}`}>{homeValue}</span>
      <span className="text-muted-foreground text-center mx-2">{title}</span>
      <span className={`font-semibold ${awayColor || 'text-blue-400'}`}>{awayValue}</span>
    </div>
  );

  return (
    <Card className="bg-card border-border">
      <CardHeader>
        <CardTitle className="text-card-foreground flex items-center gap-2 text-sm sm:text-base">
          <Users className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />
          Análise de Desempenho
        </CardTitle>
      </CardHeader>
      <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
        <div>
            <h4 className="font-semibold text-center text-card-foreground/80 mb-3">Confrontos Diretos ({h2hHomeInsights.total} jogos)</h4>
            <div className="space-y-1">
                <InsightRow title="Vitórias" homeValue={h2hHomeInsights.wins} awayValue={h2hAwayInsights.wins} />
                <InsightRow title="Empates" homeValue={h2hHomeInsights.draws} awayValue={h2hAwayInsights.draws} homeColor="text-yellow-400" awayColor="text-yellow-400" />
                <InsightRow title="Derrotas" homeValue={h2hHomeInsights.losses} awayValue={h2hAwayInsights.losses} homeColor="text-red-400" awayColor="text-red-400" />
                <InsightRow title="Taxa de Vitória" homeValue={`${h2hHomeInsights.winRate.toFixed(0)}%`} awayValue={`${h2hAwayInsights.winRate.toFixed(0)}%`} />
            </div>
        </div>
        <div>
            <h4 className="font-semibold text-center text-card-foreground/80 mb-3">Últimos 6 Jogos (Casa/Fora)</h4>
            <div className="space-y-1">
                <InsightRow title="Vitórias" homeValue={homeRecentInsights.wins} awayValue={awayRecentInsights.wins} />
                <InsightRow title="Empates" homeValue={homeRecentInsights.draws} awayValue={awayRecentInsights.draws} homeColor="text-yellow-400" awayColor="text-yellow-400" />
                <InsightRow title="Derrotas" homeValue={homeRecentInsights.losses} awayValue={awayRecentInsights.losses} homeColor="text-red-400" awayColor="text-red-400" />
                <InsightRow title="Taxa de Vitória" homeValue={`${homeRecentInsights.winRate.toFixed(0)}%`} awayValue={`${awayRecentInsights.winRate.toFixed(0)}%`} />
            </div>
        </div>
      </CardContent>
    </Card>
  );
}
