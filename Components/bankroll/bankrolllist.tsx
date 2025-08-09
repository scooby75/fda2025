import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Wallet, Edit, Trash2, Calendar, DollarSign } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Bankroll } from "@/entities/Bankroll";
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

export default function BankrollList({ bankrolls, onBankrollSelect, onDataChange, isLoading }) {
  const [deleteDialog, setDeleteDialog] = useState({ open: false, bankroll: null });

  const handleDeleteClick = (bankroll) => {
    setDeleteDialog({ open: true, bankroll });
  };

  const handleConfirmDelete = async () => {
    if (deleteDialog.bankroll) {
      try {
        await Bankroll.delete(deleteDialog.bankroll.id);
        onDataChange();
        setDeleteDialog({ open: false, bankroll: null });
      } catch (error) {
        console.error("Erro ao excluir banca:", error);
      }
    }
  };

  if (isLoading) {
    return (
      <div className="text-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
        <p className="text-muted-foreground">Carregando bancas...</p>
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
            Crie sua primeira banca para começar
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <div className="space-y-4">
        <Card className="bg-card border-border">
          <CardHeader className="border-b border-border">
            <CardTitle className="text-card-foreground flex items-center gap-2">
              <Wallet className="w-6 h-6 text-primary" />
              Suas Bancas ({bankrolls.length})
            </CardTitle>
          </CardHeader>
        </Card>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {bankrolls.map((bankroll) => (
            <Card key={bankroll.id} className="bg-card border-border hover:bg-muted/20 transition-all duration-300">
              <CardHeader className="border-b border-border">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-semibold text-card-foreground mb-1">{bankroll.name}</h3>
                    <Badge 
                      variant={bankroll.is_active ? "default" : "secondary"}
                      className="text-xs"
                    >
                      {bankroll.is_active ? 'Ativa' : 'Inativa'}
                    </Badge>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-bold text-card-foreground">
                      {bankroll.currency} {(bankroll.current_balance || bankroll.initial_balance).toFixed(2)}
                    </p>
                    <p className="text-xs text-muted-foreground">Saldo atual</p>
                  </div>
                </div>
              </CardHeader>
              
              <CardContent className="p-6">
                <div className="space-y-3 mb-4">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Saldo Inicial:</span>
                    <span className="text-card-foreground">{bankroll.currency} {bankroll.initial_balance.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Data Inicial:</span>
                    <span className="text-card-foreground">
                      {format(new Date(bankroll.start_date), 'dd/MM/yyyy', { locale: ptBR })}
                    </span>
                  </div>
                  {bankroll.commission_percentage > 0 && (
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Comissão:</span>
                      <span className="text-card-foreground">{bankroll.commission_percentage}%</span>
                    </div>
                  )}
                </div>
                
                <div className="flex gap-2">
                  <Button 
                    onClick={() => onBankrollSelect(bankroll)}
                    variant="outline"
                    size="sm"
                    className="flex-1 border-border text-muted-foreground hover:bg-muted/50"
                  >
                    <DollarSign className="w-4 h-4 mr-1" />
                    Selecionar
                  </Button>
                  <Button
                    onClick={() => handleDeleteClick(bankroll)}
                    variant="outline"
                    size="sm"
                    className="border-red-600 text-red-400 hover:bg-red-600 hover:text-white"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      <AlertDialog open={deleteDialog.open} onOpenChange={(open) => setDeleteDialog({ open, bankroll: null })}>
        <AlertDialogContent className="bg-card border-border">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-card-foreground flex items-center">
              <Trash2 className="w-5 h-5 mr-2 text-red-400"/>
              Excluir Banca
            </AlertDialogTitle>
            <AlertDialogDescription className="text-muted-foreground pt-2">
              Tem certeza que deseja excluir a banca "{deleteDialog.bankroll?.name}"? Esta ação não pode ser desfeita e todas as transações associadas também serão perdidas.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="mt-4">
            <AlertDialogCancel onClick={() => setDeleteDialog({ open: false, bankroll: null })} className="hover:bg-muted/80">
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
    </>
  );
}