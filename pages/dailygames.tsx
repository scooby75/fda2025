
import React, { useState, useEffect, useMemo } from 'react';
import { DailyGame } from '@/entities/DailyGame';
import { Strategy } from '@/entities/Strategy';
import { User } from '@/entities/User';
import { Bankroll } from "@/entities/Bankroll"; // Added Bankroll import
import BacktestingEngine from '../components/backtesting/BacktestingEngine';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import H2HModalContent from '../components/h2h/H2HModalContent';
import {
  CalendarDays, Loader2, Search, Filter, Users, Wallet
} from 'lucide-react';
import { format } from 'date-fns'; // parse is no longer needed for game.date based on YYYY-MM-DD assumption
import { ptBR } from 'date-fns/locale';
import { createPageUrl } from "@/utils";

export default function DailyGames() {
    const [games, setGames] = useState([]);
    const [strategies, setStrategies] = useState([]);
    const [bankrolls, setBankrolls] = useState([]); // New state for bankrolls
    const [selectedStrategyId, setSelectedStrategyId] = useState('all');
    const [isLoading, setIsLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [showH2HModal, setShowH2HModal] = useState(false);
    const [selectedH2H, setSelectedH2H] = useState(null);
    const [showBankrollSelect, setShowBankrollSelect] = useState(false); // New state for bankroll selection modal
    const [selectedGameForBet, setSelectedGameForBet] = useState(null); // New state to hold game for bet

    useEffect(() => {
        loadData();
    }, []);

    const handleH2HClick = (homeTeam, awayTeam) => {
        setSelectedH2H({ home: homeTeam, away: awayTeam });
        setShowH2HModal(true);
    };

    const loadData = async () => {
        setIsLoading(true);
        try {
            const currentUser = await User.me();
            const [dailyGames, savedStrategies, userBankrolls] = await Promise.all([
                DailyGame.list('-created_date'),
                Strategy.filter({ created_by: currentUser.email }, "-created_date"),
                Bankroll.filter({ created_by: currentUser.email }, "-created_date") // Fetch bankrolls
            ]);
            setGames(dailyGames);
            setStrategies(savedStrategies);
            setBankrolls(userBankrolls); // Set bankrolls
        } catch (error) {
            console.error("Erro ao carregar dados:", error);
        }
        setIsLoading(false);
    };

    const handleBetClick = (game) => {
        if (bankrolls.length === 0) {
            alert('Você precisa criar uma banca primeiro antes de fazer apostas.');
            return;
        }
        
        // Assuming game.date is in YYYY-MM-DD format
        const gameDate = game.date ? new Date(game.date + 'T12:00:00').toISOString().split('T')[0] : ''; // Add T12:00:00 to avoid timezone issues

        if (bankrolls.length === 1) {
            // Se houver apenas uma banca, usar diretamente
            window.location.href = createPageUrl(`BankrollManagement?eventName=${encodeURIComponent(`${game.home} vs ${game.away}`)}&eventDate=${encodeURIComponent(gameDate)}&competition=${encodeURIComponent(game.league)}&bankrollId=${bankrolls[0].id}`);
        } else {
            // Se houver múltiplas bancas, mostrar seleção
            setSelectedGameForBet(game);
            setShowBankrollSelect(true);
        }
    };

    const handleBankrollSelect = (bankrollId) => {
        if (selectedGameForBet) {
            // Assuming selectedGameForBet.date is in YYYY-MM-DD format
            const gameDate = selectedGameForBet.date ? new Date(selectedGameForBet.date + 'T12:00:00').toISOString().split('T')[0] : '';
            window.location.href = createPageUrl(`BankrollManagement?eventName=${encodeURIComponent(`${selectedGameForBet.home} vs ${selectedGameForBet.away}`)}&eventDate=${encodeURIComponent(gameDate)}&competition=${encodeURIComponent(selectedGameForBet.league)}&bankrollId=${bankrollId}`);
        }
        setShowBankrollSelect(false);
        setSelectedGameForBet(null);
    };

    const backtestingEngine = useMemo(() => new BacktestingEngine(), []);

    const filteredGames = useMemo(() => {
        if (!games || games.length === 0) return [];

        let filtered = games; // Start with all games

        // Apply search filter
        if (searchTerm) {
            const searchLower = searchTerm.toLowerCase();
            filtered = filtered.filter(game =>
                (game.home?.toLowerCase() || '').includes(searchLower) ||
                (game.away?.toLowerCase() || '').includes(searchLower) ||
                (game.league?.toLowerCase() || '').includes(searchLower)
            );
        }

        // Apply strategy filter
        if (selectedStrategyId !== 'all') {
            const strategy = strategies.find(s => s.id === selectedStrategyId);
            if (strategy) {
                // Transform games to match the format expected by the backtesting engine
                const gamesForEngine = filtered.map(game => ({
                    ...game,
                    // Map DailyGame fields to GameData fields for compatibility
                    ppg_home_pre: game.ppg_home,
                    ppg_away_pre: game.ppg_away,
                    season: game.season || '2024_2025', // Default season if not present
                    date: game.date, // Preserve date for the engine
                }));

                // Create empty ranking data arrays since DailyGames doesn't have ranking info
                const emptyRankingHome = [];
                const emptyRankingAway = [];

                // Use the backtesting engine to filter games
                const filteredByStrategy = backtestingEngine.filterGames(strategy, gamesForEngine, emptyRankingHome, emptyRankingAway);
                
                // Map back to original game IDs to maintain consistency
                const filteredIds = new Set(filteredByStrategy.map(g => g.id));
                filtered = filtered.filter(game => filteredIds.has(game.id));
            }
        }

        // Sort by time (ascending order) - preserved existing sorting
        filtered.sort((a, b) => {
            const timeA = a.time || '00:00';
            const timeB = b.time || '00:00';
            return timeA.localeCompare(timeB);
        });

        return filtered;
    }, [games, searchTerm, selectedStrategyId, strategies, backtestingEngine]);

    return (
        <div className="p-4 sm:p-6 lg:p-8 bg-background min-h-screen">
            <Card className="bg-card border-border">
                <CardHeader>
                    <CardTitle>
                        <h1 className="text-3xl lg:text-4xl font-semibold text-foreground mb-1 flex items-center gap-3">
                            <CalendarDays className="w-8 h-8 text-primary" />
                            Jogos do Dia
                        </h1>
                        <p className="text-muted-foreground text-lg">
                            Partidas e estatísticas para os próximos jogos.
                        </p>
                    </CardTitle>
                    <div className="flex flex-col sm:flex-row gap-4 w-full lg:w-auto">
                        <div className="relative w-full sm:w-64">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                            <Input
                                type="text"
                                placeholder="Buscar time ou liga..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="pl-10 w-full bg-input border-border"
                            />
                        </div>
                         <div className="relative w-full sm:w-64">
                             <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground z-10" />
                             <Select value={selectedStrategyId} onValueChange={setSelectedStrategyId}>
                                <SelectTrigger className="pl-10 w-full bg-input border-border">
                                    <SelectValue placeholder="Filtrar por estratégia..." />
                                
                                </SelectTrigger>
                                <SelectContent className="bg-popover border-border text-popover-foreground">
                                    <SelectItem value="all" className="hover:bg-muted/50" style={{ color: 'rgb(15, 23, 42)' }}>Não filtrar</SelectItem>
                                    {strategies.map(strategy => (
                                        <SelectItem key={strategy.id} value={strategy.id} className="hover:bg-muted/50" style={{ color: 'rgb(15, 23, 42)' }}>
                                            {strategy.name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                             </Select>
                        </div>
                    </div>
                </CardHeader>

                <CardContent className="p-4 sm:p-6">
                    <div className="overflow-x-auto">
                        <Table>
                            <TableHeader>
                                <TableRow className="border-border hover:bg-transparent">
                                    <TableHead className="text-muted-foreground w-20">Hora</TableHead>
                                    <TableHead className="text-muted-foreground min-w-64">Jogo</TableHead>
                                    <TableHead className="text-center text-muted-foreground">1X2 FT</TableHead>
                                    <TableHead className="text-center text-muted-foreground">Over 2.5</TableHead>
                                    <TableHead className="text-center text-muted-foreground">xG (H/A)</TableHead>
                                    <TableHead className="text-center text-muted-foreground">BTTS Sim</TableHead>
                                    <TableHead className="text-center text-muted-foreground">Ações</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {isLoading ? (
                                    <TableRow>
                                        <TableCell colSpan={7} className="text-center h-48">
                                            <Loader2 className="w-8 h-8 animate-spin mx-auto text-primary" />
                                            <p className="mt-2 text-muted-foreground">Carregando jogos...</p>
                                        </TableCell>
                                    </TableRow>
                                ) : filteredGames.length > 0 ? (
                                    filteredGames.map(game => (
                                        <TableRow key={game.id} className="border-border">
                                            <TableCell>
                                                <div className="flex flex-col items-center">
                                                    <span className="text-sm font-semibold text-card-foreground">
                                                        {game.time || '-'}
                                                    </span>
                                                    <span className="text-xs text-muted-foreground">
                                                        {game.date ? format(new Date(game.date + 'T12:00:00'), 'dd/MM/yyyy', { locale: ptBR }) : '-'}
                                                    </span>
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <div className="flex flex-col">
                                                    <span className="font-semibold text-card-foreground">
                                                        {game.home} vs {game.away}
                                                    </span>
                                                    <Badge variant="secondary" className="w-fit mt-1 text-xs">{game.league}</Badge>
                                                </div>
                                            </TableCell>
                                            <TableCell className="text-center text-sm text-card-foreground">
                                                <div className="flex justify-center gap-2">
                                                    <Badge variant="outline" className="font-mono">{game.odd_h_ft?.toFixed(2) || '-'}</Badge>
                                                    <Badge variant="outline" className="font-mono">{game.odd_d_ft?.toFixed(2) || '-'}</Badge>
                                                    <Badge variant="outline" className="font-mono">{game.odd_a_ft?.toFixed(2) || '-'}</Badge>
                                                </div>
                                            </TableCell>
                                            <TableCell className="text-center text-sm text-card-foreground">
                                                 <Badge variant="outline" className="font-mono">{game.odd_over25_ft?.toFixed(2) || '-'}</Badge>
                                            </TableCell>
                                            <TableCell className="text-center text-sm text-card-foreground">
                                                {game.xg_home_pre?.toFixed(2) || '-'} / {game.xg_away_pre?.toFixed(2) || '-'}
                                            </TableCell>
                                            <TableCell className="text-center text-sm text-card-foreground">
                                                {game.odd_btts_yes?.toFixed(2) || '-'}
                                            </TableCell>
                                            <TableCell className="text-center">
                                                <div className="flex gap-2 justify-center">
                                                    <Button variant="outline" size="sm" onClick={() => handleH2HClick(game.home, game.away)}>
                                                        <Users className="w-4 h-4 text-white" />
                                                    </Button>
                                                    <Button 
                                                        variant="outline" 
                                                        size="sm" 
                                                        className="text-primary border-primary/50 hover:bg-primary/10 hover:text-primary"
                                                        onClick={() => handleBetClick(game)}
                                                    >
                                                        <Wallet className="w-4 h-4 text-white" />
                                                    </Button>
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                ) : (
                                    <TableRow>
                                        <TableCell colSpan={7} className="text-center h-48 text-muted-foreground">
                                            Nenhum jogo encontrado para os filtros selecionados.
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </div>
                </CardContent>
            </Card>
            
            {/* H2H Modal */}
            <Dialog open={showH2HModal} onOpenChange={setShowH2HModal}>
              <DialogContent className="max-w-4xl lg:max-w-6xl xl:max-w-7xl h-[90vh] bg-card border-border p-4 sm:p-6">
                <DialogHeader>
                    <DialogTitle className="text-card-foreground text-lg sm:text-xl">
                        {selectedH2H ? `Análise H2H: ${selectedH2H.home} vs ${selectedH2H.away}` : "Análise H2H"}
                    </DialogTitle>
                </DialogHeader>
                <div className="overflow-y-auto h-full pr-2">
                    {selectedH2H && (
                        <H2HModalContent homeTeam={selectedH2H.home} awayTeam={selectedH2H.away} />
                    )}
                </div>
              </DialogContent>
            </Dialog>

            {/* Bankroll Selection Modal */}
            <Dialog open={showBankrollSelect} onOpenChange={setShowBankrollSelect}>
              <DialogContent className="sm:max-w-md bg-card border-border">
                <DialogHeader>
                    <DialogTitle className="text-card-foreground">
                        Selecionar Banca para Aposta
                    </DialogTitle>
                </DialogHeader>
                <div className="space-y-4 p-4">
                    <p className="text-muted-foreground text-sm">
                        Escolha qual banca usar para registrar a aposta:
                    </p>
                    <div className="space-y-2">
                        {bankrolls.map(bankroll => (
                            <Button
                                key={bankroll.id}
                                variant="outline"
                                className="w-full justify-between border-border text-card-foreground hover:bg-muted/20"
                                onClick={() => handleBankrollSelect(bankroll.id)}
                            >
                                <span>{bankroll.name}</span>
                                <span className="text-sm text-muted-foreground">
                                    R$ {bankroll.current_balance?.toFixed(2) || '0.00'}
                                </span>
                            </Button>
                        ))}
                    </div>
                    <div className="flex justify-end">
                        <Button variant="outline" onClick={() => setShowBankrollSelect(false)}>
                            Cancelar
                        </Button>
                    </div>
                </div>
              </DialogContent>
            </Dialog>

        </div>
    );
}
