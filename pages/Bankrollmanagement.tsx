
import React, { useState, useEffect } from "react";
import { Bankroll } from "@/entities/Bankroll";
import { BetTransaction } from "@/entities/BetTransaction";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import {
  ArrowLeft,
  Wallet,
  Plus,
  TrendingUp,
  BarChart3,
  Target
} from "lucide-react";

import BankrollDashboard from "../Components/bankroll/bankrolldashboard";
import BankrollList from "../Components/bankroll/bankrolllist";
import CreateBankroll from "../Components/bankroll/createbankroll";
import BetList from "../Components/bankroll/betlist";
import CreateBet from "../Components/bankroll/createbet";
import BankrollReports from "../Components/bankroll/reports/BankrollReports";

// Unified interface definitions for this page
interface TransactionData {
  id: string;
  bankroll_id: string;
  event_name: string;
  event_date: string;
  competition?: string;
  strategy_name?: string;
  market?: string;
  stake: number;
  odds: number;
  result?: 'pending' | 'win' | 'loss' | 'void';
  profit?: number;
  description?: string;
  tags?: string[];
  sport?: string;
  created_at?: string;
  created_date: string;
}

interface BankrollData {
  id: string;
  name: string;
  initial_balance: number;
  current_balance: number;
  start_date: string;
  is_active: boolean;
  commission_percentage: number;
  currency: string;
}

export default function BankrollManagement() {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [bankrolls, setBankrolls] = useState<BankrollData[]>([]);
  const [transactions, setTransactions] = useState<TransactionData[]>([]);
  const [selectedBankroll, setSelectedBankroll] = useState<BankrollData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isDataLoading, setIsDataLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setIsDataLoading(true);
    try {
      const [bankrollData, transactionData] = await Promise.all([
        Bankroll.list(),
        BetTransaction.list()
      ]);

      const transformedBankrolls: BankrollData[] = bankrollData.map((b: any) => ({
        id: b.id.toString(),
        name: b.name,
        initial_balance: b.initial_balance,
        current_balance: b.current_balance,
        start_date: b.start_date,
        is_active: b.is_active,
        commission_percentage: b.commission_percentage || 0,
        currency: b.currency || 'BRL'
      }));

      const transformedTransactions: TransactionData[] = transactionData.map((t: any) => ({
        id: t.id.toString(),
        bankroll_id: t.bankroll_id.toString(),
        event_name: t.event_name,
        event_date: t.event_date,
        competition: t.competition || '',
        strategy_name: t.strategy_name || '',
        market: t.market || '',
        stake: t.stake,
        odds: t.odds,
        result: t.result || 'pending',
        profit: t.profit || 0,
        description: t.description || '',
        tags: t.tags || [],
        sport: t.sport || '',
        created_at: t.created_at,
        created_date: t.created_at || t.created_date || new Date().toISOString()
      }));

      setBankrolls(transformedBankrolls);
      setTransactions(transformedTransactions);
    } catch (error) {
      console.error("Erro ao carregar dados:", error);
    }
    setIsDataLoading(false);
  };

  const handleBankrollSelect = (bankroll: BankrollData) => {
    setSelectedBankroll(bankroll);
    setActiveTab("bets");
  };

  const handleBetUpdate = (updatedBet: TransactionData) => {
    setTransactions(prev => 
      prev.map(bet => bet.id === updatedBet.id ? updatedBet : bet)
    );
  };

  const handleDeleteBet = async (betId: string) => {
    setIsLoading(true);
    try {
      await BetTransaction.delete(parseInt(betId));
      setTransactions(prev => prev.filter(bet => bet.id !== betId));
    } catch (error) {
      console.error("Erro ao excluir aposta:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Link to={createPageUrl("Dashboard")}>
            <Button variant="outline" size="icon" className="border-border text-muted-foreground hover:bg-muted/20">
              <ArrowLeft className="w-4 h-4" />
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl lg:text-4xl font-semibold text-foreground mb-1">
              Gestão de Bankroll
            </h1>
            <p className="text-muted-foreground text-lg">
              Controle e monitore suas apostas e resultados
            </p>
          </div>
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full max-w-2xl grid-cols-5 bg-card border border-border text-muted-foreground">
            <TabsTrigger
              value="dashboard"
              className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
            >
              <BarChart3 className="w-4 h-4 mr-2" />
              Dashboard
            </TabsTrigger>
            <TabsTrigger
              value="bankrolls"
              className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
            >
              <Wallet className="w-4 h-4 mr-2" />
              Bankrolls
            </TabsTrigger>
            <TabsTrigger
              value="create-bankroll"
              className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
            >
              <Plus className="w-4 h-4 mr-2" />
              Criar
            </TabsTrigger>
            <TabsTrigger
              value="bets"
              className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
            >
              <Target className="w-4 h-4 mr-2" />
              Apostas
            </TabsTrigger>
            <TabsTrigger
              value="reports"
              className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
            >
              <TrendingUp className="w-4 h-4 mr-2" />
              Relatórios
            </TabsTrigger>
          </TabsList>

          <TabsContent value="dashboard" className="space-y-6">
            <BankrollDashboard
              bankrolls={bankrolls}
              transactions={transactions}
              isLoading={isDataLoading}
            />
          </TabsContent>

          <TabsContent value="bankrolls" className="space-y-6">
            <BankrollList
              bankrolls={bankrolls}
              onBankrollSelect={handleBankrollSelect}
              onDataChange={loadData}
              isLoading={isDataLoading}
            />
          </TabsContent>

          <TabsContent value="create-bankroll" className="space-y-6">
            <CreateBankroll
              onBankrollCreated={loadData}
              onCancel={() => setActiveTab("bankrolls")}
            />
          </TabsContent>

          <TabsContent value="bets" className="space-y-6">
            {selectedBankroll ? (
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <div>
                    <h2 className="text-2xl font-semibold text-foreground">
                      Apostas - {selectedBankroll.name}
                    </h2>
                    <p className="text-muted-foreground">
                      Saldo atual: {selectedBankroll.currency} {selectedBankroll.current_balance.toLocaleString()}
                    </p>
                  </div>
                </div>
                
                <CreateBet
                  bankrollId={selectedBankroll.id}
                  bankrolls={bankrolls.map(b => ({ id: b.id, name: b.name }))}
                  onBetCreated={loadData}
                />
                
                <BetList
                  transactions={transactions.filter(t => t.bankroll_id === selectedBankroll.id)}
                  isLoading={isDataLoading}
                  onBetUpdate={handleBetUpdate}
                />
              </div>
            ) : (
              <Card className="bg-card border-border">
                <CardContent className="p-12 text-center">
                  <Target className="w-16 h-16 text-muted-foreground/50 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-card-foreground mb-2">
                    Selecione um Bankroll
                  </h3>
                  <p className="text-muted-foreground mb-6">
                    Escolha um bankroll na aba "Bankrolls" para ver suas apostas
                  </p>
                  <Button
                    onClick={() => setActiveTab("bankrolls")}
                    className="bg-primary text-primary-foreground hover:bg-primary/90"
                  >
                    Ver Bankrolls
                  </Button>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="reports" className="space-y-6">
            <BankrollReports
              bankrolls={bankrolls}
              transactions={transactions}
              isLoading={isDataLoading}
            />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
