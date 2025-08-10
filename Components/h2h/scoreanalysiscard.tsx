
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

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

interface ScoreAnalysisCardProps {
  gameData: GameDataType[];
  teamName: string;
  perspective: string;
}

export default function ScoreAnalysisCard({ gameData, teamName, perspective }: ScoreAnalysisCardProps) {
  return (
    <Card className="bg-card border-border">
      <CardHeader>
        <CardTitle className="text-card-foreground">
          Análise de Gols - {teamName} ({perspective})
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <Badge variant="outline">
            {gameData.length} jogos analisados
          </Badge>
          <p className="text-muted-foreground">
            Análise detalhada dos padrões de gols será implementada aqui.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
