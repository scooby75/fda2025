
import React, { useState, useEffect } from "react";
import { Bankroll } from "@/entities/Bankroll";
import { BetTransaction } from "@/entities/BetTransaction";
import { User } from "@/entities/User";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Link, useLocation } from "react-router-dom";
import { createPageUrl } from "@/utils";
import {
  ArrowLeft,
  Wallet,
  Plus,
  TrendingUp,
  TrendingDown,
  Target,
  DollarSign,
  Activity,
  BarChart
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

interface InitialBetData {
  event_name: string;
  event_date: string;
  competition: string;
}

export default function BankrollManagement() {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [bankrolls, setBankrolls] = useState<BankrollData[]>([]);
  const [selectedBankroll, setSelectedBankroll] = useState<BankrollData | null>(null);
  const [transactions, setTransactions] = useState<TransactionData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showCreateBet, setShowCreateBet] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState<TransactionData | undefined>(undefined);
  const [initialBetData, setInitialBetData] = useState<Partial<TransactionData> | undefined>(undefined);

  const location = useLocation();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const eventName = params.get('eventName');
    if (eventName) {
      const betData: Partial<TransactionData> = {
        event_name: eventName,
        event_date: params.get('eventDate') || '',
        competition: params.get('competition') || '',
      };
      setInitialBetData(betData);
      setShowCreateBet(true);
      setActiveTab("bets");
    }
  }, [location.search]);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setIsLoading(true);
    try {
      const currentUser = await User.me();
      const [userBankrolls, allTransactions] = await Promise.all([
        Bankroll.filter({ created_by: currentUser.email }, "-created_date"),
        BetTransaction.list("-created_date")
      ]);

      const updatedBankrolls: BankrollData[] = userBankrolls.map((bankroll: any) => {
        const bankrollTransactions = allTransactions.filter((t: any) => t.bankroll_id === bankroll.id && t.result !== 'pending');
        const totalProfit = bankrollTransactions.reduce((sum: number, t: any) => sum + (t.profit || 0), 0);
        return {
          ...bankroll,
          current_balance: bankroll.initial_balance + totalProfit,
        };
      });
      
      setBankrolls(updatedBankrolls);
      setTransactions(allTransactions);
      
      if (updatedBankrolls.length > 0 && !selectedBankroll) {
        setSelectedBankroll(updatedBankrolls[0]);
      } else if (selectedBankroll) {
        const refreshedSelected = updatedBankrolls.find((b: BankrollData) => b.id === selectedBankroll.id);
        setSelectedBankroll(refreshedSelected || (updatedBankrolls.length > 0 ? updatedBankrolls[0] : null));
      }
      
    } catch (error) {
      console.error("Erro ao carregar dados da banca:", error);
    }
    setIsLoading(false);
  };

  const handleBankrollCreated = () => {
    loadData();
    setActiveTab("dashboard");
  };

  const handleBankrollSelect = (bankroll: BankrollData | null) => {
    setSelectedBankroll(bankroll);
    setActiveTab("dashboard");
  };

  const handleEditBet = (bet: TransactionData) => {
    setInitialBetData(undefined);
    setEditingTransaction(bet);
    setShowCreateBet(true);
  };

  const handleOpenCreateBet = () => {
    setEditingTransaction(undefined);
    if (!location.search) {
      setInitialBetData(undefined); 
    }
    setShowCreateBet(true);
  };

  return (
    <div className="min-h-screen bg-background text-foreground p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center gap-4 mb-8">
          <Link to={createPageUrl("Dashboard")}>
            <Button variant="outline" size="icon" className="border-border text-muted-foreground hover:bg-muted/20">
              <ArrowLeft className="w-4 h-4" />
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl lg:text-4xl font-semibold text-foreground mb-1">
              Gestão de Banca
            </h1>
            <p className="text-muted-foreground text-lg">
              Gerencie suas bancas e acompanhe suas apostas
            </p>
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <div className="flex justify-between items-center">
            <TabsList className="grid w-full max-w-lg grid-cols-4 bg-card border border-border text-muted-foreground">
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
                <Target className="w-4 h-4 mr-2" />
                Apostas
              </TabsTrigger>
               <TabsTrigger
                value="reports"
                className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
              >
                <BarChart className="w-4 h-4 mr-2" />
                Relatórios
              </TabsTrigger>
            </TabsList>
            
            <Button 
              onClick={() => setActiveTab("create")}
              className="bg-primary text-primary-foreground hover:bg-primary/90"
            >
              <Plus className="w-4 h-4 mr-2" />
              Nova Banca
            </Button>
          </div>

          <TabsContent value="dashboard" className="space-y-6">
            <BankrollDashboard 
              bankrolls={bankrolls}
              selectedBankroll={selectedBankroll}
              transactions={transactions.filter((t: TransactionData) => t.bankroll_id === selectedBankroll?.id)}
              isLoading={isLoading}
              onBankrollSelect={handleBankrollSelect}
            />
          </TabsContent>

          <TabsContent value="bankrolls" className="space-y-6">
            <BankrollList
              bankrolls={bankrolls}
              onBankrollSelect={handleBankrollSelect}
              onDataChange={loadData}
              isLoading={isLoading}
            />
          </TabsContent>

          <TabsContent value="bets" className="space-y-6">
            <div>
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-semibold text-card-foreground">
                  Transações
                </h3>
                {selectedBankroll && (
                  <Button
                    onClick={handleOpenCreateBet}
                    className="bg-primary text-primary-foreground hover:bg-primary/90"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Nova Aposta
                  </Button>
                )}
              </div>
              <BetsList
                bankrolls={bankrolls}
                selectedBankroll={selectedBankroll}
                transactions={transactions.filter((t: TransactionData) => t.bankroll_id === selectedBankroll?.id)}
                onDataChange={loadData}
                isLoading={isLoading}
                onEditBet={handleEditBet}
              />
            </div>
          </TabsContent>

          <TabsContent value="create" className="space-y-6">
            <CreateBankroll
              onBankrollCreated={handleBankrollCreated}
              onCancel={() => setActiveTab("dashboard")}
            />
          </TabsContent>

          <TabsContent value="reports" className="space-y-6">
            <BankrollReports
              bankrolls={bankrolls}
              selectedBankroll={selectedBankroll}
              transactions={transactions.filter((t: TransactionData) => t.bankroll_id === selectedBankroll?.id)}
              isLoading={isLoading}
            />
          </TabsContent>

        </Tabs>
      </div>

      {showCreateBet && selectedBankroll && (
        <CreateBet
          bankrollId={selectedBankroll.id}
          bankrolls={bankrolls}
          onClose={() => {
            setShowCreateBet(false);
            setEditingTransaction(undefined);
            if (location.search) {
              window.history.replaceState({}, document.title, location.pathname);
            }
            setInitialBetData(undefined);
          }}
          onSave={loadData}
          transaction={editingTransaction}
          initialData={initialBetData}
        />
      )}
    </div>
  );
}
