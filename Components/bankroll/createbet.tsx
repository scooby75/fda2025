
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { ArrowLeft, Target, Plus } from "lucide-react";
import { BetTransaction } from "@/entities/BetTransaction";
import { Bankroll } from "@/entities/Bankroll";
import { DailyGame } from "@/entities/DailyGame";
import { Strategy } from "@/entities/Strategy";
import { User } from "@/entities/User";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";

interface BankrollData {
  id: string;
  name: string;
  currency: string;
  current_balance: number;
  initial_balance: number;
}

interface TransactionData {
  id: string;
  bankroll_id: string;
  event_name: string;
  strategy_name: string;
  market: string;
  odds: number;
  stake: number;
  result: 'win' | 'loss' | 'pending' | 'void';
  profit: number;
  event_date: string;
  competition: string;
  description?: string;
  tags?: string[];
}

interface DailyGameData {
  id: string;
  home: string;
  away: string;
  league: string;
  date: string;
  time: string;
}

interface StrategyData {
  id: string;
  name: string;
  market: string;
}

interface CreateBetProps {
  bankrollId: string;
  bankrolls: BankrollData[];
  onClose: () => void;
  onSave: () => void;
  transaction?: TransactionData;
  initialData?: Partial<TransactionData>;
}

const initialFormState = {
  bankroll_id: "",
  event_name: "",
  event_date: "",
  competition: "",
  strategy_name: "",
  market: "",
  stake: "",
  odds: "",
  result: "pending",
  profit: 0,
  description: "",
  tags: [] as string[]
};

export default function CreateBet({
  bankrollId,
  bankrolls,
  onClose,
  onSave,
  transaction,
  initialData
}: CreateBetProps) {
  const [formData, setFormData] = useState(initialFormState);
  const [dailyGames, setDailyGames] = useState<DailyGameData[]>([]);
  const [strategies, setStrategies] = useState<StrategyData[]>([]);
  const [selectedGame, setSelectedGame] = useState<DailyGameData | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    loadData();

    if (transaction) {
      setFormData(prev => ({
        ...prev,
        ...transaction,
        bankroll_id: transaction.bankroll_id,
        event_date: transaction.event_date ? new Date(transaction.event_date).toISOString().split('T')[0] : "",
        stake: transaction.stake?.toString() || "",
        odds: transaction.odds?.toString() || "",
        profit: transaction.profit?.toString() || "0",
        tags: transaction.tags || [],
      }));
    } else if (initialData) {
       setFormData(prev => ({
         ...initialFormState,
         ...initialData,
         bankroll_id: bankrollId,
         event_date: initialData.event_date ? new Date(initialData.event_date).toISOString().split('T')[0] : (new Date().toISOString().split('T')[0]),
       }));
    } else {
      setFormData({
        ...initialFormState,
        bankroll_id: bankrollId,
        event_date: new Date().toISOString().split('T')[0],
      });
    }
  }, [transaction, initialData, bankrollId]);

  const loadData = async () => {
    try {
      const currentUser = await User.me();
      const [games, savedStrategies] = await Promise.all([
        DailyGame.list('-created_date'),
        Strategy.filter({ created_by: currentUser.email }, "-created_date")
      ]);

      setDailyGames(games as DailyGameData[]);
      setStrategies(savedStrategies as StrategyData[]);
    } catch (error) {
      console.error("Erro ao carregar dados:", error);
    }
  };

  const handleInputChange = (field: string, value: string | number) => {
    let newStake = field === 'stake' ? parseFloat(value.toString()) : parseFloat(formData.stake);
    let newOdds = field === 'odds' ? parseFloat(value.toString()) : parseFloat(formData.odds);
    let newResult = field === 'result' ? value : formData.result;

    let newProfit = formData.profit;

    if (newResult !== 'pending' && !isNaN(newStake) && !isNaN(newOdds)) {
      if (newResult === 'win') {
        newProfit = (newOdds - 1) * newStake;
      } else if (newResult === 'loss') {
        newProfit = -newStake;
      } else {
        newProfit = 0;
      }
    } else if (newResult === 'pending') {
      newProfit = 0;
    }

    setFormData(prev => ({
      ...prev,
      [field]: value,
      profit: parseFloat(newProfit.toFixed(2))
    }));
  };

  const handleGameSelect = (gameId: string) => {
    const game = dailyGames.find(g => g.id === gameId);
    if (game) {
      setSelectedGame(game);
      setFormData(prev => ({
        ...prev,
        event_name: `${game.home} vs ${game.away}`,
        event_date: game.date,
        competition: game.league
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const dataToSubmit = {
        ...formData,
        bankroll_id: formData.bankroll_id,
        stake: parseFloat(formData.stake),
        odds: parseFloat(formData.odds),
        profit: parseFloat(formData.profit.toString() || "0")
      };

      if (transaction) {
        await BetTransaction.update(parseInt(transaction.id), dataToSubmit);
      } else {
        await BetTransaction.create(dataToSubmit);
      }

      const bankrollToUpdate = await Bankroll.get(parseInt(formData.bankroll_id));
      const allBets = await BetTransaction.filter({ bankroll_id: formData.bankroll_id });
      const totalProfit = allBets
        .filter((b: any) => b.result !== 'pending')
        .reduce((sum: number, t: any) => sum + (t.profit || 0), 0);

      const newBalance = bankrollToUpdate.initial_balance + totalProfit;
      await Bankroll.update(parseInt(formData.bankroll_id), { current_balance: newBalance });

      onSave();
    } catch (error) {
      console.error("Erro ao salvar aposta:", error);
    }

    setIsLoading(false);
  };

  const filteredGames = dailyGames.filter((game: DailyGameData) =>
    game.home && game.away && game.league && game.date && game.time
  );

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[700px] bg-card border-border text-card-foreground p-0">
        <DialogHeader className="border-b border-border p-6">
          <DialogTitle className="text-card-foreground flex items-center gap-2">
            <Target className="w-6 h-6 text-primary" />
            {transaction ? 'Editar Aposta' : 'Criar Nova Aposta'}
          </DialogTitle>
        </DialogHeader>
        <div className="p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="bankroll_id" className="text-muted-foreground">Banca</Label>
                <Select
                  value={formData.bankroll_id || ''}
                  onValueChange={(value: string) => handleInputChange('bankroll_id', value)}
                  required
                >
                  <SelectTrigger className="bg-input border-border text-foreground">
                    <SelectValue placeholder="Selecione uma banca..." />
                  </SelectTrigger>
                  <SelectContent className="bg-popover border-border">
                    {bankrolls?.map((b: BankrollData) => (
                      <SelectItem key={b.id} value={b.id} style={{ color: 'rgb(15, 23, 42)' }}>
                        {b.name} ({b.currency} {b.current_balance?.toFixed(2)})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="daily_game" className="text-muted-foreground">Evento (Jogos do Dia)</Label>
                <Select
                  value={selectedGame?.id || ''}
                  onValueChange={handleGameSelect}
                >
                  <SelectTrigger className="bg-input border-border text-foreground">
                    <SelectValue placeholder="Selecionar jogo do dia..." />
                  </SelectTrigger>
                  <SelectContent className="bg-popover border-border text-popover-foreground max-h-60">
                    {filteredGames.map((game: DailyGameData) => (
                      <SelectItem key={game.id} value={game.id} style={{ color: 'rgb(15, 23, 42)' }}>
                        <div className="flex flex-col">
                          <span>{game.home} vs {game.away}</span>
                          <span className="text-xs opacity-70">{game.league} - {game.time}</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="event_name" className="text-muted-foreground">Nome do Evento</Label>
                <Input
                  id="event_name"
                  value={formData.event_name}
                  onChange={(e) => handleInputChange('event_name', e.target.value)}
                  placeholder="Ex: Manchester United vs Liverpool"
                  className="bg-input border-border text-foreground"
                  required
                />
              </div>

              <div>
                <Label htmlFor="event_date" className="text-muted-foreground">Data</Label>
                <Input
                  id="event_date"
                  type="date"
                  value={formData.event_date}
                  onChange={(e) => handleInputChange('event_date', e.target.value)}
                  className="bg-input border-border text-foreground"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="sport" className="text-muted-foreground">Esporte</Label>
                <Select value={formData.sport} onValueChange={(value) => handleInputChange('sport', value)}>
                  <SelectTrigger className="bg-input border-border text-foreground">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-popover border-border">
                    <SelectItem value="Futebol">Futebol</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="competition" className="text-muted-foreground">Competição</Label>
                <Input
                  id="competition"
                  value={formData.competition}
                  onChange={(e) => handleInputChange('competition', e.target.value)}
                  placeholder="Ex: Premier League, Copa do Brasil"
                  className="bg-input border-border text-foreground"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="strategy" className="text-muted-foreground">Estratégia</Label>
              <Select
                value={formData.strategy_name}
                onValueChange={(strategyName) => {
                  const selectedStrategy = strategies.find(s => s.name === strategyName);
                  if (selectedStrategy) {
                    handleInputChange('strategy_name', selectedStrategy.name);
                    handleInputChange('market', selectedStrategy.market);
                  } else {
                    handleInputChange('strategy_name', strategyName);
                    handleInputChange('market', '');
                  }
                }}
              >
                <SelectTrigger className="bg-input border-border text-foreground">
                  <SelectValue placeholder="Selecione a estratégia..." />
                </SelectTrigger>
                <SelectContent className="bg-popover border-border max-h-60">
                  {strategies.map(strategy => (
                    <SelectItem key={strategy.id} value={strategy.name} style={{ color: 'rgb(15, 23, 42)' }}>
                      {strategy.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <Label htmlFor="stake" className="text-muted-foreground">Stake</Label>
                <Input
                  id="stake"
                  type="number"
                  step="0.01"
                  min="0"
                  value={formData.stake}
                  onChange={(e) => handleInputChange('stake', e.target.value)}
                  placeholder="300.00"
                  className="bg-input border-border text-foreground"
                  required
                />
              </div>

              <div>
                <Label htmlFor="odds" className="text-muted-foreground">Odd</Label>
                <Input
                  id="odds"
                  type="number"
                  step="0.01"
                  min="1"
                  value={formData.odds}
                  onChange={(e) => handleInputChange('odds', e.target.value)}
                  placeholder="2.50"
                  className="bg-input border-border text-foreground"
                  required
                />
              </div>

              <div>
                <Label htmlFor="market" className="text-muted-foreground">Mercado</Label>
                <Input
                  id="market"
                  value={formData.market}
                  onChange={(e) => handleInputChange('market', e.target.value)}
                  placeholder="Over 2.5"
                  className="bg-input border-border text-foreground"
                />
              </div>

              <div>
                <Label htmlFor="result" className="text-muted-foreground">Resultado</Label>
                <Select
                  value={formData.result}
                  onValueChange={(value) => handleInputChange('result', value)}
                >
                  <SelectTrigger className="bg-input border-border text-foreground">
                    <SelectValue placeholder="Selecione o resultado" />
                  </SelectTrigger>
                  <SelectContent className="bg-popover border-border">
                    <SelectItem value="pending" style={{ color: 'rgb(15, 23, 42)' }}>Pendente</SelectItem>
                    <SelectItem value="win" style={{ color: 'rgb(15, 23, 42)' }}>Ganho</SelectItem>
                    <SelectItem value="loss" style={{ color: 'rgb(15, 23, 42)' }}>Perda</SelectItem>
                    <SelectItem value="void" style={{ color: 'rgb(15, 23, 42)' }}>Anulado</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <Label htmlFor="profit" className="text-muted-foreground">Lucro (R$)</Label>
              <Input
                id="profit"
                type="number"
                step="0.01"
                value={formData.profit}
                onChange={(e) => handleInputChange('profit', e.target.value)}
                placeholder="0.00"
                className="bg-input border-border text-foreground"
                disabled={formData.result === 'pending'}
              />
            </div>

            <div>
              <Label htmlFor="description" className="text-muted-foreground">Descrição</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                placeholder="Adicione detalhes sobre a aposta..."
                className="bg-input border-border text-foreground h-20"
              />
            </div>

            <div className="flex gap-3 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                className="flex-1 border-border text-muted-foreground hover:bg-muted/20"
              >
                Cancelar
              </Button>
              <Button
                type="submit"
                disabled={isLoading || !formData.bankroll_id || !formData.event_name || !formData.stake || !formData.odds}
                className="flex-1 bg-primary text-primary-foreground hover:bg-primary/90"
              >
                {isLoading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary-foreground mr-2"></div>
                    {transaction ? 'Atualizando...' : 'Salvando...'}
                  </>
                ) : (
                  transaction ? 'Atualizar Aposta' : 'Salvar Aposta'
                )}
              </Button>
            </div>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
}
