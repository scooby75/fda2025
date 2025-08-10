
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from "recharts";
import { TrendingUp, TrendingDown, Target, Activity, Calendar, DollarSign } from "lucide-react";

interface BankrollData {
  id: string;
  name: string;
  currency: string;
  current_balance: number;
  initial_balance: number;
  start_date: string;
  is_active: boolean;
  commission_percentage: number;
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
  created_date: string;
}

interface BankrollReportsProps {
  bankrolls: BankrollData[];
  selectedBankroll: BankrollData | null;
  transactions: TransactionData[];
  isLoading: boolean;
}

export default function BankrollReports({ bankrolls, selectedBankroll, transactions, isLoading }: BankrollReportsProps) {
  if (isLoading) {
    return (
      <div className="text-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
        <p className="text-muted-foreground">Carregando relatórios...</p>
      </div>
    );
  }

  if (!selectedBankroll) {
    return (
      <Card className="bg-card border-border">
        <CardContent className="p-12 text-center">
          <Target className="w-16 h-16 text-muted-foreground/50 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-card-foreground mb-2">
            Selecione uma Banca
          </h3>
          <p className="text-muted-foreground">
            Escolha uma banca para visualizar os relatórios detalhados
          </p>
        </CardContent>
      </Card>
    );
  }

  const completedTransactions = transactions.filter(t => t.result !== 'pending');
  const wins = completedTransactions.filter(t => t.result === 'win');
  const losses = completedTransactions.filter(t => t.result === 'loss');
  
  const totalProfit = completedTransactions.reduce((sum, t) => sum + t.profit, 0);
  const winRate = completedTransactions.length > 0 ? (wins.length / completedTransactions.length) * 100 : 0;
  const roi = selectedBankroll.initial_balance > 0 ? (totalProfit / selectedBankroll.initial_balance) * 100 : 0;

  // Monthly performance data
  const monthlyData = completedTransactions.reduce((acc: any[], transaction) => {
    const month = new Date(transaction.event_date).toLocaleString('default', { month: 'short', year: 'numeric' });
    const existing = acc.find(item => item.month === month);
    
    if (existing) {
      existing.profit += transaction.profit;
      existing.bets += 1;
    } else {
      acc.push({
        month,
        profit: transaction.profit,
        bets: 1
      });
    }
    
    return acc;
  }, []);

  // Strategy performance
  const strategyData = completedTransactions.reduce((acc: any[], transaction) => {
    const existing = acc.find(item => item.strategy === transaction.strategy_name);
    
    if (existing) {
      existing.profit += transaction.profit;
      existing.bets += 1;
      if (transaction.result === 'win') existing.wins += 1;
    } else {
      acc.push({
        strategy: transaction.strategy_name,
        profit: transaction.profit,
        bets: 1,
        wins: transaction.result === 'win' ? 1 : 0
      });
    }
    
    return acc;
  }, []);

  const COLORS = ['#8884d8', '#82ca9d', '#ffc658', '#ff7300', '#00ff00'];

  return (
    <div className="space-y-6">
      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-card border-border">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total de Apostas</p>
                <p className="text-2xl font-bold text-card-foreground">{transactions.length}</p>
              </div>
              <Activity className="w-8 h-8 text-primary" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card border-border">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Taxa de Acerto</p>
                <p className="text-2xl font-bold text-card-foreground">{winRate.toFixed(1)}%</p>
              </div>
              <Target className="w-8 h-8 text-emerald-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card border-border">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Lucro Total</p>
                <p className={`text-2xl font-bold ${totalProfit >= 0 ? 'text-emerald-500' : 'text-red-500'}`}>
                  ${totalProfit.toFixed(2)}
                </p>
              </div>
              {totalProfit >= 0 ? 
                <TrendingUp className="w-8 h-8 text-emerald-500" /> :
                <TrendingDown className="w-8 h-8 text-red-500" />
              }
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card border-border">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">ROI</p>
                <p className={`text-2xl font-bold ${roi >= 0 ? 'text-emerald-500' : 'text-red-500'}`}>
                  {roi.toFixed(1)}%
                </p>
              </div>
              <DollarSign className="w-8 h-8 text-primary" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Monthly Performance */}
        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="text-card-foreground flex items-center gap-2">
              <Calendar className="w-5 h-5" />
              Performance Mensal
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={monthlyData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" />
                  <YAxis stroke="hsl(var(--muted-foreground))" />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'hsl(var(--popover))', 
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '8px',
                      color: 'hsl(var(--popover-foreground))'
                    }} 
                  />
                  <Line 
                    type="monotone" 
                    dataKey="profit" 
                    stroke="hsl(var(--primary))" 
                    strokeWidth={2}
                    dot={{ fill: 'hsl(var(--primary))', strokeWidth: 2, r: 4 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Strategy Performance */}
        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="text-card-foreground flex items-center gap-2">
              <Target className="w-5 h-5" />
              Performance por Estratégia
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={strategyData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="strategy" stroke="hsl(var(--muted-foreground))" />
                  <YAxis stroke="hsl(var(--muted-foreground))" />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'hsl(var(--popover))', 
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '8px',
                      color: 'hsl(var(--popover-foreground))'
                    }} 
                  />
                  <Bar dataKey="profit" fill="hsl(var(--primary))" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Strategy Table */}
      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle className="text-card-foreground">Detalhamento por Estratégia</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left p-2 text-muted-foreground">Estratégia</th>
                  <th className="text-left p-2 text-muted-foreground">Apostas</th>
                  <th className="text-left p-2 text-muted-foreground">Vitórias</th>
                  <th className="text-left p-2 text-muted-foreground">Taxa</th>
                  <th className="text-left p-2 text-muted-foreground">Lucro</th>
                </tr>
              </thead>
              <tbody>
                {strategyData.map((strategy, index) => (
                  <tr key={index} className="border-b border-border/50">
                    <td className="p-2 text-card-foreground font-medium">{strategy.strategy}</td>
                    <td className="p-2 text-muted-foreground">{strategy.bets}</td>
                    <td className="p-2 text-muted-foreground">{strategy.wins}</td>
                    <td className="p-2">
                      <Badge variant="outline" className={
                        (strategy.wins / strategy.bets) * 100 >= 50 
                          ? "border-emerald-500 text-emerald-400" 
                          : "border-red-500 text-red-400"
                      }>
                        {((strategy.wins / strategy.bets) * 100).toFixed(1)}%
                      </Badge>
                    </td>
                    <td className={`p-2 font-medium ${strategy.profit >= 0 ? 'text-emerald-500' : 'text-red-500'}`}>
                      ${strategy.profit.toFixed(2)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
