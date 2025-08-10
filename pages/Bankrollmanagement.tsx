
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
  TrendingUp,
  Plus,
  BarChart3,
  DollarSign,
  Activity
} from "lucide-react";

import BankrollDashboard from "../Components/bankroll/bankrolldashboard";
import BankrollList from "../Components/bankroll/bankrolllist";
import CreateBankroll from "../Components/bankroll/createbankroll";
import BetsList from "../Components/bankroll/betlist";
import BankrollReports from "../Components/bankroll/reports/BankrollReports";
import CreateBet from "../Components/bankroll/createbet";

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

interface TransactionData {
  id: string;
  bankroll_id: string;
  event_name: string;
  event_date: string;
  competition: string;
  strategy_name: string;
  market: string;
  stake: number;
  odds: number;
  result: "pending" | "win" | "loss" | "void";
  profit: number;
  description: string;
  tags: string[];
  sport: string;
  created_date: string;
}

interface InitialBetData {
  event_name: string;
  event_date: string;
  competition: string;
}

export default function BankrollManagement() {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [bankrolls, setBankrolls] = useState<BankrollData[]>([]);
  const [transactions, setTransactions] = useState<TransactionData[]>([]);
  const [selectedBankroll, setSelectedBankroll] = useState<BankrollData | null>(null);
  const [showCreateBankroll, setShowCreateBankroll] = useState(false);
  const [showCreateBet, setShowCreateBet] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState<TransactionData | null>(null);
  const [initialBetData, setInitialBetData] = useState<InitialBetData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setIsLoading(true);
    try {
      const [bankrollsData, transactionsData] = await Promise.all([
        Bankroll.list(),
        BetTransaction.list()
      ]);

      // Transform data to match our interfaces
      const transformedBankrolls: BankrollData[] = bankrollsData.map((b: any) => ({
        id: String(b.id),
        name: b.name,
        initial_balance: b.initial_balance,
        current_balance: b.current_balance,
        start_date: b.start_date,
        is_active: b.is_active,
        commission_percentage: b.commission_percentage || 0,
        currency: b.currency || 'BRL'
      }));

      const transformedTransactions: TransactionData[] = transactionsData.map((t: any) => ({
        id: String(t.id),
        bankroll_id: String(t.bankroll_id),
        event_name: t.event_name,
        event_date: t.event_date,
        competition: t.competition || '',
        strategy_name: t.strategy_name || '',
        market: t.market || '',
        stake: Number(t.stake),
        odds: Number(t.odds),
        result: t.result as "pending" | "win" | "loss" | "void",
        profit: t.profit || 0,
        description: t.description || '',
        tags: t.tags || [],
        sport: t.sport || 'Futebol',
        created_date: t.created_at || new Date().toISOString()
      }));

      setBankrolls(transformedBankrolls);
      setTransactions(transformedTransactions);

      if (transformedBankrolls.length > 0 && !selectedBankroll) {
        setSelectedBankroll(transformedBankrolls[0]);
      }
    } catch (error) {
      console.error("Error loading data:", error);
    }
    setIsLoading(false);
  };

  const handleCreateBankroll = async () => {
    await loadData();
    setShowCreateBankroll(false);
  };

  const handleEditBet = (bet: TransactionData) => {
    setEditingTransaction(bet);
    setShowCreateBet(true);
  };

  const handleSaveBet = async () => {
    await loadData();
    setShowCreateBet(false);
    setEditingTransaction(null);
    setInitialBetData(null);
  };

  const handleCreateBetFromGame = (gameData: InitialBetData) => {
    setInitialBetData(gameData);
    setShowCreateBet(true);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background text-foreground p-4 sm:p-6 lg:p-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Carregando dados...</p>
          </div>
        </div>
      </div>
    );
  }

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
              Gerencie suas bancas e apostas de forma profissional
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
              <Activity className="w-4 h-4 mr-2" />
              Dashboard
            </TabsTrigger>
            <TabsTrigger
              value="bankrolls"
              className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
            >
              <Wallet className="w-4 h-4 mr-2" />
              Bancas
            </TabsTrigger>
            <TabsTrigger
              value="bets"
              className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
            >
              <DollarSign className="w-4 h-4 mr-2" />
              Apostas
            </TabsTrigger>
            <TabsTrigger
              value="reports"
              className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
            >
              <BarChart3 className="w-4 h-4 mr-2" />
              Relatórios
            </TabsTrigger>
            <TabsTrigger
              value="settings"
              className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
            >
              <Plus className="w-4 h-4 mr-2" />
              Nova Banca
            </TabsTrigger>
          </TabsList>

          <TabsContent value="dashboard" className="space-y-6">
            <BankrollDashboard
              bankrolls={bankrolls}
              transactions={transactions.filter((t: TransactionData) => selectedBankroll ? t.bankroll_id === selectedBankroll.id : true)}
              selectedBankroll={selectedBankroll}
              onSelectBankroll={setSelectedBankroll}
            />
          </TabsContent>

          <TabsContent value="bankrolls" className="space-y-6">
            <BankrollList
              bankrolls={bankrolls}
              onBankrollSelect={setSelectedBankroll}
              onDataChange={loadData}
              isLoading={isLoading}
            />
          </TabsContent>

          <TabsContent value="bets" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-semibold text-foreground">Lista de Apostas</h2>
              <Button
                onClick={() => setShowCreateBet(true)}
                className="bg-primary text-primary-foreground hover:bg-primary/90"
              >
                <Plus className="w-4 h-4 mr-2" />
                Nova Aposta
              </Button>
            </div>
            <BetsList
              bankrolls={bankrolls}
              selectedBankroll={selectedBankroll}
              transactions={transactions.filter((t: TransactionData) => selectedBankroll ? t.bankroll_id === selectedBankroll.id : true)}
              onDataChange={loadData}
              isLoading={isLoading}
              onEditBet={handleEditBet}
            />
          </TabsContent>

          <TabsContent value="reports" className="space-y-6">
            <BankrollReports
              bankrolls={bankrolls}
              transactions={transactions}
              selectedBankroll={selectedBankroll}
              isLoading={isLoading}
            />
          </TabsContent>

          <TabsContent value="settings" className="space-y-6">
            <CreateBankroll
              onCancel={() => setActiveTab("dashboard")}
              onBankrollCreated={handleCreateBankroll}
            />
          </TabsContent>
        </Tabs>

        {/* Modals */}
        {showCreateBet && (
          <CreateBet
            bankrollId={selectedBankroll?.id || ""}
            bankrolls={bankrolls}
            onClose={() => {
              setShowCreateBet(false);
              setEditingTransaction(null);
              setInitialBetData(null);
            }}
            onSave={handleSaveBet}
            transaction={editingTransaction ? {
              ...editingTransaction,
              stake: editingTransaction.stake.toString(),
              odds: editingTransaction.odds.toString()
            } : null}
            initialData={initialBetData}
          />
        )}
      </div>
    </div>
  );
}
