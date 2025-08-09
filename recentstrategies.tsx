import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Target, TrendingUp, TrendingDown } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { format } from "date-fns";

export default function RecentStrategies({ strategies, isLoading }) {
  if (isLoading) {
    return (
      <Card className="bg-slate-800/50 border-slate-700">
        <CardHeader className="border-b border-slate-700">
          <CardTitle className="text-white">Estratégias Recentes</CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="space-y-4">
            {Array(5).fill(0).map((_, i) => (
              <div key={i} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Skeleton className="w-8 h-8 rounded-full bg-slate-700" />
                  <div>
                    <Skeleton className="h-4 w-24 bg-slate-700" />
                    <Skeleton className="h-3 w-16 mt-1 bg-slate-700" />
                  </div>
                </div>
                <Skeleton className="h-4 w-16 bg-slate-700" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  const recentStrategies = strategies.slice(0, 5);

  return (
    <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
      <CardHeader className="border-b border-slate-700">
        <CardTitle className="text-white flex items-center gap-2">
          <Target className="w-5 h-5 text-emerald-400" />
          Estratégias Recentes
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        {recentStrategies.length > 0 ? (
          <div className="space-y-4">
            {recentStrategies.map((strategy) => (
              <div key={strategy.id} className="flex items-center justify-between p-3 rounded-lg bg-slate-800/30 hover:bg-slate-800/50 transition-colors">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-emerald-500/20 rounded-full flex items-center justify-center">
                    {(strategy.results?.roi || 0) >= 0 ? (
                      <TrendingUp className="w-4 h-4 text-emerald-400" />
                    ) : (
                      <TrendingDown className="w-4 h-4 text-red-400" />
                    )}
                  </div>
                  <div>
                    <p className="font-medium text-white text-sm">{strategy.name}</p>
                    <p className="text-xs text-slate-400">
                      {strategy.created_date ? format(new Date(strategy.created_date), 'dd/MM/yyyy') : '-'}
                    </p>
                  </div>
                </div>
                <Badge 
                  variant="outline"
                  className={`${(strategy.results?.roi || 0) >= 0 
                    ? 'border-emerald-500 text-emerald-400' 
                    : 'border-red-500 text-red-400'
                  }`}
                >
                  {(strategy.results?.roi || 0).toFixed(1)}%
                </Badge>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <Target className="w-12 h-12 text-slate-600 mx-auto mb-4" />
            <p className="text-slate-400 mb-2">Nenhuma estratégia testada ainda</p>
            <p className="text-slate-500 text-sm">Comece criando sua primeira estratégia</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}