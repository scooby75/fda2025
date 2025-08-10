
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowLeft, Target } from "lucide-react";
import { BetTransaction } from '@/entities/BetTransaction';
import { Bankroll } from '@/entities/Bankroll';

interface BankrollData {
  id: string;
  name: string;
  currency: string;
  current_balance: number;
  initial_balance: number;
}

interface TransactionData {
  id?: string;
  event_name: string;
  strategy_name: string;
  market: string;
  odds: number;
  stake: number;
  result: 'win' | 'loss' | 'pending';
  profit?: number;
  event_date: string;
  competition: string;
}

interface CreateBetProps {
  bankrolls: BankrollData[];
  selectedBankroll: BankrollData | null;
  onClose: () => void;
  onSave: () => void;  
  transaction?: TransactionData;
}

export default function CreateBet({ 
  bankrolls,
  selectedBankroll, 
  onClose, 
  onSave,
  transaction
}: CreateBetProps) {
  const [formData, setFormData] = useState({
    event_name: "",
    strategy_name: "",
    market: "",
    odds: "",
    stake: "",
    result: "pending" as 'win' | 'loss' | 'pending',
    event_date: new Date().toISOString().split('T')[0],
    competition: ""
  });
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (transaction) {
      setFormData({
        event_name: transaction.event_name || "",
        strategy_name: transaction.strategy_name || "",
        market: transaction.market || "",
        odds: transaction.odds?.toString() || "",
        stake: transaction.stake?.toString() || "",
        result: transaction.result || "pending",
        event_date: transaction.event_date || new Date().toISOString().split('T')[0],
        competition: transaction.competition || ""
      });
    }
  }, [transaction]);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedBankroll) return;
    
    setIsLoading(true);

    try {
      const betData = {
        bankroll_id: selectedBankroll.id,
        event_name: formData.event_name,
        strategy_name: formData.strategy_name,
        market: formData.market,
        odds: parseFloat(formData.odds),
        stake: parseFloat(formData.stake),
        result: formData.result,
        event_date: formData.event_date,
        competition: formData.competition,
        profit: formData.result === 'pending' ? null : 
               formData.result === 'win' ? 
               (parseFloat(formData.stake) * parseFloat(formData.odds)) - parseFloat(formData.stake) :
               -parseFloat(formData.stake)
      };

      if (transaction?.id) {
        await BetTransaction.update(parseInt(transaction.id), betData);
      } else {
        await BetTransaction.create(betData);
      }

      // Update bankroll balance
      const bankrollToUpdate = await Bankroll.get(parseInt(selectedBankroll.id));
      const allBets = await BetTransaction.filter({ bankroll_id: selectedBankroll.id });
      const totalProfit = allBets
        .filter((b: any) => b.result !== 'pending')
        .reduce((sum: number, t: any) => sum + (t.profit || 0), 0);
      
      const newBalance = bankrollToUpdate.initial_balance + totalProfit;
      await Bankroll.update(parseInt(selectedBankroll.id), { current_balance: newBalance });

      onSave();
    } catch (error) {
      console.error("Erro ao salvar aposta:", error);
    }

    setIsLoading(false);
  };

  return (
    <Card className="bg-card border-border max-w-2xl mx-auto">
      <CardHeader className="border-b border-border">
        <CardTitle className="text-card-foreground flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <Target className="w-6 h-6 text-primary" />
          {transaction ? 'Editar Aposta' : 'Nova Aposta'}
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
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

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="strategy_name" className="text-muted-foreground">Estratégia</Label>
              <Input
                id="strategy_name"
                value={formData.strategy_name}
                onChange={(e) => handleInputChange('strategy_name', e.target.value)}
                placeholder="Nome da estratégia"
                className="bg-input border-border text-foreground"
                required
              />
            </div>

            <div>
              <Label htmlFor="market" className="text-muted-foreground">Mercado</Label>
              <Select value={formData.market} onValueChange={(value) => handleInputChange('market', value)}>
                <SelectTrigger className="bg-input border-border text-foreground">
                  <SelectValue placeholder="Selecione o mercado" />
                </SelectTrigger>
                <SelectContent className="bg-popover border-border">
                  <SelectItem value="over_2.5">Over 2.5</SelectItem>
                  <SelectItem value="under_2.5">Under 2.5</SelectItem>
                  <SelectItem value="btts">BTTS</SelectItem>
                  <SelectItem value="1x2">1x2</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="odds" className="text-muted-foreground">Odd</Label>
              <Input
                id="odds"
                type="number"
                step="0.01"
                min="1"
                value={formData.odds}
                onChange={(e) => handleInputChange('odds', e.target.value)}
                placeholder="1.80"
                className="bg-input border-border text-foreground"
                required
              />
            </div>

            <div>
              <Label htmlFor="stake" className="text-muted-foreground">Stake</Label>
              <Input
                id="stake"
                type="number"
                step="0.01"
                min="0"
                value={formData.stake}
                onChange={(e) => handleInputChange('stake', e.target.value)}
                placeholder="10.00"
                className="bg-input border-border text-foreground"
                required
              />
            </div>

            <div>
              <Label htmlFor="result" className="text-muted-foreground">Resultado</Label>
              <Select value={formData.result} onValueChange={(value) => handleInputChange('result', value)}>
                <SelectTrigger className="bg-input border-border text-foreground">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-popover border-border">
                  <SelectItem value="pending">Pendente</SelectItem>
                  <SelectItem value="win">Green</SelectItem>
                  <SelectItem value="loss">Red</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="event_date" className="text-muted-foreground">Data do Evento</Label>
              <Input
                id="event_date"
                type="date"
                value={formData.event_date}
                onChange={(e) => handleInputChange('event_date', e.target.value)}
                className="bg-input border-border text-foreground"
                required
              />
            </div>

            <div>
              <Label htmlFor="competition" className="text-muted-foreground">Competição</Label>
              <Input
                id="competition"
                value={formData.competition}
                onChange={(e) => handleInputChange('competition', e.target.value)}
                placeholder="Ex: Premier League"
                className="bg-input border-border text-foreground"
                required
              />
            </div>
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
              disabled={isLoading || !formData.event_name || !formData.odds || !formData.stake}
              className="flex-1 bg-primary text-primary-foreground hover:bg-primary/90"
            >
              {isLoading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary-foreground mr-2"></div>
                  Salvando...
                </>
              ) : (
                transaction ? "Atualizar Aposta" : "Criar Aposta"
              )}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
