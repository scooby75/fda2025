
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Database, Calendar, Target, Activity } from "lucide-react";

interface GameData {
  id?: string;
  home: string;
  away: string;
  date: string;
  league: string;
  [key: string]: any;
}

interface Strategy {
  id?: number;
  name: string;
  market?: string;
  [key: string]: any;
}

interface DataSummaryProps {
  gameData: GameData[];
  strategies: Strategy[];
  lastUpdated: string;
}

export default function DataSummary({ gameData, strategies, lastUpdated }: DataSummaryProps) {
  const getUniqueLeagues = () => {
    const leagues = new Set(gameData.map(game => game.league));
    return leagues.size;
  };

  const getDateRange = () => {
    if (gameData.length === 0) return { start: null, end: null };
    
    const dates = gameData
      .map(game => new Date(game.date))
      .filter(date => !isNaN(date.getTime()))
      .sort((a, b) => a.getTime() - b.getTime());
    
    return {
      start: dates[0],
      end: dates[dates.length - 1]
    };
  };

  const uniqueLeagues = getUniqueLeagues();
  const dateRange = getDateRange();

  return (
    <Card className="bg-card border-border backdrop-blur-sm">
      <CardHeader className="border-b border-border">
        <CardTitle className="text-xl text-card-foreground flex items-center gap-2">
          <Database className="w-6 h-6 text-primary" />
          Resumo dos Dados
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        <div className="space-y-6">
          {/* Game Data Stats */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Activity className="w-5 h-5 text-primary" />
              <h3 className="font-semibold text-card-foreground">Dados de Jogos</h3>
            </div>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-muted-foreground">Total de Jogos</p>
                <p className="text-2xl font-bold text-card-foreground">{gameData.length.toLocaleString()}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Ligas</p>
                <p className="text-2xl font-bold text-card-foreground">{uniqueLeagues}</p>
              </div>
            </div>
            
            {dateRange.start && dateRange.end && (
              <div className="pt-2 border-t border-border">
                <p className="text-xs text-muted-foreground">
                  Período: {dateRange.start.toLocaleDateString()} - {dateRange.end.toLocaleDateString()}
                </p>
              </div>
            )}
          </div>

          {/* Strategy Stats */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Target className="w-5 h-5 text-primary" />
              <h3 className="font-semibold text-card-foreground">Estratégias</h3>
            </div>
            <div className="grid grid-cols-1 gap-2">
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Total criadas</span>
                <Badge variant="secondary" className="text-xs">
                  {strategies.length}
                </Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Com resultados</span>
                <Badge variant="secondary" className="text-xs">
                  {strategies.filter(s => s.results).length}
                </Badge>
              </div>
            </div>
          </div>

          {/* Last Updated */}
          <div className="pt-4 border-t border-border">
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <Calendar className="w-4 h-4" />
              <span>
                Atualizado em: {new Date(lastUpdated).toLocaleString()}
              </span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
