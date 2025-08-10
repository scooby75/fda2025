
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { BarChart3 } from "lucide-react";

interface ScoreAnalysisCardProps {
  h2hMatches: any[];
  homeRecentGames: any[];
  awayRecentGames: any[];
}

const getScoreFrequency = (games: any[], type: string) => {
  const scores: { [key: string]: number } = {};
  
  games.forEach((game: any) => {
    let score;
    if (type === 'home') {
      score = `${game.home_score}-${game.away_score}`;
    } else if (type === 'away') {
      score = `${game.away_score}-${game.home_score}`;
    } else {
      score = `${game.home_score}-${game.away_score}`;
    }
    
    scores[score] = (scores[score] || 0) + 1;
  });
  
  return scores;
};

const getMostCommonScores = (scores: { [key: string]: number }) => {
  return Object.entries(scores)
    .sort(([,a], [,b]) => b - a)
    .slice(0, 5)
    .map(([score, count]) => ({ score, count }));
};

const ScoreFrequencyList = ({ scores }: { scores: { [key: string]: number } }) => {
  const sortedScores = getMostCommonScores(scores);
  
  return (
    <div className="space-y-2">
      {sortedScores.map((item: { score: string; count: number }, index: number) => (
        <div key={item.score} className="flex justify-between items-center">
          <span className="text-sm font-medium">{item.score}</span>
          <Badge variant="outline" className="text-xs">
            {item.count}x
          </Badge>
        </div>
      ))}
    </div>
  );
};

export default function ScoreAnalysisCard({ h2hMatches, homeRecentGames, awayRecentGames }: ScoreAnalysisCardProps) {
  const h2hScores = getScoreFrequency(h2hMatches, 'h2h');
  const homeScores = getScoreFrequency(homeRecentGames, 'home');
  const awayScores = getScoreFrequency(awayRecentGames, 'away');

  return (
    <Card className="bg-card border-border shadow-lg">
      <CardHeader className="border-b border-border">
        <CardTitle className="text-lg text-card-foreground flex items-center gap-2">
          <BarChart3 className="w-5 h-5 text-primary" />
          Análise de Placares Mais Frequentes
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <h4 className="font-semibold text-card-foreground mb-3">Confrontos Diretos</h4>
            <ScoreFrequencyList scores={h2hScores} />
          </div>
          
          <div>
            <h4 className="font-semibold text-card-foreground mb-3">Casa (como mandante)</h4>
            <ScoreFrequencyList scores={homeScores} />
          </div>
          
          <div>
            <h4 className="font-semibold text-card-foreground mb-3">Visitante (como visitante)</h4>
            <ScoreFrequencyList scores={awayScores} />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
