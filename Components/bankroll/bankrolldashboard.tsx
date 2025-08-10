import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { 
  Wallet, 
  TrendingUp, 
  TrendingDown, 
  Target, 
  DollarSign,
  Activity,
  Calendar,
  BarChart3
} from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

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
  result: 'win' | 'loss' | 'pending';
  profit: number;
  stake: number;
  created_date: string;
}

interface BankrollDashboardProps {
  bankrolls: BankrollData[];
  selectedBankroll: BankrollData | null;
  transactions: TransactionData[];
  isLoading: boolean;
  onBankrollSelect: (bankroll: BankrollData | null) => void;
}

export default function BankrollDashboard({ 
  bankrolls, 
  selectedBankroll, 
  transactions, 
  isLoading, 
  onBankrollSelect 
}: BankrollDashboardProps) {
  if (isLoading) {
    return (
      <div className="text-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
        <p className="text-muted-foreground">Carregando dados da banca...</p>
      </div>
    );
  }

  if (bankrolls.length === 0) {
    return (
      <Card className="bg-card border-border">
        <CardContent className="p-12 text-center">
          <Wallet className="w-16 h-16 text-muted-foreground/50 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-card-foreground mb-2">
            Nenhuma banca criada
          </h3>
          <p className="text-muted-foreground">
            Crie sua primeira banca para começar a gerenciar suas apostas
          </p>
        </CardContent>
      </Card>
    );
  }

  const bankrollTransactions = transactions.filter((t: TransactionData) => t.bankroll_id === selectedBankroll?.id);
  
  const getStats = () => {
    const totalBets = bankrollTransactions.length;
    const finishedBets = bankrollTransactions.filter((t: TransactionData) => t.result !== 'pending');
    const winningBets = bankrollTransactions.filter((t: TransactionData) => t.result === 'win').length;
    const losingBets = bankrollTransactions.filter((t: TransactionData) => t.result === 'loss').length;
    const pendingBets = bankrollTransactions.filter((t: TransactionData) => t.result === 'pending').length;
    
    const totalProfit = bankrollTransactions
        .filter((t: TransactionData) => t.result !== 'pending')
        .reduce((sum: number, t: TransactionData) => sum + (t.profit || 0), 0);

    const totalStaked = bankrollTransactions
        .filter((t: TransactionData) => t.result !== 'pending')
        .reduce((sum: number, t: TransactionData) => sum + t.stake, 0);

    const hitRate = finishedBets.length > 0 ? (winningBets / finishedBets.length) * 100 : 0;
    
    // ROI calculation changed to be based on the initial bankroll
    const roi = selectedBankroll && selectedBankroll.initial_balance > 0 
      ? (totalProfit / selectedBankroll.initial_balance) * 100 
      : 0;

    return {
      totalBets,
      winningBets,
      losingBets,
      pendingBets,
      totalProfit,
      totalStaked,
      hitRate,
      roi
    };
  };

  const stats = getStats();

  return (
    <div className="space-y-6">
      {/* Bankroll Selector */}
      <Card className="bg-card border-border">
        <CardHeader className="border-b border-border">
          <CardTitle className="text-card-foreground flex items-center gap-2">
            <Wallet className="w-6 h-6 text-primary" />
            Selecionar Banca
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <Select 
            value={selectedBankroll?.id || ''} 
            onValueChange={(value: string) => {
              const bankroll = bankrolls.find((b: BankrollData) => b.id === value);
              onBankrollSelect(bankroll || null);
            }}
          >
            <SelectTrigger className="bg-input border-border text-foreground">
              <SelectValue placeholder="Selecione uma banca..." />
            </SelectTrigger>
            <SelectContent className="bg-popover border-border">
              {bankrolls.map((bankroll: BankrollData) => (
                <SelectItem key={bankroll.id} value={bankroll.id}>
                  {bankroll.name} - {bankroll.currency} {bankroll.current_balance?.toFixed(2) || bankroll.initial_balance?.toFixed(2)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </CardContent>
      </Card>

      {selectedBankroll && (
        <>
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="bg-card border-border">
              <CardContent className="p-6 text-center">
                <DollarSign className="w-8 h-8 text-primary mx-auto mb-2" />
                <p className="text-sm text-muted-foreground mb-1">Saldo Atual</p>
                <p className="text-2xl font-bold text-card-foreground">
                  {selectedBankroll.currency} {(selectedBankroll.current_balance || selectedBankroll.initial_balance).toFixed(2)}
                </p>
              </CardContent>
            </Card>

            <Card className="bg-card border-border">
              <CardContent className="p-6 text-center">
                <Target className="w-8 h-8 text-blue-400 mx-auto mb-2" />
                <p className="text-sm text-muted-foreground mb-1">Total de Apostas</p>
                <p className="text-2xl font-bold text-card-foreground">{stats.totalBets}</p>
                <div className="flex justify-center gap-2 mt-2">
                  <Badge variant="outline" className="text-xs">
                    {stats.pendingBets} pendentes
                  </Badge>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-card border-border">
              <CardContent className="p-6 text-center">
                <TrendingUp className="w-8 h-8 text-emerald-400 mx-auto mb-2" />
                <p className="text-sm text-muted-foreground mb-1">Taxa de Acerto</p>
                <p className="text-2xl font-bold text-card-foreground">{stats.hitRate.toFixed(1)}%</p>
                <p className="text-xs text-muted-foreground mt-1">
                  {stats.winningBets}W / {stats.losingBets}L
                </p>
              </CardContent>
            </Card>

            <Card className="bg-card border-border">
              <CardContent className="p-6 text-center">
                <BarChart3 className="w-8 h-8 text-purple-400 mx-auto mb-2" />
                <p className="text-sm text-muted-foreground mb-1">ROI (sobre banca inicial)</p>
                <p className={`text-2xl font-bold ${stats.roi >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                  {stats.roi.toFixed(1)}%
                </p>
                <p className={`text-xs mt-1 ${stats.totalProfit >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                  {selectedBankroll.currency} {stats.totalProfit.toFixed(2)}
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Recent Transactions */}
          <Card className="bg-card border-border">
            <CardHeader className="border-b border-border">
              <CardTitle className="text-card-foreground flex items-center gap-2">
                <Activity className="w-6 h-6 text-primary" />
                Últimas Transações
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              {bankrollTransactions.length > 0 ? (
                <div className="space-y-3">
                  {bankrollTransactions.slice(0, 5).map((transaction: TransactionData) => (
                    <div key={transaction.id} className="flex items-center justify-between p-3 bg-muted/20 rounded-lg">
                      <div className="flex-1">
                        <p className="font-medium text-card-foreground">{transaction.event_name}</p>
                        <p className="text-sm text-muted-foreground">
                          {transaction.strategy_name} • {transaction.market}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {format(new Date(transaction.created_date), 'dd/MM/yyyy HH:mm', { locale: ptBR })}
                        </p>
                      </div>
                      <div className="text-right">
                        <Badge 
                          variant="outline"
                          className={
                            transaction.result === 'win' 
                              ? 'border-emerald-500 text-emerald-400'
                              : transaction.result === 'loss'
                              ? 'border-red-500 text-red-400'
                              : 'border-yellow-500 text-yellow-400'
                          }
                        >
                          {transaction.result === 'pending' ? 'Pendente' : 
                           transaction.result === 'win' ? 'Green' : 'Red'}
                        </Badge>
                        <p className="text-sm font-medium text-card-foreground mt-1">
                          {selectedBankroll.currency} {transaction.stake.toFixed(2)}
                        </p>
                        {transaction.result !== 'pending' && (
                          <p className={`text-xs ${transaction.profit >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                            {transaction.profit >= 0 ? '+' : ''}{selectedBankroll.currency} {transaction.profit.toFixed(2)}
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Activity className="w-12 h-12 text-muted-foreground/50 mx-auto mb-4" />
                  <p className="text-muted-foreground">Nenhuma transação encontrada</p>
                </div>
              )}
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
}
