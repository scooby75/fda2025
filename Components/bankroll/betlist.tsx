
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Target, Plus, Calendar, TrendingUp, Edit, Trash2 } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import CreateBet from "./createbet";
import { BetTransaction } from '@/entities/BetTransaction';
import { Bankroll } from '@/entities/Bankroll';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

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
  result: 'win' | 'loss' | 'pending' | 'void';
  profit: number;
  stake: number;
  odds: number;
  created_date: string;
  event_date: string;
  competition: string;
  description: string;
  tags: string[];
  sport: string;
}

interface BetsListProps {
  bankrolls: BankrollData[];
  selectedBankroll: BankrollData | null;
  transactions: TransactionData[];
  onDataChange: () => void;
  isLoading: boolean;
  onEditBet?: (bet: TransactionData) => void;
}

export default function BetsList({ 
  bankrolls, 
  selectedBankroll, 
  transactions, 
  onDataChange, 
  isLoading,
  onEditBet
}: BetsListProps) {
  const [showCreateBet, setShowCreateBet] = useState(false);
  const [editingBet, setEditingBet] = useState<TransactionData | null>(null);
  const [activeTab, setActiveTab] = useState("finished");
  const [deleteDialog, setDeleteDialog] = useState<{ open: boolean; bet: TransactionData | null }>({ open: false, bet: null });

  if (isLoading) {
    return (
      <div className="text-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
        <p className="text-muted-foreground">Carregando apostas...</p>
      </div>
    );
  }

  if (!selectedBankroll) {
    return (
      <Card className="bg-card border-border">
        <CardContent className="p-12 text-center">
          <Target className="w-16 h-16 text-muted-foreground/50 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-card-foreground mb-2">
            Selecione uma banca
          </h3>
          <p className="text-muted-foreground">
            Escolha uma banca para ver as apostas
          </p>
        </CardContent>
      </Card>
    );
  }

  const bankrollTransactions = transactions.filter((t: TransactionData) => t.bankroll_id === selectedBankroll.id);
  const finishedBets = bankrollTransactions.filter((t: TransactionData) => t.result !== 'pending');
  const pendingBets = bankrollTransactions.filter((t: TransactionData) => t.result === 'pending');

  const handleEditClick = (bet: TransactionData) => {
    if (onEditBet) {
      onEditBet(bet);
    } else {
      // Convert TransactionData to FormData for editing
      const formData = {
        ...bet,
        stake: bet.stake.toString(),
        odds: bet.odds.toString()
      };
      setEditingBet(formData as any);
    }
  };

  if (editingBet) {
    return (
      <CreateBet
        bankrollId={selectedBankroll.id}
        bankrolls={bankrolls}
        transaction={{
          ...editingBet,
          stake: editingBet.stake.toString(),
          odds: editingBet.odds.toString()
        }}
        onSave={() => {
          setEditingBet(null);
          onDataChange();
        }}
        onClose={() => {
          setEditingBet(null);
        }}
      />
    );
  }

  const handleDeleteClick = (bet: TransactionData) => {
    setDeleteDialog({ open: true, bet });
  };
  
  const handleConfirmDelete = async () => {
    if (deleteDialog.bet) {
      try {
        const betToDelete = deleteDialog.bet;
        const bankrollId = betToDelete.bankroll_id;

        await BetTransaction.delete(parseInt(betToDelete.id));

        // Recalculate balance
        const bankrollToUpdate = await Bankroll.get(parseInt(bankrollId));
        const allBets = await BetTransaction.filter({ bankroll_id: bankrollId });
        const totalProfit = allBets
          .filter((b: any) => b.result !== 'pending')
          .reduce((sum: number, t: any) => sum + (t.profit || 0), 0);
        
        const newBalance = bankrollToUpdate.initial_balance + totalProfit;
        await Bankroll.update(parseInt(bankrollId), { current_balance: newBalance });

      } catch (error) {
        console.error("Erro ao excluir aposta:", error);
      } finally {
        setDeleteDialog({ open: false, bet: null });
        onDataChange();
      }
    }
  };

  const BetsTable = ({ bets }: { bets: TransactionData[] }) => (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow className="border-border">
            <TableHead className="text-muted-foreground">Data</TableHead>
            <TableHead className="text-muted-foreground">Evento</TableHead>
            <TableHead className="text-muted-foreground">Mercado</TableHead>
            <TableHead className="text-muted-foreground text-center">Stake</TableHead>
            <TableHead className="text-muted-foreground text-center">Odd</TableHead>
            <TableHead className="text-muted-foreground text-center">Resultado</TableHead>
            <TableHead className="text-muted-foreground text-center">P&L</TableHead>
            <TableHead className="text-muted-foreground text-center">Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {bets.length > 0 ? (
            bets.map((bet: TransactionData) => (
              <TableRow key={bet.id} className="border-border hover:bg-muted/50">
                <TableCell className="text-card-foreground">
                  {format(new Date(bet.event_date || bet.created_date), 'dd/MM/yyyy', { locale: ptBR })}
                </TableCell>
                <TableCell>
                  <div>
                    <p className="font-medium text-card-foreground">{bet.event_name}</p>
                    <p className="text-xs text-muted-foreground">{bet.competition}</p>
                  </div>
                </TableCell>
                <TableCell className="text-card-foreground">{bet.market}</TableCell>
                <TableCell className="text-center text-card-foreground">
                  {selectedBankroll.currency} {bet.stake.toFixed(2)}
                </TableCell>
                <TableCell className="text-center text-card-foreground">
                  {bet.odds.toFixed(2)}
                </TableCell>
                <TableCell className="text-center">
                  <Badge 
                    variant="outline"
                    className={
                      bet.result === 'win' 
                        ? 'border-emerald-500 text-emerald-400'
                        : bet.result === 'loss'
                        ? 'border-red-500 text-red-400'
                        : bet.result === 'void'
                        ? 'border-yellow-500 text-yellow-400'
                        : 'border-blue-500 text-blue-400' // 'pending' or unknown results
                    }
                  >
                    {bet.result === 'pending' ? 'Pendente' : 
                     bet.result === 'win' ? 'Green' : 
                     bet.result === 'loss' ? 'Red' : 'Anulada'}
                  </Badge>
                </TableCell>
                <TableCell className="text-center">
                  {bet.result !== 'pending' ? (
                    <span className={`font-medium ${bet.profit >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                      {bet.profit >= 0 ? '+' : ''}{selectedBankroll.currency} {bet.profit.toFixed(2)}
                    </span>
                  ) : (
                    <span className="text-muted-foreground">-</span>
                  )}
                </TableCell>
                <TableCell className="text-center">
                  <div className="flex justify-center gap-2">
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => handleEditClick(bet)}
                      className="border-border text-muted-foreground hover:bg-muted/50 h-8 w-8"
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="destructive"
                      size="icon"
                      onClick={() => handleDeleteClick(bet)}
                      className="h-8 w-8"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={8} className="text-center h-32 text-muted-foreground">
                Nenhuma aposta encontrada
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );

  return (
    <>
      <div className="space-y-6">
        <Card className="bg-card border-border">
          <CardHeader className="border-b border-border">
            <div className="flex justify-between items-center">
              <CardTitle className="text-card-foreground flex items-center gap-2">
                <Target className="w-6 h-6 text-primary" />
                Apostas - {selectedBankroll.name}
              </CardTitle>
              <Button 
                onClick={() => setShowCreateBet(true)}
                className="bg-primary text-primary-foreground hover:bg-primary/90"
              >
                <Plus className="w-4 h-4 mr-2" />
                Nova Aposta
              </Button>
            </div>
          </CardHeader>
          <CardContent className="p-6">
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid w-full max-w-md grid-cols-2 bg-muted/20">
                <TabsTrigger value="finished" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                  Finalizadas ({finishedBets.length})
                </TabsTrigger>
                <TabsTrigger value="pending" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                  Pendentes ({pendingBets.length})
                </TabsTrigger>
              </TabsList>

              <TabsContent value="finished" className="mt-6">
                <BetsTable bets={finishedBets} />
              </TabsContent>

              <TabsContent value="pending" className="mt-6">
                <BetsTable bets={pendingBets} />
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>

      <AlertDialog open={deleteDialog.open} onOpenChange={(open) => setDeleteDialog({ open, bet: null })}>
        <AlertDialogContent className="bg-card border-border">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-card-foreground flex items-center">
              <Trash2 className="w-5 h-5 mr-2 text-red-400"/>
              Excluir Aposta
            </AlertDialogTitle>
            <AlertDialogDescription className="text-muted-foreground pt-2">
              Tem certeza que deseja excluir a aposta no evento "{deleteDialog.bet?.event_name}"? Esta ação não pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="mt-4">
            <AlertDialogCancel onClick={() => setDeleteDialog({ open: false, bet: null })} className="hover:bg-muted/80">
              Cancelar
            </AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleConfirmDelete} 
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      
      {showCreateBet && (
        <CreateBet
          bankrollId={selectedBankroll.id}
          bankrolls={bankrolls}
          onClose={() => setShowCreateBet(false)}
          onSave={() => {
            setShowCreateBet(false);
            onDataChange();
          }}
        />
      )}
    </>
  );
}
