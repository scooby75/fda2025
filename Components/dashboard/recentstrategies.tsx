
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, Target, TrendingUp, ArrowRight } from "lucide-react";

interface Strategy {
  id?: number;
  name: string;
  market?: string;
  created_date?: string;
  results?: {
    roi: number;
    totalGames: number;
    wins: number;
    profit: number;
  };
}

interface RecentStrategiesProps {
  strategies: Strategy[];
}

export default function RecentStrategies({ strategies }: RecentStrategiesProps) {
  const recentStrategies = strategies
    .sort((a, b) => {
      const dateA = new Date(a.created_date || '').getTime();
      const dateB = new Date(b.created_date || '').getTime();
      return dateB - dateA;
    })
    .slice(0, 5);

  return (
    <Card className="bg-card border-border backdrop-blur-sm">
      <CardHeader className="border-b border-border">
        <CardTitle className="text-xl text-card-foreground flex items-center gap-2">
          <Target className="w-6 h-6 text-primary" />
          Estratégias Recentes
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        {strategies.length === 0 ? (
          <div className="text-center py-8">
            <Target className="w-12 h-12 text-muted-foreground/50 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-card-foreground mb-2">
              Nenhuma estratégia encontrada
            </h3>
            <p className="text-muted-foreground">
              Crie sua primeira estratégia para começar a analisar dados
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {recentStrategies.map((strategy, index) => (
              <div
                key={strategy.id || index}
                className="p-4 border border-border rounded-lg hover:bg-muted/20 transition-colors"
              >
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h4 className="font-semibold text-card-foreground mb-1">
                      {strategy.name}
                    </h4>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Calendar className="w-4 h-4" />
                      {strategy.created_date 
                        ? new Date(strategy.created_date).toLocaleDateString()
                        : 'Data não disponível'
                      }
                    </div>
                  </div>
                  {strategy.results && (
                    <Badge
                      variant={strategy.results.roi > 0 ? "default" : "destructive"}
                      className="text-xs"
                    >
                      <TrendingUp className="w-3 h-3 mr-1" />
                      {strategy.results.roi.toFixed(1)}% ROI
                    </Badge>
                  )}
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4 text-sm">
                    <span className="text-muted-foreground">
                      Mercado: <span className="text-card-foreground font-medium">{strategy.market || 'N/A'}</span>
                    </span>
                    {strategy.results && (
                      <span className="text-muted-foreground">
                        Jogos: <span className="text-card-foreground font-medium">{strategy.results.totalGames}</span>
                      </span>
                    )}
                  </div>
                  <Button variant="ghost" size="sm" className="text-primary hover:text-primary/80">
                    Ver detalhes
                    <ArrowRight className="w-4 h-4 ml-1" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
