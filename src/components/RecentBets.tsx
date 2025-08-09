
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { History, TrendingUp, TrendingDown } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

const RecentBets = () => {
  const { data: bets, isLoading } = useQuery({
    queryKey: ['recent-bets'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('bet_transaction')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(5);
      
      if (error) throw error;
      return data;
    },
  });

  const getResultBadge = (result: string, profit: number) => {
    switch (result) {
      case 'win':
        return <Badge className="bg-green-100 text-green-800 border-green-200">Ganhou</Badge>;
      case 'loss':
        return <Badge className="bg-red-100 text-red-800 border-red-200">Perdeu</Badge>;
      case 'pending':
        return <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200">Pendente</Badge>;
      default:
        return <Badge variant="outline">-</Badge>;
    }
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value);
  };

  if (isLoading) {
    return (
      <Card className="gradient-card border-0 shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <History className="h-5 w-5" />
            Apostas Recentes
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="animate-pulse">
                <div className="h-20 bg-gray-200 rounded-lg"></div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="gradient-card border-0 shadow-lg">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <History className="h-5 w-5" />
          Apostas Recentes
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {bets?.map((bet) => (
          <div key={bet.id} className="p-4 border border-border rounded-lg hover:shadow-md transition-all duration-200">
            <div className="flex items-start justify-between mb-2">
              <div className="flex-1">
                <h4 className="font-semibold text-sm">{bet.event_name}</h4>
                <p className="text-xs text-muted-foreground">{bet.competition} • {bet.sport}</p>
                {bet.market && (
                  <p className="text-xs text-muted-foreground mt-1">Mercado: {bet.market}</p>
                )}
              </div>
              <div className="flex flex-col items-end gap-1">
                {getResultBadge(bet.result || 'pending', Number(bet.profit))}
                <div className="text-xs text-muted-foreground">
                  Odd: {Number(bet.odds).toFixed(2)}
                </div>
              </div>
            </div>
            
            <div className="flex items-center justify-between">
              <div className="text-sm">
                <span className="text-muted-foreground">Stake: </span>
                <span className="font-medium">{formatCurrency(Number(bet.stake))}</span>
              </div>
              
              <div className="flex items-center gap-1">
                {bet.result === 'win' && <TrendingUp className="h-4 w-4 text-green-600" />}
                {bet.result === 'loss' && <TrendingDown className="h-4 w-4 text-red-600" />}
                <span className={`font-semibold text-sm ${
                  bet.result === 'win' ? 'text-green-600' : 
                  bet.result === 'loss' ? 'text-red-600' : 
                  'text-yellow-600'
                }`}>
                  {bet.profit !== null ? formatCurrency(Number(bet.profit)) : 'Pendente'}
                </span>
              </div>
            </div>
          </div>
        ))}
        
        {(!bets || bets.length === 0) && (
          <div className="text-center py-8 text-muted-foreground">
            <History className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>Nenhuma aposta encontrada</p>
            <p className="text-sm">Suas apostas aparecerão aqui</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default RecentBets;
