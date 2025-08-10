
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export interface ScoreAnalysisCardProps {
  games: Array<{
    home: string;
    away: string;
    goals_h_ft?: number;
    goals_a_ft?: number;
    date: string;
  }>;
  teamName: string;
  perspective: string;
}

export default function ScoreAnalysisCard({ games, teamName, perspective }: ScoreAnalysisCardProps) {
  const calculateScoreStats = () => {
    const scores = games
      .filter(game => game.goals_h_ft !== undefined && game.goals_a_ft !== undefined)
      .map(game => ({
        home: game.goals_h_ft!,
        away: game.goals_a_ft!,
        total: game.goals_h_ft! + game.goals_a_ft!
      }));

    if (scores.length === 0) {
      return {
        averageGoals: 0,
        over25: 0,
        btts: 0,
        commonScores: []
      };
    }

    const averageGoals = scores.reduce((sum, score) => sum + score.total, 0) / scores.length;
    const over25 = (scores.filter(score => score.total > 2.5).length / scores.length) * 100;
    const btts = (scores.filter(score => score.home > 0 && score.away > 0).length / scores.length) * 100;

    // Find most common scores
    const scoreCounts: { [key: string]: number } = {};
    scores.forEach(score => {
      const scoreStr = `${score.home}-${score.away}`;
      scoreCounts[scoreStr] = (scoreCounts[scoreStr] || 0) + 1;
    });

    const commonScores = Object.entries(scoreCounts)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 3)
      .map(([score, count]) => ({ score, count, percentage: (count / scores.length) * 100 }));

    return { averageGoals, over25, btts, commonScores };
  };

  const stats = calculateScoreStats();

  return (
    <Card className="bg-slate-800/50 border-slate-700">
      <CardHeader>
        <CardTitle className="text-white text-lg">
          Análise de Gols - {teamName} ({perspective})
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          <div className="text-center">
            <p className="text-2xl font-bold text-emerald-400">
              {stats.averageGoals.toFixed(1)}
            </p>
            <p className="text-sm text-slate-400">Média de Gols</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-blue-400">
              {stats.over25.toFixed(0)}%
            </p>
            <p className="text-sm text-slate-400">Over 2.5</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-purple-400">
              {stats.btts.toFixed(0)}%
            </p>
            <p className="text-sm text-slate-400">BTTS</p>
          </div>
        </div>

        {stats.commonScores.length > 0 && (
          <div>
            <h4 className="text-white font-semibold mb-2">Placares Mais Comuns</h4>
            <div className="space-y-1">
              {stats.commonScores.map((item, index) => (
                <div key={index} className="flex justify-between items-center text-sm">
                  <span className="text-slate-300">{item.score}</span>
                  <span className="text-slate-400">
                    {item.count}x ({item.percentage.toFixed(0)}%)
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="text-xs text-slate-500 mt-4">
          Baseado em {games.length} jogos analisados
        </div>
      </CardContent>
    </Card>
  );
}
