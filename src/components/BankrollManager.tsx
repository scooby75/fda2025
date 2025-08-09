
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Wallet, Plus, TrendingUp, TrendingDown } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

const BankrollManager = () => {
  const { data: bankrolls, isLoading } = useQuery({
    queryKey: ['bankrolls'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('bankroll')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data;
    },
  });

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value);
  };

  const calculateProfit = (initial: number, current: number) => {
    return current - initial;
  };

  const calculateProfitPercentage = (initial: number, current: number) => {
    return ((current - initial) / initial) * 100;
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold">Gestão de Banca</h2>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Nova Banca
          </Button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="animate-pulse">
              <div className="h-48 bg-gray-200 rounded-lg"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Gestão de Banca</h2>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Nova Banca
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {bankrolls?.map((bankroll) => {
          const profit = calculateProfit(
            Number(bankroll.initial_balance), 
            Number(bankroll.current_balance || bankroll.initial_balance)
          );
          const profitPercentage = calculateProfitPercentage(
            Number(bankroll.initial_balance), 
            Number(bankroll.current_balance || bankroll.initial_balance)
          );
          const isProfit = profit >= 0;

          return (
            <Card key={bankroll.id} className="gradient-card border-0 shadow-lg hover:shadow-xl transition-all duration-300">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <Wallet className="h-5 w-5" />
                    {bankroll.name}
                  </CardTitle>
                  <Badge variant={bankroll.is_active ? "default" : "secondary"}>
                    {bankroll.is_active ? "Ativa" : "Inativa"}
                  </Badge>
                </div>
              </CardHeader>
              
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Saldo Inicial</span>
                    <span className="font-medium">{formatCurrency(Number(bankroll.initial_balance))}</span>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Saldo Atual</span>
                    <span className="font-bold text-lg">
                      {formatCurrency(Number(bankroll.current_balance || bankroll.initial_balance))}
                    </span>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Lucro/Prejuízo</span>
                    <div className="flex items-center gap-1">
                      {isProfit ? (
                        <TrendingUp className="h-4 w-4 text-green-600" />
                      ) : (
                        <TrendingDown className="h-4 w-4 text-red-600" />
                      )}
                      <span className={isProfit ? 'text-green-600' : 'text-red-600'}>
                        {formatCurrency(profit)} ({profitPercentage.toFixed(1)}%)
                      </span>
                    </div>
                  </div>
                </div>

                <div className="pt-2 border-t border-border">
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-muted-foreground">Moeda</span>
                    <span>{bankroll.currency}</span>
                  </div>
                  
                  <div className="flex justify-between items-center text-sm mt-1">
                    <span className="text-muted-foreground">Comissão</span>
                    <span>{Number(bankroll.commission_percentage || 0).toFixed(1)}%</span>
                  </div>
                </div>

                <Button variant="outline" className="w-full mt-4">
                  Gerenciar Banca
                </Button>
              </CardContent>
            </Card>
          );
        })}
        
        {(!bankrolls || bankrolls.length === 0) && (
          <Card className="gradient-card border-0 shadow-lg col-span-full">
            <CardContent className="flex flex-col items-center justify-center py-12">
              <Wallet className="h-16 w-16 text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">Nenhuma banca encontrada</h3>
              <p className="text-muted-foreground text-center mb-6">
                Crie sua primeira banca para começar a gerenciar suas apostas
              </p>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Criar Primeira Banca
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default BankrollManager;
