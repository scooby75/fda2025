
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, Filter, Eye, Calendar, Clock } from "lucide-react";
import Navigation from "@/components/Navigation";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface DailyGameData {
  id: string;
  home: string;
  away: string;
  date: string;
  time?: string;
  league: string;
  odd_h_ft?: number;
  odd_d_ft?: number;
  odd_a_ft?: number;
  odd_over25_ft?: number;
  odd_btts_yes?: number;
  xg_home_pre?: number;
  xg_away_pre?: number;
  strategy?: string;
}

const DailyGames = () => {
  const [games, setGames] = useState<DailyGameData[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStrategy, setSelectedStrategy] = useState("none");

  useEffect(() => {
    fetchDailyGames();
  }, []);

  const fetchDailyGames = async () => {
    try {
      const { data, error } = await supabase
        .from('dailygame')
        .select('*')
        .order('date', { ascending: true })
        .limit(50);

      if (error) throw error;
      setGames(data || []);
    } catch (error) {
      console.error('Error fetching daily games:', error);
      toast.error('Erro ao carregar jogos do dia');
    } finally {
      setLoading(false);
    }
  };

  const filteredGames = games.filter((game: DailyGameData) => {
    const matchesSearch = 
      game.home?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      game.away?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      game.league?.toLowerCase().includes(searchTerm.toLowerCase());

    if (selectedStrategy === "none") {
      return matchesSearch;
    }

    if (selectedStrategy === "ha-visitante") {
      return matchesSearch && game.strategy === "ha-visitante";
    }
    if (selectedStrategy === "raid-boss") {
      return matchesSearch && game.strategy === "raid-boss";
    }
    if (selectedStrategy === "back-home-ev") {
      return matchesSearch && game.strategy === "back-home-ev";
    }
    if (selectedStrategy === "ppg-ligas") {
      return matchesSearch && game.strategy === "ppg-ligas";
    }

    return matchesSearch;
  });

  const formatOdds = (odds: number | undefined) => {
    return odds ? Number(odds).toFixed(2) : "-";
  };

  return (
    <div className="min-h-screen p-6 space-y-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-8 animate-fade-in">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-primary-glow bg-clip-text text-transparent mb-4">
            Jogos do Dia
          </h1>
          <p className="text-xl text-muted-foreground">
            Partidas e estatísticas para os próximos jogos
          </p>
        </div>

        <Navigation />

        <div className="space-y-6">
          {/* Filters */}
          <Card className="card-glow">
            <CardContent className="p-6">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                    <Input
                      placeholder="Buscar time ou liga..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10 bg-input"
                    />
                  </div>
                </div>
                <Select value={selectedStrategy} onValueChange={setSelectedStrategy}>
                  <SelectTrigger className="w-full md:w-[200px]">
                    <Filter className="w-4 h-4 mr-2" />
                    <SelectValue placeholder="Estratégia" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">Não filtrar</SelectItem>
                    <SelectItem value="ha-visitante">HA Visitante</SelectItem>
                    <SelectItem value="raid-boss">Raid Boss</SelectItem>
                    <SelectItem value="back-home-ev">Back Home EV+</SelectItem>
                    <SelectItem value="ppg-ligas">PPG - Ligas</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Games Table */}
          <Card className="card-glow">
            <CardContent className="p-0">
              {loading ? (
                <div className="p-8 text-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
                  <p className="text-muted-foreground">Carregando jogos...</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <div className="min-w-full">
                    {/* Header */}
                    <div className="grid grid-cols-12 gap-4 p-4 border-b border-border font-semibold text-sm text-muted-foreground">
                      <div className="col-span-2">Hora</div>
                      <div className="col-span-3">Jogo</div>
                      <div className="col-span-2">1X2 FT</div>
                      <div className="col-span-1">Over 2.5</div>
                      <div className="col-span-1">xG (H/A)</div>
                      <div className="col-span-1">BTTS Sim</div>
                      <div className="col-span-2">Ações</div>
                    </div>

                    {/* Games */}
                    {filteredGames.map((game: DailyGameData, index: number) => (
                      <div key={game.id || index} className="grid grid-cols-12 gap-4 p-4 border-b border-border hover:bg-secondary/20 transition-colors">
                        <div className="col-span-2">
                          <div className="flex flex-col">
                            <span className="text-sm font-mono">{game.time || "06:00:00"}</span>
                            <span className="text-xs text-muted-foreground">{game.date}</span>
                          </div>
                        </div>
                        
                        <div className="col-span-3">
                          <div className="space-y-1">
                            <div className="font-medium">{game.home} vs {game.away}</div>
                            <Badge variant="secondary" className="text-xs">
                              {game.league}
                            </Badge>
                          </div>
                        </div>

                        <div className="col-span-2">
                          <div className="flex gap-1">
                            <Badge variant="outline" className="text-xs">{formatOdds(game.odd_h_ft)}</Badge>
                            <Badge variant="outline" className="text-xs">{formatOdds(game.odd_d_ft)}</Badge>
                            <Badge variant="outline" className="text-xs">{formatOdds(game.odd_a_ft)}</Badge>
                          </div>
                        </div>

                        <div className="col-span-1">
                          <Badge variant="outline" className="text-xs">
                            {formatOdds(game.odd_over25_ft)}
                          </Badge>
                        </div>

                        <div className="col-span-1">
                          <span className="text-sm font-mono">
                            {game.xg_home_pre ? `${Number(game.xg_home_pre).toFixed(1)}/${Number(game.xg_away_pre).toFixed(1)}` : "-"}
                          </span>
                        </div>

                        <div className="col-span-1">
                          <Badge variant="outline" className="text-xs">
                            {formatOdds(game.odd_btts_yes)}
                          </Badge>
                        </div>

                        <div className="col-span-2">
                          <div className="flex gap-2">
                            <Button size="sm" variant="outline" className="h-8 w-8 p-0">
                              <Eye className="h-3 w-3" />
                            </Button>
                            <Button size="sm" variant="outline" className="h-8 w-8 p-0">
                              <Calendar className="h-3 w-3" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default DailyGames;
