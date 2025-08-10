
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Target, Calendar } from "lucide-react";
import { format } from "date-fns";

interface Strategy {
  id: string;
  name: string;
  market: string;
  created_date: string;
}

interface RecentStrategiesProps {
  strategies: Strategy[];
  isLoading: boolean;
}

export default function RecentStrategies({ strategies, isLoading }: RecentStrategiesProps) {
  if (isLoading) {
    return (
      <Card className="bg-card border-border">
        <CardHeader className="border-b border-border">
          <CardTitle className="text-card-foreground flex items-center gap-2">
            <Target className="w-6 h-6 text-primary" />
            Estratégias Recentes
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="flex items-center justify-between p-3 bg-muted/20 rounded-lg">
                <div className="space-y-2">
                  <Skeleton className="h-4 w-32" />
                  <Skeleton className="h-3 w-24" />
                </div>
                <Skeleton className="h-5 w-16" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-card border-border">
      <CardHeader className="border-b border-border">
        <CardTitle className="text-card-foreground flex items-center gap-2">
          <Target className="w-6 h-6 text-primary" />
          Estratégias Recentes
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        {strategies.length > 0 ? (
          <div className="space-y-3">
            {strategies.slice(0, 5).map((strategy: Strategy) => (
              <div key={strategy.id} className="flex items-center justify-between p-3 bg-muted/20 rounded-lg">
                <div>
                  <p className="font-medium text-card-foreground">{strategy.name}</p>
                  <p className="text-sm text-muted-foreground flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    {format(new Date(strategy.created_date), 'dd/MM/yyyy')}
                  </p>
                </div>
                <Badge variant="outline" className="text-xs">
                  {strategy.market}
                </Badge>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <Target className="w-12 h-12 text-muted-foreground/50 mx-auto mb-4" />
            <p className="text-muted-foreground">Nenhuma estratégia encontrada</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
