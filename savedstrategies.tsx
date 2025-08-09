import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Save, Play, TrendingUp, TrendingDown, Calendar, Trash2 } from "lucide-react";
import { format } from "date-fns";
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

export default function SavedStrategies({ strategies, onLoadStrategy, onDeleteStrategy }) {
  const [deleteDialog, setDeleteDialog] = React.useState({ open: false, strategy: null });

  const handleDeleteClick = (strategy) => {
    setDeleteDialog({ open: true, strategy });
  };

  const handleConfirmDelete = () => {
    if (deleteDialog.strategy) {
      onDeleteStrategy(deleteDialog.strategy.id);
      setDeleteDialog({ open: false, strategy: null });
    }
  };

  if (strategies.length === 0) {
    return (
      <Card className="bg-card border-border">
        <CardContent className="p-12 text-center">
          <Save className="w-16 h-16 text-muted-foreground/50 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-card-foreground mb-2">
            Nenhuma estratégia salva
          </h3>
          <p className="text-muted-foreground">
            Execute e salve estratégias para vê-las aqui
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
              <Save className="w-6 h-6 text-primary" />
              Estratégias Salvas ({strategies.length})
            </CardTitle>
          </CardHeader>
        </Card>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {strategies.map((strategy) => (
            <Card key={strategy.id} className="bg-card border-border hover:bg-muted/20 transition-all duration-300">
              <CardHeader className="border-b border-border">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-semibold text-card-foreground mb-1">{strategy.name}</h3>
                    <p className="text-sm text-muted-foreground">{strategy.market.replace('_', ' ')}</p>
                  </div>
                  <Badge 
                    variant="outline"
                    className={`${(strategy.results?.roi || 0) >= 0 
                      ? 'border-emerald-500 text-emerald-400' 
                      : 'border-red-500 text-red-400'
                    }`}
                  >
                    {(strategy.results?.roi || 0) >= 0 ? (
                      <TrendingUp className="w-3 h-3 mr-1" />
                    ) : (
                      <TrendingDown className="w-3 h-3 mr-1" />
                    )}
                    {(strategy.results?.roi || 0).toFixed(1)}%
                  </Badge>
                </div>
              </CardHeader>
              
              <CardContent className="p-6">
                {strategy.description && (
                  <p className="text-muted-foreground text-sm mb-4 line-clamp-2">
                    {strategy.description}
                  </p>
                )}
                
                <div className="space-y-2 mb-4">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Total de Apostas:</span>
                    <span className="text-card-foreground">{strategy.results?.total_bets || 0}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Taxa de Acerto:</span>
                    <span className="text-card-foreground">{(strategy.results?.hit_rate || 0).toFixed(1)}%</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Lucro Total:</span>
                    <span 
                      className="font-medium"
                      style={{ 
                        color: (strategy.results?.total_profit || 0) >= 0 
                          ? 'rgb(16, 185, 129)' 
                          : 'rgb(239, 68, 68)' 
                      }}
                    >
                      ${(strategy.results?.total_profit || 0).toFixed(2)}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Criado em:</span>
                    <span className="text-card-foreground">
                      {format(new Date(strategy.created_date), 'dd/MM/yyyy')}
                    </span>
                  </div>
                </div>
                
                <div className="flex gap-2">
                  <Button 
                    onClick={() => onLoadStrategy(strategy)}
                    variant="outline"
                    size="sm"
                    className="flex-1 border-border text-muted-foreground hover:bg-muted/50"
                  >
                    <Play className="w-4 h-4 mr-1" />
                    Usar
                  </Button>
                  <Button
                    onClick={() => handleDeleteClick(strategy)}
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

      <AlertDialog open={deleteDialog.open} onOpenChange={(open) => setDeleteDialog({ open, strategy: null })}>
        <AlertDialogContent className="bg-card border-border">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-card-foreground flex items-center">
              <Trash2 className="w-5 h-5 mr-2 text-red-400"/>
              Excluir Estratégia
            </AlertDialogTitle>
            <AlertDialogDescription className="text-muted-foreground pt-2">
              Tem certeza que deseja excluir a estratégia "{deleteDialog.strategy?.name}"? Esta ação não pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="mt-4">
            <AlertDialogCancel onClick={() => setDeleteDialog({ open: false, strategy: null })} className="hover:bg-muted/80">
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