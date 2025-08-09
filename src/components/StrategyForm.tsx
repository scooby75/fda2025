
import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import MultiSelect from "@/components/ui/MultiSelect";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Play, Settings, Filter, Info } from "lucide-react";

const MARKETS = [
  { value: "home_win", label: "Casa Vence (FT)" },
  { value: "draw", label: "Empate (FT)" },
  { value: "away_win", label: "Fora Vence (FT)" },
  { value: "over_25", label: "Over 2.5 Gols" },
  { value: "under_25", label: "Under 2.5 Gols" },
  { value: "btts_yes", label: "Ambos Marcam - Sim" },
  { value: "btts_no", label: "Ambos Marcam - Não" },
];

const initialFormData = {
  name: "",
  description: "",
  market: "home_win",
  min_odds: null,
  max_odds: null,
  unit_stake: 10,
  start_date: "",
  end_date: "",
  leagues: [],
  home_teams: [],
  away_teams: [],
};

interface StrategyFormProps {
  gameData: any[];
  onRunBacktest: (strategy: any) => void;
  isLoading: boolean;
  initialStrategy?: any;
  onStrategyChange?: (strategy: any) => void;
}

export default function StrategyForm({ 
  gameData, 
  onRunBacktest, 
  isLoading, 
  initialStrategy, 
  onStrategyChange 
}: StrategyFormProps) {
  const [formData, setFormData] = useState(initialStrategy || initialFormData);
  const [availableOptions, setAvailableOptions] = useState({
    leagues: [],
    teams: [],
  });

  useEffect(() => {
    const leagues = [...new Set((gameData || []).map(g => g.league))].filter(Boolean).sort().map(l => ({ value: l, label: l }));
    const teams = [...new Set([...(gameData || []).map(g => g.home), ...(gameData || []).map(g => g.away)])].filter(Boolean).sort().map(t => ({ value: t, label: t }));
    
    setAvailableOptions({ leagues, teams });
  }, [gameData]);

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => {
      const updatedFormData = { ...prev, [field]: value };
      if (onStrategyChange) {
        onStrategyChange(updatedFormData);
      }
      return updatedFormData;
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onRunBacktest(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle className="text-card-foreground flex items-center gap-2">
            <Info className="w-5 h-5 text-primary" />
            Informações Básicas
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="name" className="text-muted-foreground">Nome da Estratégia</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => handleInputChange('name', e.target.value)}
              placeholder="Ex: Casa Forte com Over 2.5"
              className="bg-input border-border text-foreground"
              required
            />
          </div>
          
          <div>
            <Label htmlFor="market" className="text-muted-foreground">Mercado Principal</Label>
            <Select value={formData.market} onValueChange={(value) => handleInputChange('market', value)}>
              <SelectTrigger className="bg-input border-border text-foreground">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {MARKETS.map(market => (
                  <SelectItem key={market.value} value={market.value}>
                    {market.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="description" className="text-muted-foreground">Descrição</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              placeholder="Descreva sua estratégia..."
              className="bg-input border-border text-foreground"
            />
          </div>
        </CardContent>
      </Card>

      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle className="text-card-foreground flex items-center gap-2">
            <Settings className="w-5 h-5 text-primary" />
            Configurações de Aposta
          </CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <Label htmlFor="min_odds" className="text-muted-foreground">Odd Mínima</Label>
            <Input
              id="min_odds"
              type="number"
              step="0.01"
              value={formData.min_odds || ''}
              onChange={(e) => handleInputChange('min_odds', e.target.value ? parseFloat(e.target.value) : null)}
              className="bg-input border-border text-foreground"
              placeholder="Ex: 1.50"
            />
          </div>
          
          <div>
            <Label htmlFor="max_odds" className="text-muted-foreground">Odd Máxima</Label>
            <Input
              id="max_odds"
              type="number"
              step="0.01"
              value={formData.max_odds || ''}
              onChange={(e) => handleInputChange('max_odds', e.target.value ? parseFloat(e.target.value) : null)}
              className="bg-input border-border text-foreground"
              placeholder="Ex: 3.00"
            />
          </div>
          
          <div>
            <Label htmlFor="unit_stake" className="text-muted-foreground">Valor da Aposta ($)</Label>
            <Input
              id="unit_stake"
              type="number"
              step="0.01"
              value={formData.unit_stake}
              onChange={(e) => handleInputChange('unit_stake', parseFloat(e.target.value))}
              className="bg-input border-border text-foreground"
              required
            />
          </div>
        </CardContent>
      </Card>

      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle className="text-card-foreground flex items-center gap-2">
            <Filter className="w-5 h-5 text-primary" />
            Filtros
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="start_date" className="text-muted-foreground">Data Inicial</Label>
              <Input
                id="start_date"
                type="date"
                value={formData.start_date}
                onChange={(e) => handleInputChange('start_date', e.target.value)}
                className="bg-input border-border text-foreground"
              />
            </div>
            
            <div>
              <Label htmlFor="end_date" className="text-muted-foreground">Data Final</Label>
              <Input
                id="end_date"
                type="date"
                value={formData.end_date}
                onChange={(e) => handleInputChange('end_date', e.target.value)}
                className="bg-input border-border text-foreground"
              />
            </div>
          </div>

          <div>
            <Label className="text-muted-foreground">Ligas</Label>
            <MultiSelect
              options={availableOptions.leagues}
              selected={formData.leagues}
              onChange={(selected) => handleInputChange('leagues', selected)}
              placeholder="Selecione as ligas..."
            />
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end">
        <Button
          type="submit"
          disabled={isLoading || !formData.name}
          className="bg-primary text-primary-foreground hover:bg-primary/90 px-8 py-3"
        >
          {isLoading ? (
            <>
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-primary-foreground mr-2"></div>
              Executando...
            </>
          ) : (
            <>
              <Play className="w-5 h-5 mr-2" />
              Executar Backtesting
            </>
          )}
        </Button>
      </div>
    </form>
  );
}
