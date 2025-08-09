
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Trophy } from "lucide-react";

export default function ScoreAnalysisCard({ h2hMatches, homeRecentGames, awayRecentGames }) {
  
  const calculateFrequencies = (games, type) => {
    const scoreMap = new Map();
    let validGamesCount = 0;

    games.forEach(game => {
      const homeGoals = type === 'FT' ? game.goals_h_ft : game.goals_h_ht;
      const awayGoals = type === 'FT' ? game.goals_a_ft : game.goals_a_ht;

      if (homeGoals != null && awayGoals != null) {
        validGamesCount++;
        const score = `${homeGoals} x ${awayGoals}`;
        scoreMap.set(score, (scoreMap.get(score) || 0) + 1);
      }
    });

    if (validGamesCount === 0) return [];

    const sortedScores = Array.from(scoreMap.entries())
      .map(([score, count]) => ({
        score,
        count,
        percentage: (count / validGamesCount) * 100,
      }))
      .sort((a, b) => b.count - a.count);

    return sortedScores.slice(0, 6);
  };
  
  const h2hFtScores = calculateFrequencies(h2hMatches, 'FT');
  const h2hHtScores = calculateFrequencies(h2hMatches, 'HT');
  const homeRecentFtScores = calculateFrequencies(homeRecentGames, 'FT');
  const homeRecentHtScores = calculateFrequencies(homeRecentGames, 'HT');
  const awayRecentFtScores = calculateFrequencies(awayRecentGames, 'FT');
  const awayRecentHtScores = calculateFrequencies(awayRecentGames, 'HT');

  const renderScores = (scores) => {
    if (!scores || scores.length === 0) {
      return <p className="text-muted-foreground text-xs text-center col-span-2 py-2">Não há dados suficientes.</p>;
    }
    return scores.map((item, index) => (
      <div key={index} className="flex justify-between items-center bg-muted/30 p-2 rounded-md">
        <span className="font-mono text-sm text-foreground">{item.score}</span>
        <div className="flex items-center gap-2">
            <Badge variant="secondary" className="text-xs">{item.count} {item.count > 1 ? 'jogos' : 'jogo'}</Badge>
            <Badge className="bg-primary/20 text-primary border-primary/30 min-w-[50px] justify-center text-xs">{item.percentage.toFixed(0)}%</Badge>
        </div>
      </div>
    ));
  };

  return (
    <Card className="bg-card border-border">
      <CardHeader>
        <CardTitle className="text-card-foreground flex items-center gap-2 text-sm sm:text-base">
          <Trophy className="w-4 h-4 sm:w-5 sm:h-5 text-amber-400" />
          Placares Mais Comuns (HT & FT)
        </CardTitle>
      </CardHeader>
      <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-x-8 gap-y-6">
        {/* H2H Scores */}
        <div className="space-y-3">
          <h4 className="font-medium text-center text-card-foreground/80 mb-3 text-sm">Confronto Direto</h4>
          <div className="space-y-2">
            <h5 className="text-xs text-center text-muted-foreground">Final (FT)</h5>
            {renderScores(h2hFtScores)}
          </div>
          <div className="space-y-2 pt-2">
             <h5 className="text-xs text-center text-muted-foreground">Intervalo (HT)</h5>
            {renderScores(h2hHtScores)}
          </div>
        </div>
        {/* Home Recent Scores */}
        <div className="space-y-3">
          <h4 className="font-medium text-center text-card-foreground/80 mb-3 text-sm">Mandante (Últ. 6)</h4>
          <div className="space-y-2">
            <h5 className="text-xs text-center text-muted-foreground">Final (FT)</h5>
            {renderScores(homeRecentFtScores)}
          </div>
          <div className="space-y-2 pt-2">
             <h5 className="text-xs text-center text-muted-foreground">Intervalo (HT)</h5>
            {renderScores(homeRecentHtScores)}
          </div>
        </div>
        {/* Away Recent Scores */}
        <div className="space-y-3">
          <h4 className="font-medium text-center text-card-foreground/80 mb-3 text-sm">Visitante (Últ. 6)</h4>
           <div className="space-y-2">
            <h5 className="text-xs text-center text-muted-foreground">Final (FT)</h5>
            {renderScores(awayRecentFtScores)}
          </div>
          <div className="space-y-2 pt-2">
             <h5 className="text-xs text-center text-muted-foreground">Intervalo (HT)</h5>
            {renderScores(awayRecentHtScores)}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
