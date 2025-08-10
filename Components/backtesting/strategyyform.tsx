
import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import MultiSelect from "@/components/ui/MultiSelect";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Play, Settings, Filter, Info, Percent, BarChartHorizontalBig, Calendar, Target, SlidersHorizontal, BarChart, Tags, CheckSquare } from "lucide-react";

const MARKETS = [
  { value: "home_win", label: "Casa Vence (FT)" },
  { value: "draw", label: "Empate (FT)" },
  { value: "away_win", label: "Fora Vence (FT)" },
  { value: "home_win_ht", label: "Casa Vence (HT)" },
  { value: "draw_ht", label: "Empate (HT)" },
  { value: "away_win_ht", label: "Fora Vence (HT)" },
  { value: "over_15", label: "Over 1.5 Gols" },
  { value: "over_25", label: "Over 2.5 Gols" },
  { value: "under_15", label: "Under 1.5 Gols" },
  { value: "under_25", label: "Under 2.5 Gols" },
  { value: "btts_yes", label: "Ambos Marcam - Sim" },
  { value: "btts_no", label: "Ambos Marcam - Não" },
  { value: "dc_1x", label: "Dupla Chance 1X" },
  { value: "dc_12", label: "Dupla Chance 12" },
  { value: "dc_x2", label: "Dupla Chance X2" }
];

interface FormData {
  name: string;
  description: string;
  market: string;
  min_odds: number | null;
  max_odds: number | null;
  unit_stake: number;
  start_date: string;
  end_date: string;
  season: string[];
  leagues: string[];
  home_teams: string[];
  away_teams: string[];
  [key: string]: any;
}

interface OptionType {
  value: string;
  label: string;
}

interface AvailableOptions {
  leagues: OptionType[];
  teams: OptionType[];
  seasons: OptionType[];
}

interface GameData {
  league: string;
  home: string;
  away: string;
  [key: string]: any;
}

interface RankingData {
  season: string;
  [key: string]: any;
}

interface StrategyFormProps {
  gameData: GameData[];
  rankingHomeData: RankingData[];
  rankingAwayData: RankingData[];
  onRunBacktest: (formData: FormData) => void;
  isLoading: boolean;
  initialStrategy?: FormData;
  onStrategyChange?: (strategy: FormData) => void;
}

const initialFormData: FormData = {
  name: "",
  description: "",
  market: "home_win",
  min_odds: null,
  max_odds: null,
  unit_stake: 10,
  start_date: "",
  end_date: "",
  season: [],
  leagues: [],
  home_teams: [],
  away_teams: [],
  min_game_week: null,
  max_game_week: null,
  min_home_ppg: null,
  max_home_ppg: null,
  min_away_ppg: null,
  max_away_ppg: null,
  min_home_xg: null,
  max_home_xg: null,
  min_away_xg: null,
  max_away_xg: null,
  min_shots_on_target_h: null,
  max_shots_on_target_h: null,
  min_shots_on_target_a: null,
  max_shots_on_target_a: null,
  min_shots_off_target_h: null,
  max_shots_off_target_h: null,
  min_shots_off_target_a: null,
  max_shots_off_target_a: null,
  min_goals_h_ht: null,
  max_goals_h_ht: null,
  min_goals_a_ht: null,
  max_goals_a_ht: null,
  min_goals_h_ft: null,
  max_goals_h_ft: null,
  min_goals_a_ft: null,
  max_goals_a_ft: null,
  min_ranking_home: null,
  max_ranking_home: null,
  min_ranking_away: null,
  max_ranking_away: null,
  min_odds_h_ht: null,
  max_odds_h_ht: null,
  min_odds_d_ht: null,
  max_odds_d_ht: null,
  min_odds_a_ht: null,
  max_odds_a_ht: null,
  min_odds_ft_home_team_win: null,
  max_odds_ft_home_team_win: null,
  min_odds_ft_draw: null,
  max_odds_ft_draw: null,
  min_odds_ft_away_team_win: null,
  max_odds_ft_away_team_win: null,
  min_odds_ft_over15: null,
  max_odds_ft_over15: null,
  min_odds_ft_over25: null,
  max_odds_ft_over25: null,
  min_odds_btts_yes: null,
  max_odds_btts_yes: null,
  min_odds_btts_no: null,
  max_odds_btts_no: null,
  min_odds_under05_ft: null,
  max_odds_under05_ft: null,
  min_odds_under15_ft: null,
  max_odds_under15_ft: null,
  min_odds_under25_ft: null,
  max_odds_under25_ft: null,
  min_odds_dc_1x: null,
  max_odds_dc_1x: null,
  min_odds_dc_12: null,
  max_odds_dc_12: null,
  min_odds_dc_x2: null,
  max_odds_dc_x2: null,
};

interface OddsFilterFieldProps {
  label: string;
  minField: string;
  maxField: string;
  formData: FormData;
  handleInputChange: (field: string, value: any) => void;
}

const OddsFilterField = ({ label, minField, maxField, formData, handleInputChange }: OddsFilterFieldProps) => (
  <>
    <div>
      <Label htmlFor={minField} className="text-muted-foreground text-xs">{label} Min</Label>
      <Input
        id={minField} type="number" step="0.01"
        value={formData[minField] === null ? '' : formData[minField]}
        onChange={(e) => handleInputChange(minField, e.target.value === '' ? null : parseFloat(e.target.value))}
        className="bg-input border-border text-foreground h-8 text-sm"
        placeholder="Ex: 1.50"
      />
    </div>
    <div>
      <Label htmlFor={maxField} className="text-muted-foreground text-xs">{label} Max</Label>
      <Input
        id={maxField} type="number" step="0.01"
        value={formData[maxField] === null ? '' : formData[maxField]}
        onChange={(e) => handleInputChange(maxField, e.target.value === '' ? null : parseFloat(e.target.value))}
        className="bg-input border-border text-foreground h-8 text-sm"
        placeholder="Ex: 3.00"
      />
    </div>
  </>
);

export default function StrategyForm({ gameData, rankingHomeData, rankingAwayData, onRunBacktest, isLoading, initialStrategy, onStrategyChange }: StrategyFormProps) {
  const [formData, setFormData] = useState<FormData>(initialStrategy || initialFormData);

  const [availableOptions, setAvailableOptions] = useState<AvailableOptions>({
    leagues: [],
    teams: [],
    seasons: [],
  });

  useEffect(() => {
    const leagues = [...new Set((gameData || []).map((g: GameData) => g.league))].filter(Boolean).sort().map((l: string) => ({ value: l, label: l }));
    const teams = [...new Set([...(gameData || []).map((g: GameData) => g.home), ...(gameData || []).map((g: GameData) => g.away)])].filter(Boolean).sort().map((t: string) => ({ value: t, label: t }));
    const seasons = [...new Set((rankingHomeData || []).map((r: RankingData) => r.season))].filter(Boolean).sort((a: string, b: string) => b.localeCompare(a)).map((s: string) => ({ value: s, label: s }));

    setAvailableOptions({ leagues, teams, seasons });
  }, [gameData, rankingHomeData]);

  useEffect(() => {
    if (initialStrategy) {
      const mergedStrategy = { ...initialFormData, ...initialStrategy };
      mergedStrategy.leagues = Array.isArray(mergedStrategy.leagues) ? mergedStrategy.leagues : [];
      mergedStrategy.home_teams = Array.isArray(mergedStrategy.home_teams) ? mergedStrategy.home_teams : [];
      mergedStrategy.away_teams = Array.isArray(mergedStrategy.away_teams) ? mergedStrategy.away_teams : [];
      mergedStrategy.season = Array.isArray(mergedStrategy.season) ? mergedStrategy.season : (mergedStrategy.season ? [mergedStrategy.season] : []);
      setFormData(mergedStrategy);
      
      if (onStrategyChange) {
        onStrategyChange(mergedStrategy);
      }
    } else {
      setFormData(initialFormData);
    }
  }, [initialStrategy, onStrategyChange]);

  const handleInputChange = (field: string, value: any) => {
    setFormData((prev: FormData) => {
      const updatedFormData = {
        ...prev,
        [field]: value
      };
      if (onStrategyChange) {
        onStrategyChange(updatedFormData);
      }
      return updatedFormData;
    });
  };

  const handleMultiSelectChange = (field: string, selectedValues: string[]) => {
    setFormData((prev: FormData) => {
      const updatedFormData = {
        ...prev,
        [field]: selectedValues
      };
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

  interface AdvancedFilterInputProps {
    label: string;
    field: string;
    type?: string;
    step?: string;
    placeholder?: string;
  }

  const AdvancedFilterInput = ({ label, field, type = "number", step = "1", placeholder = "" }: AdvancedFilterInputProps) => (
    <div>
      <Label htmlFor={field} className="text-muted-foreground text-xs whitespace-nowrap">{label}</Label>
      <Input
        id={field} type={type} step={step}
        value={formData[field] === null ? '' : formData[field]}
        onChange={(e) => handleInputChange(field, e.target.value === '' ? null : (type === "number" || type === "text" ? parseFloat(e.target.value) : parseInt(e.target.value)))}
        className="bg-input border-border text-foreground h-8 text-sm"
        placeholder={placeholder}
      />
    </div>
  );

  return (
    <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
      {/* Basic Info */}
      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle className="text-card-foreground flex items-center gap-2">
            <Info className="w-5 h-5 text-primary" />
            Informações Básicas
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 pt-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
              <Select value={formData.market} onValueChange={(value: string) => handleInputChange('market', value)}>
                <SelectTrigger className="bg-input border-border text-foreground">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-popover border-border text-popover-foreground">
                  {MARKETS.map(market => (
                    <SelectItem key={market.value} value={market.value} className="hover:bg-muted/50">
                      {market.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div>
            <Label htmlFor="description" className="text-muted-foreground">Descrição (Opcional)</Label>
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

      {/* Odds and Stake for Primary Market */}
      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle className="text-card-foreground flex items-center gap-2">
            <Settings className="w-5 h-5 text-primary" />
            Configurações de Aposta (Mercado Principal)
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="min_odds" className="text-muted-foreground">Odd Mínima</Label>
              <Input
                id="min_odds" type="number" step="0.01"
                value={formData.min_odds === null ? '' : formData.min_odds}
                onChange={(e) => handleInputChange('min_odds', e.target.value === '' ? null : parseFloat(e.target.value))}
                className="bg-input border-border text-foreground"
                placeholder="Ex: 1.50"
              />
            </div>
            <div>
              <Label htmlFor="max_odds" className="text-muted-foreground">Odd Máxima</Label>
              <Input
                id="max_odds" type="number" step="0.01"
                value={formData.max_odds === null ? '' : formData.max_odds}
                onChange={(e) => handleInputChange('max_odds', e.target.value === '' ? null : parseFloat(e.target.value))}
                className="bg-input border-border text-foreground"
                placeholder="Ex: 3.00"
              />
            </div>
            <div>
              <Label htmlFor="unit_stake" className="text-muted-foreground">Valor da Aposta Unitária ($)</Label>
              <Input
                id="unit_stake" type="number" step="0.01"
                value={formData.unit_stake}
                onChange={(e) => handleInputChange('unit_stake', parseFloat(e.target.value))}
                className="bg-input border-border text-foreground"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Date Range */}
      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle className="text-card-foreground flex items-center gap-2">
            <Calendar className="w-5 h-5 text-primary" />
            Período de Análise
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="start_date" className="text-muted-foreground">Data Inicial</Label>
              <Input
                id="start_date" type="date"
                value={formData.start_date}
                onChange={(e) => handleInputChange('start_date', e.target.value)}
                className="bg-input border-border text-foreground"
              />
            </div>
            <div>
              <Label htmlFor="end_date" className="text-muted-foreground">Data Final</Label>
              <Input
                id="end_date" type="date"
                value={formData.end_date}
                onChange={(e) => handleInputChange('end_date', e.target.value)}
                className="bg-input border-border text-foreground"
              />
            </div>
            <div>
              <Label htmlFor="season" className="text-muted-foreground">Temporadas</Label>
              <MultiSelect
                options={availableOptions.seasons}
                selected={Array.isArray(formData.season) ? formData.season : (formData.season ? [formData.season] : [])}
                onChange={(selected: string[]) => handleMultiSelectChange('season', selected)}
                placeholder="Selecione temporadas..."
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Teams and Leagues */}
      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle className="text-card-foreground flex items-center gap-2">
            <Filter className="w-5 h-5 text-primary" />
            Filtros de Times e Ligas
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 pt-4">
          <div>
            <Label htmlFor="leagues" className="text-muted-foreground">Ligas (Selecione ou deixe em branco para todas)</Label>
            <MultiSelect
              options={availableOptions.leagues}
              selected={formData.leagues}
              onChange={(selected: string[]) => handleMultiSelectChange('leagues', selected)}
              placeholder="Selecione as ligas..."
            />
          </div>
          <div>
            <Label htmlFor="home_teams" className="text-muted-foreground">Times Mandantes</Label>
            <MultiSelect
              options={availableOptions.teams}
              selected={formData.home_teams}
              onChange={(selected: string[]) => handleMultiSelectChange('home_teams', selected)}
              placeholder="Selecione times mandantes..."
            />
          </div>
          <div>
            <Label htmlFor="away_teams" className="text-muted-foreground">Times Visitantes</Label>
            <MultiSelect
              options={availableOptions.teams}
              selected={formData.away_teams}
              onChange={(selected: string[]) => handleMultiSelectChange('away_teams', selected)}
              placeholder="Selecione times visitantes..."
            />
          </div>
        </CardContent>
      </Card>

      {/* Specific Odds Filters */}
      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle className="text-card-foreground flex items-center gap-2">
            <BarChartHorizontalBig className="w-5 h-5 text-primary" />
            Filtros de Odds
          </CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-2 md:grid-cols-4 gap-x-4 gap-y-4 pt-4">
          <OddsFilterField label="1x2 Casa (FT)" minField="min_odds_ft_home_team_win" maxField="max_odds_ft_home_team_win" formData={formData} handleInputChange={handleInputChange} />
          <OddsFilterField label="1x2 Empate (FT)" minField="min_odds_ft_draw" maxField="max_odds_ft_draw" formData={formData} handleInputChange={handleInputChange} />
          <OddsFilterField label="1x2 Fora (FT)" minField="min_odds_ft_away_team_win" maxField="max_odds_ft_away_team_win" formData={formData} handleInputChange={handleInputChange} />
          <OddsFilterField label="1x2 Casa (HT)" minField="min_odds_h_ht" maxField="max_odds_h_ht" formData={formData} handleInputChange={handleInputChange} />
          <OddsFilterField label="1x2 Empate (HT)" minField="min_odds_d_ht" maxField="max_odds_d_ht" formData={formData} handleInputChange={handleInputChange} />
          <OddsFilterField label="1x2 Fora (HT)" minField="min_odds_a_ht" maxField="max_odds_a_ht" formData={formData} handleInputChange={handleInputChange} />
          <OddsFilterField label="Over 1.5FT" minField="min_odds_ft_over15" maxField="max_odds_ft_over15" formData={formData} handleInputChange={handleInputChange} />
          <OddsFilterField label="Over 2.5FT" minField="min_odds_ft_over25" maxField="max_odds_ft_over25" formData={formData} handleInputChange={handleInputChange} />
          <OddsFilterField label="BTTS Sim" minField="min_odds_btts_yes" maxField="max_odds_btts_yes" formData={formData} handleInputChange={handleInputChange} />
          <OddsFilterField label="BTTS Não" minField="min_odds_btts_no" maxField="max_odds_btts_no" formData={formData} handleInputChange={handleInputChange} />
          <OddsFilterField label="Under 0.5FT" minField="min_odds_under05_ft" maxField="max_odds_under05_ft" formData={formData} handleInputChange={handleInputChange} />
          <OddsFilterField label="Under 1.5FT" minField="min_odds_under15_ft" maxField="max_odds_under15_ft" formData={formData} handleInputChange={handleInputChange} />
          <OddsFilterField label="Under 2.5FT" minField="min_odds_under25_ft" maxField="max_odds_under25_ft" formData={formData} handleInputChange={handleInputChange} />
          <OddsFilterField label="DC 1X" minField="min_odds_dc_1x" maxField="max_odds_dc_1x" formData={formData} handleInputChange={handleInputChange} />
          <OddsFilterField label="DC 12" minField="min_odds_dc_12" maxField="max_odds_dc_12" formData={formData} handleInputChange={handleInputChange} />
          <OddsFilterField label="DC X2" minField="min_odds_dc_x2" maxField="max_odds_dc_x2" formData={formData} handleInputChange={handleInputChange} />
        </CardContent>
      </Card>

      {/* Advanced Stat Filters */}
      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle className="text-card-foreground flex items-center gap-2 text-sm sm:text-base">
            <Percent className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />
            Filtros Avançados
          </CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-4 gap-y-4 pt-4">
          <AdvancedFilterInput label="Rodada Min" field="min_game_week" placeholder="Ex: 1" type="number" step="1" />
          <AdvancedFilterInput label="Rodada Max" field="max_game_week" placeholder="Ex: 38" type="number" step="1" />
          <AdvancedFilterInput label="Ranking Casa Min" field="min_ranking_home" placeholder="Ex: 1" type="number" step="1" />
          <AdvancedFilterInput label="Ranking Casa Max" field="max_ranking_home" placeholder="Ex: 5" type="number" step="1" />
          <AdvancedFilterInput label="Ranking Fora Min" field="min_ranking_away" placeholder="Ex: 1" type="number" step="1" />
          <AdvancedFilterInput label="Ranking Fora Max" field="max_ranking_away" placeholder="Ex: 8" type="number" step="1" />
          <AdvancedFilterInput label="PPG Casa Min" field="min_home_ppg" type="number" step="0.1" placeholder="Ex: 1.0" />
          <AdvancedFilterInput label="PPG Casa Max" field="max_home_ppg" type="number" step="0.1" placeholder="Ex: 2.5" />
          <AdvancedFilterInput label="PPG Visitante Min" field="min_away_ppg" type="number" step="0.1" placeholder="Ex: 0.8" />
          <AdvancedFilterInput label="PPG Visitante Max" field="max_away_ppg" type="number" step="0.1" placeholder="Ex: 2.0" />
          <AdvancedFilterInput label="xG Casa Min" field="min_home_xg" type="number" step="0.1" placeholder="Ex: 1.2" />
          <AdvancedFilterInput label="xG Casa Max" field="max_home_xg" type="number" step="0.1" placeholder="Ex: 2.8" />
          <AdvancedFilterInput label="xG Visitante Min" field="min_away_xg" type="number" step="0.1" placeholder="Ex: 0.9" />
          <AdvancedFilterInput label="xG Visitante Max" field="max_away_xg" type="number" step="0.1" placeholder="Ex: 2.5" />
          <AdvancedFilterInput label="Chutes Alvo Casa Min" field="min_shots_on_target_h" type="number" step="1" placeholder="Ex: 3" />
          <AdvancedFilterInput label="Chutes Alvo Casa Max" field="max_shots_on_target_h" type="number" step="1" placeholder="Ex: 8" />
          <AdvancedFilterInput label="Chutes Alvo Fora Min" field="min_shots_on_target_a" type="number" step="1" placeholder="Ex: 2" />
          <AdvancedFilterInput label="Chutes Alvo Fora Max" field="max_shots_on_target_a" type="number" step="1" placeholder="Ex: 7" />
          <AdvancedFilterInput label="Chutes Fora Casa Min" field="min_shots_off_target_h" placeholder="Ex: 1" type="number" step="1" />
          <AdvancedFilterInput label="Chutes Fora Casa Max" field="max_shots_off_target_h" placeholder="Ex: 6" type="number" step="1" />
          <AdvancedFilterInput label="Chutes Fora Visit. Min" field="min_shots_off_target_a" placeholder="Ex: 0" type="number" step="1" />
          <AdvancedFilterInput label="Chutes Fora Visit. Max" field="max_shots_off_target_a" placeholder="Ex: 5" type="number" step="1" />
          <AdvancedFilterInput label="Gols Casa (HT) Min" field="min_goals_h_ht" placeholder="Ex: 0" type="number" step="1" />
          <AdvancedFilterInput label="Gols Casa (HT) Max" field="max_goals_h_ht" placeholder="Ex: 3" type="number" step="1" />
          <AdvancedFilterInput label="Gols Fora (HT) Min" field="min_goals_a_ht" placeholder="Ex: 0" type="number" step="1" />
          <AdvancedFilterInput label="Gols Fora (HT) Max" field="max_goals_a_ht" placeholder="Ex: 4" type="number" step="1" />
          <AdvancedFilterInput label="Gols Casa (FT) Min" field="min_goals_h_ft" placeholder="Ex: 1" type="number" step="1" />
          <AdvancedFilterInput label="Gols Casa (FT) Max" field="max_goals_h_ft" placeholder="Ex: 5" type="number" step="1" />
          <AdvancedFilterInput label="Gols Fora (FT) Min" field="min_goals_a_ft" placeholder="Ex: 0" type="number" step="1" />
          <AdvancedFilterInput label="Gols Fora (FT) Max" field="max_goals_a_ft" placeholder="Ex: 4" type="number" step="1" />
        </CardContent>
      </Card>

      <div className="flex justify-end pt-4">
        <Button
          type="submit"
          disabled={isLoading || !formData.name}
          className="bg-primary text-primary-foreground hover:bg-primary/90 px-8 py-3 text-base font-medium rounded-lg shadow-md hover:shadow-lg transition-all duration-300"
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
