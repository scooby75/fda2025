
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { TrendingUp, TrendingDown, Target, Trophy, Save, BarChart3, DollarSign } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

interface StrategyResultsProps {
  strategy: any;
  results: any;
  onSaveStrategy: (strategy: any, results: any) => void;
}

export default function StrategyResults({ strategy, results, onSaveStrategy }: StrategyResultsProps) {
  const handleSave = () => {
    onSaveStrategy(strategy, results);
  };

  if (!results) {
    return (
      <Card className="bg-card border-border">
        <CardContent className="p-8 text-center">
          <BarChart3 className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-foreground mb-2">
            Aguardando Resultados
          </h3>
          <p className="text-muted-foreground">
            Execute uma estratégia para ver os resultados aqui.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card className="bg-card border-border">
        <CardHeader className="border-b border-border">
          <div className="flex justify-between items-center">
            <CardTitle className="text-xl text-foreground flex items-center gap-2">
              <BarChart3 className="w-6 h-6 text-emerald-500" />
              Resultados: {strategy?.name}
            </CardTitle>
            <Button onClick={handleSave} className="bg-emerald-600 hover:bg-emerald-700">
              <Save className="w-4 h-4 mr-2" />
              Salvar Estratégia
            </Button>
          </div>
        </CardHeader>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="bg-card border-border">
          <CardContent className="p-6 text-center">
            <Target className="w-8 h-8 text-blue-500 mx-auto mb-2" />
            <p className="text-sm text-muted-foreground mb-1">Total de Apostas</p>
            <p className="text-2xl font-bold text-foreground">{results.total_bets || 0}</p>
          </CardContent>
        </Card>

        <Card className="bg-card border-border">
          <CardContent className="p-6 text-center">
            <Trophy className="w-8 h-8 text-emerald-500 mx-auto mb-2" />
            <p className="text-sm text-muted-foreground mb-1">Taxa de Acerto</p>
            <p className="text-2xl font-bold text-foreground">{(results.hit_rate || 0).toFixed(1)}%</p>
          </CardContent>
        </Card>

        <Card className="bg-card border-border">
          <CardContent className="p-6 text-center">
            <DollarSign className="w-8 h-8 text-purple-500 mx-auto mb-2" />
            <p className="text-sm text-muted-foreground mb-1">Lucro Total</p>
            <p className={`text-2xl font-bold ${(results.total_profit || 0) >= 0 ? 'text-emerald-500' : 'text-red-500'}`}>
              ${(results.total_profit || 0).toFixed(2)}
            </p>
          </CardContent>
        </Card>

        <Card className="bg-card border-border">
          <CardContent className="p-6 text-center">
            <TrendingUp className="w-8 h-8 text-orange-500 mx-auto mb-2" />
            <p className="text-sm text-muted-foreground mb-1">ROI</p>
            <p className={`text-2xl font-bold ${(results.roi || 0) >= 0 ? 'text-emerald-500' : 'text-red-500'}`}>
              {(results.roi || 0).toFixed(1)}%
            </p>
          </CardContent>
        </Card>
      </div>

      {results.evolution_chart && (
        <Card className="bg-card border-border">
          <CardHeader className="border-b border-border">
            <CardTitle className="text-foreground">Evolução da Estratégia</CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={results.evolution_chart}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="bet" stroke="hsl(var(--muted-foreground))" />
                  <YAxis stroke="hsl(var(--muted-foreground))" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'hsl(var(--popover))',
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '8px'
                    }}
                  />
                  <Line
                    type="monotone"
                    dataKey="profit"
                    stroke="hsl(var(--primary))"
                    strokeWidth={2}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
