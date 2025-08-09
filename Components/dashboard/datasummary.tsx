
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Zap, Database } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { format, parseISO } from "date-fns";

export default function DataSummary({ stats, totalRecords, isLoading }) {
  if (isLoading) {
    return (
      <Card className="bg-card border-border">
        <CardHeader className="border-b border-border">
          <CardTitle className="text-card-foreground">Resumo dos Dados</CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="space-y-4">
            <div className="flex justify-between">
              <Skeleton className="h-4 w-32 bg-muted" />
              <Skeleton className="h-4 w-8 bg-muted" />
            </div>
            <div className="flex justify-between">
              <Skeleton className="h-4 w-28 bg-muted" />
              <Skeleton className="h-4 w-8 bg-muted" />
            </div>
            <div className="flex justify-between">
              <Skeleton className="h-4 w-36 bg-muted" />
              <Skeleton className="h-4 w-12 bg-muted" />
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  // The getDataStats function and its logic were moved out of this component
  // as 'stats' is now passed directly as a prop.

  return (
    <Card className="bg-card border-border backdrop-blur-sm">
      <CardHeader className="border-b border-border">
        <CardTitle className="text-card-foreground flex items-center gap-2">
          <Zap className="w-5 h-5 text-primary" />
          Resumo dos Dados
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground">Jogos no sistema</span>
            <span className="text-card-foreground font-semibold">{totalRecords.toLocaleString()}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground">Ligas diferentes</span>
            <span className="text-card-foreground font-semibold">{stats.uniqueLeagues}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground">Último jogo importado</span>
            <span className="text-card-foreground font-semibold">{stats.latestGame}</span>
          </div>
        </div>
        
        <div className="mt-6 pt-4 border-t border-border">
          <div className="flex items-center gap-2 text-sm">
            <div className="w-2 h-2 bg-primary rounded-full animate-pulse"></div>
            <span className="text-muted-foreground">Dados atualizados</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
