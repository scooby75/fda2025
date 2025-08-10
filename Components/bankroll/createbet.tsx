import React, { useState, useEffect } from "react";
import { BetTransaction } from "@/entities/BetTransaction";
import { DailyGame } from "@/entities/DailyGame";
import { Strategy } from "@/entities/Strategy";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import MultiSelect from "@/components/ui/MultiSelect";
import { X, Save, Search, Calendar, DollarSign } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

interface FormData {
  id?: string;
  bankroll_id: string;
  event_name: string;
  event_date: string;
  competition: string;
  strategy_name: string;
  market: string;
  stake: string;
  odds: string;
  result: string;
  profit: number;
  description: string;
  tags: string[];
  sport: string;
}

interface CreateBetProps {
  bankrollId: string;
  bankrolls: Array<{ id: string; name: string }>;
  onClose: () => void;
  onSave: () => void;
  transaction?: FormData | null;
  initialData?: Partial<FormData> | null;
}

interface DailyGameData {
  id: string;
  home: string;
  away: string;
  date: string;
  time?: string;
  league: string;
}

interface StrategyData {
  id: string;
  name: string;
  market: string;
}

export default function CreateBet({ 
  bankrollId, 
  bankrolls, 
  onClose, 
  onSave, 
  transaction = null, 
  initialData = null 
}: CreateBetProps) {
  const [formData, setFormData] = useState<FormData>({
    bankroll_id: bankrollId,
    event_name: '',
    event_date: '',
    competition: '',
    strategy_name: '',
    market: '',
    stake: '',
    odds: '',
    result: 'pending',
    profit: 0,
    description: '',
    tags: [],
    sport: 'Futebol'
  });

  const [dailyGames, setDailyGames] = useState<DailyGameData[]>([]);
  const [strategies, setStrategies] = useState<StrategyData[]>([]);
  const [showGameSelector, setShowGameSelector] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    if (transaction) {
      setFormData({
        ...transaction,
        stake: String(transaction.stake),
        odds: String(transaction.odds)
      });
    } else if (initialData) {
      setFormData(prev => ({
        ...prev,
        ...initialData,
        event_name: initialData.event_name || '',
        event_date: initialData.event_date || '',
        competition: initialData.competition || ''
      }));
    }
  }, [transaction, initialData]);

  const loadData = async () => {
    try {
      const [gamesData, strategiesData] = await Promise.all([
        DailyGame.list(),
        Strategy.list()
      ]);
      setDailyGames(gamesData);
      
      // Transform strategy data to match StrategyData interface
      const transformedStrategies: StrategyData[] = strategiesData.map(s => ({
        id: String(s.id),
        name: s.name,
        market: s.market || 'Over 2.5'
      }));
      setStrategies(transformedStrategies);
    } catch (error) {
      console.error('Error loading data:', error);
    }
  };

  const handleInputChange = (field: keyof FormData, value: string | number | string[]) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleGameSelect = (gameId: string) => {
    const selectedGame = dailyGames.find((g: DailyGameData) => g.id === gameId);
    if (selectedGame) {
      handleInputChange('event_name', `${selectedGame.home} vs ${selectedGame.away}`);
      handleInputChange('event_date', selectedGame.date);
      handleInputChange('competition', selectedGame.league);
      setShowGameSelector(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const stake = parseFloat(formData.stake);
      const odds = parseFloat(formData.odds);
      const profit = formData.result === 'win' ? 
        (stake * odds) - stake : 
        formData.result === 'loss' ? -stake : 0;

      const transactionData = {
        bankroll_id: parseInt(formData.bankroll_id),
        event_name: formData.event_name,
        event_date: formData.event_date,
        competition: formData.competition,
        strategy_name: formData.strategy_name,
        market: formData.market,
        stake: stake,
        odds: odds,
        result: formData.result as 'pending' | 'win' | 'loss' | 'void',
        profit: profit,
        description: formData.description,
        tags: formData.tags,
        sport: formData.sport
      };

      if (formData.id) {
        await BetTransaction.update(parseInt(formData.id), transactionData);
      } else {
        await BetTransaction.create(transactionData);
      }

      onSave();
      onClose();
    } catch (error) {
      console.error('Error saving bet:', error);
    }
    setIsLoading(false);
  };

  const filteredGames = dailyGames.filter((game: DailyGameData) =>
    game.home.toLowerCase().includes(searchTerm.toLowerCase()) ||
    game.away.toLowerCase().includes(searchTerm.toLowerCase()) ||
    game.league.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const availableTags = ['Valor', 'Zebra', 'Casa', 'Fora', 'Over', 'Under', 'BTTS'];

  const handleTagChange = (selectedTags: string[]) => {
    handleInputChange('tags', selectedTags);
  };

  const handleBankrollChange = (value: string) => {
    handleInputChange('bankroll_id', value);
  };

  const selectedBankroll = bankrolls.find((b: { id: string; name: string }) => b.id === formData.bankroll_id);

  const getGameOptions = () => {
    return dailyGames.map((game: DailyGameData) => ({
      value: game.id,
      label: `${game.home} vs ${game.away} - ${game.league} ${game.time ? `(${game.time})` : ''}`
    }));
  };

  const marketOptions = [
    'Resultado Final (1X2)',
    'Dupla Chance',
    'Handicap Asiático',
    'Total de Gols (Over/Under)',
    'Ambas Marcam (BTTS)',
    'Gols do 1º Tempo',
    'Resultado/Total',
    'Handicap Europeu',
    'Próximo Gol',
    'Escanteios'
  ];

  const handleSportChange = (field: keyof FormData, value: string) => {
    handleInputChange(field, value);
  };

  const handleStrategyChange = (strategyName: string) => {
    const selectedStrategy = strategies.find((s: StrategyData) => s.name === strategyName);
    if (selectedStrategy) {
      handleInputChange('strategy_name', selectedStrategy.name);
      handleInputChange('market', selectedStrategy.market);
    }
  };

  const getStrategyOptions = () => {
    return strategies.map((strategy: StrategyData) => ({
      id: strategy.id,
      name: strategy.name,
      label: strategy.name
    }));
  };

  return (
    <>
      <Dialog open={true} onOpenChange={onClose}>
        <DialogContent className="bg-card border-border max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-card-foreground flex items-center gap-2">
              <DollarSign className="w-5 h-5 text-primary" />
              {transaction ? 'Editar Aposta' : 'Nova Aposta'}
            </DialogTitle>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-card-foreground">Banca</Label>
                <Select value={formData.bankroll_id} onValueChange={handleBankrollChange}>
                  <SelectTrigger className="bg-input border-border text-foreground">
                    <SelectValue placeholder="Selecione a banca" />
                  </SelectTrigger>
                  <SelectContent>
                    {bankrolls.map((bankroll: { id: string; name: string }) => (
                      <SelectItem key={bankroll.id} value={bankroll.id}>
                        {bankroll.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label className="text-card-foreground">Esporte</Label>
                <Select value={formData.sport} onValueChange={(value: string) => handleSportChange('sport', value)}>
                  <SelectTrigger className="bg-input border-border text-foreground">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Futebol">Futebol</SelectItem>
                    <SelectItem value="Basquete">Basquete</SelectItem>
                    <SelectItem value="Tennis">Tennis</SelectItem>
                    <SelectItem value="Volei">Vôlei</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-card-foreground">Evento</Label>
              <div className="flex gap-2">
                <Input
                  value={formData.event_name}
                  onChange={(e) => handleInputChange('event_name', e.target.value)}
                  placeholder="Nome do evento"
                  className="bg-input border-border text-foreground"
                />
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setShowGameSelector(true)}
                  className="border-border text-muted-foreground hover:bg-muted/20"
                >
                  <Search className="w-4 h-4" />
                </Button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-card-foreground">Data do Evento</Label>
                <Input
                  type="date"
                  value={formData.event_date}
                  onChange={(e) => handleInputChange('event_date', e.target.value)}
                  className="bg-input border-border text-foreground"
                />
              </div>

              <div className="space-y-2">
                <Label className="text-card-foreground">Competição</Label>
                <Input
                  value={formData.competition}
                  onChange={(e) => handleInputChange('competition', e.target.value)}
                  placeholder="Nome da competição"
                  className="bg-input border-border text-foreground"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-card-foreground">Estratégia</Label>
                <Select value={formData.strategy_name} onValueChange={handleStrategyChange}>
                  <SelectTrigger className="bg-input border-border text-foreground">
                    <SelectValue placeholder="Selecione a estratégia" />
                  </SelectTrigger>
                  <SelectContent>
                    {getStrategyOptions().map((strategy: { id: string; name: string; label: string }) => (
                      <SelectItem key={strategy.id} value={strategy.name}>
                        {strategy.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label className="text-card-foreground">Mercado</Label>
                <Select value={formData.market} onValueChange={(value: string) => handleInputChange('market', value)}>
                  <SelectTrigger className="bg-input border-border text-foreground">
                    <SelectValue placeholder="Selecione o mercado" />
                  </SelectTrigger>
                  <SelectContent>
                    {marketOptions.map((market) => (
                      <SelectItem key={market} value={market}>
                        {market}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label className="text-card-foreground">Stake</Label>
                <Input
                  type="number"
                  step="0.01"
                  value={formData.stake}
                  onChange={(e) => handleInputChange('stake', e.target.value)}
                  placeholder="0.00"
                  className="bg-input border-border text-foreground"
                />
              </div>

              <div className="space-y-2">
                <Label className="text-card-foreground">Odds</Label>
                <Input
                  type="number"
                  step="0.01"
                  value={formData.odds}
                  onChange={(e) => handleInputChange('odds', e.target.value)}
                  placeholder="1.00"
                  className="bg-input border-border text-foreground"
                />
              </div>

              <div className="space-y-2">
                <Label className="text-card-foreground">Resultado</Label>
                <Select value={formData.result} onValueChange={(value: string) => handleInputChange('result', value)}>
                  <SelectTrigger className="bg-input border-border text-foreground">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pending">Pendente</SelectItem>
                    <SelectItem value="win">Vitória</SelectItem>
                    <SelectItem value="loss">Derrota</SelectItem>
                    <SelectItem value="void">Anulada</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-card-foreground">Tags</Label>
              <MultiSelect
                options={availableTags.map(tag => ({ value: tag, label: tag }))}
                selected={formData.tags}
                onChange={handleTagChange}
                placeholder="Selecione as tags..."
                className="bg-input border-border text-foreground"
              />
            </div>

            <div className="space-y-2">
              <Label className="text-card-foreground">Descrição</Label>
              <Textarea
                value={formData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                placeholder="Detalhes adicionais sobre a aposta..."
                className="bg-input border-border text-foreground"
                rows={3}
              />
            </div>

            <div className="flex justify-end gap-3 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                className="border-border text-muted-foreground hover:bg-muted/20"
              >
                Cancelar
              </Button>
              <Button
                type="submit"
                disabled={isLoading}
                className="bg-primary text-primary-foreground hover:bg-primary/90"
              >
                <Save className="w-4 h-4 mr-2" />
                {isLoading ? 'Salvando...' : 'Salvar Aposta'}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {showGameSelector && (
        <Dialog open={showGameSelector} onOpenChange={setShowGameSelector}>
          <DialogContent className="bg-card border-border max-w-4xl max-h-[80vh]">
            <DialogHeader>
              <DialogTitle className="text-card-foreground flex items-center gap-2">
                <Calendar className="w-5 h-5 text-primary" />
                Selecionar Jogo
              </DialogTitle>
            </DialogHeader>

            <div className="space-y-4">
              <Input
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Buscar por time ou liga..."
                className="bg-input border-border text-foreground"
              />

              <div className="max-h-96 overflow-y-auto space-y-2">
                {filteredGames.map((game: DailyGameData) => (
                  <div
                    key={game.id}
                    onClick={() => handleGameSelect(game.id)}
                    className="p-3 border border-border rounded-lg cursor-pointer hover:bg-muted/20 transition-colors"
                  >
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="font-medium text-card-foreground">
                          {game.home} vs {game.away}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {game.league} • {game.date} {game.time && `• ${game.time}`}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </>
  );
}
