
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Clock, Trophy } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

const TodaysGames = () => {
  const { data: games, isLoading } = useQuery({
    queryKey: ['todays-games'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('dailygame')
        .select('*')
        .limit(6);
      
      if (error) throw error;
      return data;
    },
  });

  if (isLoading) {
    return (
      <Card className="gradient-card border-0 shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Trophy className="h-5 w-5" />
            Jogos de Hoje
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="animate-pulse">
                <div className="h-16 bg-gray-200 rounded-lg"></div>
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
          <Trophy className="h-5 w-5" />
          Jogos de Hoje
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {games?.map((game) => (
          <div key={game.id} className="p-4 border border-border rounded-lg hover:shadow-md transition-all duration-200">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">{game.time}</span>
                <Badge variant="outline" className="text-xs">{game.league}</Badge>
              </div>
            </div>
            
            <div className="flex items-center justify-between mb-3">
              <div className="flex-1">
                <div className="font-semibold text-sm">{game.home}</div>
                <div className="text-sm text-muted-foreground">vs</div>
                <div className="font-semibold text-sm">{game.away}</div>
              </div>
              
              <div className="flex gap-2">
                {game.odd_h_ft && (
                  <div className="text-center">
                    <div className="text-xs text-muted-foreground">Casa</div>
                    <div className="font-bold text-sm">{Number(game.odd_h_ft).toFixed(2)}</div>
                  </div>
                )}
                {game.odd_d_ft && (
                  <div className="text-center">
                    <div className="text-xs text-muted-foreground">Empate</div>
                    <div className="font-bold text-sm">{Number(game.odd_d_ft).toFixed(2)}</div>
                  </div>
                )}
                {game.odd_a_ft && (
                  <div className="text-center">
                    <div className="text-xs text-muted-foreground">Fora</div>
                    <div className="font-bold text-sm">{Number(game.odd_a_ft).toFixed(2)}</div>
                  </div>
                )}
              </div>
            </div>
            
            <Button size="sm" className="w-full" variant="outline">
              Ver Análise
            </Button>
          </div>
        ))}
      </CardContent>
    </Card>
  );
};

export default TodaysGames;
